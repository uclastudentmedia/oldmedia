<?php
    $which = $_GET['choice'];
    $ind = $_GET['index'];
    switch( $which ) {
    	case "up":
    		upvote($ind);
    		break;

    	case "down":
    		downvote($ind);
    		break;
    }

	function upvote( $index )
	{
	    $myfile = fopen("notes.txt", "r") or die("Unable to open file!");
	    $notesArray = json_decode(fread($myfile, filesize("notes.txt")), true);
	    fclose($myfile);
		$notesArray[(int)$index]['upvotes'] = (int) $notesArray[$index]['upvotes'] + 1;
		$writefile = fopen("notes.txt", "w") or die("Unable to open file!");
		fwrite($writefile, json_encode($notesArray));
		$fclose();
	}

	function downvote( $index )
	{
	    $myfile = fopen("notes.txt", "r") or die("Unable to open file!");
	    $notesArray = json_decode(fread($myfile, filesize("notes.txt")), true);
	    fclose($myfile);
		$notesArray[(int)$index]['upvotes'] = (int) $notesArray[$index]['downvotes'] - 1;
		$writefile = fopen("notes.txt", "w") or die("Unable to open file!");
		fwrite($writefile, json_encode($notesArray));
		$fclose();
	}
?>