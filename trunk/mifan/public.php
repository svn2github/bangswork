<?php 
	require_once 'inc/Fanfou.php';
	require_once 'inc/config.php';
	
	if (isset($_GET['p']) && $_GET['p']>0) {
		$page = $_GET['p'];
	} else {
		$page = 1;
	}
	
	$pageType = 0;
	$fanfou = new Fanfou(FANFOU_NAME, FANFOU_PW);
	$statusData = $fanfou->getReplies($page);
	
	if (!empty($statusData)) {
		
		if (count($statusData) < 20 && $page == 1) {
			$pageType = false;
		} else if (count($statusData) < 20 ) {
			$pageType = -1;
		} else if($page == 1) {
			$pageType = 1;
		}
		
		$smarty->assign('pageType', $pageType);
		$smarty->assign('prePage', $page-1);
		$smarty->assign('nextPage', $page+1);
		
		$smarty->assign('data', $statusData);
		$smarty->assign('type', 'public');
		$smarty->assign('title', '秘饭 公开的秘密');
		
		$smarty->display('main.html');
		
	} else {
		$smarty->assign('type', 'nodata');
		$smarty->display('main.html');
	}
?>