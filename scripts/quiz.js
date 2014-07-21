var quiz,
	questions,
	player;

/*************** FUNCTIONS **********************/

function checkCredentials(){
		var test = false;
		
		if(test){
			quiz = new Quiz();
			player = new User();
			topScores = new TopScores();
			quiz.nextQuestion();
			return;
		}
		// check the login against what is stored in localStorage.  COMPLETELY unsafe but this is just
		// to experiement with localStorage since I have never used it for anything
		if($('#password').val() == localStorage.getItem($('#name').val())){
			// load the questions
			questions = [];

			for(var i = 0; i < allQuestions.length;i++){
				questions[i] = new Question(allQuestions[i].question, 
											allQuestions[i].choices,
											allQuestions[i].correctAnswer);
			}
			quiz = new Quiz();
			player = new User($('#name').val());
			topScores = new TopScores();
			quiz.nextQuestion();	
		}
		else{
			// show error
			$('#error').html("Your credentials are not correct");
		}
		
}

/*********************** Handlebar Helper Functions *************************/

Handlebars.registerHelper('userAnswer', function(question, options){
	if(question.userAnswer === options.hash.i){
		return 'checked';
	}
});

Handlebars.registerPartial('oneQuestion', Handlebars.templates.question);

/************************* OBJECTS ***********************************/

/* 
	User Object  
		Right now, it just holds a name.  Eventually, it will get all the past scores for the user
		through ajax calls to some php.  The php will get the scores from a text file called <username>.txt
*/
function User(name){
	this.name = name;	
	this.scores = this.loadScores() || [];
	this.saved = false;
}

User.prototype = {
	constructor: User,
	getName: function() {
		return this.name;
	},
	loadScores: function(){
		$.ajax({
			url: 'scores/scores.php',
			data: {name: this.name + '.scores', type: 'get'},
			success: function(result) {
				if(result){
					this.scores = JSON.parse(result);
				}
			}.bind(this)
		});
	},
	displayScores: function(){ 
		var html = Handlebars.templates.userScores({scores: this.scores});
		$('#main').append(html);
	}, 
	addNewScore: function(score){
		// add the new score to the scores array and then save them to file
		this.scores.push(score);
		$.ajax({
			url: 'scores/scores.php',
			type: 'get',
			data: {name: this.name + '.scores', type: 'put', data: JSON.stringify(this.scores)},
			success: function(result) {
				this.saved = true;
			}.bind(this)
		});
	}
};

/*
	Question Object
		contains all the necessary information for one question and contains methods to display the question on the quiz page and
		determine if the user gave the correct answer.  
		choices: an array of possible answers
*/

function Question(text, choices, correctAnswer) {
	this.text = text;
	this.choices = choices;
	this.correctAnswer = correctAnswer;
	this.userAnswer = null;
}	

Question.prototype = {
	constructor: Question,
	isUserCorrect: function() {
		return this.correctAnswer == this.userAnswer;
	},
	display: function() {
		var that = this;  // save a reference to the question so it can be used in load function
		
		if(!$('#quiz').length){
			quizHtml = Handlebars.templates.quiz(this);
			$('#main').html(quizHtml);

			$('#quiz').change(function(event){
				$('#next').prop('disabled', false);
				// can't use this since the context is #main
				questions[quiz.current].userAnswer = Number(event.target.id);
			});	
		}
		else{
			qHtml = Handlebars.templates.question(this);
			$('#quiz').html(qHtml);
		}
		
	}	
};

/*
	Top Scores Object
		Holds the highest 20 scores. Can set those scores to template, determine if a score should be added to the list, and add 
		it.
		insertScore will insert the new score and then sort by score.  If the length is greater than 20, it will remove the excess
		to keep it at 20.  
		topScores is of the format [{name: "name", score: "score"}, {name: "name", score: "scores"}
*/
function TopScores() {
	this.scoreFile = 'top.scores';
	this.scores = this.loadScores() || [];
	
}

TopScores.prototype = {
	constructor: TopScores,
	loadScores: function(){
		$.ajax({
			url: 'scores/scores.php',
			data: {type: 'get', name: this.scoreFile},
			success: function(result){
				if(result){
					this.scores = JSON.parse(result);
				}
			}.bind(this)
		});
	},
	insertScore: function(score){
		this.scores.push(score);
		this.scores.sort(function(a, b){
			return b.score - a.score;
		});

		if(this.scores.length > 20){
			this.scores.pop();
		}
	},
	displayScores: function(){
		var html = Handlebars.templates.topScores({topScores: this.scores});
		$('#main').append(html);
	},
	saveScores: function(){
		$.ajax({
			url: 'scores/scores.php',
			data: {type: 'put', name: this.scoreFile, data: JSON.stringify(this.scores)},
			success: function(result){
				if(result){
					this.saved = true;
				}
			}.bind(this)
		});	
	}
};

/*
	Quiz Object
		The workhorse of the application.  Controls navigation including moving to previous and next questions
		and displaying the results.
		
*/

function Quiz() {
	this.current = -1;  // the first question is not loaded upon initialization
}

Quiz.prototype = {
	constructor: Quiz,
	previousQuestion: function(event){
		this.current--;
		$('#next').prop('disabled', false);

		if(this.current === 0){
			$('#back').css('display', 'none');
		}

		questions[this.current].display();
	},
	nextQuestion: function(event){
		var quizDiv = $('#quiz');
		this.current++;

		if(this.current === questions.length){
			this.loadResults();
		}
		else{
			if(questions[this.current].userAnswer === null){
				$('#next').prop('disabled', true);
			}

			if(this.current === 0){
				$('#next').css('display', 'inline-block');
			}
			else if(this.current > 0){
				$('#back').css('display', 'inline-block');
			}

			questions[this.current].display();
		}
		

	},
	loadResults: function(){
		var that = this;
		$('#back').css('display', 'none');
		$('#next').css('display', 'none');
		$questions = $(questions);
		correct = $questions.filter(function(){
			return this.isUserCorrect();
		});

		results = {
			numCorrect: correct.length + ' out of ' + questions.length + ' correct',
			percentCorrect: (correct.length / questions.length) * 100 + '%'
		};
		
		// add the score
		player.addNewScore({"correct": correct.length,"total": questions.length});

		// add the score to the top scores and then save the topscores
		topScores.insertScore({"user":player.name,"score": correct.length});
		topScores.saveScores();

		// and load the html
		html = Handlebars.templates.results(results);
		$('#main').html(html);
		player.displayScores();
		topScores.displayScores();
	}
};

// Controller function.  Encapsulated so it can be unit tested easily.
function startQuiz(){
	// Add some effect and do some setup.  Everything else is user interaction

	// turn off jquery effects for testing.  They don't need to be tested. That way I don't have to run async tests everywhere.  That means faster tests.
	// faster tests equals YAY FOR ME!
	$.fx.off = true;

	// hide the back and next buttons
	next = $('#next');
	back = $('#back');
	loginButton = $('#login_button');
	next.css('display', 'none');
	back.css('display', 'none');

	// add the events to login, back, and next
	next.click(function(){
		quiz.nextQuestion();
	});
	back.click(function(){
		quiz.previousQuestion();
	});
	loginButton.click(checkCredentials);	
}
/**************************  START IT UP!! ****************************/

startQuiz();	


