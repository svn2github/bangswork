<?php
	DEFINE('DB_HOST','localhost');		// 数据库服务器
	DEFINE('DB_USER','bang590');			// 数据库用户名
	DEFINE('DB_PW','401401');			// 数据库密码
	DEFINE('DB_NAME','bang590');			// 数据库名	
	
	DEFINE('CHARSET','utf-8');			// 编码
	
	$conn = @mysql_connect(DB_HOST,DB_USER,DB_PW) OR die ('Could not connect to MySQL:' . mysql_error());
	mysql_query("set names utf8;");
	@mysql_select_db(DB_NAME) OR die ('Could not select the database:' . mysql_error());
	
		
	//处理SQL语句
	function escape_data($data){
		
		$data = stripslashes($data);
		//PHP4.3以后才有mysql_real_escape_string函数，需要数据库连接为参数
		if (function_exists('mysql_real_escape_string')) {
			global $conn;
			$data = mysql_real_escape_string(trim($data),$conn);
		} else{
			$data = mysql_escape_string(trim($data));
		}
		return $data;
	}

?>