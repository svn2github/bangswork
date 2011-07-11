<?php
	
	function processCurl($url,$postargs=false)
	{
	    $ch = curl_init($url);
	
		if($postargs !== false)	{
			curl_setopt ($ch, CURLOPT_POST, true);
			curl_setopt ($ch, CURLOPT_POSTFIELDS, $postargs);
        }
		
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_VERBOSE, 1);
   		curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);

        $response = curl_exec($ch);
        $responseInfo=curl_getinfo($ch);
        curl_close($ch);
        if( intval( $responseInfo['http_code'] ) == 200 )
			return $response;    
        else
            return false;
	}
//	header('Content-Type: text/xml');

	if (isset($_GET['since_id'])) {
		echo processCurl("http://twitter.com/statuses/public_timeline.json?since_id=" . $_GET['since_id']);
	} else {
		echo processCurl("http://twitter.com/statuses/public_timeline.json");
	}
?>