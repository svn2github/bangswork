<?php
	require_once '../inc/config.php';
	
	if (isset($_POST['name'])) {
		if ($_POST['name'] == ADMIN_NAME && $_POST['password'] == ADMIN_PW) {
			
			setcookie('mifanName', ADMIN_NAME);
			setcookie('mifanPW', ADMIN_PW);
			header("location:statusNoAccept.php");
			
		} else {
			$smarty->assign('message', '用户名密码出错');
		}
	}
	
	$smarty->display('adminLogin.html');
?>