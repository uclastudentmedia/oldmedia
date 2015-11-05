// Variable Declaration
/**
 * A number corresponding to the homepage's currently selected major.
 *
 * @author Albert Deng
 */
var majorIndex = 2;

/**
 * An array that holds all of the majors that are to be used on the home page.
 *
 * @author Albert Deng
 */
var majorNameArray = [ "NullNameIsOkayI'veDoneThisEnough", "Anthropology", "Biochemistry", "Biology", "Business Economics", "Economics", "Linguistics, Applied", "Political Science", "Psychology", "Sociology" ];

/**
 * An array containing all of the department acronyms.
 *
 * @author Albert Deng
 */
var majorArray = [ "NullMajorIsBestMajor" ];

/**
 * An array that holds the names of all of the schools.
 *
 * @author Albert Deng
 */
var schoolArray = [ "NullSchoolIsBestSchool", "College of Letters and Science", "School of Engineering and Applied Science", "School of the Arts and Architecture", "School of Nursing", "School of Theater, Film, and Television", "College of Letters and Science", "School of Engineering and Applied Science" ];

/**
 * An array containing all of the classes that the user has taken.
 *
 * @author Albert Deng
 */
var classArray = new Array();

/**
 * An array that contains all of the pre-major classes for the current major. Is
 * emptied every time a new major is selected, and populated anew with
 *
 * @author Albert Deng
 */
var preMajorRequirementsArray = new Array();

/**
 * A dictionary holding information for all of the classes the user has added.
 *
 * @author Albert Deng
 */
var classDictionary = {
    "nullEntry": "This is a null entry"
};

var categoryDictionary = {
    "nullEntry": "This is a null entry"
};

var pseudoCatDictionary = {
    "nullEntry": "This is a null entry"
};

var myDataRef = new Firebase('https://uclastudentmedia.firebaseio.com/majors');

var majorClassDictionary = new Object();

var currReqUnitArray = new Array();

// Initialization
$( document ).ready( function()
{
    // alert("Initialization successful!");
    updateHomePage( majorNameArray[ 1 ] );
    /*
    if ( typeof $.cookie( 'savedUserCourses' ) != "undefined" )
    {
        var str = $.cookie( 'savedUserCourses' ).split( "," );
        for ( var l = 0; l < str.length; l += 2 )
        {
            var tempArray = new Array();
            tempArray.push( str[ l ] );
            tempArray.push( str[ l + 1 ] );
            classArray.push( tempArray );
        }

        for ( var q = 0; q < classArray.length; q++ )
        {
            addSpecifiedCourseToList( classArray[ q ][ 0 ], classArray[ q ][ 1 ] );
        }
    }

    if ( typeof $.cookie( "classDictionaryBackup" ) != "undefined" )
    {
        var stringSplitter = $.cookie( "classDictionaryBackup" ).split( "~" );
        stringSplitter.splice( 0, 1 );
        for ( var g = 0; g < stringSplitter.length; g += 5 )
        {
            var tempDictionary = {
                "department": stringSplitter[ g ],
                "class_number": stringSplitter[ g + 1 ],
                "units": stringSplitter[ g + 2 ],
                "name": stringSplitter[ g + 3 ],
                "description": stringSplitter[ g + 4 ]
            };
            var keyGen = stringSplitter[ g ] + "d" + stringSplitter[ g + 1 ];
            classDictionary[ keyGen ] = tempDictionary;
        }
    }
*/
    $.mobile.loadPage( "#page2",
    {
        showLoadMsg: true
    } );
    $.mobile.loadPage( "#page3",
    {
        showLoadMsg: true
    } );

    populateDepartmentList();
    populateMajorList();
    repopulateList( $( "#majorSelect" ).val() );

    updateDisable();
/*
    if ( typeof $.cookie( "savedMajor" ) != "undefined" )
    {
        $( "#majorSelect" ).val( $.cookie( "savedMajor" ) ).selectmenu( 'refresh' );
        updateHomePage( majorNameArray[ $( "#majorSelect" ).val() ] );
        repopulateList( $( "#majorSelect" ).val() );
        $( "#page3" ).page();
        $( "input:checkbox" ).checkboxradio().checkboxradio( 'refresh' );
        updateSlider();
        $.cookie( 'savedMajor', $( "#majorSelect" ).val() );
    }*/

} );

// Major Switch Scripts
/**
 * Determines which requirements array to use for populating the progress page's checklists.
 *
 * @param
 * @param major         - The major's PK value
 * @author Albert Deng
 */

function repopulateList( major )
{
    switch ( parseInt( major ) )
    {
        case 0: // Anthropology
            updateMajorArray( 2 );
            break;

        case 1: // Biochemistry
            updateMajorArray( 3 );
            break;

        case 2: // Biology
            updateMajorArray( 4 );
            break;

        case 3: // Business 
            updateMajorArray( 5 );
            break;

        case 4: // Economics
            updateMajorArray( 6 );
            break;

        case 5: // Applied Linguistics
            updateMajorArray( 82 );

        case 6: // Political Science
            updateMajorArray( 13 );
            break;

        case 7: // Psychology
            updateMajorArray( 14 );
            break;

        case 8: // Sociology
            updateMajorArray( 16 );
            break;

        default:
            // alert("Failure");
            break;
    }
}

// Event Handlers
/**
 * Event handler for the Add Course page's button that initiates the add-course process.
 *
 * @author Albert Deng
 */
$( document ).on( "tap", '#ac_button', function()
{
    getPage( $( "#ac_dept" ).val(), $( "#ac_numb" ).val() );
    // alert("Added " + majorArray[classArray[classArray.length-1][0]] + " " + classArray[classArray.length-1][1]);
} );

/**
 * Executes the commands necessary to change the major used.
 *
 * @author Albert Deng
 */
$( document ).on( "change", "#majorSelect", function()
{
    updateHomePage( majorNameArray[ $( "#majorSelect" ).val() ] );
    repopulateList( $( "#majorSelect" ).val() );
    $( "#page3" ).page();
    $( "input:checkbox" ).checkboxradio().checkboxradio( 'refresh' );
    // $.cookie( 'savedMajor', $( "#majorSelect" ).val() );
    // alert("Finished!");
} );

// Progress Page Scripts
/**
 * Disables all of the checkboxes.
 *
 * @author Albert Deng
 */

