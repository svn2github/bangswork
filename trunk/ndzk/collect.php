<?php
require("simple_html_dom.php");
if (isset($_GET['n'])) {
	$num = (int) $_GET['n'];
} else {
	$num = 0;
}
$html = file_get_html ( $_GET['url'] );

$imgs = $html->find("#MyDataList img");
$imgsUrl = array();
foreach ( $imgs as $img ) {
	array_push($imgsUrl, 'http://www.nbweekly.com/' . $img->attr['src']);
	$title = explode('第',$img->attr['alt']);
	$title = trim(eregi_replace("[^0-9]","",$title[0]));
}

$count = 5;
$end = false;
for ($i = $num*$count; $i < $num*$count+$count; $i++) {
	if (!isset($imgsUrl[$i])) {
		$end = true;
		break;
	}
	GrabImage($imgsUrl[$i], ($i<10 ? "0$i.jpg" : "$i.jpg"), "./$title/");
}

$url = 'http://' . $_SERVER['HTTP_HOST'].$_SERVER["REQUEST_URI"];
$url = explode('&', $url);
$url = $url[0] . '&n=' . (++$num);

if (!$end) {
	$total = $count * $num;
	echo "<html><head><head><body><meta http-equiv=\"refresh\" content=\"1;url=$url\">已抓取 $total 页</body></html>";
} else {
	echo 'end';
}


	
function GrabImage($url,$filename="", $filedir="./") {
   if($url=="") return false;

	
   if (!file_exists($filedir)) {  
   	mkdir($filedir, 0777);   
   }
   
   ob_start();
   readfile($url);
   $img = ob_get_contents();
   ob_end_clean();
   $size = strlen($img);

   $fp2=@fopen($filedir.$filename, "a");
   fwrite($fp2,$img);
   fclose($fp2);

   return $filedir.$filename;
} 
?>