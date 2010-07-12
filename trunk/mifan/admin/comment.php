<?php 
	require_once '../inc/Comment.php';
	require_once 'checkAdmin.php';
	
	$comment = new CommentDAL();
	
	
	//处理页码
	if (isset($_GET['p']) && $_GET['p']>0) {
		$page = $_GET['p'];
	} else {
		$page = 1;
	}
	$num = 20;			//每页显示数
	$pageType = 0;
	
	$totalPage = ceil($comment->countComment()/$num);
	
	if ($page <= $totalPage) {
		
		if ($page == $totalPage && $page == 1) {
			$pageType = false;
		} else if ($page == $totalPage) {
			$pageType = -1;
		} else if ($page == 1) {
			$pageType = 1;
		}
		
		$cmtData = $comment->getAllComment(($page-1)*$num, $num);
		$smarty->assign('pageType', $pageType);
		$smarty->assign('prePage', $page-1);
		$smarty->assign('nextPage', $page+1);
		
		$smarty->assign('data', $cmtData);
		$smarty->assign('title', '评论_秘饭');
		$smarty->display('adminComment.html');
		
	} else {
		$smarty->assign('title', '评论_秘饭');
		$smarty->assign('type', 'nodata');
		$smarty->display('adminComment.html');
	}
?>