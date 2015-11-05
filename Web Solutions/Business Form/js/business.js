// Business class; not paid enough for first class
    function Business( bisName, bisType, locAdd, locHood, locZip, subName, subTeam, key, time, dmName, dmTitle, coPhone, coMail, coSite )
    {
        this.bisName = bisName;
        this.bisType = bisType;
        this.locAdd = locAdd;
        this.locHood = locHood;
        this.locZip = locZip;
        this.subName = subName;
        this.subTeam = subTeam;
        this.key = key;
        this.time = time;
        this.dmName = dmName;
        this.dmTitle = dmTitle;
        this.coPhone = coPhone;
        this.coMail = coMail;
        this.coSite = coSite;
    }

    Business.prototype.bisName = "";
    Business.prototype.bisType = "";
    Business.prototype.locAdd = "";
    Business.prototype.locHood = "";
    Business.prototype.locZip = 0;
    Business.prototype.subName = "";
    Business.prototype.subTeam = "";
    Business.prototype.key = "";
    Business.prototype.time = 0;
    Business.prototype.dmName = "";
    Business.prototype.dmTitle = "";
    Business.prototype.coPhone = "";
    Business.prototype.coMail = "";
    Business.prototype.coSite = "";

    Business.prototype.getBisName = function() {
        return this.bisName;
    }

    Business.prototype.getBisType = function() {
        return this.bisType;
    }

    Business.prototype.getLocAdd = function() {
        return this.locAdd;
    }

    Business.prototype.getLocHood = function() {
        return this.locHood;
    }

    Business.prototype.getLocZip = function() {
        return this.locZip;
    }

    Business.prototype.getSubName = function() {
        return this.subName;
    }

    Business.prototype.getSubTeam = function() {
        return this.subTeam;
    }

    Business.prototype.getKey = function() {
        return this.key;
    }

    Business.prototype.getTime = function() {
        return this.time;
    }

    Business.prototype.getDmName = function() {
        return this.dmName;
    }

    Business.prototype.getDmTitle = function() {
        return this.dmTitle;
    }

    Business.prototype.getCoPhone = function() {
        return this.coPhone;
    }

    Business.prototype.getCoMail = function() {
        return this.coMail;
    }

    Business.prototype.getCoSite = function() {
        return this.coSite;
    }

    Business.prototype.isDuplicate = function() {
        var returnStatement = false;
        for ( var i = 0; i < businesses.length; i++ )
        {
            if ( this.getLocZip() == businesses[i].getLocZip() && this.getLocHood() == businesses[i].getLocHood() && returnNumbersFromString( this.getLocAdd() ) == returnNumbersFromString( businesses[i].getLocAdd() ) && returnStrippedStreetName( this.getLocAdd() ) == returnStrippedStreetName( businesses[i].getLocAdd() ))
            {
                //alert ( this.getLocZip() == businesses[i].getLocZip() );
                //alert ( this.getLocHood() == businesses[i].getLocHood() );
                //alert ( returnNumbersFromString( this.getLocAdd() ) == returnNumbersFromString( businesses[i].getLocAdd() ) );
                //alert ( returnStrippedStreetName( this.getLocAdd() ) == returnStrippedStreetName( businesses[i].getLocAdd() ) );
                returnStatement = true;
                break;
            }
        }

        return returnStatement;
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