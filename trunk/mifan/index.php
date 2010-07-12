<?php 
	require_once 'inc/Fanfou.php';
	require_once 'inc/Status.php';
	require_once 'inc/config.php';
	
	$status = new StatusDAL();
	
	if (isset($_POST['message'])) {
		try {
			setcookie('posting', 'success');
			$status->insertStatus($_POST['message'], $_POST['tag']);
		} catch (Exception $e) {
			setcookie('posting', 'error');
		}
		header("location:index.php");
	}
	
	//处理页码
	if (isset($_GET['p']) && $_GET['p']>0) {
		$page = $_GET['p'];
	} else {
		$page = 1;
	}
	$num = 20;			//每页显示数
	$pageType = 0;
	
	if (isset($_GET['tag'])) {
		$tag = $_GET['tag'];
		$totalPage = ceil($status->countByTag($tag)/$num);	//对应tag总页数
		
		if ($page <= $totalPage) {
			
			if ($page == $totalPage && $page == 1) {
				$pageType = false;
			} else if ($page == $totalPage) {
				$pageType = -1;
			} else if ($page == 1) {
				$pageType = 1;
			}
			
			$statusData = $status->getByTag($tag, ($page-1)*$num, $num);
			$smarty->assign('pageType', $pageType);
			$smarty->assign('prePage', $page-1);
			$smarty->assign('nextPage', $page+1);
			$smarty->assign('tag', $tag);
			
			$smarty->assign('data', $statusData);
			$smarty->assign('type', 'index');
			$smarty->assign('title', "$tag _标签_秘饭");
		} else {
			$smarty->assign('type', 'nodata');
		}
		
	} else {
		$totalPage = ceil($status->countAccepted()/$num);
		
		if ($page <= $totalPage) {
			
			if ($page == $totalPage && $page == 1) {
				$pageType = false;
			} else if ($page == $totalPage) {
				$pageType = -1;
			} else if ($page == 1) {
				$pageType = 1;
			}
			
			$statusData = $status->getAccepted(($page-1)*$num,$num);
			$smarty->assign('pageType', $pageType);
			$smarty->assign('prePage', $page-1);
			$smarty->assign('nextPage', $page+1);
			
			
			$smarty->assign('data', $statusData);
			$smarty->assign('type', 'index');
			$smarty->assign('title', '秘饭 首页');
			
			if (isset($_COOKIE['posting'])) {
				$postResult = $_COOKIE['posting'];
				setcookie('posting','');
				$smarty->assign('updateStatus', $postResult);
			}
			
		} else {
			$smarty->assign('type', 'nodata');
		}
	}
	$smarty->display('main.html');
?>