function updateDisable()
{
    $( "input:checkbox" ).checkboxradio().checkboxradio( 'disable' );
    $( "#prog" ).slider( 'disable' );
}

function uploadMajor()
{
    var major = $('#majorInput').val();
    var entry = {input: major};
    myDataRef.push(entry);
    $("#majorSubmit").hide();
    alert("Thank you for your feedback!");
}


/**
 * Finds the checkbox specified and then checks or unchecks it.
 *
 * @WARNING: must update this for requirement section.
 * @param addOrRemove   - Whether to check or uncheck the box.
 * @param toCheck       - The checkbox's ID.
 * @author Albert Deng
 */

function updateCheckbox( addOrRemove, toCheck )
{
    var dep = parseInt( toCheck.substring( 0, toCheck.indexOf( 'x' ) ) );   
    var num = toCheck.substring( toCheck.indexOf( 'x' ) + 1 ).toUpperCase();

    /*
    for ( var i = 0; i < currMajorArray[ 1 ].length; i++ )
    {
        for ( var k = 0; k < currMajorArray[ 1 ][ i ].length; k++ )
        {
            thisClass = currMajorArray[ 1 ][ i ][ k ];
            var thisDep = parseInt( thisClass.substring( 0, thisClass.indexOf( 'e' ) ) );
            var thisNum = thisClass.substring( thisClass.indexOf( 'e' ) + 1 );

            if ( dep == thisDep && num == thisNum )
            {
                $( '#' + thisClass ).prop( "checked", addOrRemove ).checkboxradio( "refresh" );
                break;
            }
        }
    }
    */
    var key = dep + "r" + num;
    if ( key in majorClassDictionary )
    {
        var infoArray = majorClassDictionary[ key ].split( "_" );

        if ( infoArray[ 3 ] == "true" )
        {
            switch ( infoArray[ 1 ] )
            {
                case "A":
                    alert( "You broke something here..." );
                    break;

                case "C":
                    var numChecked = $( '#cc_' + infoArray[ 0 ] + ' input:checked' ).length;
                    if ( numChecked < infoArray[ 2 ] )
                    {
                        $( '#cat' + infoArray[ 0 ] + '_' + numChecked ).prop( "checked", addOrRemove ).checkboxradio( "refresh" );
                    }
                    break;
            }
        }
        else
        {
            switch ( infoArray[ 1 ] )
            {
                case "A":
                    var thisClass = dep + "e" + num;
                    $( '#' + thisClass ).prop( "checked", addOrRemove ).checkboxradio( "refresh" );
                    break;

                case "C":
                    var thatClass = dep + "c" + num;

                    if ( $( '#choiceC_' + infoArray[ 0 ] + ' input' ).length < infoArray[ 2 ] && $( '#' + thatClass ).length == 0 )
                    {
                        $( '#choiceC_' + infoArray[ 0 ] ).append( '<input id="' + thatClass + '" type="checkbox"><label for="' + thatClass + '">' + majorArray[ dep ] + ' ' + num + '</label>' );
                        $( '#' + thatClass ).prop( "checked", true ).checkboxradio().checkboxradio( "refresh" );
                        $( '#page3' ).trigger( 'create' );
                        updateDisable();
                    }
                    break;

                case "U":
                    var thereClass = dep + "u" + num;
                    if ( typeof currReqUnitArray[infoArray[0]] == "undefined" )
                    {
                        currReqUnitArray[infoArray[0]] = 0;
                    }

                    if ( currReqUnitArray[ infoArray[0] ] < infoArray[ 2 ] && $( '#' + thereClass ).length == 0 )
                    {
                        $( '#choiceU_' + infoArray[ 0 ] ).append( '<input id="' + thereClass + '" type="checkbox"><label for="' + thereClass + '">' + majorArray[ dep ] + ' ' + num + '</label>' );
                        $( '#' + thereClass ).prop( "checked", true ).checkboxradio().checkboxradio( "refresh" );
                        $( '#page3' ).trigger( 'create' );
                        currReqUnitArray[infoArray[0]] += getUnitsFromID( dep + "d" + num );
                        updateDisable();
                    }
                    break;

                default:
                    alert( "Error: FindBoxException" );
                    break;
            }
        }
    }

    updateSlider();
    updatePreMajorTransition();
}

/**
 * Runs through the entire list of checkboxes and checks all of the classes currently added to classArray.
 *
 * @author Albert Deng
 */

function updateAllCheckboxes()
{
    for ( var j = 0; j < classArray.length; j++ )
    {
        updateCheckbox( true, classArray[ j ][ 0 ] + "x" + classArray[ j ][ 1 ] );
    }
    updateSlider();
}

/**
 * Updates the slider's value based on the ratio of checked boxes to the total number of checked boxes.
 *
 * @WARNING: update after adding types
 * @author Albert Deng
 */

function updateSlider()
{
    var totalNum = 0;
    for ( var i = 0; i < $( '#page3 div' ).length; i++ )
    {
        if ( typeof $( '#page3 div' ).eq( i ).attr( 'data-req' ) != "undefined" )
        {
            var tempString = $( '#page3 div' ).eq( i ).attr( 'data-req' );
            totalNum += parseInt( tempString.substring( tempString.indexOf( "_" ) + 1, tempString.length ) );
        }
    }
    var totalChecked = $( 'input:checked' ).length;
    var div = totalChecked / totalNum;
    div = Math.round( div *= 100 );
    $( '#prog' ).val( div ).slider( 'refresh' );
}

/**
 * Collapses or uncollapses the requirement lists based on whether there are
 * pre-major classes remaining.
 *
 * @author Albert Deng
 */

function updatePreMajorTransition()
{
    var preMajorNum = $( '#pm_a fieldset input:checkbox' ).length;
    var preMajorChecked = $( '#pm_a fieldset input:checked' ).length;

    if ( preMajorNum == preMajorChecked )
    {
        $( '#pmr' ).children().trigger( 'collapse' );
        $( '#mr' ).children().trigger( 'expand' );
    }
    else if ( preMajorNum > preMajorChecked )
    {
        $( '#pmr' ).children().trigger( 'expand' );
        $( '#mr' ).children().trigger( 'collapse' );
    }
}

// Button Functions
/**
 * Checks whether the class to be added is already in classArray
 *
 * @param dept          - The class's department ID.
 * @param numb          - The class's number.
 * @author Albert Deng
 */

