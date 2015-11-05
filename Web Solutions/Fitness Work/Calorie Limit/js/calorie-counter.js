$(function() {
        
        //Insert code here
        
        });

function updatecalories(gender, weight, weightunit, feet, inches, age, activity)
{
	$("#maintaincalories").html("<h1> <font color='#084B8A'>" +maintaincal(calcBMR(gender, weight, weightunit, feet, inches, age), activity)+" Calories </font> </h1>");
	var totalcal = maintaincal(calcBMR(gender, weight, weightunit, feet, inches,age), activity);
	$("#losecalories").html("<h1>  <font color='#084B8A'>" +losecal(totalcal) + " </font> </h1>");
}

function calcBMR(gender, weight, weightunit, feet, inches, age)
{
	var height = parseInt(feet)*12+parseInt(inches);
	var weightnum;
	if (weightunit == "kg")
	{
		weightnum = parseInt(weight);
	}
	else if (weightunit == "lb")
	{
		weightnum = parseInt(weight)/2.2046;
	}
	var agenum = parseInt(age);
	var BMR;
	if (gender == "male")
	{
		BMR = 66.47+(13.75* weightnum)+(5.0*height)-(6.75*agenum);
	}
	if (gender == "female")
	{
		BMR =665.09+(9.56*weightnum)+(1.84*height)-(4.67*agenum);
	}

	return BMR;
	
}
function maintaincal(bmr, activity)
{
	var cal;
	if(activity == "sedentary")
	{
		cal = 1.2*bmr;
	}
	if(activity == "lightly active")
	{
		cal = 1.375*bmr;
	}
	if(activity == "moderately active")
	{
		cal = 1.55*bmr;
	}
	if(activity == "very active")
	{
		cal = 1.725*bmr;	
	}
	if(activity == "extremely active")
	{
		cal = 1.9=bmr;	
	}

	return Math.round(cal);
}

function losecal(maincal)
{
	return (Math.round(maincal-500)+" - "+Math.round(maincal-250)+" Calories");
}