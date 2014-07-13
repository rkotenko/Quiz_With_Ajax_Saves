
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
	// load login html
	$('#main').load('templates/login.html', function(){
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
	});
}