function isDuplicate( dept, numb )
{
    for ( var i = 0; i < classArray.length; i++ )
    {
        if ( classArray[ i ][ 0 ] == dept && classArray[ i ][ 1 ].toUpperCase() == numb.toUpperCase() )
        {
            alert( "You have already added this class!" );
            return true;
        }
    }

    return false;
}

/**
 * Remove a course array with the given department and number from the classArray.
 *
 * @param name          - The class ID.
 * @author Albert Deng
 */

function removeCourse( name )
{
    var dep = parseInt( name.substring( 0, name.indexOf( 'x' ) ) );
    var num = name.substring( name.indexOf( 'x' ) + 1 );
    var resultArray = new Array();
    var recheck = false;

    for ( var i = 0; i < classArray.length; i++ )
    {
        if ( classArray[ i ][ 0 ] == dep && classArray[ i ][ 1 ] == num )
        {
            continue;
        }
        resultArray.push( classArray[ i ] );
    }

    if ( $( "#" + dep + "c" + num ).length == 1 )
    {
        // Type C
        $( "#" + dep + "c" + num ).parent().remove();
        recheck = true;
    }
    else if ( $( "#" + dep + "u" + num ).length == 1 )
    {
        // Type U
        $( "#" + dep + "u" + num ).parent().remove();
        recheck = true;
    }
    else if ( $( "#" + dep + "e" + num ).length == 1 )
    {
        // Type A
        updateCheckbox( false, name );
    }
    else
    {
        // Category
        var q = getCategoryID( dep + "d" + num.toUpperCase() );
        var s = $( "#cc_" + q + " input:checked" ).length - 1;

        $( "#cat" + q + "_" + s ).prop( "checked", false ).checkboxradio( "refresh" );
    }

    $( "li[name=" + name + "]" ).remove();

    $( "#ac_list" ).listview( 'refresh' );
    $( "#panel1 ul" ).listview( 'refresh' );

    // alert("Original had: " + classArray.length + "; New has: " + resultArray.length);
    classArray = resultArray;
    // $.cookie( 'savedUserCourses', classArray );
    if ( recheck )
    {
        updateAllCheckboxes();
    }
}

/**
 * Visually adds the last course added to classArray course to both of the
 * Completed Courses lists.
 *
 * @author Albert Deng
 */

function addCourseToList()
{
    var courseString = majorArray[ classArray[
        classArray.length - 1 ][ 0 ] ] + ' ' + classArray[ classArray.length - 1 ][ 1 ].toUpperCase();
    $( "#ac_list" ).append( '<li name=' + classArray[ classArray.length - 1 ][ 0 ] + "x" + classArray[ classArray.length - 1 ][ 1 ] + ' data-theme=""><a href="#page5" onclick="refreshPage(&quot;' + classArray[ classArray.length - 1 ][ 0 ] + "d" + classArray[ classArray.length - 1 ][ 1 ] + '&quot;)" data-transition="slideup">' + courseString + '</a></li>' );
    $( "#panel1 ul" ).append( '<li name=' + classArray[ classArray.length - 1 ][ 0 ] + "x" + classArray[ classArray.length - 1 ][ 1 ] + ' data-theme="a"><a href="javascript:removeCourse(&quot;' + classArray[ classArray.length - 1 ][ 0 ] + "x" + classArray[ classArray.length - 1 ][ 1 ] + '&quot;);" data-transition="slide">' + courseString + '</a></li>' );
    $( "#ac_list" ).listview( 'refresh' );
    $( "#panel1 ul" ).listview( 'refresh' );
}

function addSpecifiedCourseToList( department, number )
{
    var num = "" + number;
    num.toUpperCase();
    var courseString = majorArray[ department ] + ' ' + num;
    $( "#ac_list" ).append( '<li name=' + department + "x" + number + ' data-theme=""><a href="#page5" onclick="refreshPage(&quot;' + department + "d" + num + '&quot;)" data-transition="slideup">' + courseString + '</a></li>' );
    $( "#panel1 ul" ).append( '<li name=' + department + "x" + number + ' data-theme="a"><a href="javascript:removeCourse(&quot;' + department + "x" + num + '&quot;);" data-transition="slide">' + courseString + '</a></li>' );
    $( "#ac_list" ).listview( 'refresh' );
    $( "#panel1 ul" ).listview( 'refresh' );
}

/**
 * Populates the Add Course page's list of departments from the server's master list.
 *
 * @author Albert Deng
 */

function populateDepartmentList()
{
    $.ajax(
    {
        url: 'http://majors.uclastudentmedia.com/departments/',
        type: 'GET',
        crossDomain: true,
        data:
        {
            order_by: "acronym"
        },
        dataType: 'json',
        success: function( json )
        {
            var compositeString = "";

            for ( var r = 0; r < json.length; r++ )
            {
                compositeString += '<option value="' + json[ r ][ 'pk' ] + '">' + json[ r ][ 'fields' ][ 'acronym' ] + '</option>';
                majorArray[ parseInt( json[ r ][ 'pk' ] ) ] = json[ r ][ 'fields' ][ 'acronym' ];
            }

            $( '#page2 select' )[ 0 ].innerHTML = compositeString;
            $( '#page2 select' ).selectmenu( 'refresh' );
        },
        error: function()
        {
            window.location.replace = 'http://adeng927.bol.ucla.edu/500.html';
        }
    } );

}

/**
 * Updates page5 with the requested class's elements.
 *
 * @param key           - The class page ID.
 * @author Albert Deng
 */

function refreshPage( key )
{
    //$( '#page5 h3' )[ 0 ].innerHTML = majorArray[ parseInt( classDictionary[ key ][ 'department' ] ) ] + " " + classDictionary[ key ][ 'class_number' ];
    $( '#page5 h3' )[ 0 ].innerHTML = classDictionary[ key ][ 'name' ];
    $( '#page5 div p' )[ 0 ].innerHTML = "<span><strong>Units:</strong> " + classDictionary[ key ][ 'units' ] + "</span>";
    $( '#page5 div p span' )[ 1 ].innerHTML = "<span><strong>Description:</strong></span>";
    $( '#page5 div p' )[ 2 ].innerHTML = "<p>" + classDictionary[ key ][ 'description' ] + "</p>";
}

// Page Generation
/**
 * Gets the given class from the server, checks if it is a real class, and adds
 * it to classArray if it is. Also executes the addCourseToList() and updateCheckbox
 * commands, as well as caching that class's information such that it can be called
 * when page5 is to be updated.
 *
 * @param depart        - The class's department ID.
 * @param number        - The class's number.
 * @author Albert Deng
 */

function getPage( depart, number )
{
    $.ajax(
    {
        url: 'http://majors.uclastudentmedia.com/classes/',
        type: 'GET',
        crossDomain: true,
        data:
        {
            department__id: depart,
            class_number: number
        },
        dataType: 'json',
        success: function( json )
        {
            // Check if class exists
            if ( json.length == 0 )
            {
                alert( "This is not a real class!" );
            }
            else
            {
                // Add to list
                if ( !isDuplicate( depart, number ) )
                {
                    var course = new Array();
                    course[ 0 ] = depart;
                    course[ 1 ] = number;

                    var keyGen = depart + "d" + number;
                    classDictionary[ keyGen ] = json[ 0 ][ 'fields' ];

                    var dictionaryString = "~" + classDictionary[ keyGen ][ 'department' ] + "~" + classDictionary[ keyGen ][ 'class_number' ] + "~" + classDictionary[ keyGen ][ 'units' ] + "~" + classDictionary[ keyGen ][ 'name' ] + "~" + classDictionary[ keyGen ][ 'description' ];
                    /*
                    if ( typeof $.cookie( "classDictionaryBackup" ) == "undefined" )
                    {
                        $.cookie( "classDictionaryBackup", dictionaryString );
                    }
                    else
                    {
                        $.cookie( "classDictionaryBackup", $.cookie( "classDictionaryBackup" ) + dictionaryString );
                    }*/

                    classArray.push( course );
                    // $.cookie( 'savedUserCourses', classArray );
                    addCourseToList();
                    updateCheckbox( true, depart + "x" + number );
                }
            }
        },
        error: function()
        {
            window.location.replace = 'http://adeng927.bol.ucla.edu/500.html';
        }
    } );
}

/**
 * Same as getPage, except accepts a PK ID instead of a department and class
 * number.
 *
 * @param pkIDArray     - The class's PK ID.
 * @author Albert Deng
 */
function getPageFromID( pkIDArray, categoryID )
{
    $.ajax(
    {
        url: 'http://majors.uclastudentmedia.com/classes/',
        type: 'GET',
        crossDomain: true,
        data:
        {
            pk__in: pkIDArray.toString()
        },
        dataType: 'json',
        success: function( json )
        {
            // Check if class exists
            if ( json.length == 0 )
            {
                alert( "This is not a real class!" );
            }
            else
            {
                for ( var q = 0; q < json.length; q++ )
                {
                    var depart = json[ q ][ 'fields' ][ 'department' ];
                    var number = json[ q ][ 'fields' ][ 'class_number' ];
                    // Add to list
                    if ( !isDuplicate( depart, number ) )
                    {
                        var course = new Array();
                        course[ 0 ] = depart;
                        course[ 1 ] = number;

                        var keyGen = depart + "d" + number;
                        classDictionary[ keyGen ] = json[ q ][ 'fields' ];

                        var dictionaryString = "~" + classDictionary[ keyGen ][ 'department' ] + "~" + classDictionary[ keyGen ][ 'class_number' ] + "~" + classDictionary[ keyGen ][ 'units' ] + "~" + classDictionary[ keyGen ][ 'name' ] + "~" + classDictionary[ keyGen ][ 'description' ];
                        if ( typeof categoryDictionary[ categoryID ] == "undefined" )
                        {
                            categoryDictionary[ categoryID ] = new Array();
                        }

                        categoryDictionary[ categoryID ][ q ] = keyGen;
                        /*
                        if ( typeof $.cookie( "classDictionaryBackup" ) == "undefined" )
                        {
                            $.cookie( "classDictionaryBackup", dictionaryString );
                        }
                        else
                        {
                            $.cookie( "classDictionaryBackup", $.cookie( "classDictionaryBackup" ) + dictionaryString );
                        }*/ 
                    }
                }
            }
        },
        error: function()
        {
            window.location.replace = 'http://adeng927.bol.ucla.edu/500.html';
        }
    } );
}

function getPageFromIDReq( pkIDArray, requirementSection )
{
    $.ajax(
    {
        url: 'http://majors.uclastudentmedia.com/classes/',
        type: 'GET',
        crossDomain: true,
        data:
        {
            pk__in: pkIDArray.toString()
        },
        dataType: 'json',
        success: function( json )
        {
            // Check if class exists
            if ( json.length == 0 )
            {
                alert( "This is not a real class!" );
            }
            else
            {
                for ( var q = 0; q < json.length; q++ )
                {
                    var depart = json[ q ][ 'fields' ][ 'department' ];
                    var number = json[ q ][ 'fields' ][ 'class_number' ];
                    // Add to list
                    if ( !isDuplicate( depart, number ) )
                    {
                        var course = new Array();
                        course[ 0 ] = depart;
                        course[ 1 ] = number;

                        var keyGen = depart + "d" + number;
                        classDictionary[ keyGen ] = json[ q ][ 'fields' ];

                        var dictionaryString = "~" + classDictionary[ keyGen ][ 'department' ] + "~" + classDictionary[ keyGen ][ 'class_number' ] + "~" + classDictionary[ keyGen ][ 'units' ] + "~" + classDictionary[ keyGen ][ 'name' ] + "~" + classDictionary[ keyGen ][ 'description' ];
                        if ( typeof pseudoCatDictionary[ requirementSection ] == "undefined" )
                        {
                            pseudoCatDictionary[ requirementSection ] = new Array();
                        }

                        var reqArray = new Array();
                        reqArray[ 0 ] = keyGen;
                        reqArray[ 1 ] = json[ q ][ 'fields' ][ 'units' ];

                        pseudoCatDictionary[ requirementSection ][ q ] = reqArray;
/*
                        if ( typeof $.cookie( "classDictionaryBackup" ) == "undefined" )
                        {
                            $.cookie( "classDictionaryBackup", dictionaryString );
                        }
                        else
                        {
                            $.cookie( "classDictionaryBackup", $.cookie( "classDictionaryBackup" ) + dictionaryString );
                        } */
                    }
                }
            }
        },
        error: function()
        {
            window.location.replace = 'http://adeng927.bol.ucla.edu/500.html';
        }
    } );
}

