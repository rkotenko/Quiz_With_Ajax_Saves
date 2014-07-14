var quiz;

startQuiz();

/*************** FUNCTIONS **********************/

var quiz;
var questions;

function checkCredentials(){
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
			quiz.nextQuestion();	
		}
		else{
			// show error
			$('#error').html("Your credentials are not correct");
		}
		
}

function startQuiz(){
	
	// turn off jquery effects for testing.  They don't need to be tested. That way I don't have to run async tests.  That means faster tests.
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
}

User.prototype = {
	constructor: User,
	getName: function() {
		return this.name;
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
		
		html = Handlebars.templates.results(results);
		$('#main').html(html);
	}
};

/*
	Top Scores Object
		Holds the highest 20 scores. Can set those scorse to template, determine if a score should be added to the list, and add 
		it
		topScores is of the format [{name: "name", score: "score"}, {name: "name", score: "scores"}
*/
function TopScores() {
	this.topScores = this.getTopScores();  
}

TopScores.prototype = {
	getTopScores: function(){

	},
	checkScore: function(){

	},
	displayScores: function(){

	},
	saveScores: function(){
		
	}
};


