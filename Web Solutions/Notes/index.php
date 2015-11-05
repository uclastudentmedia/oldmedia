<html>
    <head>
        <meta charset="utf-8">
        <title>BruiNotes</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="apple-mobile-web-app-capable" content="yes">
        <meta name="apple-mobile-web-app-status-bar-style" content="black">

        <link href="http://code.jquery.com/mobile/1.4.5/jquery.mobile-1.4.5.min.css" rel="stylesheet">
        <script type='text/javascript' src='https://cdn.firebase.com/js/client/2.0.2/firebase.js'></script>

        <script src="http://code.jquery.com/jquery-2.1.1.min.js"></script>
        <script src="http://code.jquery.com/mobile/1.4.5/jquery.mobile-1.4.5.min.js"></script>

        <style>
            .split-custom-wrapper {
                /* position wrapper on the right of the listitem */
                position: absolute;
                right: 5px;
                top: 12.5%;
                height: 100%;
            }

            .split-custom-button {
                position: relative;
                float: right;   /* allow multiple links stacked on the right */
                height: 75%;
                margin:0;
                min-width:3em;
                /* remove boxshadow and border */
                border:none;
                moz-border-radius: 0;
                webkit-border-radius: 0;
                border-radius: 0 !important;
                border-top: 1px !important;
                border-bottom: 1px !important;
                moz-box-shadow: none;
                webkit-box-shadow: none;
                box-shadow: none;
            }

            .split-custom-button span.ui-btn-inner {
                /* position icons in center of listitem*/
                position: relative;
                margin-top:50%;
                margin-left:50%;
                /* compensation for icon dimensions */
                top:11px; 
                left:-12px;
                height:40%; /* stay within boundaries of list item */
            }

            /*target the count bubbles and left align them, by default they are right aligned*/
            .ui-page .ui-content .ui-listview .ui-li-count {
                left  : 10px;
                right : auto;
            }

            /*target the link in which the count bubbles reside and add some padding so the bubbles and link text don't overlap*/
            /*notice this is only applied to list-items that actually have count bubbles*/
            .ui-page .ui-content .ui-listview .ui-li-has-count .ui-btn-text a {
                padding-left : 55px;
            }
        </style>
        <script>
            // Helper Cookie Functions
            function setCookie(cname, cvalue, exdays) {
                var d = new Date();
                d.setTime(d.getTime() + (exdays*24*60*60*1000));
                var expires = "expires="+d.toUTCString();
                document.cookie = cname + "=" + cvalue + "; " + expires;
            }

            function getCookie(cname) {
                var name = cname + "=";
                var ca = document.cookie.split(';');
                for(var i=0; i<ca.length; i++) {
                    var c = ca[i];
                    while (c.charAt(0)==' ') c = c.substring(1);
                    if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
                }
                return "";
            }

            // Upvote/Downvote Functions
            function upvote( index )
            {
                if( getCookie( index ).length != 0 ) {
                    alert("You have already voted!");
                    return;
                }

                $.ajax({
                    method: 'get',
                    url: 'helper.php',
                    data: {
                        'choice': 'up',
                        'index': index
                    },
                    async: true,
                    success: function( data ) {
                        var votes = parseInt($("#votes" + index).text());
                        $("#votes" + index).text(++votes);
                        setCookie( index, "Voted!" );
                    }
                });
            }

            function downvote( index )
            {
                if( getCookie( index ).length != 0 ) {
                    alert("You have already voted!");
                    return;
                }

                $.ajax({
                    method: 'get',
                    url: 'helper.php',
                    data: {
                        'choice': 'down',
                        'index': index
                    },
                    async: true,
                    success: function( data ) {
                        var votes = parseInt($("#votes" + index).text());
                        $("#votes" + index).text(--votes);
                        setCookie( index, "Voted!" );
                    }
                });
            }
        </script>
    </head>
    <body>
        <?php
            class Notes {
                public $author;
                public $url;
                public $upvotes;
                public $timestamp;
                public $description;
                public $id;

                public function __construct( $auth, $link, $votes, $time, $blurb, $index ) {
                    $this->author = $auth;
                    $this->url = $link;
                    $this->upvotes = $votes;
                    $this->timestamp = $time;
                    $this->description = $blurb;
                    $this->id = $index;
                }
            }

            function sortByUpvotes( $a, $b )
            {
                $u = (int) $a['upvotes'];
                $v = (int) $b['upvotes'];

                if( $u == $v )
                    return 0;

                return ($u < $v) ? 1 : -1;
            }

            $myfile = fopen("notes.txt", "r") or die("Unable to open file!");
            $notesArray = json_decode(fread($myfile, filesize("notes.txt")), true);
            usort( $notesArray, 'sortByUpvotes' );
        ?>
        <div data-role="page" id="home">
            <div data-role="content">
                <a href="#upload" class="ui-btn">Submit Notes!</a>
                <ul data-role="listview" data-split-icon="gear" data-split-theme="a" data-inset="true">
                    <?php
                        if( count($notesArray) == 0 )
                            print "<li><h1>There are currently no notes submitted! Be the first!</h1></li>";
                        for( $i = 0; $i < count($notesArray); $i++ ) {
                    ?>
                    <li>
                        <a href="<?php print $notesArray[$i]['url'] ?>">
                            <h2 style="padding-left:25px;white-space:normal;"><?php print $notesArray[$i]['description']; ?></h2>
                            <p style="padding-left:25px;white-space:normal;"><?php print $notesArray[$i]['author'] ?></p>
                        </a>
                        <span id="votes<?php print $i ?>" class="ui-li-count"><?php print $notesArray[$i]['upvotes'] ?></span>
                        <div class="split-custom-wrapper">
                            <a href="javascript:upvote(<?php print $i ?>)" data-role="button" class="split-custom-button" data-icon="arrow-u" data-rel="dialog" data-theme="c" data-iconpos="notext"></a>
                            <a href="javascript:downvote(<?php print $i ?>)" data-role="button" class="split-custom-button" data-icon="arrow-d" data-rel="dialog" data-theme="c" data-iconpos="notext"></a>
                        </div>
                    </li>
                    <?php } ?>
                </ul>
            </div>
        </div>

        <div data-role="page" id="upload">
            <div data-role="content">
                <form method="post" action="submit.php">
                    <ul data-role="listview" data-inset="true">
                        <li class="ui-field-contain">
                            <label for="author">Name:</label>
                            <input type="text" name="author" id="author" value="">
                        </li>
                        <li class="ui-field-contain">
                            <label for="url">URL:</label>
                            <input type="text" name="URL" id="URL" value="">
                        </li>
                        <li class="ui-field-contain">
                            <label for="description">Comments:</label>
                            <textarea name="description" id="description" cols="50"></textarea>
                        </li>
                        <li class="ui-body ui-body-b">
                            <fieldset class="ui-grid-b">
                                <div class="ui-block-a">
                                </div>
                                <div class="ui-block-b">
                                    <button align="right" type="submit" class="ui-btn ui-corner-all ui-btn-a">Submit</button>
                                </div>
                            </fieldset>
                        </li>
                    </ul>
                </form>
            </div>
        </div>
    </body>
</html>