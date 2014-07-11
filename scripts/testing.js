// test on simple user object
// future: two modules to test an existing user and a new user to test returning a score array and not finding 
// any scores for a user
module("User Object", {
	setup: function() {
		// create a user
		player = new User('rob');
	}
});

test('get user name', function(){
	equal(player.getName(), 'rob', 'The name was not returned');
});

module("Question Object", {
	setup: function() {
		questions = [
			new Question("What is the color of space?", ['black', 'blue', 'zebra', 'grey'], 0),
			new Question("What is life?", ['love', 'money', 'happiness', 'nothing'], 2)
		];
	}
});

test('user correct', function() {
	questions[0].user_answer = 0;
	equal(questions[0].isUserCorrect(), true, 'answer is 0 and user choice is 0, should return true');
});

test('user incorrect', function() {
	questions[0].user_answer = 1;
	equal(questions[0].isUserCorrect(), false, 'Answer is 0 and user choice is 1, should be false');
});

// test the loading of question template and first question

asyncTest('display first question', function() {
	questions[0].display();
	
	// run a 500ms timout to let display run to completion
	setTimeout(function(){
		// check that the quiz div is present
		ok($('#quiz').length, 'quiz div is present');

		// check that question and radio button labels are set correctly
		equal($('#question').html(), 'What is the color of space?', 'Question text is not inserted correctly');

		// check that the first and last answer label.  If they are there, then so are the middle one
		equal($('#0_label').html(), 'black', 'first answer not set correctly');
		equal($('#3_label').html(), 'grey', 'last answer not set correctly');
		start();	
	}, 500);
	
});
