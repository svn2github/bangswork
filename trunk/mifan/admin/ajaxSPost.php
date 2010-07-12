<?php
	require_once '../inc/config.php';
	require_once '../inc/Status.php';
	require_once '../inc/Fanfou.php';
	require_once 'checkAdmin.php';
	
	if (isset($_POST['id'])) {
		$id = $_POST['id'];
		$tag = $_POST['tag'];
		
		$status = new StatusDAL();
		$statusData = $status->getStatusById($id);
		
		$content = $statusData->content;
		if ($content == NULL) {
			echo 'error';
			exit();
		}
		
		try {
			$fanfou = new Fanfou(FANFOU_NAME, FANFOU_PW);
			$statusId = $fanfou->updateStatus($content);
			$status->updataStatus($id, $statusId, $tag);			
			echo 'success';
		} catch (Exception $e) {
			echo $e->getMessage();
		}
	}
?>