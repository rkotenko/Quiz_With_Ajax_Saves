var i = 0;  // question count
doPrep();	// doPrep does all the initial work, applying events and hiding certain things

// set up the initial question
setUpQuestion();


/*************** Functions ********************/

function displayResults() {
	// first hide the question div
	document.getElementById('quiz').style.display = 'none';
	
	// compute the results
	var total = 0;
	var length = allQuestions.length;
	
	for(var j = 0; j < length; j++){
		if(allQuestions[j].chosenAnswer == allQuestions[j].correctAnswer){
			total++;
		}
	}
	
	document.getElementById('num_correct').innerHTML = total + ' out of ' + length + ' correct';
	document.getElementById('percent').innerHTML = (total / length) * 100 + '%';		
	document.getElementById('results').style.display = 'block';
}

function doPrep(){
	document.getElementById('next').onclick = nextQuestion;
	document.getElementById('next').disabled = true;
	document.getElementById('results').style.display = 'none';  //hide the results div to start
	document.getElementById('back').onclick = previousQuestion;
	document.getElementById('back').style.display = 'none'; // hide the back button on first page

	// add an onchange event to the quiz div that holds the questions
	// Since the only thing that changes are the radio buttons, any change on the div mean
	// on was selected and the next button can be enabled
	document.getElementById('quiz').onchange = function(){
		document.getElementById('next').disabled = false;
	};
}

function nextQuestion()
{
	// reveal the back button.  Really should check if necessary but impact is minimal
	document.getElementById('back').style.display = 'inline-block';
	
	// place the selected answer into the chosenAnswer field of the question
	for(var j = 0; j < 4;j++){
		if(document.getElementById(j).checked) {
			allQuestions[i].chosenAnswer = j;
			
			// uncheck the radio button to get ready for the next question
			document.getElementById(j).checked = '';
		}
	}
	
	
	// check if the all questions have been used. If not, set up next one.
	// if so, compute the number correct and show the total percentage
	i++;
	
	if(i > allQuestions.length - 1) {
		displayResults();
	} else {
		setUpQuestion();
	}
}

function previousQuestion(){
	i--;  // remove one from the question count
	
	if(i == 0){
		document.getElementById('back').style.display = 'none';
	}
	
	setUpQuestion();
}

function setUpQuestion(){
	
	// disable the next button if the question is unanswered. Make sure it is enabled
	// if there was an answer given
	if(!allQuestions[i].chosenAnswer){
		document.getElementById('next').disabled = true;
	}else {
		document.getElementById('next').disabled = false;	
	}
	
	// insert the question and answers into the page
	document.getElementById('question').innerHTML = allQuestions[i].question;

	// only four possible answers so use 4 for the loop
	for(var j = 0; j < 4;j++){
		document.getElementById(j + '_label').innerHTML = allQuestions[i].choices[j];
	}
	
	// if there is an answer present, check the proper radio button
	if(allQuestions[i].chosenAnswer){
		document.getElementById(allQuestions[i].chosenAnswer).checked = true
	}
}
