function Card( title, type, genres, location, date, sTime, eTime, price, likes, attendees, index, key )
{
    this.title = title;
    this.type = type;
    this.genres = genres;
    this.loc = location;
    this.price = price;
    this.index = index;
    this.key = key;
    
    var startTime = sTime.split(":");
    var endTime = eTime.split(":");
    this.start = new Date( date )
    this.start.setHours( startTime[0] );
    this.start.setMinutes( startTime[1] );
    this.start.setSeconds( 0 );
    this.start.setDate( this.start.getDate() + 1 );

    this.end = new Date( date );
    this.end.setHours( endTime[0] );
    this.end.setMinutes( endTime[1] );
    this.end.setSeconds( 0 );
    this.end.setDate( this.end.getDate() + 1 );

    this.likes = likes;
    this.attendees = attendees;

    this.drawCard( "eventCards" );
}

Card.prototype.type = "";
Card.prototype.title = "";
Card.prototype.price = "";
Card.prototype.start = new Date();
Card.prototype.end = new Date();
Card.prototype.genres = new Array();
Card.prototype.loc = "";
Card.prototype.likes = 0;
Card.prototype.attendees = new Array();
Card.prototype.index = 0;
Card.prototype.key = "";

Card.prototype.getTitle = function() {
    return this.title;
}
Card.prototype.getGenres = function() {
	return this.genres;
}
Card.prototype.getPrice = function () {
	return this.price;
}
Card.prototype.getIndex = function() {
	return this.index;
}
Card.prototype.getLoc = function() {
	return this.loc;
}
Card.prototype.getType = function() {
    return this.type;
}
Card.prototype.getStart = function() {
    return this.start;
}
Card.prototype.getEnd = function() {
    return this.end;
}
Card.prototype.getLikes = function() {
	return this.likes;
}
Card.prototype.getAttendees = function() {
	return this.attendees;
}
Card.prototype.getKey = function() {
	return this.key;
}

function writeTime( time )
{
	var text = time.toLocaleTimeString();
	return text.split(":")[0] + ":" + text.split(":")[1] + " " + text.split(" ")[1];
}

Card.prototype.addAttendee = function( person ) {
	this.attendees.push( person );
}

Card.prototype.removeAttendee = function( person ) {
	this.attendees.splice( this.attendees.indexOf( person ), 1 );
}

Card.prototype.incLikes = function() {
	this.likes++;
}

Card.prototype.decLikes = function() {
	this.likes--;
}

Card.prototype.drawCard = function( containerID ) {
	var cardString = "";

	cardString += '<ul data-role="listview" data-inset="true">';
    cardString += '<li data-role="list-divider"><span align="right">' + this.getStart().toLocaleDateString() + " - " + writeTime( this.getStart() ) + " - " + writeTime( this.getEnd() ) + '</span></li>';
	cardString += '<li><a onclick="modEventPage( ' + this.getIndex() + ' );" href="#event"><h3 style="white-space:normal;">' + this.getTitle() + '</h3></a></li>';
	cardString += '<li><p style="margin:0px">' + this.getType() + ': ';

	for( var i = 0; i < this.getGenres().length; i++ )
	{
		cardString += this.getGenres()[i];
		cardString += ( i == this.getGenres().length - 1 ) ? "" : ", ";
	}

	cardString += '</p></li>';
	cardString += '</ul>';

	$("#" + containerID).append( cardString );
}

Card.prototype.genPage = function() {
	$("#nameE").text( this.getTitle() );
	$("#likesE").text( this.getLikes() );
	$("#dateE").text( this.getStart().toLocaleDateString() );
	$("#startE").text( writeTime( this.getStart() ));
	$("#endE").text( writeTime( this.getEnd() ));
	$("#locE").text( this.getLoc() );
	$("#priceE").text( this.getPrice() );
	$("#catE").text( this.getType() );
	$("#likeButton").attr( "onclick", "cards[" + this.getIndex() + "].likeEvent();" );

	if( $.inArray( this.getKey(), likeIDs ) != -1 )
	{
		$("#likeButton").text("Un-like");
		$("#likeButton").attr( "onclick", "cards[" + this.getIndex() + "].unlikeEvent(" + this.getIndex() + ");" );
	}
	else
	{
		$("#likeButton").text("Like");
		$("#likeButton").attr( "onclick", "cards[" + this.getIndex() + "].likeEvent(" + this.getIndex() + ");" );
	}

	if( $.inArray( this.getKey(), attendIDs ) != -1 )
	{
		$("#attendButton").text("Not Attending");
		$("#attendButton").attr( "onclick", "cards[" + this.getIndex() + "].notAttending(" + this.getIndex() + ");" );

	}
	else 
	{
		$("#attendButton").text("Attending" );
		$("#attendButton").attr( "onclick", "cards[" + this.getIndex() + "].isAttending(" + this.getIndex() + ");" );
	}

	var genreString = "";
	for( var i = 0; i < this.getGenres().length; i++ )
	{
		genreString += this.getGenres()[i];
		genreString += ( i == this.getGenres().length - 1 ) ? "" : ", ";
	}

	$("#attendeesE").empty();
	if( this.getAttendees().length == 0 )
	{
		$("#attendeesE").append("<li>No one is currently attending! Be the first!</li>");
	}
	else
	{
		for( var j = 0; j < this.getAttendees().length; j++ )
		{
			$("#attendeesE").append("<li>" + this.getAttendees()[j] + "</li>");
		}
	}

	$("#genresE").text( genreString );
}