function saveClasses( pkIDArray, toStore )
{
    $.ajax(
    {
        url: 'http://majors.uclastudentmedia.com/classes/',
        type: 'GET',
        crossDomain: true,
        data:
        {
            pk__in: pkIDArray.toString()
        },
        dataType: 'json',
        success: function( json )
        {
            for ( var q = 0; q < json.length; q++ )
            {
                var depart = json[ q ][ 'fields' ][ 'department' ];
                var number = json[ q ][ 'fields' ][ 'class_number' ];

                var key = depart + "r" + number;

                majorClassDictionary[ key ] = toStore;
            }
        },
        error: function()
        {
            window.location.replace = 'http://adeng927.bol.ucla.edu/500.html';
        }
    } );
}

// Home Page Scripts
/**
 * Scans the server for a major sharing the currently selected menu item's name
 * and updates the information for the major displayed on the homepage.
 *
 * @param department    - The major's ID.
 * @author Albert Deng
 */

function updateHomePage( department )
{
    $.ajax(
    {
        url: 'http://majors.uclastudentmedia.com/majors/',
        type: 'GET',
        crossDomain: true,
        data:
        {
            name: department
        },
        dataType: 'json',
        success: function( json )
        {
            majorIndex = json[ 0 ][ 'pk' ];
            $( "#page1 p" )[ 0 ].innerHTML = "<strong>College:</strong> " + schoolArray[ json[ 0 ][ 'fields' ][ 'school' ] ];
            $( "#page1 p" )[ 1 ].innerHTML = "<strong>Description:</strong> " + json[ 0 ][ 'fields' ][ 'description' ];
        },
        error: function()
        {
            window.location.replace = 'http://adeng927.bol.ucla.edu/500.html';
        }
    } );
}

/**
 * Populates the list of majors on the home page from the majorNameArray array.
 *
 * @author Albert Deng
 */

function populateMajorList()
{
    var sortedArray = majorNameArray;
    sortedArray.sort();
    sortedArray.splice(sortedArray.indexOf("NullNameIsOkayI'veDoneThisEnough"), 1);

    var majorOptionList = "";
    for ( var v = 0; v < sortedArray.length; v++ )
    {
        majorOptionList += '<option value="' + majorNameArray.indexOf( sortedArray[ v ] ) + '">' + sortedArray[ v ] + '</option>';
    }

    $( '#page1 select' )[ 0 ].innerHTML = majorOptionList;
    $( '#page1 select' ).selectmenu( 'refresh' );
}

// Requirement scripts
/**
 * Updates the requirement list for the pre-major array from the rqeuirementsection
 * from the server.
 *
 * @WARNING: single-use case demo; does not work properly
 * @param department    - The class's department ID.
 * @param courseNumber  - The class's number.
 * @author Albert Deng
 */

function updatePreMajorPKArray( majorD )
{
    var preMajorPKArray = [];

    $.ajax(
    {
        url: 'http://majors.uclastudentmedia.com/requirementsections/',
        type: 'GET',
        crossDomain: true,
        data:
        {
            major: majorD,
            name: "Pre-Major"
        },
        dataType: 'json',
        success: function( json )
        {
            for ( var c = 0; c < json[ 0 ][ 'fields' ][ 'classes' ].length; c++ )
            {
                preMajorPKArray.push( json[ 0 ][ 'fields' ][ 'classes' ][ c ] );
            }

            for ( var b = 0; b < preMajorPKArray.length; b++ )
            {
                $.ajax(
                {
                    url: 'http://majors.uclastudentmedia.com/classes/',
                    type: 'GET',
                    crossDomain: true,
                    data:
                    {
                        pk: preMajorPKArray[ b ]
                    },
                    dataType: 'json',
                    success: function( json )
                    {
                        var toPush = "";
                        toPush += json[ 0 ][ 'fields' ][ 'department' ];
                        toPush += "e";
                        toPush += json[ 0 ][ 'fields' ][ 'class_number' ];
                        currMajorArray[ majorD ][ 0 ].push( toPush );
                        currMajorArray[ majorD ][ 0 ].sort();
                        updateRequirementsList( "pm_a", econPMRArray );
                    }
                } );
            }
        }
    } );
}

/**
 * Updates the requirement list for the pre-major array from the rqeuirementsection
 * from the server.
 *
 * @author Albert Deng
 */

function updateAnthroPreMajorArray()
{
    $( "#page3 div[role='main']" ).prepend( '<form><label for="anthro-1">Choose Major:</label><select name="flip-1" id="anthro-1" data-role="slider"><option value="true">B.A.</option><option value="false">B.S.</option></select></form>' );
    $( "#page3 form" ).trigger( 'create' );

    if ( $( "#anthro-1" ).val() == "true" )
    {
        // Bachelor of Arts
    }
    else if ( $( "#anthro-1" ).val() == "false" )
    {
        // Bachelor of Science
    }
}

var tempOfTemp;

function refreshDialog( categoryID, categoryName )
{
    var currArray = categoryDictionary[ categoryID ];
    var tempStuffArray = new Array();
    var totalPost = "";

    for ( var t = 0; t < currArray.length; t++ )
    {
        if ( typeof tempStuffArray[ parseInt( currArray[ t ].substring( 0, currArray[ t ].indexOf( 'd' ) ) ) ] == "undefined" )
        {
            tempStuffArray[ parseInt( currArray[ t ].substring( 0, currArray[ t ].indexOf( 'd' ) ) ) ] = new Array();
        }
        tempStuffArray[ parseInt( currArray[ t ].substring( 0, currArray[ t ].indexOf( 'd' ) ) ) ][ tempStuffArray[ parseInt( currArray[ t ].substring( 0, currArray[ t ].indexOf( 'd' ) ) ) ].length ] = currArray[ t ].substring( currArray[ t ].indexOf( 'd' ) + 1, currArray[ t ].length );
    }

    // $( "#page6 h3" )[ 0 ].innerHTML = categoryName;
    $( "#page6 h3" )[ 0 ].innerHTML = "Classes in Category";
    $( "#page6 ul" ).empty();

    var currentDept = 0;

    for ( var q = 0; q < tempStuffArray.length; q++ )
    {
        if ( typeof tempStuffArray[ q ] == "object" )
        {
            $( "#page6 ul" ).append( '<li data-theme="e" data-role="list-divider">' + majorArray[ q ] + '</li>' )
            for ( var s = 0; s < tempStuffArray[ q ].length; s++ )
            {
                $( "#page6 ul" ).append( '<li data-theme="c"><a href="#page5" onclick="refreshPage(&quot;' + q + "d" + tempStuffArray[ q ][ s ] + '&quot;)" data-transition="slide">' + majorArray[ q ] + ' ' + tempStuffArray[ q ][ s ] + '</a></li>' );
            }
        }
    }

    $( "#page6 ul" ).listview( 'refresh' );
}

