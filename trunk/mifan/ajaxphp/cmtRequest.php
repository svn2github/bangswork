<?php
	require_once '../inc/config.php';
	require_once '../inc/Comment.php';
	$id = $_POST["id"];
	$html = '<div class="comment">
				<div class="cArea">';
	$comment = new CommentDAL();
	$commentDataArr = $comment->getComment($id);
	foreach ($commentDataArr as $commentData) {
		if ($commentData->authorName == null || $commentData->authorName == '') {
			$html .= '<span class="cAuthor">'.$commentData->authorId.'</span><div class="cContent">'.$commentData->content.'</div>';
		} else {
			$html .= '<span class="cAuthor"><a href="http://fanfou.com/'.$commentData->authorId.'" target="_blank">@'.$commentData->authorName.'</a></span><div class="cContent">'.$commentData->content.'</div>';
		}
	}
	$html .= '<form action="" method="post" class="cForm">
					<textarea class="cInput" name="content"></textarea>
					<input type="text" class="cAuthorInput" name="author" value="匿名" maxlength="20" /><div class="cTip">填入饭否ID会自动连接到该ID的饭否页面，填入其他则无连接。</div>
					<input type="button" value="评论" name="submit" class="cSubmit" />
					<span class="cPostTip"></span>
				</form></div></div>';
	echo $html;
?>