<?php

	require_once '../inc/config.php';
	require_once '../inc/Fanfou.php';
	require_once '../inc/Comment.php';
	require_once '../inc/Status.php';
	$content = $_POST['content'];
	$name = $_POST['name'];
	$msgId = $_POST['msgId'];
	$fanfou = new Fanfou();
	$comment = new CommentDAL();
	$status = new StatusDAL();
	
	$authorId = $name;
	if ($name != '匿名') {
		$authorName = $fanfou->getNameById($name);
	}
	$newComment = new CommentData($content, $msgId, $authorId, $authorName);
	try {
		$comment->insertComment($newComment);
		$status->updateCommentNum($msgId);
		if ($authorName != '') {
			echo "<span class='cAuthor'><a href='http://fanfou.com/$authorId' target='_blank'>@$authorName</a></span><div class='cContent'>$content</div>";
		} else {
			echo "<span class='cAuthor'>$authorId</span><div class='cContent'>$content</div>";
		}
	} catch (Exception $e) {
		echo 'error';
	}
	
?>