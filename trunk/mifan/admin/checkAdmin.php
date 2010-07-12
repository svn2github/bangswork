<?php
	require_once '../inc/config.php';
	
	if ($_COOKIE['mifanName'] != ADMIN_NAME || $_COOKIE['mifanPW'] != ADMIN_PW) {
		header('location:login.php');
		exit();
	}
?>