Card.prototype.likeEvent = function( index ) {
	var likeRef = myDataRef.child("Events").child( this.getKey() ).child("likes");
	likeRef.transaction( function( currVal ) {
		return currVal + 1;
	});

	var personRef = myDataRef.child("Users").child( getCookie("userid") ).child("likes");
	var anotherArray = new Array();
	personRef.once( 'value', function( dataSnap ) {
		var otherData = dataSnap.val();
		if( otherData != null )
		{
			for( var j in otherData )
			{
				anotherArray.push( otherData[j] );
			}	
		}
		anotherArray.push( cards[index].getKey() );
		likeIDs.push( cards[index].getKey() );
		personRef.set( anotherArray );
		cards[index].incLikes();
		cards[index].genPage();
	});
}

Card.prototype.unlikeEvent = function( index ) {
	var likeRef = myDataRef.child("Events").child( this.getKey() ).child("likes");
	likeRef.transaction( function( currVal ) {
		return currVal - 1;
	});	

	var personRef = myDataRef.child("Users").child( getCookie("userid") ).child("likes");
	var anotherArray = new Array();
	personRef.once( 'value', function( dataSnap ) {
		var otherData = dataSnap.val();
		for( var j in otherData )
		{
			anotherArray.push( otherData[j] );
		}

		anotherArray.splice( anotherArray.indexOf( cards[index].getKey() ), 1 );
		likeIDs.splice( attendIDs.indexOf( cards[index].getKey() ), 1 );
		personRef.set( anotherArray );
		cards[index].decLikes();
		cards[index].genPage();
	});
}

Card.prototype.isAttending = function( index ) {
	var attenRef = myDataRef.child("Events").child( this.getKey() ).child("attendees");
	var currArray = new Array();
	attenRef.once( 'value', function( dataSnapshot ) {
		var data = dataSnapshot.val();
		for( var k in data )
		{
			currArray.push( data[k] );
		}

		currArray.push( getCookie("name") );
		cards[index].addAttendee( getCookie("name") );
		attenRef.set( currArray );
		cards[index].genPage();
	});

	var personRef = myDataRef.child("Users").child( getCookie("userid") ).child("attending");
	var anotherArray = new Array();
	personRef.once( 'value', function( dataSnap ) {
		var otherData = dataSnap.val();
		if( otherData != null )
		{
			for( var j in otherData )
			{
				anotherArray.push( otherData[j] );
			}	
		}
		anotherArray.push( cards[index].getKey() );
		attendIDs.push( cards[index].getKey() );
		personRef.set( anotherArray );
		cards[index].genPage();
	});
}

Card.prototype.notAttending = function( index ) {
	var attenRef = myDataRef.child("Events").child( this.getKey() ).child("attendees");
	var currArray = new Array();
	attenRef.once( 'value', function( dataSnapshot ) {
		var data = dataSnapshot.val();
		for( var k in data )
		{
			currArray.push( data[k] );
		}

		cards[index].removeAttendee( getCookie("name") );
		currArray.splice( currArray.indexOf( getCookie("name") ), 1 );
		attenRef.set( currArray );
		cards[index].genPage();
	});

	var personRef = myDataRef.child("Users").child( getCookie("userid") ).child("attending");
	var anotherArray = new Array();
	personRef.once( 'value', function( dataSnap ) {
		var otherData = dataSnap.val();
		for( var j in otherData )
		{
			anotherArray.push( otherData[j] );
		}

		anotherArray.splice( anotherArray.indexOf( cards[index].getKey() ), 1 );
		attendIDs.splice( attendIDs.indexOf( cards[index].getKey() ), 1 );
		personRef.set( anotherArray );
		cards[index].genPage();
	});
}