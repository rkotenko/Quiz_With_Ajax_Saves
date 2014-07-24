

/******************** NOTE!!! ***************************/

//	Be sure to run scores/scores.php?reset=true to set up the files correctly for the tests!

/**********************************************************/
var state; // in order to test the flow of the quiz, I need to save the states so they can be passed to the next tests
var qState;  //  a special state saved to jump right into the question
var player,
	topScores; // user and topscores load asynchronously.  So that each test does not have to run that async process, save them globally
var quiz = new Quiz();
var questions = [];

for(var i = 0; i < allQuestions.length;i++){
	questions[i] = new Question(allQuestions[i].question, 
								allQuestions[i].choices,
								allQuestions[i].correctAnswer);
}

QUnit.config.reorder = false;

// test on simple user object
// future: two modules to test an existing user and a new user to test returning a score array and not finding 
// any scores for a user
module("User Object");

asyncTest('Test Existing User', function(){
	player = new User('Rob');
	expected = [
					{"correct": 4, "total": 4},
					{"correct": 4,"total": 4},
					{"correct": 4,"total": 4},
					{"correct": 3,"total": 4}
				];

	setTimeout(function(){
		deepEqual(player.scores, expected, 'Scores array not correct');
		equal(player.name, 'Rob', 'player name is missing');
		start();	
	}, 200);
	
});

asyncTest('Test save To Server', function(){
	result = player.addNewScore({"correct": 2,"total": 4});

	setTimeout(function(){
		equal(player.saved, true, 'saveScore Ajax call did not work');
		start();	
	}, 200);
	
});

// now check that the score saved above was in fact saved correctly
asyncTest('Test that save succeeded', function(){
	player.loadScores();
	
	setTimeout(function(){
		deepEqual(player.scores[4], {"correct": 2,"total": 4}, 'addNewScore did not save');
		start();	
	}, 200);
	
});
test('Display Past Scores', function(){
	player.displayScores();
	equal($('#user_scores').children(':nth-child(2)').html(), '4 out of 4', 'User scores are not displayed');
});

asyncTest('Test New User', function(){
	player = new User('Steve');
	setTimeout(function(){
		deepEqual(player.scores, Array(), 'Scores array should be an empty array');
		start();	
	}, 200);
	
});


module("Question Object", {
	setup: function() {
		
		//disable the next button, so the radio button change can be tested
		$('#next').prop('disabled', true);
	}
});

test('user correct', function() {
	questions[0].userAnswer = 0;
	equal(questions[0].isUserCorrect(), true, 'answer is 0 and user choice is 0, should return true');
});

test('user incorrect', function() {
	questions[0].userAnswer = 1;
	equal(questions[0].isUserCorrect(), false, 'Answer is 0 and user choice is 1, should be false');
});

// test the loading of question template and first question

test('displayQuestion', function() {
	var event,
		 c0,
		 quizDiv;
	quiz.current = 0;
	questions[0].display();
	
	// run a 500ms timout to let display run to completion
	c0 = document.getElementById('0');
	quizDiv = $('#quiz');

	// check that the quiz div is present
	ok(quizDiv.length, 'quiz div is present');

	// check that question and radio button labels are set correctly
	equal($('#question').html(), "Who is Prime Minister of the United Kingdom?", 'Question text is not inserted correctly');

	// check that the first and last answer label.  If they are there, then so are the middle one
	equal($('#0_label').html(), "David Cameron", 'first answer not set correctly');
	equal($('#3_label').html(), "Tony Blair", 'last answer not set correctly');

	// check that the onchange event is set correctly by changing the radio button and storing the new choice
	$('#0').prop('checked', true);
	event = $.Event('change');
	event.target = c0;
	quizDiv.trigger(event);

	// answer was set to 1, should now be 0
	equal(questions[0].userAnswer, 0, 'Answer should be set to 0');
	equal($('#next').prop('disabled'), false, 'Next button should be enabled');	
});

module('TopScores object');

asyncTest('Create Top Scores Object', function(){
	topScores = new TopScores();
	expected = [
				{'user': 'Rob', 'score': 4},
				{'user': 'Steve', 'score': 4},
				{'user': 'Phil', 'score': 4},
				{'user': 'Greg', 'score': 3},
				{'user': 'Armin', 'score': 2}
			];

	setTimeout(function(){
		deepEqual(topScores.scores, expected, 'Top Scores were not loaded');
		start();
	}, 200);
});


test('insertScore', function(){
	var order = '';
	score = {'user': 'Nate', 'score': 5};

	// try an insert when array size is less than 20
	topScores.insertScore(score);
	equal(topScores.scores.length, 6, 'Score should have been inserted since top scores array only contained 5 items');

	// the scores should be in the proper order from highest to lowest
	$scores = $(topScores.scores);

	$scores.each(function(){
		order = order + this.score.toString();
	});

	equal(order, '544432', 'Score order should now be 544432');

	// add some elements to the array to get it to 20
	while(topScores.scores.length < 20){
		topScores.scores.push(score);
	}

	// Once there are 20 scores, when a score is added, the lowest score should be removed (may be the one trying to be added)
	score = {'user': 'Mark', 'score': 4};  
	topScores.insertScore(score);
	equal(topScores.scores.length, 20, 'There should be exactly 20 scores after trying to insert a new one');

	deepEqual(topScores.scores[topScores.scores.length - 1], {'user': 'Greg', 'score': 3}, 'Last high score should now be greg');

	score = {'user': 'Mark', 'score': 1};  
	topScores.insertScore(score);
	equal(topScores.scores.length, 20, 'There should be exactly 20 scores after trying to insert a new one');

	deepEqual(topScores.scores[topScores.scores.length - 1], {'user': 'Greg', 'score': 3}, 'Last high score should still be Greg after a score of 1 is attempted');

});

asyncTest('saveScores', function(){
	topScores.saveScores();

	setTimeout(function(){
		equal(topScores.saved, true, 'scores were not saved');
		start();
	}, 200);

});

// check that the save worked by reloading the top scores
asyncTest('Check saveScores result', function(){
	topScores.scores = [];
	expectedFirstScore = {'user': 'Nate', 'score': 5};
	topScores.loadScores();

	setTimeout(function(){
		deepEqual(topScores.scores[0], expectedFirstScore, 'scores were not saved');
		start();
	}, 200);

});

test('Display Top Scores', function(){
	topScores.displayScores();
	equal($('#0').html(), 'Nate', 'Top scores are not displayed');
});

/*
	Quiz Needed Tests:
		First question: loads the question html, next is disabled, back is hidden, first question is loaded
		Next question with first answer selected: next is disabled, back is displayed, radio buttons unchecked, 2nd q loaded
		Previous question: proper radio button is checked, next enabled, back is hidden, 1st q loaded
		Next question when it has an answer: next enabled, back displayed, proper radio button is checked
		Next question when all are done:  results computed and displayed, next and back buttons hidden

		Quiz tests are NOT atomic.  They depend on the state of the previous tests to continue with navigation.  So the
		state is saved globally and then reinserted for the next test

		CHANGE:  It may be in fact, that I can make them atomic.  The display function always checks for the presence of the needed
		html.  If not there, it inserts it.  So I believe use of previous states might be unecessary.
*/

module("Quiz Object");




test('Load first question', function(){
	back = $('#back');
	next = $('#next');

	back.css('display', 'none');
	next.prop('disabled', true);
	quiz.current = -1;
	quiz.nextQuestion();

	deepEqual(quiz.current, 0, 'First call to next question should result in current being set to 0');
	equal(next.prop('disabled'), true, 'Next button should be disabled');
	equal(back.css('display'), 'none', 'Back button should be hidden');
	equal($('#question').html(), questions[0].text, 'Question text should be: ' + questions[0].text);
	state = $('#contain').detach();  // save the state of the inside of qunit-fixture for the next test
});

// set an answer for the current question, enable the next button, check the radio button, and load the next one
test('load second question', function(){
	$('#qunit-fixture').empty().append(state); // set the state resulting from the previous tests
	next = $('#next');
	back = $('#back');
	questions[0].userAnswer = 0;
	$('#0').prop('checked', true);  
	next.prop('disabled', false);
	quiz.nextQuestion();


	deepEqual(quiz.current, 1, 'Call to next question should result in current being set to 1');

	// next should be disabled
	equal(next.prop('disabled'), true, 'Next needs to be disabled for unanswered questions');

	// back button should be visible
	equal(back.css('display'), 'inline-block', 'Back button should be visible');

	// all radio buttons should be unchecked
	checked = $('.answer').filter(function(){
		return this.checked === true;
	});

	equal(checked.length, 0, 'There should be no radio buttons checked');

	// check that the question for the second one is set
	equal($('#question').html(), questions[1].text, 'Question text should be: ' + questions[1].text);	

	state = $('#contain').detach();  // save the state of the inside of qunit-fixture for the next test
	qState = state.find('#main');
});

