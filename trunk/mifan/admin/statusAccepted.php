<?php 
	require_once '../inc/Status.php';
	require_once '../inc/Fanfou.php';
	require_once 'checkAdmin.php';
	
	$status = new StatusDAL();
	
	
	//处理页码
	if (isset($_GET['p']) && $_GET['p']>0) {
		$page = $_GET['p'];
	} else {
		$page = 1;
	}
	$num = 20;			//每页显示数
	$pageType = 0;
	
	$totalPage = ceil($status->countAccepted()/$num);
	
	if ($page <= $totalPage) {
		
		if ($page == $totalPage && $page == 1) {
			$pageType = false;
		} else if ($page == $totalPage) {
			$pageType = -1;
		} else if ($page == 1) {
			$pageType = 1;
		}
		
		$statusData = $status->getAccepted(($page-1)*$num, $num, false);
		$smarty->assign('pageType', $pageType);
		$smarty->assign('prePage', $page-1);
		$smarty->assign('nextPage', $page+1);
		
		$smarty->assign('data', $statusData);
		$smarty->assign('title', '已发布消息_秘饭');
		$smarty->display('adminAccepted.html');
		
	} else {
		$smarty->assign('title', '已发布消息_秘饭');
		$smarty->assign('type', 'nodata');
		$smarty->display('adminAccepted.html');
	}
?>