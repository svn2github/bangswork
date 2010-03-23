<?php
	header('Content-Tyep:text/html; charset=utf-8');
	if(!file_exists("rank.xml")) {
		echo '无记录';
		exit();
	}
	$xmlData = simplexml_load_file("rank.xml");
	$dataArr = array();
	foreach ($xmlData->item as $item) {
		$score = (int)$item->attributes()->score;
		$name = $item->attributes()->name;
		$dataArr[] = array('name'=> $name, 'score'=> $score);
	}
	foreach($dataArr as $k=>$v){
	    $orderby[$k]=$v['score'];
	}
	array_multisort($orderby,SORT_DESC,$dataArr);
	
	$html = '<table><tr><th colspan="3">Ranking</th></tr><tr><td>Rank</td><td>Name</td><td>Score</td></tr>';
	$rowNum = 1;
	foreach ($dataArr as $data) {
		$name = $data['name'];
		$score = $data['score'];
		$html .= '<tr>';
		$html .= "<td>$rowNum</td><td>$name</td><td>$score</td>";
		$html .= '</tr>';
		$rowNum ++;
	}
	$html .= '</table>';
	echo $html;
?> 