// previous question test
test('previous question', function(){
	$('#qunit-fixture').empty().append(state); // set the state resulting from the previous tests
	quiz.previousQuestion();

	deepEqual(quiz.current, 0, 'Call to previous question should result in current being set to 0');
	equal($('#0').prop('checked'), true, 'User answer for question 0 is 0 and so its radio box should be checked');
	equal($('#next').prop('disabled'), false, 'Question has an answer so next should be enabled');
	equal($('#back').css('display'), 'none', 'Back needs to be hidden on first question');
	equal($('#question').html(), questions[0].text, 'Question text should be: ' + questions[0].text);	
	state = $('#contain').detach();  // save the state of the inside of qunit-fixture for the next test
});

// next question when its answer has been given, only thing that has not been checked in previous tests is that the proper
// radio button is checked
test('next question with answer set', function(){
	$('#qunit-fixture').empty().append(state); // set the state resulting from the previous tests
	questions[1].userAnswer = 1;
	quiz.nextQuestion();
	equal($('#1').prop('checked'), true, 'User answer for question 1 is 1 and so its radio box should be checked');	
	state = $('#contain').detach();  // save the state of the inside of qunit-fixture for the next test
});

// test the display result page
asyncTest('display results: all correct', function(){
	$('#qunit-fixture').empty().append(state); // set the state resulting from the previous tests

	// set the all the question userAnswer to the correctAnswer
	for(var i = 0; i < questions.length;i++){
		questions[i].userAnswer = questions[i].correctAnswer;
	}
	quiz.current = 3;  // question 4
	quiz.nextQuestion();
	
	setTimeout(function(){
		// check that the results div has been loaded
		ok($('#results').length, 'results div is present');
		equal($('#num_correct').html(), '4 out of 4 correct', 'All answers are correct so this should be 4 out of 4');
		equal($('#percent').html(), '100%', 'Should be 100%');

		// check that the user past scores is loaded
		ok($('#user_scores').length, 'user scores is not present');

		// check for top scores
		ok($('#top_scores').length, 'top scores are not here!');
		equal($('#back').css('display'), 'none');
		equal($('#next').css('display'), 'none');
		state = $('#contain').detach();  // save the state of the inside of qunit-fixture for the next test	
		start();
	}, 1500);
	
});


test('display results: 2 correct', function(){
	$('#qunit-fixture').empty().append(state); // set the state resulting from the previous tests
	// set 2 wrong answers
	questions[0].userAnswer = 1;  // correct is 0
	questions[1].userAnswer = 2; //correct is 3
	quiz.current = 3;  // question 4
	quiz.nextQuestion();

	equal($('#num_correct').html(), '2 out of 4 correct', 'All answers are correct so this should be 2 out of 4');
	equal($('#percent').html(), '50%', 'Should be 50%');	
});


// reset the questions for some main testing
questions = [];

for(var i = 0; i < allQuestions.length;i++){
	questions[i] = new Question(allQuestions[i].question, 
								allQuestions[i].choices,
								allQuestions[i].correctAnswer);
}

// MAIN PAGE TESTS - Test the login screen, the next, and back buttons

module('Main Page Test');

test('Credentials', function(){
	//$('#qunit-fixture').empty().append(state);
	startQuiz();
	// put a user into localStorage
	localStorage.setItem('rob', 'pass');

	// check for the login button event by giving it a click
	$('#login_button').trigger('click');

	// there should be an error now in the error div
	equal($('#error').html(), "Your credentials are not correct", 'login event not firing');
	
	$('#name').val('rob');
	$('#password').val('pass');
	$('#login_button').trigger('click');
	
	// credentials are correct, so quiz div should now be present
	ok($('#quiz').length, 'quiz div is present');
	equal($('#next').css('display'), 'inline-block', 'Next button needs to be displayed');
	state = $('#contain').detach();
});

test('Back and next button', function(){
	fixture = $('#qunit-fixture');
	fixture.empty().append(state);  // load the special state of the second question so back and next can be tested
	fixture.remove('#main');
	fixture.prepend(qState);
	quiz.current = 1;  // makes sure quiz knows it is on question 2

	$('#back').trigger('click');

	equal($('#question').html(), questions[0].text, 'Question text should be ' + questions[0].text);
});

test('Next question click', function(){
	fixture = $('#qunit-fixture');
	fixture.empty().append(state);  // load the special state of the second question so back and next can be tested
	fixture.remove('#main');
	fixture.prepend(qState);
	quiz.current = 1;  // makes sure quiz knows it is on question 2

	$('#next').trigger('click');
	equal($('#question').html(), questions[2].text, 'Question text should be ' + questions[2].text);	
});






