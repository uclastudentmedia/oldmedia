<?php

set_time_limit(60);

$url = "http://menu.ha.ucla.edu/foodpro/";

$html = file_get_contents($url . 'default.asp');

$lines = preg_split('/\<\/.*?>/', $html);

$rgx_time = '/\<td class=\"menumealheader\"(.+?)\"/';
$rgx_hall = '/\<td class=\"menulocheader\"\>\<.*\"\>(.*$)/';
$rgx_sub = '/\<li class=\"category5\"\>(.*$)/';
$rgx_item = '/\<li class=\"level5\"\>\<a class=\"itemlinkt*\" href=\"(.+?)\" onmouseover/';
$rgx_sort = '/\<td class=\"(.+?)\"\>/';
$rgx_fact = '/\<p class=\".*?\>(.+?)\<\/p>/';
$rgx_fact2 = '/\<span class=\"nfvitpct\"\>(.+?)\<\/span>/';
$rgx_name = '/\<title\>(.+?)\<\/title\>/';
$rgx_veg = '/\<img class=\"webcode\" src=.*?alt=\"(.+?)\"/';

$lr = 0;
$current = "";
$left = "";
$right = "";
$sub = "";
$items = array();
$index = 0;
$timecount = 0;
$vitamins = array("Vitamin A", "Vitamin C", "Calcium", "Iron");
$tags = array("Size","","Calories","","Total Fat","Saturated Fat","Trans Fat","Cholesterol","Sodium","Carbohydrate",
"Dietary Fiber","Sugars","Protein","Ingredients");

foreach( $lines as $line )
{	
	preg_match($rgx_veg,$line,$match);
	if( count($match) >= 1 )
	{
		$items[$index-1]["Veg"] = $match[1];
	}

	preg_match($rgx_time,$line,$match);
	if( count($match) >= 1 )
	{
		$timecount++;
	}

	preg_match($rgx_hall,$line,$match);
	if( count($match) >= 1 )
	{
		if( $lr == 0 )
			$left = $match[1];
		else
			$right = $match[1];
		$lr = 1 - $lr;
	}

	preg_match($rgx_sort,$line,$match);
	if( count($match) >= 1 )
	{
		if( $match[1] == "menugridcell" )
			$current = $left;
		else
			$current = $right;
	}
	
	preg_match($rgx_sub,$line,$match);
	if( count($match) >= 1 )
	{	
		$sub = $match[1];
	}
	
	preg_match($rgx_item,$line,$match);
	if( count($match) >= 1 )
	{
		$items[$index] = array("Hall"=>$current,"Section"=>$sub);
		if( $timecount == 1 )
			$items[$index]["Time"] = "Lunch";
		else if( $timecount == 2 )
			$items[$index]["Time"] = "Dinner";
		$cont = file_get_contents($url . $match[1]);
		preg_match($rgx_name,$cont,$match_facts);
		$items[$index]["Name"] = $match_facts[1];
		preg_match_all($rgx_fact,$cont,$match_facts);
		for($i = 0; $i < count($match_facts[1]); $i++)
			if( $tags[$i] == "")
				continue;
			else
				$items[$index][$tags[$i]] = preg_replace(array('/\<span class=\".*?\>/','/<\/span\>/'),'',$match_facts[1][$i]);
		preg_match_all($rgx_fact2,$cont,$match_facts);
		for($i = 0; $i< count($match_facts[1]); $i++)
			$items[$index][$vitamins[$i]] = $vitamins[$i] . " " . $match_facts[1][$i];
		$index++;
	}			
}

foreach($items as &$val)
	if( array_key_exists("Ingredients",$val ))
		$val["Ingredients"] = utf8_encode( $val["Ingredients"] );

$DOCUMENT_ROOT = $_SERVER['DOCUMENT_ROOT'];
$filename = $DOCUMENT_ROOT.'/phptest/dining.txt';
$fptr = fopen($filename, 'w');
fwrite($fptr, json_encode($items));
fclose($fptr);
echo json_encode($items);
?>
