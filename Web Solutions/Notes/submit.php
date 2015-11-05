<html>
    <head>
        <meta charset="utf-8">
        <title>BruiNotes</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="apple-mobile-web-app-capable" content="yes">
        <meta name="apple-mobile-web-app-status-bar-style" content="black">

        <link href="http://code.jquery.com/mobile/1.4.5/jquery.mobile-1.4.5.min.css" rel="stylesheet">

        <script src="http://code.jquery.com/jquery-2.1.1.min.js"></script>
        <script src="http://code.jquery.com/mobile/1.4.5/jquery.mobile-1.4.5.min.js"></script>
    </head>
    <body>
    	<div data-role="content">
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

			$auth = $_POST['author'];
			$link = $_POST['URL'];
			$desc = $_POST['description'];

			$myfile = fopen("notes.txt", "r") or die("Unable to open file!");
			$arr = (filesize("notes.txt") > 0) ? json_decode(fread($myfile, filesize("notes.txt")), true) : array();
			array_push( $arr, new Notes( $auth, $link, 0, time(), $desc, count($arr) ));

			fclose($myfile);

			$writefile = fopen("notes.txt", "w") or die("Unable to open file!");
			fwrite($writefile, json_encode($arr));

			echo "<p>Your data was written successfully!</p>";
		?>
			<a href="index.php" class="ui-btn">Back</a>
		</div>
	</body>
</html>