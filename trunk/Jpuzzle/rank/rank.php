<?php
	if(!file_exists("rank.xml")) {
		$str = '<?xml version="1.0" encoding="UTF-8"?><Rank></Rank>';
		$fp = fopen('rank.xml', 'w');
		fwrite($fp, $str);
		fclose($fp);
	}
	
	$score = $_POST['score'];
	$name = $_POST['name'];
	if ((int)$score < 0) $score = 0;
	$xmlData = simplexml_load_file("rank.xml");
	
	if (count($xmlData->item) >= 10) {
		$p = $score;
		$i = 0;
		$flag = FALSE;
		foreach ($xmlData->item as $item) {
			$currentScore = (int)$item->attributes()->score;
			if ($p > $currentScore) {
				$p = $currentScore;
				$flag = TRUE;
			}
		}
	
		
		if($flag){
			foreach ($xmlData->item as $item) {
				$currentScore = (int)$item->attributes()->score;
				if ($p == $currentScore) break;
				$i ++;
			}
			unset($xmlData->item[$i]);
			$item = $xmlData->addChild('item');
			$item->addAttribute('name',$name);
			$item->addAttribute('score',$score);
		}
	} else {
		$item = $xmlData->addChild('item');
		$item->addAttribute('name',$name);
		$item->addAttribute('score',$score);
	}
	
	$fp=fopen("rank.xml",'w');
	fwrite($fp,$xmlData->asXML());
	fclose($fp);
?>