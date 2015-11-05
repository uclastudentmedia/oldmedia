    var myDataRef = new Firebase('https://uclastudentmedia.firebaseio.com/bisForms');

    var businesses = new Array();

    var submitters = new Object();

    var sortedSubs = new Array();

    var teamsArray = new Object();

    var indivArray = new Object();

    var indivSubs = new Array();

    var indivDict = new Object();

    var sortedIndivs = new Array();

    $(document).ready( function() {

        $.blockUI({ 
            message: null, 
        });

        $("#coPhone").mask("(999) 999-9999");
        $("#eDMPhone").mask("(999) 999-9999");

        switchLists( $("[name*='Box']:checked")[0].id );

        // Refresh handler
        if( window.location.hash != "#loaded" )
        {
            window.location = '#loaded';
            window.location.reload();
        } 

        // Data retrieval
        myDataRef.once( 'value', function( dataSnapshot )
        {
            var data = dataSnapshot.val();
            var counter = 0;
            for ( var i in data )
            {
                businesses.push( new Business( data[i]['bisName'], data[i]['bisType'], data[i]['locAdd'], data[i]['locHood'], data[i]['locZip'], data[i]['subName'], data[i]['subTeam'], i, data[i]['time'], data[i]['dmName'], data[i]['dmTitle'], data[i]['coPhone'], data[i]['coMail'], data[i]['coSite'] ));

                var subber = data[i]['subName'].toUpperCase();

                var team = data[i]['subTeam'].toUpperCase().replace(/ /g,'');

                if ( typeof submitters[subber] == "undefined" )
                    submitters[subber] = 1;
                else
                    submitters[subber]++;

                // TeamArray data storage
                if ( typeof teamsArray[team] == "undefined" )
                {
                    var array = new Array();
                    array[0] = 1;
                    array[1] = data[i]['subTeam'];
                    array[2] = new Object();

                    array[2][subber] = 1;

                    teamsArray[team] = array;
                }
                else
                {
                    teamsArray[team][0]++;
                    if ( !( subber in teamsArray[team][2] ) )
                    {
                        teamsArray[team][2][subber] = 1;
                    }
                    else
                    {
                        teamsArray[team][2][subber]++;
                    }
                }

                // IndivArray data storage
                if ( typeof indivArray[subber] == "undefined" )
                {
                    indivArray[subber] = new Object();
                }

                if ( typeof indivArray[subber][team] == "undefined" )
                {
                    indivArray[subber][team] = new Array();
                }
                indivArray[subber][team].push( businesses[counter] );

                counter++;
            }

            // Populate lists
            pushToList();

            // Sort the rankings and push the rankings
            for ( var key in teamsArray )
            {
                if ( key != "swap" )
                    sortedSubs.push( key );
            }

            for ( var indiv in indivArray )
            {
                if ( indiv.length != 0 )
                {
                    for ( var team in indivArray[indiv] )
                    {
                        sortedIndivs.push( indiv + "-" + team );
                    }    
                }
            }

            quickSort( sortedSubs, "team" );
            quickSort( sortedIndivs, "indivRank" );
            pushToTeamList( sortedSubs );
            pushToIndivList();
            $("#bisList").listview('refresh');
            $("#subRankings").listview('refresh');
            $.unblockUI();
        });
    });

    // Compatibility for iOS devices
    $( document ).on( "tap", '#submit', function()
    { 
        submitForm( bisName.value, bisType.value, locAdd.value, locHood.value, locZip.value, subName.value, subTeam.value, dmName.value, dmTitle.value, coPhone.value, coMail.value, coSite.value ); 
    });

    $( document ).on( "change", "#selectorButtons", function()
    {
        switchLists( $("[name*='Box']:checked")[0].id );
    });

    // Muh beautiful quicksort algorithm
    function partitionTeam( array, left, right, pivotIndex )
    {
        var pivot = teamsArray[array[pivotIndex]][0];
        array.swap( pivotIndex, right - 1 );
        var storeIndex = left;
        for( var i = left; i < right - 1; ++i ) 
        {
            if( teamsArray[array[i]][0] > pivot ) 
            {
                array.swap( storeIndex, i );
                ++storeIndex;
            }
        }
        array.swap( right - 1, storeIndex );

        return storeIndex;
    }

    function partitionIndiv( array, left, right, pivotIndex )
    {
        var pivot = indivDict[array[pivotIndex]];
        array.swap( pivotIndex, right - 1 );
        var storeIndex = left;
        for( var i = left; i < right - 1; ++i ) 
        {
            if( indivDict[array[i]] > pivot ) 
            {
                array.swap( storeIndex, i );
                ++storeIndex;
            }
        }
        array.swap( right - 1, storeIndex );

        return storeIndex;
    }

    function partitionIndivRank( array, left, right, pivotIndex )
    {
        var selectedPivot = sortedIndivs[pivotIndex];
        var pivot = teamsArray[selectedPivot.split("-")[1].replace(/ /g,'')][2][selectedPivot.split("-")[0]];
        array.swap( pivotIndex, right - 1 );
        var storeIndex = left;
        for( var i = left; i < right - 1; ++i ) 
        {
            if( teamsArray[sortedIndivs[i].split("-")[1].replace(/ /g,'')][2][sortedIndivs[i].split("-")[0]] > pivot ) 
            {
                array.swap( storeIndex, i );
                ++storeIndex;
            }
        }
        array.swap( right - 1, storeIndex );

        return storeIndex;
    }

    function qSort( array, left, right, sortIndex )
    {
        if( left < right - 1 ) 
        {
            var pivotIndex = getRandomInt( left, right - 1 );
            if ( sortIndex == "team" )
                pivotIndex = partitionTeam( array, left, right, pivotIndex );
            else if ( sortIndex == "indiv" )
                pivotIndex = partitionIndiv( array, left, right, pivotIndex );
            else if ( sortIndex == "indivRank" )
                pivotIndex = partitionIndivRank( array, left, right, pivotIndex );

            qSort( array, left, pivotIndex, sortIndex );
            qSort( array, pivotIndex + 1, right, sortIndex );
        }
    }

    function quickSort( array, sortIndex )
    {
        qSort( array, 0, array.length, sortIndex );
    }

    // Assorted Helper methods

    Array.prototype.swap = function( a, b )
    {
        var temp = this[a];
        this[a] = this[b];
        this[b] = temp;
    }

    Object.size = function( obj ) {
        var size = 0, key;
        for (key in obj) {
            if (obj.hasOwnProperty(key)) size++;
        }
        return size;
    };

    function populateSubsList( team )
    {
        indivSubs.length = 0;
        for ( var key in teamsArray[team][2] )
        {
            indivSubs.push( key );
        }
        indivDict = teamsArray[team][2];
        quickSort( indivSubs, "indiv" );
    }

    function submitForm( bisName, bisType, locAdd, locHood, locZip, subName, subTeam, dmName, dmTitle, coPhone, coMail, coSite )
    {
        if ( bisName == "" || bisType == "" || locAdd == "" || locHood == "" || locZip == "" || subName == "" )
        {
            alert( "Please fill out all of the fields in the form!" );
        }
        else
        {
            var d = new Date();
            var times = d.getTime() - ( d.getTimezoneOffset() * 60 * 1000 );
            var subT = subTeam;

            if ( subTeam == "" )
            {
                subT = "Unspecified";
            }

            var bis = new Business( bisName, bisType, locAdd, locHood, locZip, subName, subTeam, dmName, dmTitle, coPhone, coMail, coSite );

            if ( !bis.isDuplicate() )
            {
                $.when( myDataRef.push( { bisName: bisName, bisType: bisType, locAdd: locAdd, locHood: locHood, locZip: locZip, subName: subName, subTeam: subT, time: times, dmName: dmName, dmTitle: dmTitle, coPhone: coPhone, coMail: coMail, coSite: coSite })).then( location.reload() );
            }
            else
                alert("This business is a duplicate!");
        }
    }

    function submitChanges( bisIndex )
    {
        myDataRef.child( businesses[bisIndex].getKey() ).child("bisName").set( $("#eBusinessName").val() );
        myDataRef.child( businesses[bisIndex].getKey() ).child("bisType").set( $("#eBusinessType").val() );
        myDataRef.child( businesses[bisIndex].getKey() ).child("locAdd").set( $("#eLocationAddress").val() );
        myDataRef.child( businesses[bisIndex].getKey() ).child("locHood").set( $("#eLocationHood").val() );
        myDataRef.child( businesses[bisIndex].getKey() ).child("locZip").set( $("#eLocationZip").val() );
        myDataRef.child( businesses[bisIndex].getKey() ).child("dmName").set( $("#eDMName").val() );
        myDataRef.child( businesses[bisIndex].getKey() ).child("dmTitle").set( $("#eDMPosition").val() );
        myDataRef.child( businesses[bisIndex].getKey() ).child("coPhone").set( $("#eDMPhone").val() );
        myDataRef.child( businesses[bisIndex].getKey() ).child("coMail").set( $("#eDMEmail").val() );
        myDataRef.child( businesses[bisIndex].getKey() ).child("coSite").set( $("#eDMWebsite").val() );

        alert("Your changes were submitted!");
        location.reload()
    }

    function pushToList()
    {
        for ( var i = 0; i < businesses.length; i++ )
        {
            $("#bisList").append("<li><a onclick='modPage( businesses[" + i + "].getBisName(), businesses[" + i + "].getBisType(), businesses[" + i + "].getLocAdd(), businesses[" + i + "].getLocHood(), businesses[" + i + "].getLocZip(), businesses[" + i + "].getSubName(), businesses[" + i + "].getSubTeam(), businesses[" + i + "].getTime(), businesses[" + i + "].getDmName(), businesses[" + i + "].getDmTitle(), businesses[" + i + "].getCoPhone(), businesses[" + i + "].getCoMail(), businesses[" + i + "].getCoSite(), " + i + " );' href='#dialog'>" + businesses[i].getBisName() + "</li>");
        }               
    }

    function pushToIndivList()
    {
        for ( var i = 0; i < sortedIndivs.length; i++ )
        {
            $("#indivList").append("<li><a onclick='modSubs(&quot;" + sortedIndivs[i].split("-")[0] + "&quot;, &quot;" + sortedIndivs[i].split("-")[1] + "&quot;);' href='#indivSubmits'>" + capitaliseWholeString( sortedIndivs[i].split("-")[0].toLowerCase() ) + " (" + teamsArray[sortedIndivs[i].split("-")[1].replace(/ /g,'').toUpperCase()][1] + ") - " + Object.size( indivArray[sortedIndivs[i].split("-")[0]][sortedIndivs[i].split("-")[1]] ) + "</li>");
        }

        $("#indivList").listview('refresh');
    }

    function pushToTeamList( subsArray )
    {
        for ( var i = 0; i < subsArray.length; i++ )
        {
            if ( subsArray[i] != "UNSPECIFIED" )
                $("#subRankings").append("<li><a onclick='modRoster(&quot;" + subsArray[i] + "&quot;);' href='#teamComp'><b>" + teamsArray[subsArray[i]][1] + " - " + teamsArray[subsArray[i]][0] + "</b></a></li>");
        }
    }

    function modPage( bisName, bisType, locAdd, locHood, locZip, subName, subTeam, time, dmName, dmTitle, coPhone, coMail, coSite, bisIndex )
    {
        $("#businessName").text( bisName );
        $("#businessType").text( bisType );
        $("#locationAddress").text( locAdd );
        $("#locationNeighborhood").text( locHood );
        $("#locationZip").text( locZip );

        var submitString = "<b>Submitter (Team): </b>" + subName + " (" + subTeam + ")";
        $("#submitterInfo").html( submitString );

        var d = new Date( $.now() );
        var date = new Date( time + ( d.getTimezoneOffset() * 60 * 1000));
        $("#submissionTime").text( date.toLocaleTimeString() );
        $("#submissionDate").text( date.toLocaleDateString() );

        $("#extraInfo").html("");
        $("#decisionMakerName").html("");
        $("#decisionMakerTitle").html("");
        $("#contactPhone").html("");
        $("#contactWebsite").html("");
        $("#contactEmail").html("");

        $("#dialogEdit").attr( "onclick", "modEdit(" + bisIndex + ");");

        if ( dmName != "" || dmTitle != "" || coPhone != "" || coMail != "" || coSite != "" )
            $("#extraInfo").text( "Additional Information" );

        if ( dmName != "" )
            $("#decisionMakerName").html( "<b>Decision Maker's Name: </b>" + dmName );

        if ( dmTitle != "" )
            $("#decisionMakerTitle").html( "<b>Decision Maker's Title: </b>" + dmTitle );

        if ( coPhone != "" )
            $("#contactPhone").html( "<b>Contact Phone: </b>" + coPhone );

        if ( coMail != "" )
            $("#contactEmail").html( "<b>Contact Email: </b>" + coMail );

        if ( coSite != "" )
            $("#contactWebsite").html( "<b>Contact Website: </b>" + coSite );
    }

    function modRoster( team )
    {
        $("#teamList").empty();
        populateSubsList( team );

        for ( var i = 0; i < indivSubs.length; i++ )
        {
            $("#teamList").append("<p>" + ( i + 1 ) + ". " + capitaliseWholeString( indivSubs[i] ) + " - " + teamsArray[team][2][indivSubs[i]] + "</p>");
        }
    }

    function modSubs( indiv, team )
    {
        $("#subList").empty();
        
        for ( var i = 0; i < Object.size( indivArray[indiv][team] ); i++ )
        {
            $("#subList").append("<p>" + ( i + 1 ) + ". " + indivArray[indiv][team][i].getBisName() + "</p>");
        }
    }

    function modEdit( businessIndex )
    {
        var business = businesses[businessIndex];
        $("#eBusinessName").val( business.getBisName() );
        $("#eBusinessType").val( business.getBisType() );
        $("#eLocationAddress").val( business.getLocAdd() );
        $("#eLocationHood").val( business.getLocHood() );
        $("#eLocationZip").val( business.getLocZip() );
        $("#eDMName").val( business.getDmName() );
        $("#eDMPosition").val( business.getDmTitle() );
        $("#eDMWebsite").val( business.getCoSite() );
        $("#eDMPhone").val( business.getCoPhone() );
        $("#eDMEmail").val( business.getCoMail() );

        $("#eBusinessName").data( "businessIndex", businessIndex );
        $("#subChanges").attr("onclick", "submitChanges(" + businessIndex + ");");
    }

    function returnTeamSubmissions( team )
    {
        var counter = 0;
        var cleanString = team.toUpperCase().replace(/ /g,'');
        for ( var i = 0; i < submitters[cleanString].length; i++ )
        {
            counter += submitters[cleanString][i][0];
        }

        return counter;
    }

    function returnStrippedStreetName( addressString )
    {
        var string = "";
        var wordArray = addressString.replace(/[0-9]/g, '').split(" ");

        for ( var i = 1; i < wordArray.length - 1; i++ )
        {
            string += wordArray[i];
        }

        return string.toUpperCase();
    }

    // Call $("[name*='Box']:checked")[0].name as argument

    function switchLists( currentChecked )
    {
        switch ( currentChecked )
        {
            case "bisBox":
                $("#businessList").show();
                $("#individualList").hide();
                break;

            case "indivBox":
                $("#individualList").show();
                $("#businessList").hide();
                break;
        }
    }

    // StackOverflow helper functions
    function capitaliseFirstLetter(string)
    {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    function capitaliseWholeString(string)
    {
        var wordArray = string.split( " " );
        var result = "";
        for ( var i = 0; i < wordArray.length; i++ )
        {
            result += capitaliseFirstLetter( wordArray[i].toLowerCase() ) + " ";
        }

        return result.substring( 0, result.length - 1 );
    }

    function returnNumbersFromString( string )
    {
        return parseInt(string);
    }

    function getRandomInt (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }