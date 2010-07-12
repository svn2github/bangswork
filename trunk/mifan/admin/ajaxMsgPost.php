<?php
	require_once '../inc/config.php';
	require_once '../inc/Status.php';
	require_once '../inc/Fanfou.php';
	require_once '../inc/Message.php';
	require_once 'checkAdmin.php';
	
	if (isset($_POST['id'])) {
		$id = $_POST['id'];
		$content = $_POST['content'];
		$tag = $_POST['tag'];
		if($tag == 'null' || $tag == 'undefined') {
			$tag = NULL;
		}
		if ($content == NULL) {
			echo 'error';
			exit();
		}
		
		try {
			
			$status = new StatusDAL();
			$fanfou = new Fanfou(FANFOU_NAME, FANFOU_PW);
			$message = new Message();
			
			$statusId = $fanfou->updateStatus($content);
			$status->insertStatus($content, $tag, $statusId);
			$message->insertMessage($id);
			
			echo 'success';
			
		} catch (Exception $e) {
			echo $e->getMessage();
		}
	}
?>