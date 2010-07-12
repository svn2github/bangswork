<?php
	DEFINE('DB_HOST','localhost');		// 数据库服务器
	DEFINE('DB_USER','bang590');			// 数据库用户名
	DEFINE('DB_PW','401401');			// 数据库密码
	DEFINE('DB_NAME','bang590');			// 数据库名	
	
	DEFINE('FANFOU_NAME','mysecret');	// 饭否名
	DEFINE('FANFOU_PW','liubang401');	// 饭否密码
	
	DEFINE('ADMIN_NAME','mifan');		// 后台名
	DEFINE('ADMIN_PW','mysecret590');	// 后台密码
	
	DEFINE('CHARSET','utf-8');			// 编码
	
	$conn = @mysql_connect(DB_HOST,DB_USER,DB_PW) OR die ('Could not connect to MySQL:' . mysql_error());
	mysql_query("set names utf8;");
	@mysql_select_db(DB_NAME) OR die ('Could not select the database:' . mysql_error());
	
		
	//处理SQL语句
	function escape_data($data){
		
		$data = stripslashes($data);
		$data = str_replace('\n', ' ', $data);
		//PHP4.3以后才有mysql_real_escape_string函数，需要数据库连接为参数
		if (function_exists('mysql_real_escape_string')) {
			global $conn;
			$data = mysql_real_escape_string(trim($data),$conn);
		} else{
			$data = mysql_escape_string(trim($data));
		}
		return $data;
	}

	require(dirname(__FILE__).'/smarty/Smarty.class.php');
	
	$smarty = new Smarty;
	$smarty->template_dir = dirname(__FILE__) . '/../s_templates';
	$smarty->config_dir   = dirname(__FILE__) . '/../s_config';
	$smarty->cache_dir    = dirname(__FILE__) . '/../s_cache';
	$smarty->compile_dir  = dirname(__FILE__) . '/../s_compile';
	
?>