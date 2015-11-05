// Variable Declaration
var counterIDIndex = 0;

var majorArray = ["NullMajorIsBestMajor", "ECON", "HIST", "MATH"];

var econPMRArray = ["1e1", "1e2", "1e11", "1e41"];

var econMRArray = ["1e101", "1e102", "1e103", "1e103L"];

var mathPMRArray = ["3e31A", "3e31B", "3e32A", "3e32B", "3e33A", "3e33B"];

var mathMRArray = ["3e110A", "3e110B", "3e115A", "3e120A", "3e131A", "3e131B", "3e132"];

var econRequirementsArray = [econPMRArray, econMRArray];

var mathRequirementsArray = [mathPMRArray, mathMRArray];

var currMajorArray = [null, econRequirementsArray, null, mathRequirementsArray];

var classArray = new Array();

// Initialization

$(document).ready(function () {
    alert("Initialization successful!");

    $.mobile.loadPage("#page2", {
        showLoadMsg: true
    });
    $.mobile.loadPage("#page3", {
        showLoadMsg: true
    });

    updateRequirementsList("pm_a", econPMRArray);
    updateRequirementsList("pm_b", econMRArray);

    updateDisable();
});

// Major Switch Scripts

function repopulateList(major) {
    switch (parseInt(major)) {
    case 1:
        updateRequirementsList("pm_a", econPMRArray);
        updateRequirementsList("pm_b", econMRArray);
        break;

    case 3:
        updateRequirementsList("pm_a", mathPMRArray);
        updateRequirementsList("pm_b", mathMRArray);
        break;

    default:
        alert("Failure");
    }

    updateDisable();
    updateAllCheckboxes();
}

// Event Handlers

$(document).on("tap", '#ac_button', function () {
    addCourse($("#ac_dept").val(), $("#ac_numb").val());
    // alert("Added " + majorArray[classArray[classArray.length-1][0]] + " " + classArray[classArray.length-1][1]);
});

$(document).on("change", "#majorSelect", function () {
    repopulateList($("#majorSelect").val());
    $("#page3").page();
    $("input:checkbox").checkboxradio().checkboxradio('refresh');
    updateSlider();
    alert("Finished!");
});

// Progress Page Scripts

function updateDisable() {
    $("input:checkbox").checkboxradio().checkboxradio('disable');
    $("#prog").slider('disable');
}

function updateRequirementsList(list, courseArray) {
    $('#' + list + ' fieldset').empty();
    for (var i = 0; i < courseArray.length; i++) {
        var depa = parseInt(courseArray[i].substring(0, courseArray[i].indexOf('e')));
        var numa = courseArray[i].substring(courseArray[i].indexOf('e') + 1);

        $('#' + list + ' fieldset').append('<input id="' + courseArray[i] + '" type="checkbox"><label for="' + courseArray[i] + '">' + majorArray[depa] + ' ' + numa + '</label>');
    }
}

function updateCheckbox(addOrRemove, toCheck) {
    var dep = parseInt(toCheck.substring(0, toCheck.indexOf('x')));
    var num = toCheck.substring(toCheck.indexOf('x') + 1);

    for (var i = 0; i < currMajorArray[$("#majorSelect").val()].length; i++) {
        for (var k = 0; k < currMajorArray[$("#majorSelect").val()][i].length; k++) {
            thisClass = currMajorArray[$("#majorSelect").val()][i][k];
            var thisDep = parseInt(thisClass.substring(0, thisClass.indexOf('e')));
            var thisNum = thisClass.substring(thisClass.indexOf('e') + 1);

            if (dep == thisDep && num == thisNum) {
                $('#' + thisClass).attr("checked", addOrRemove).checkboxradio("refresh");
                break;
            }
        }
    }

    updateSlider();
    updatePreMajorTransition();
}

function updateAllCheckboxes() {
    for (var j = 0; j < classArray.length; j++) {
        updateCheckbox(true, classArray[j][0] + "x" + classArray[j][1]);
    }
}

function updateSlider() {
    var totalNum = $('input:checkbox').length;
    var totalChecked = $('input:checked').length;
    var div = totalChecked / totalNum;
    div = Math.round(div *= 100);
    $('#prog').val(div).slider('refresh');
}

function updatePreMajorTransition() {
    var preMajorNum = $('#pm_a fieldset input:checkbox').length;
    var preMajorChecked = $('#pm_a fieldset input:checked').length;

    if (preMajorNum == preMajorChecked) {
        $('#pmr').children().trigger('collapse');
        $('#mr').children().trigger('expand');
    } else if (preMajorNum > preMajorChecked) {
        $('#pmr').children().trigger('expand');
        $('#mr').children().trigger('collapse');
    }
}

// Button Functions

function addCourse(department, courseNumber) {
    var course = new Array();
    course[0] = department;
    course[1] = courseNumber;

    newCourse = department + "x" + courseNumber;

    getPage(department, courseNumber);
}

