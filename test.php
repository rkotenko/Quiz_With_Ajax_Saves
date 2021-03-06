<?php
echo '<!DOCTYPE HTML>
<html>
	<head>
		<title>Quiz time</title>
		<link rel="stylesheet" type="text/css" href="styles/style.css">
	</head>
	<body>
		<div id="main">
			<div class="results" id="results">
				<div id="num_correct">{{numCorrect}}</div>
				<div id="percent">{{percentCorrect}}</div>
			</div>
			<div id="user_scores" class="scores">
				<div>Your past scores</div>
				<li> 1 out of 4</li>
				<li> 3 out of 4</li>
				<li> 2 out of 4</li>
				<li> 3 out of 4</li>
			</div>
			<div id="top_scores" class="scores">
				<div>Top 20 scores</div>
				<table>
					<tr>
						<th>Name</th><th>Score</th>
					</tr>
					<tr>
						<td>Rob</td><td>4</td>
					</tr>
					<tr>
						<td>Frank</td><td>4</td>
					</tr>
					<tr>
						<td>Rob</td><td>4</td>
					</tr>
				</table>
			</div>
		</div>
		<div id="navigation">
			<button id="back" type="button">Back</button>
			<button id="next" type="button">Next</button>		
		</div>
	</body>
	<script src="scripts/jquery.js"></script>
	<script src="scripts/handlebars.runtime-v1.3.0.js"></script>
	<script src="scripts/questions.json"></script>
	<script src="templates/master_template.js"></script>
	<script src="scripts/quiz.js" ></script>
</html>';
?>