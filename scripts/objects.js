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

function Question(text, choices, correct_answer) {
	var self = this;
	this.text = text;
	this.choices = choices;
	this.correct_answer = correct_answer;
	this.user_answer = null;
}	

Question.prototype = {
	constructor: Question,
	isUserCorrect: function() {
		return this.correct_answer == this.user_answer;
	},
	insertQuestion: function() {

		$('#question').html(this.text);

		for(var i = 0;i < this.choices.length;i++){
			$('#' + i + '_label').html(this.choices[i]);
		}
	},
	display: function() {
		// check if the quiz div is present, if not, load it, otherwise call insertQuestion
		if($('#quiz').length) {
			this.insertQuestion();
		}
		else {
			// proxy ensures the insertQuestion is called using question as context, not the calling element
			$('#main').load('templates/question.html', $.proxy(this.insertQuestion, this));  
			i = 0;
		}
	}
};