function refreshReqPage( reqSection )
{
    var currArray = pseudoCatDictionary[ reqSection ];
    var tempStuffArray = new Array();
    var totalPost = "";

    for ( var t = 0; t < currArray.length; t++ )
    {
        if ( typeof tempStuffArray[ parseInt( currArray[ t ][ 0 ].substring( 0, currArray[ t ][ 0 ].indexOf( 'd' ) ) ) ] == "undefined" )
        {
            tempStuffArray[ parseInt( currArray[ t ][ 0 ].substring( 0, currArray[ t ][ 0 ].indexOf( 'd' ) ) ) ] = new Array();
        }
        tempStuffArray[ parseInt( currArray[ t ][ 0 ].substring( 0, currArray[ t ][ 0 ].indexOf( 'd' ) ) ) ][ tempStuffArray[ parseInt( currArray[ t ][ 0 ].substring( 0, currArray[ t ][ 0 ].indexOf( 'd' ) ) ) ].length ] = currArray[ t ][ 0 ].substring( currArray[ t ][ 0 ].indexOf( 'd' ) + 1, currArray[ t ][ 0 ].length );
    }

    // $( "#page6 h3" )[ 0 ].innerHTML = "Choices";
    $( "#page6 h3" )[ 0 ].innerHTML = "Choose from the Following:";
    $( "#page6 ul" ).empty();

    tempOfTemp = tempStuffArray;

    for ( var q = 0; q < tempStuffArray.length; q++ )
    {
        if ( typeof tempStuffArray[ q ] == "object" )
        {
            $( "#page6 ul" ).append( '<li data-theme="e" data-role="list-divider">' + majorArray[ q ] + '</li>' )
            for ( var s = 0; s < tempStuffArray[ q ].length; s++ )
            {
                $( "#page6 ul" ).append( '<li data-theme="c"><a href="#page5" onclick="refreshPage(&quot;' + q + "d" + tempStuffArray[ q ][ s ] + '&quot;)" data-transition="slide">' + majorArray[ q ] + ' ' + tempStuffArray[ q ][ s ] + '</a></li>' );
            }
        }
    }

    $( "#page6 ul" ).listview( 'refresh' );
}

function refreshReqPageU( reqSection, totalNumUnits )
{
    var currArray = pseudoCatDictionary[ reqSection ];
    var tempStuffArray = new Array();
    var totalPost = "";

    for ( var t = 0; t < currArray.length; t++ )
    {
        if ( typeof tempStuffArray[ parseInt( currArray[ t ][ 0 ].substring( 0, currArray[ t ][ 0 ].indexOf( 'd' ) ) ) ] == "undefined" )
        {
            tempStuffArray[ parseInt( currArray[ t ][ 0 ].substring( 0, currArray[ t ][ 0 ].indexOf( 'd' ) ) ) ] = new Array();
        }
        tempStuffArray[ parseInt( currArray[ t ][ 0 ].substring( 0, currArray[ t ][ 0 ].indexOf( 'd' ) ) ) ][ tempStuffArray[ parseInt( currArray[ t ][ 0 ].substring( 0, currArray[ t ][ 0 ].indexOf( 'd' ) ) ) ].length ] = currArray[ t ][ 0 ].substring( currArray[ t ][ 0 ].indexOf( 'd' ) + 1, currArray[ t ][ 0 ].length );
    }

    // $( "#page6 h3" )[ 0 ].innerHTML = "Choices";
    $( "#page6 h3" )[ 0 ].innerHTML = "Choose " + totalNumUnits + " Units From The Following:";
    $( "#page6 ul" ).empty();

    tempOfTemp = tempStuffArray;

    for ( var q = 0; q < tempStuffArray.length; q++ )
    {
        if ( typeof tempStuffArray[ q ] == "object" )
        {
            $( "#page6 ul" ).append( '<li data-theme="e" data-role="list-divider">' + majorArray[ q ] + '</li>' )
            for ( var s = 0; s < tempStuffArray[ q ].length; s++ )
            {
                $( "#page6 ul" ).append( '<li data-theme="c"><a href="#page5" onclick="refreshPage(&quot;' + q + "d" + tempStuffArray[ q ][ s ] + '&quot;)" data-transition="slide">' + majorArray[ q ] + ' ' + tempStuffArray[ q ][ s ] + '</a></li>' );
            }
        }
    }

    $( "#page6 ul" ).listview( 'refresh' );
}

function generateDialogDiv( majorID, numberArray )
{
    var postText = "";
    postText += '<div data-role="content">';
    postText += '<ul data-role="listview" data-divider-theme="e" data-inset="true">';
    postText += '<li data-role="list-divider" role="heading">' + majorArray[ majorID ] + '</li>';

    for ( var j = 0; j < numberArray.length; j++ )
    {
        postText += '<li data-theme="c"><a href="#page5" onclick="refreshPage(&quot;' + majorID + "d" + numberArray[ j ] + '&quot;)" data-transition="slide">' + numberArray[ j ] + '</a></li>';
    }

    postText += '</ul>';
    postText += '</div>';

    return postText;
}

function getCategoryID( classID )
{
    for ( var key in categoryDictionary )
    {
        if ( categoryDictionary[ key ].indexOf( classID ) != -1 )
        {
            return key;
        }
    }
    return -1;
}

function getUnitsFromID ( classID )
{
    for ( var key in pseudoCatDictionary )
    {
        for ( var secondKey in pseudoCatDictionary[key] )
        {
            if ( pseudoCatDictionary[key][secondKey][0] == classID )
            {
                return pseudoCatDictionary[key][secondKey][1];
            }
        }
    }
    return -1;
}

function getReqID( ID )
{
    for ( var key in pseudoCatDictionary )
    {
        for ( var i = 0; i < pseudoCatDictionary[ key ].length; i++ )
        {
            if ( pseudoCatDictionary[ key ][ i ][ 0 ] == ID )
            {
                return key;
            }
        }
    }
    return -1;
}

function contains( str, item )
{
    return str.indexOf( item ) != -1;
}

