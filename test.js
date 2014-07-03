$('#document').ready(function() {
	var i = 0;  // question count
	
	// load the login page and run its setup function.  
	loadLogin();


	/***************** Functions ********************/

	function checkCredentials(){
		loadQuizPage();
	}

	function displayResults() {
		// first hide the question div
		$('#quiz').css('display', 'none');
	
		// compute the results
		var total = 0;
		var length = allQuestions.length;
	
		for(var j = 0; j < length; j++){
			if(allQuestions[j].chosenAnswer == allQuestions[j].correctAnswer){
				total++;
			}
		}
	
		$('#num_correct').html(total + ' out of ' + length + ' correct');
		$('#percent').html((total / length) * 100 + '%');		
		$('#results').fadeIn('slow');
	}

	/*
		Load the login page and apply the login button click event
	*/

	function loadLogin(){
		$('body').load('templates/login.html', function(){
			$('#login_button').click(checkCredentials);	
		});
		
		
	}

	function loadQuestion(){
	
		answer = allQuestions[i].chosenAnswer;
	
		// disable the next button if the question is unanswered. Make sure it is enabled
		// if there was an answer given
		// also mark a radio button as checked if the answer is present
		if(answer === null){
			$('#next').prop('disabled', true);
		}else {
			$('#next').prop('disabled', false);
			$('#' + answer).prop('checked', true);	
		}
	
		// insert the question and answers into the page
		$('#question').html(allQuestions[i].question);

		// only four possible answers so use 4 for the loop
		for(var j = 0; j < 4;j++){
			$('#' + j + '_label').html(allQuestions[i].choices[j]);
		}
		
		$('#quiz').fadeIn('slow');
	}

	/*
		Loads the html for the quiz page and sets up some events and properties on it
	*/

	function loadQuizPage(){

		// load the question html
		$('body').load('templates/quiz.html', function(){
			$('#quiz').css('display', 'none');
			$('#next').click(nextQuestion);
			$('#next').prop('disabled', true);
			$('#results').css('display', 'none');  //hide the results div to start
			$('#back').click(previousQuestion);
			$('#back').css('display', 'none'); // hide the back button on first page

			// add an onchange event to the quiz div that holds the questions
			// Since the only thing that changes are the radio buttons, any change on the div mean
			// on was selected and the next button can be enabled
			$('#quiz').change(function(){
				$('#next').prop('disabled', false);
			});
			
			// now load the question
			loadQuestion();	
		});
		

	}

	function nextQuestion()
	{
		// reveal the back button.  Really should check if necessary but impact is minimal
		$('#back').css('display', 'inline-block');
	
		// place the selected answer into the chosenAnswer field of the question
		for(var j = 0; j < 4;j++){
			if($('#' + j).prop('checked')) {
				allQuestions[i].chosenAnswer = j;
			
				// uncheck the radio button to get ready for the next question
				$('#' + j).prop('checked', false);
			}
		}
	
	
		// check if the all questions have been used. If not, set up next one.
		// if so, compute the number correct and show the total percentage
		i++;
	
		if(i > allQuestions.length - 1) {
			$('#quiz').fadeOut('slow', displayResults);
		} else {
			$('#quiz').fadeOut('slow', loadQuestion);
		}
	}

	function previousQuestion(){
		i--;  // remove one from the question count
	
		if(i === 0){
			$('#back').css('display', 'none');
		}
		
		// fade out the question div and set up the next question
		$('#quiz').fadeOut('slow', loadQuestion);
		
	}
	
});