<html>
<head><title>南都周刊</title></head>
<body>
<?php
require("simple_html_dom.php");
if (isset($_GET['p'])) {
	$page = (int) $_GET['p'];
} else {
	$page = 1;
}
$html = file_get_html ( "http://www.nbweekly.com/Print/Page/Default.aspx?Page=$page" );
$books = $html->find("#MyDataList li");
$bookArr = array();
foreach ( $books as $book ) {
	$a = $book->find('a');
	$bookArr[] = array('href' => $a[0]->attr['href'], 'title' => $a[0]->attr['title'], 'src' => $a[0]->children[0]->attr['src']);
}
echo '<ul>';
foreach ($bookArr as $book) {
	$url = 'http://www.nbweekly.com' . $book['href'];
	echo '<li><a href="collect.php?url=' . $url . '"><img src="http://www.nbweekly.com' . $book['src'] .'" /></a>';
	
}
echo '</ul>';
if ($page != 1) {
	echo '<a href="index.php?p=' . ($page-1) . '">上一页</a>';
}
	echo '<a href="index.php?p=' . ($page+1) . '">下一页</a>';
?>
</body>
</html>