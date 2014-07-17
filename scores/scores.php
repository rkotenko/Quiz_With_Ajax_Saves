<?php
	$topScores = '[{"user": "Rob", "score": 4},{"user": "Steve", "score": 4},{"user": "Phil", "score": 3},
				  {"user": "Greg", "score": 3},{"user": "Armin", "score": 2}]';

	$robScores = '[{"correct": 4, "total": 4},{"correct": 4,"total": 4},
					{"correct": 4,"total": 4},{"correct": 3,"total": 4}]';

	if($_GET['reset']){
		// reset the files back to original state for testing.
		file_put_contents('Rob.scores', $robScores);
		file_put_contents('top.scores', $topScores);
		echo ' files reset';
	}
	if($_GET['type'] == 'saveUserScores')
	{	
		if(file_put_contents($_GET['name'] . '.scores', $_GET['data']))
		{
			echo 'score ok';
		}
		else
		{
			echo 'fail!';
		}

		exit;
	}
	elseif($_GET['type'] == 'saveTopScores')
	{	

		exit;
	}
	elseif($_GET['type'] == 'getUserScores')
	{	
		echo file_get_contents($_GET['name'] . '.scores');
	}
	elseif ($_GET['type'] == 'getTopScores') 
	{
		echo file_get_contents($_GET['name']);
	}

	
	
?>