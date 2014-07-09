/* 
	User Object  
		Right now, it just holds a name.  Eventually, it will get all the past scores for the user
		through ajax calls to some php.  The php will get the scores from a text file called <username>.txt
*/
function User(name){
	
}

User.prototype = {
	constructor: User,
	getName: function() {
		
	}
};

/*
	Question Object
		contains all the necessary information for one question and contains methods to get the correct answer,
		the user answer, and display the question on the quiz page.  
		choices: an array of possible answers
*/

function Question(text, choices, correct_answer) {

}	

Question.prototype = {
	constructor: Question,
	getCorrectAnswer: function() {

	},
	getUserAnswer: function() {

	},
	displayQuestion: function() {

	}
};