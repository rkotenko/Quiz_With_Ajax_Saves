<?php
	if($_GET['type'] == 'saveUserScores')
	{	exit;
	}
	elseif($_GET['type'] == 'saveTopScores')
	{	exit;
	}
	elseif($_GET['type'] == 'getUserScores')
	{	
		echo file_get_contents($_GET['name'] . '.scores');
	}
	elseif ($_GET['type'] == 'getTopScores') 
	{
		echo file_get_contents('top.scores');
	}

	
	
?>