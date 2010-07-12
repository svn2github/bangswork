<?php
	class MifanMsg {
		private $_id;	
		private $_content;	
		private $_isAccept;	
		private $_time;	
		private $_sourceId;	
		private $_tag;
	
		function __construct($id, $content, $time, $isAccept, $sourceId, $tag) {
			$this->_id = $id;
			$this->_content = $content;
			$this->_isAccept = $isAccept;
			$this->_time = $time;
			$this->_sourceId = $sourceId;
			$this->_tag = $tag;
		}
		
		function __get($name) {
			switch ($name) {
				case "id":
					return $this->_id;
					break;
				case "content":
					return $this->_content;
					break;
				case "isAccept":
					return $this->_isAccept;
					break;
				case "time":
					return $this->_time;
					break;
				case "sourceId":
					return $this->_sourceId;
					break;
				case "tag":
					return $this->_tag;
					break;
			}
		}	
		
		function __set($name, $value) {
			switch ($name) {
				case "id":
					$this->_id = $value;
					break;
				case "content":
					$this->_content = $value;
					break;
				case "isAccept":
					$this->_isAccept = $value;
					break;
				case "time":
					$this->_time = $value;
					break;
				case "sourceId":
					$this->_sourceId = $value;
					break;
				case "tag":
					$this->_tag = $value;
					break;
			}
		}
		
	}

	class MifanDAL {
	
		
		public static function getAccepted($start, $end) {
			
			$start = (int)$start; 
			$end = (int)$end; 
			$query = "SELECT id, content, time, sourceId, tag FROM message WHERE isAccept=1 ORDER BY id LIMIT $start,$end";
			$result = mysql_query($query);
			$list = array();
			
			while ($row = mysql_fetch_array($result , MYSQL_NUM)) {
				$tempMsg = new MifanMsg($row[0], $row[1], $row[2], 1, $row[3], $row[4]);
				$list[]=$tempMsg;				
			}
			
			return $list;
			
		}
		
		
		public static function getNoAccept($start, $end) {
			
			$start = (int)$start; 
			$end = (int)$end; 
			$query = "SELECT id, content, time, tag FROM message WHERE isAccept=0 ORDER BY id LIMIT $start,$end";
			$result = mysql_query($query);
			$list = array();
			
			while ($row = mysql_fetch_array($result , MYSQL_NUM)) {
				$tempMsg = new MifanMsg($row[0], $row[1], $row[2], 1, '', $row[3]);
				$list[]=$tempMsg;				
			}
			
			return $list;
		}
		
		public static function insertMsg($content, $tag) {
			$content = escape_data($content);
			$tag = escape_data($tag);
			$time = date("Y-m-d H:i:s");
			$isAccept = 0;
			$query = "INSERT INTO `message`(content, time, tag, isAccept) VALUES ('$content', '$time', '$tag', '$isAccept')";
			echo $query;
			mysql_query($query);
		
			if (mysql_affected_rows() == 1) {
				return null;
			}
			else {
				return mysql_error();
			}
		}
	}
	
	
?>