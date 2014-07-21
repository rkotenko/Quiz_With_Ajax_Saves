<?php
	$topScores = '[{"user": "Rob", "score": 4},{"user": "Steve", "score": 4},{"user": "Phil", "score": 4},
				  {"user": "Greg", "score": 3},{"user": "Armin", "score": 2}]';

	$robScores = '[{"correct": 4, "total": 4},{"correct": 4,"total": 4},
					{"correct": 4,"total": 4},{"correct": 3,"total": 4}]';

	if($_GET['reset']){
		// reset the files back to original state for testing.

		array_map('unlink', glob("*.scores"));
		file_put_contents('Rob.scores', $robScores);
		file_put_contents('top.scores', $topScores);

		echo ' files reset';
	}
	elseif($_GET['type'] == 'put')
	{	
		file_put_contents($_GET['name'], $_GET['data']);
		echo 'file saved';
		
	}
	elseif($_GET['type'] == 'get')
	{	
		echo file_get_contents($_GET['name']);
	}

?>