<?php
	require_once '../inc/config.php';
	require_once '../inc/Status.php';
	require_once 'checkAdmin.php';
	if (isset($_POST['id'])) {
		$status = new StatusDAL();
		if ($_POST['id'] == 'all') {
			try {
				$status->deleteNoAccept();
				echo 'success';
			} catch (Exception $e) {
				echo 'error';
			}
			
		} else {
			try {
				$status->deleteById($_POST['id']);
				echo 'success';
			} catch (Exception $e) {
				echo 'error';
			}
		}
	}
?>