function updateMajorArray( major )
{
    var appendText = "";
    $.ajax(
    {
        url: 'http://majors.uclastudentmedia.com/requirementsections/',
        type: 'GET',
        crossDomain: true,
        data:
        {
            major_id: major
        },
        dataType: 'json',
        success: function( json )
        {
            $( '#pm_a' ).empty();
            $( '#pm_b' ).empty();
            for ( var a = 0; a < json.length; a++ )
            {
                var isCategory = false;
                if ( contains( json[ a ][ 'fields' ][ 'name' ], "#" ) )
                {
                    if ( json[ a ][ 'fields' ][ 'category' ] != null )
                    {
                        isCategory = true;
                        processCategory( json[ a ][ 'fields' ][ 'category' ], json[ a ][ 'fields' ][ 'requirement_type' ], json[ a ][ 'fields' ][ 'requirement' ], "pm_a" );
                    }
                    else
                    {
                        processRequirement( json[ a ], "pm_a" );
                    }
                }
                else
                {
                    if ( json[ a ][ 'fields' ][ 'category' ] != null )
                    {
                        isCategory = true;
                        processCategory( json[ a ][ 'fields' ][ 'category' ], json[ a ][ 'fields' ][ 'requirement_type' ], json[ a ][ 'fields' ][ 'requirement' ], "pm_b" );
                    }
                    else
                    {
                        processRequirement( json[ a ], "pm_b" );
                    }
                }

                var numRequired = json[ a ][ 'fields' ][ 'requirement' ];

                if ( numRequired == 0 )
                {
                    numRequired = json[ a ][ 'fields' ][ 'classes' ].length;
                }
                if ( !isCategory )
                {
                    saveClasses( json[ a ][ 'fields' ][ 'classes' ], json[ a ][ 'pk' ] + "_" + json[ a ][ 'fields' ][ 'requirement_type' ] + "_" + numRequired + "_" + isCategory );
                }
            }

            updateDisable();
            updateAllCheckboxes();
            return appendText;
        },
        error: function()
        {
            window.location.replace = 'http://adeng927.bol.ucla.edu/500.html';
        }
    } );
}

function processRequirement( ajaxDictionaryDump, list )
{
    switch ( ajaxDictionaryDump[ 'fields' ][ 'requirement_type' ] )
    {
        case "A":
            processRequirementTypeA( ajaxDictionaryDump[ 'fields' ][ 'classes' ], list );
            break;
        case "U":
            processRequirementTypeU( ajaxDictionaryDump[ 'fields' ][ 'classes' ], ajaxDictionaryDump[ 'pk' ], ajaxDictionaryDump[ 'fields' ][ 'requirement' ], list );
            break;
        case "C":
            processRequirementTypeC( ajaxDictionaryDump[ 'fields' ][ 'classes' ], ajaxDictionaryDump[ 'pk' ], ajaxDictionaryDump[ 'fields' ][ 'requirement' ], list );
            break;
        default:
            // This is a failure
            alert( "Failure!" );
            break;
    }
}

function findParent( child, dataType )
{
    var el = null;
    do {
        el = el.parent();
    } while ( false )

    return false;
}

/**
 * Generates a new div from the array of classes specified that includes a list of checkboxes,
 * assuming Requirement Type A. This div will then be appended to the specified list.
 *
 * @param classesArray  - An array of classes to be used for population.
 * @param listG         - The list that the new div will be appended to.
 * @author Albert Deng
 */
function processRequirementTypeA( classesArray, listG )
{
    var newDiv = '<div data-req="A_' + classesArray.length + '" data-role="fieldcontain" data-controltype="checkboxes">';
    newDiv += '<h2 style="margin-bottom:2px;margin-top:2px">Requirements</h2>';
    newDiv += '<fieldset data-role="controlgroup" data-type="vertical" data-mini="true">';
    // newDiv += '<div class="ui-controlgroup-controls">';

    var tempAppendArray = "";
    $.when(
        $.ajax(
        {
            url: 'http://majors.uclastudentmedia.com/classes/',
            type: 'GET',
            crossDomain: true,
            data:
            {
                pk__in: classesArray.toString()
            },
            dataType: 'json',
            error: function()
            {
                window.location.replace = 'http://adeng927.bol.ucla.edu/500.html';
            }
        } )
    ).then(
        function( json )
        {
            for ( var g = 0; g < json.length; g++ )
            {
                var currentDepartment = json[ g ][ 'fields' ][ 'department' ];
                var currentNumber = json[ g ][ 'fields' ][ 'class_number' ];

                tempAppendArray += '<input id="' + currentDepartment + "e" + currentNumber + '" type="checkbox"><label for="' + currentDepartment + "e" + currentNumber + '">' + majorArray[ parseInt( currentDepartment ) ] + ' ' + currentNumber + '</label>';
            }

            // $( '#' + listG + ' fieldset').append( tempAppendArray );
            newDiv += tempAppendArray;
            newDiv += "</div>";
            newDiv += "</fieldset>";
            newDiv += "</div>";

            $( '#' + listG ).append( newDiv );
            $( "input:checkbox" ).checkboxradio().checkboxradio( 'refresh' );
            $( "#page3" ).trigger( 'create' );
            updateDisable();
        }
    );
}

