<html>
	<head>
	</head>
	<body>
		<?php
			$server = $_SERVER['DOCUMENT_ROOT'];
			$fileLength = count( file( $server.'/data/test.txt' ));
			print "<p>{$fileLength}</p>";
			$openedFile = fopen( $server.'/data/test.txt', 'r');

			for( $i = 0; $i < $fileLength; $i++ )
			{
				print "<p>" . trim( fgets( $openedFile )) . "</p>";
			}
		?>
	</body>
</html>