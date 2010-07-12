<?php 
	require_once '../inc/config.php';
	require_once '../inc/Fanfou.php';
	require_once '../inc/Status.php';
	require_once '../inc/Message.php';
	
	if (isset($_GET['p']) && $_GET['p']>0) {
		$page = $_GET['p'];
	} else {
		$page = 1;
	}
	
	$pageType = 0;
	$fanfou = new Fanfou(FANFOU_NAME, FANFOU_PW);
	$message = new Message();
	$msgData = $fanfou->getMsg($page);
	$msgData = $message->chectMessage($msgData);
	
	if (!empty($msgData)) {
		
		if (count($msgData) < 20 && $page == 1) {
			$pageType = false;
		} else if (count($msgData) < 20 ) {
			$pageType = -1;
		} else if($page == 1) {
			$pageType = 1;
		}
		
		$smarty->assign('pageType', $pageType);
		$smarty->assign('prePage', $page-1);
		$smarty->assign('nextPage', $page+1);
		
		$smarty->assign('data', $msgData);
		$smarty->assign('title', '私信管理_秘饭');
		
		$smarty->display('adminPrivatemsg.html');
		
	} else {
		$smarty->assign('title', '私信管理_秘饭');
		$smarty->assign('type', 'nodata');
		$smarty->display('adminPrivatemsg.html');
	}
?>