<?php

	require_once 'inc/config.php';
	require_once 'inc/Fanfou.php';
	require_once 'inc/Status.php';
	require_once 'inc/Comment.php';
	
	
	if (!isset($_GET['id'])) {
		$id = 1;
	} else {
		$id = $_GET['id'];
	}
	
	if (isset($_POST['content'])) {
		
		setcookie('cPosting', 'success');
		
		if ($_POST['content'] == '') {
			setcookie('cPosting', 'empty');
			header("location:show.php?id=$id");
			exit();
		}
		
		$fanfou = new Fanfou();
		$comment = new CommentDAL();
		$status = new StatusDAL();
		
		$content = $_POST['content'];
		$name = $_POST['author'];
		$msgId = $id;
		
		$authorId = $name;		
		if ($name != '匿名') {
			$authorName = $fanfou->getNameById($name);
		}
		$newComment = new CommentData($content, $msgId, $authorId, $authorName);
		
		try {
			$comment->insertComment($newComment);
			$status->updateCommentNum($msgId);
		} catch (Exception $e) {
			setcookie('cPosting', 'error');
		}
		
		header("location:show.php?id=$id");
	}
	
	$status = new StatusDAL();
	$statusData = $status->getStatusById($id);
	
	if (empty($statusData)){
		$smarty->assign('type', 'nodata');
		$smarty->display('main.html');
	} else {
		
		if (isset($_COOKIE['cPosting'])) {
			$postResult = $_COOKIE['cPosting'];
			setcookie('cPosting','');
			$smarty->assign('updateStatus', $postResult);
		}
		
		$comment = new CommentDAL();
		$commentData = $comment->getComment($id);
		
		$smarty->assign('statusData', $statusData);
		$smarty->assign('commentData', $commentData);
		$smarty->assign('title', "$statusData->content _秘饭");
		
		$smarty->display('show.html');
	}
?>