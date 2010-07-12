<?php
	require_once '../inc/config.php';
	require_once '../inc/Comment.php';
	require_once '../inc/Status.php';
	require_once 'checkAdmin.php';
	if (isset($_POST['id'])) {
		$id = $_POST['id'];
		$msgId = $_POST['msgId'];
		$comment = new CommentDAL();
		$status = new StatusDAL();
		try {
			$comment->deleteComment($_POST['id']);
			$status->updateCommentNum($msgId, true);
			echo 'success';
		} catch (Exception $e) {
			echo $e->getMessage();
		}
	}
?>