// Classes
function Card( title, type, date, url )
{
    this.title = title;
    this.type = type;
    this.url = url;
    this.date = new Date( date );

    this.drawCard( "homeContainer" );
}

Card.prototype.type = "";
Card.prototype.title = "";
Card.prototype.url = "";
Card.prototype.date = new Date();

Card.prototype.getTitle = function() {
    return this.title;
}
Card.prototype.getType = function() {
    return this.type;
}  
Card.prototype.getURL = function() {
    return this.url;
}
Card.prototype.getDate = function() {
    return this.date;
}

Card.prototype.drawCard = function( containerID )
{
    var cardString = "";

    // Header
    cardString += '<ul data-role="listview" data-inset="true">';
    cardString += '<li data-role="list-divider"><p style="margin:0px"><b>' + this.getDate().toLocaleDateString() + ' <span style="float:right">' + $.timeago(this.getDate()) + '</span></b></p></li>';

    // Content
    cardString += '<li><a href="' + this.getURL() + '">';
    cardString += '<h3 style="white-space:normal;">' + this.getTitle() + '</h3>';
    cardString += '</a></li>';

    // Source + Closing
    cardString += '<li><p style="margin:0px"> ' + this.getType() + '</p></li>';
    cardString += '</ul>';

    $("#" + containerID).append( cardString );
    $("ul").listview().listview('refresh');
}

function TweetCard( title, author, time, url, media )
{
    this.title = title;
    this.author = author;
    this.time = new Date( time );
    this.url = url;
    this.media = media;

    this.drawCard( "homeContainer" );
}

TweetCard.prototype.title = "";
TweetCard.prototype.author = "";
TweetCard.prototype.time = new Date();
TweetCard.prototype.url = "";
TweetCard.prototype.media = "";

TweetCard.prototype.getTitle = function() {
    return this.title;
}
TweetCard.prototype.getAuthor = function() {
    return this.author;
}
TweetCard.prototype.getDate = function() {
    return this.time;
}
TweetCard.prototype.getURL = function() {
    return this.url;
}
TweetCard.prototype.getMedia = function() {
    return this.media;
}

TweetCard.prototype.drawCard = function( containerID ) {
    var cardString = "";

    // Header
    cardString += '<ul data-role="listview" data-inset="true">';
    cardString += '<li data-role="list-divider"><p style="margin:0px"><b>' + this.getDate().toLocaleDateString() + ' <span style="float:right">' + $.timeago(this.getDate()) + '</span></b></p></li>';

    // Content
    cardString += '<li><a href="' + this.getURL() + '">';
    cardString += '<h3 style="white-space:normal;">' + this.getTitle() + '</h3>';
    cardString += '</a></li>';

    // Media
    cardString += this.getMedia();

    // Source + Closing
    cardString += '<li><p style="margin:0px"> ' + this.getAuthor() + '</p></li>';
    cardString += '</ul>';

    $("#" + containerID).append( cardString );
    $("ul").listview().listview('refresh');
}