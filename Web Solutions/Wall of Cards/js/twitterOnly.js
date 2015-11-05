    // Twitter Functions

    function processTweets( tweets )
    {
        tweetArray = tweets;

        for ( var i in tweets )
        {
            var tweet = tweets[i];

            var loc1 = 'aria-label="';
            var loc2 = '(screen';
            var author = "<b>" + findString( tweet, loc1, loc2 ) + "</b>";
            var handler = "@" + twttr.txt.extractMentions( tweet )[0];

            var authString = author + " (" + handler + ")" + "&nbsp;&nbsp;<img style='height:12px' src='https://g.twimg.com/Twitter_logo_blue.png' class='ui-li-icon ui-corner-non'>";

            var src = findMedia( tweet )[0];
            var media = findMedia( tweet )[1];

            var loc3 = '<p class="timePosted">';
            var loc4 = '</p>';
            var tweetDate = new Date(findString( tweet.substr( tweet.indexOf( loc3 ) ), loc3, loc4 ));
            var tweetTime = tweetDate.setMinutes( tweetDate.getMinutes() - tweetDate.getTimezoneOffset() );

            var loc5 = '<p class="tweet">';
            var tweetText = loc5 + findString( tweet.substr( tweet.indexOf( loc5 ) ), loc5, loc4 ) + loc4;

            $("#emptyDiv").append( tweetText );
            tweetText = $("#emptyDiv").children().text();
            $("#emptyDiv").empty();

            var infoArray = { socialmedia: 'twitter', text: highlightTags( tweetText ), publishedDate: tweetTime, source: authString, link: src, media: media };
            twitArray.push( infoArray );
        }
    }

    function findString( string, locA, locB )
    {
        return string.substring( string.indexOf( locA ) + locA.length, string.indexOf( locB )).trim();
    }

    function findMedia( tweet )
    {
        var urlArray = twttr.txt.extractUrls( tweet );
        var media = "";
        var linkURL = "";

        for( var i = 0; i < urlArray.length; i++ )
        {
            // Skip if true
            if( urlArray[i].indexOf("twitter.com") != -1 || urlArray[i].indexOf("t.co") != -1 || urlArray[i].indexOf("profile_images") != -1 )
                continue;
            else
            {
                if( linkURL == "" )
                    linkURL = urlArray[i];

                if( isMedia( urlArray[i] ) != false )
                {
                    media = isMedia( urlArray[i] );
                    break;
                }
            }
        }

        return [linkURL, media];
    }

    function isMedia( link )
    {
        if( link.indexOf('pbs.twimg.com') != -1 )
        {
            return "<li style='margin:0px; padding:0px;'><div><img style='width:100%' src='" + link + "'></div></li>";
        }
        else if ( link.indexOf('instagram.com') != -1 )
        {
            return "<li style='margin:0px; padding:0px;'><div><img style='width:100%' src='" + link + "media/'></div></li>";
        }
        else if ( link.indexOf('youtu') != -1 )
        {
            var slug = link.substring( link.indexOf("=") + 1, link.length );

            return "<li style='margin:0px; padding:0px'><object width='100%' height='auto'><param name='movie' value='//www.youtube.com/v/" + slug + "?version=3&amp;hl=en_US&amp;rel=0'></param><param name='allowFullScreen' value='true'></param><param name='allowscriptaccess' value='always'></param><embed src='//www.youtube.com/v/" + slug + "?version=3&amp;hl=en_US&amp;rel=0' type='application/x-shockwave-flash' width='100%' height='auto' allowscriptaccess='always' allowfullscreen='true'></embed></object></li>";
        }
        return false;
    }