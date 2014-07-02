var i = 0;  // question count
//document.getElementById('content').style.display = "none" // start off invisible before question is inserted

// insert the first set of question and answers into the page
document.getElementById('question').innerHTML = allQuestions[i].question;

// only four possible answers so use 4 for the loop
for(var j = 0; j < 4;j++){
	document.getElementById(j + '_label').innerHTML = allQuestions[i].choices[j];
}

function nextQuestion()
{
	// place the selected answer into the chosenAnswer field of the question
	for(var j = 0; j < 4;j++){
		if(document.getElementById(j).checked) {
			allQuestions[i].chosenAnswer = j;
		}
	}
}





	