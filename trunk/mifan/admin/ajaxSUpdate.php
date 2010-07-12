<?php
	require_once '../inc/config.php';
	require_once '../inc/Status.php';
	require_once 'checkAdmin.php';
	if (isset($_POST['id'])) {
		$id = $_POST['id'];
		$statusId = $_POST['statusId'];
		$tag = $_POST['tag'];
		$status = new StatusDAL();
		try {
			$status->updataStatus($id, $statusId, $tag);
			echo 'success';
		} catch (Exception $e) {
			echo 'error';
		}
	}
?>