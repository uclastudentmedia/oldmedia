var hall = "";
var time = "";
var name = "";

var itemsDict = new Object();

$(document).ready( function() {
	window.location.href="#";
});

function getItems()
{
	$.ajax(
    {
        url: 'http://dev.bruinmobile.com/phptest/DiningParser.php',
        type: 'GET',
        crossDomain: true,
        data:
        {
            Hall: hall,
            Time: time,
        },
        dataType: 'json',
        success: function( json )
        {
        	itemsDict = new Object();

        	for( var i = 0; i < json.length; i++ )
        	{
        		if( typeof itemsDict[json[i]["Section"]] == "undefined" )
	        	{
	        		itemsDict[json[i]["Section"]] = new Object();
	        	}
	        	itemsDict[json[i]["Section"]][json[i]["Name"].replace(/\W/g, '')] = json[i];
        	}

        	$("#collapseSet").empty();

        	for( var j in itemsDict )
        	{
        		var attach = "";
        		attach += '<div data-role="collapsible" data-collapsed="true" class="headerStyle">';
        		attach += '<h3>' + j + '</h3>';
        		attach += '<ul data-role="listview">';

        		for( var k in itemsDict[j] )
        			attach += '<li><a href onclick="populateItem( &quot;' + j + '&quot;, &quot;' + k + '&quot;);"><h2>' + itemsDict[j][k]["Name"] + '</h2></a></li>';

        		attach += '</ul></div>';
        		$("#collapseSet").append( attach );
        		$("#collapseSet").trigger('create');
        	}

        	window.location.href = "#locationname mealperiod";
        }
    });
}

function populateItem( section, name ) 
{
	// Serving Size
	var ssArray = itemsDict[section][name]["Size"].split(" ");
	$("#ss").html(ssArray[2]);

	// Calories
	var calArray = itemsDict[section][name]["Calories"].split(" ");
	$("#nfcal").text(calArray[1]);
	$("#nffatcal").text(calArray[4]);

	// Total Fat
	var totalFatArray = itemsDict[section][name]["Total Fat"].split(" ");
	$("#tfat").text(totalFatArray[2]);
	$("#tfatper").html('<span class="nfdvvalnum">' + totalFatArray[3].substring( 0, totalFatArray[3].length - 1 ) + '</span>%');

	// Saturated Fat
	var satFatArray = itemsDict[section][name]["Saturated Fat"].split(" ");
	$("#sfat").text(satFatArray[2]);
	$("#sfatper").html('<span class="nfdvvalnum">' + satFatArray[3].substring( 0, satFatArray[3].length - 1 ) + '</span>');

	// Trans Fat
	var tranFatArray = itemsDict[section][name]["Trans Fat"].split(" ");
	$("#trfat").text(tranFatArray[2]);

	// Cholesterol
	var cholArray = itemsDict[section][name]["Cholesterol"].split(" ");
	$("#chol").text(cholArray[1]);
	$("#cholper").html('<span class="nfdvvalnum">' + cholArray[2].substring( 0, cholArray[2].length - 1 ) + '</span>%');

	// Sodium
	var sodArray = itemsDict[section][name]["Sodium"].split(" ");
	$("#sod").text(sodArray[1]);
	$("#sodper").html('<span class="nfdvvalnum">' + sodArray[2].substring( 0, sodArray[2].length - 1 ) + '</span>%');

	// Total Carbohydrates
	var carbArray = itemsDict[section][name]["Carbohydrate"].split(" ");
	$("#carb").text(carbArray[2]);
	$("#carbper").html('<span class="nfdvvalnum">' + carbArray[3].substring( 0, carbArray[3].length - 1 ) + '</span>%');

	// Dietary Fiber
	var fibArray = itemsDict[section][name]["Dietary Fiber"].split(" ");
	$("#fib").text(fibArray[2]);
	$("#fibper").html('<span class="nfdvvalnum">' + fibArray[3].substring( 0, fibArray[3].length - 1 ) + '</span>%');

	// Sugars
	var sugArray = itemsDict[section][name]["Sugars"].split(" ");
	$("#sug").text(sugArray[1]);

	// Proteins
	var protArray = itemsDict[section][name]["Protein"].split(" ");
	$("#prot").text(protArray[1]);

	// Vitamins
	var vitAArray = itemsDict[section][name]["Vitamin A"].split(" ");
	$("#vitA").text(vitAArray[2]);

	var vitCArray = itemsDict[section][name]["Vitamin C"].split(" ");
	$("#vitC").text(vitCArray[2]);

	var calcArray = itemsDict[section][name]["Calcium"].split(" ");
	$("#calc").text(calcArray[1]);

	var ironArray = itemsDict[section][name]["Iron"].split(" ");
	$("#iron").text(ironArray[1]);

	$("#ing").text(itemsDict[section][name]["Ingredients"]);

	window.location.href = "#locationname mealperiod itemid";
}