<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<meta name="keywords" content="秘饭,秘密,饭否,twitter,微博客,应用,API" />
<meta name="description" content="秘饭是一个可以让你匿名发送饭否信息的网站。不需要饭否帐号，只需要输入你想说的话，点击发送即可。" />
<title>关注者排名_饭否统计</title>
<link rel="shortcut icon" href="../img/favicon.ico" />
<link type="text/css" rel="stylesheet" href="../css/index.css" />
<link type="text/css" rel="stylesheet" href="../css/main.css" />
<script type="text/javascript" src="FusionCharts/FusionCharts.js"></script>
</head>
<style type="text/css">
  ul {
    margin:40px;
  }
  li {
    list-style:none;
    margin:8px;
  }

</style>
<body>
	<div id="container">
    	<div id="sideBar">
        	<h1><a href="../index.php"><img src="../img/logo.png" id="logo" title="秘饭" /></a></h1>
            <div id="introduce">
            	<p>秘饭是一个可以让你匿名发送饭否信息的网站。不需要饭否帐号，只需要输入你想说的话，点击发送即可。这有什么用呢？一些不太适合在你饭否帐户说的话，但又很想说的，就可以在这里发，也可以说出心中的秘密。有三种方式可以发送你的秘密：</p>
            	<p>1.在秘饭主页上发送,是完全匿名的,IP地址也不会被记录,发送后需要通过验证才能发布在秘饭上。</p>
            	<p>2.<a href="http://fanfou.com/privatemsg.create/mysecret">通过饭否给秘饭发私信</a>,同样需要经过验证,发信人只有管理员看得到,发布在秘饭后是匿名,并且保证不会透露发信人姓名。</a></p>
            	<p>3.通过饭否 @秘饭 发布消息,这些消息不需要通过验证,会直接显示在 <a href="../public.php">公开的秘密</a> 页面上,需要先 <a href="http://fanfou.com/mysecret">加秘饭为好友</a></p>
            	<p>欢迎关注 <a href="http://fanfou.com/mysecret">秘饭</a></p>
            </div>
        </div>
        <div id="main">
            <div id="nav">
            <span class="navLink"><a href="index.php">用户分布统计</a></span>
            <span class="navNormal">关注者排名</span>
            <span class="navLink"><a href="statuses.php">消息排名</a></span>
            <span class="navLink"><a href="province.php">按省搜索</a></span>
            </div>
            <ul>
          <?php 
            require_once 'inc/config.php';
            require_once 'inc/User.php';
            require_once 'inc/FusionCharts.php';
            
            $userdal = new UserDAL();
            $list = $userdal->getTopFollower(100);
            $count = 1;
            foreach ($list as $data) {
              $id = $data[0];
              $name = $data[1];
              $followers = $data[2];
              echo "<li>No.$count : <a href='http://fanfou.com/$id' target='_blank'>$name</a> ($followers 个关注者)</li>";
              $count ++;
            }
            
          ?>
            </ul>
    </div>
        <div id="bottom">
        </div>
    </div>
    <div id="footer">
    	<div id="footerMain">
        	<a href="http://fanfou.com/bang590" target="_blank"><img src="../img/power.png" /></a>
        </div>
    </div>
    
<script src='http://www.google-analytics.com/ga.js' type='text/javascript'></script>
</body>
</html>
