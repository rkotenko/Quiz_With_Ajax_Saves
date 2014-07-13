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
	insertQuestion: function() {
		$('#question').html(this.text);

		for(var i = 0;i < this.choices.length;i++){
			$('#' + i + '_label').html(this.choices[i]);
		}

		if(this.userAnswer !== null){
			$('#' + this.userAnswer).prop('checked', true);
		}
		else{
			$('.answer').prop('checked', false);
		}

		$('#main').fadeIn('slow');
	},
	display: function() {
		var that = this;  // save a reference to the question so it can be used in load function
		
		// check if the quiz div is present, if not, load it, otherwise call insertQuestion
		$('#main').fadeOut('slow', function(){
			if($('#quiz').length) {
				questions[quiz.current].insertQuestion();
			}
			else {
				$('#main').load('templates/question.html', function(){
					$('#quiz').change(function(event){
						$('#next').prop('disabled', false);
						// can't use this since the context is #main
						questions[quiz.current].userAnswer = event.target.id;
					});

					that.insertQuestion();
				});  
			}	
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
	insertResults: function(){
		$questions = $(questions);
		correct = $questions.filter(function(){
			return this.isUserCorrect();
		});	

		$('#num_correct').html(correct.length + ' out of ' + questions.length + ' correct');
		$('#percent').html((correct.length / questions.length) * 100 + '%');
	},
	loadResults: function(){
		var that = this;
		$('#back').css('display', 'none');
		$('#next').css('display', 'none');

		if($('#results').length){
			this.insertResults();	
		}else {
			$('#main').load('templates/results.html', that.insertResults);
		}
	}
};