function processCategory( categoryID, requirementType, requirementNumber, listW )
{
    $.when(
        $.ajax(
        {
            url: 'http://majors.uclastudentmedia.com/classcategories/',
            type: 'GET',
            crossDomain: true,
            data:
            {
                pk__in: categoryID
            },
            dataType: 'json',
            error: function()
            {
                window.location.replace = 'http://adeng927.bol.ucla.edu/500.html';
            }
        } )
    ).then(
        function( json )
        {
            var newDiv = "";
            switch ( requirementType )
            {
                case "A":
                    newDiv += '<div id="cc_' + categoryID + '" data-req="A_' + json[ 0 ][ 'fields' ][ 'classes' ].length + '" data-role="fieldcontain" data-controltype="checkboxes">';
                    break;

                case "C":
                    newDiv += '<div id="cc_' + categoryID + '" data-req="' + requirementType + '_' + requirementNumber + '" data-role="fieldcontain" data-controltype="checkboxes">';
                    break;
            }
            newDiv += '<h2 style="margin-bottom:2px;margin-top:2px">Category Requirements</h2>';
            newDiv += '<a href="#page6" onclick="refreshDialog(' + categoryID + ', ' + '&quot;' + json[ 0 ][ 'fields' ][ 'name' ] + '&quot;' + ')" data-role="button" data-inline="true" data-theme="b" data-mini="true">View Category</a>';
            newDiv += '<br>&nbsp;</br>';
            newDiv += '<fieldset data-role="controlgroup" data-type="vertical" data-mini="true">';
            // newDiv += '<div class="ui-controlgroup-controls">';

            var tempAppendArray = "";
            categoryDictionary[ categoryID ] = new Array();
            getPageFromID( json[ 0 ][ 'fields' ][ 'classes' ], categoryID );

            switch ( requirementType )
            {
                case "A":
                    saveClasses( json[ 0 ][ 'fields' ][ 'classes' ], categoryID + "_" + requirementType + "_" + requirementNumber + "_false" );
                    processRequirementTypeA( json[ 0 ][ 'fields' ][ 'classes' ], listW );
                    break;

                case "C":
                    saveClasses( json[ 0 ][ 'fields' ][ 'classes' ], categoryID + "_" + requirementType + "_" + requirementNumber + "_true" );
                    for ( var y = 0; y < requirementNumber; y++ )
                    {
                        tempAppendArray += '<input id="cat' + categoryID + '_' + y + '" type="checkbox"><label for="cat' + categoryID + '_' + y + '">' + json[ 0 ][ 'fields' ][ 'name' ] + '</label>';
                    }

                    newDiv += tempAppendArray;
                    newDiv += "</div>";
                    newDiv += "</fieldset>";
                    newDiv += "</div>";

                    $( '#' + listW ).append( newDiv );
                    $( "input:checkbox" ).checkboxradio().checkboxradio( 'refresh' );
                    $( "#page3" ).trigger( 'create' );
                    updateDisable();
                    break;

                case "U":
                    break;
            }
        }
    );
}

function processRequirementTypeC( classesArray, requirementID, requirementNumber, listP )
{
    $.when(
        $.ajax(
        {
            url: 'http://majors.uclastudentmedia.com/classes/',
            type: 'GET',
            crossDomain: true,
            data:
            {
                pk__in: classesArray.toString()
            },
            dataType: 'json',
            error: function()
            {
                window.location.replace = 'http://adeng927.bol.ucla.edu/500.html';
            }
        } )
    ).then(
        function( json )
        {
            var newDiv = '<div data-req="C_' + requirementNumber + '" data-role="fieldcontain" data-controltype="checkboxes">';
            newDiv += '<h2 style="margin-bottom:2px;margin-top:2px">Choose ' + requirementNumber + ' From</h2>';
            newDiv += '<a href="#page6" onclick="refreshReqPage(' + requirementID + ')" data-role="button" data-inline="true" data-theme="b" data-mini="true">View Choices</a>';
            newDiv += '<br />';
            newDiv += '<fieldset id="choiceC_' + requirementID + '" data-role="controlgroup" data-type="vertical" data-mini="true">';
            // newDiv += '<div class="ui-controlgroup-controls">';

            var tempAppendArray = "";
            pseudoCatDictionary[ requirementID ] = new Array();
            getPageFromIDReq( classesArray, requirementID );

            // $( '#' + listG + ' fieldset').append( tempAppendArray );
            newDiv += tempAppendArray;
            newDiv += "</div>";
            newDiv += "</fieldset>";
            newDiv += "</div>";

            $( '#' + listP ).append( newDiv );
            $( "input:checkbox" ).checkboxradio().checkboxradio( 'refresh' );
            $( "#page3" ).trigger( 'create' );
            updateDisable();
        }
    );
}

function processRequirementTypeU( classesArray, requirementID, requirementNumber, listP )
{
    $.when(
        $.ajax(
        {
            url: 'http://majors.uclastudentmedia.com/classes/',
            type: 'GET',
            crossDomain: true,
            data:
            {
                pk__in: classesArray.toString()
            },
            dataType: 'json',
            error: function()
            {
                window.location.replace = 'http://adeng927.bol.ucla.edu/500.html';
            }
        } )
    ).then(
        function( json )
        {
            var newDiv = '<div data-req="U_' + requirementNumber + '" data-role="fieldcontain" data-controltype="checkboxes">';
            newDiv += '<h2 style="margin-bottom:2px;margin-top:2px">Choose ' + requirementNumber + ' Units From:</h2>';
            newDiv += '<a href="#page6" onclick="refreshReqPageU(' + requirementID + ', ' + requirementNumber + ')" data-role="button" data-inline="true" data-theme="b" data-mini="true">View Choices</a>';
            newDiv += '<br />';
            newDiv += '<fieldset id="choiceU_' + requirementID + '" data-role="controlgroup" data-type="vertical" data-mini="true">';
            // newDiv += '<div class="ui-controlgroup-controls">';

            var tempAppendArray = "";
            pseudoCatDictionary[ requirementID ] = new Array();
            getPageFromIDReq( classesArray, requirementID );

            // $( '#' + listG + ' fieldset').append( tempAppendArray );
            newDiv += tempAppendArray;
            newDiv += "</div>";
            newDiv += "</fieldset>";
            newDiv += "</div>";

            $( '#' + listP ).append( newDiv );
            $( "input:checkbox" ).checkboxradio().checkboxradio( 'refresh' );
            $( "#page3" ).trigger( 'create' );
            updateDisable();
        }
    );
}

/**
 * Erases the specified requirement list and appends new checkboxes generated from a specified array.
 *
 * @param list          - The requirements list to manipulate.
 * @param courseArray   - The list to use for population.
 * @author Albert Deng
 */

function updateRequirementsList( list, courseArray )
{
    $( '#' + list + ' fieldset' ).empty();
    for ( var j = 0; j < courseArray.length; j++ )
    {
        for ( var i = 0; i < courseArray[ j ].length; i++ )
        {
            var depa = parseInt( courseArray[ j ][ i ].substring( 0, courseArray[ j ][ i ].indexOf( 'e' ) ) );
            var numa = courseArray[ j ][ i ].substring( courseArray[ j ][ i ].indexOf( 'e' ) + 1 );

            $( '#' + list + ' fieldset' ).append( '<input id="' + courseArray[ j ][ i ] + '" type="checkbox"><label for="' + courseArray[ j ][ i ] + '">' + majorArray[ depa ] + ' ' + numa + '</label>' );

            $( "input:checkbox" ).checkboxradio().checkboxradio( 'refresh' );
            updateDisable();
        }
    }
}