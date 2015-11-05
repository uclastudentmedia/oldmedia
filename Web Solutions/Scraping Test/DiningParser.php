<?php
	$diningData = fopen( "dining.txt", "r" ) or die("Error!");
	$diningJSON = fread( $diningData, filesize( "dining.txt" ));
	$jsonArray = json_decode( $diningJSON, true );

	$hallInput = htmlspecialchars($_GET["Hall"]);
	$timeInput = htmlspecialchars($_GET["Time"]);
	$nameInput = htmlspecialchars($_GET["Name"]);

	$strippedArray = array();

	for( $i = 0; $i < count( $jsonArray ); $i++ )
	{
		if( !empty( $hallInput ) and $hallInput !== $jsonArray[$i]["Hall"] )
			continue;

		if( !empty( $timeInput ) and $timeInput !== $jsonArray[$i]["Time"] )
			continue;

		if( !empty( $nameInput ) and $nameInput !== $jsonArray[$i]["Name"] )
			continue;

		array_push( $strippedArray, $jsonArray[$i] );
	}

	echo json_encode( $strippedArray );

	fclose($diningData);
?>