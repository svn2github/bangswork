<%@page contentType="text/html" pageEncoding="utf-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" /> 
<link href="css/main.css" rel="stylesheet" type="text/css" media="screen" />
<script type="text/javascript" src="js/jquery-1.4.2.min.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/jquery/jquery.json-2.2.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/org/cometd.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/jquery/jquery.cometd.js"></script>
<script type="text/javascript" src="js/army.js"></script>
<script type="text/javascript" src="js/main.js"></script>
<script type="text/javascript">
	var config = {
		contextPath: '${pageContext.request.contextPath}'
	};
</script>
<title>陆战军旗</title>
</head>

<body>
    <div id="killedPieces0">
    </div>
    <div id="board">
    </div>
    <div id="killedPieces1">
    </div>
    <input type="button" id="start_btn" value="start" />
    <div id="status"><span class="status_light_off"></span><b></b></div>
</body>
</html> 