function isDuplicate(dept, numb) {
    for (var i = 0; i < classArray.length; i++) {
        if (classArray[i][0] == dept && classArray[i][1] == numb) {
            alert("You have already added this class!");
            return true;
        }
    }

    return false;
}

function removeCourse(name) {
    var dep = parseInt(name.substring(0, name.indexOf('x')));
    var num = name.substring(name.indexOf('x') + 1);
    var resultArray = new Array();

    for (var i = 0; i < classArray.length; i++) {
        if (classArray[i][0] == dep && classArray[i][1] == num) {
            continue;
        }
        resultArray.push(classArray[i]);
    }

    $("li[name=" + name + "]").remove();
    updateCheckbox(false, name);

    $("#ac_list").listview('refresh');
    $("#panel1 ul").listview('refresh');

    // alert("Original had: " + classArray.length + "; New has: " + resultArray.length);
    classArray = resultArray;
}

function addCourseToList() {
    var courseString = majorArray[classArray[classArray.length - 1][0]] + ' ' + classArray[classArray.length - 1][1];
    $("#ac_list").append('<li name=' + classArray[classArray.length - 1][0] + "x" + classArray[classArray.length - 1][1] + ' data-theme=""><a href="#'
        classArray[classArray.length - 1][0] + 'p' + classArray[classArray.length - 1][1]
        '" data-transition="slideup">' + courseString + '</a></li>');
    $("#panel1 ul").append('<li name=' + classArray[classArray.length - 1][0] + "x" + classArray[classArray.length - 1][1] + ' data-theme="a"><a href="javascript:removeCourse(&quot;' + classArray[classArray.length - 1][0] + "x" + classArray[classArray.length - 1][1] + '&quot;);" data-transition="slide">' + courseString + '</a></li>');
    $("#ac_list").listview('refresh');
    $("#panel1 ul").listview('refresh');
}

// Page Generation

var pageParameterArray;

function getPage(depart, number) {
    $.ajax({
        url: 'http://majors.uclastudentmedia.com/classes/',
        type: 'GET',
        crossDomain: true,
        data: {
            department__id: depart,
            class_number: number
        },
        dataType: 'json',
        success: function (json) {
            // Check if class exists
            if (json.length == 0) {
                alert("This is not a real class!");
            } else {
                // Add to list
                if (!isDuplicate(depart, number)) {
                    var course = new Array();
                    course[0] = depart;
                    course[1] = number;

                    classArray.push(course);
                    addCourseToList();
                    updateCheckbox(true, newCourse);
                }
                pageParameterArray = json[0]['fields'];
            }

            generateClassPage(depart, number);
            $('#' + depart + 'p' + number).page();
        }
    });
}

function generateClassPage(dept, cNumber) {
    $("body").append('<div data-role="page" data-control-title="' + majorArray[dept] + ' ' + cNumber + '" id=' + dept + 'p' + cNumber + '">');
    $("body").append('<div data-theme="b" data-role="header"><a data-role="button" data-inline="true" data-direction="reverse" data-rel="back" data-transition="slidedown" data-theme="e" href="#' + dept + 'p' + cNumber + '" data-icon="arrow-l" data-iconpos="left" class="ui-btn-left">Back</a>');
    $("body").append('<h3>' + majorArray[i] + ' ' + cNumber + '</h3>');
    $("body").append('</div><div data-role="content">');

    $("body").append('<h3>' + pageParameterArray.name + '</h3>');
    $("body").append('<div data-controltype="textblock"><p><span><strong>Units</strong>﻿: ' + pageParameterArray.units + '</span></p>');

    $("body").append('<p><span><strong>Pre-Requisites</strong>:&nbsp;</span></p>');
    $("body").append('<ul>');

    alert(pageParameterArray.prerequisites.length);

    if (pageParameterArray.prerequisites.length > 0) {
        for (var i = 0; i < pageParameterArray.prerequisites.length; i++) {
            $.ajax({
                url: 'http://majors.uclastudentmedia.com/classes/',
                type: 'GET',
                crossDomain: true,
                data: {
                    pk: pageParameterArray.prerequisites[i]
                },
                dataType: 'json',
                success: function (json_3) {
                    alert(json_3.length);
                    $("body").append('<li><span><strong data-mce-bogus="1">' + majorArray[parseInt(json_3[0]['fields']['department'])] + ' ' + json_3[0]['fields']['class_number'] + '</strong></span></li>');
                }
            });
        }
    }

    $("body").append('</ul>');

    $("body").append('</div><hr style="height:3px; background-color:#ccc; border:0; margin-top:12px; margin-bottom:12px;"><div data-controltype="textblock"><p><br data-mce-bogus="1"></p></div></div></div>');
    alert("Page created!");
}

// JSON Loading Scripts