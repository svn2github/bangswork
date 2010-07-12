<?php

	/*
	 * 储存数据库消息的数据结构
	 */
	class StatusData {
		
		private $_id;	
		private $_content;	
		private $_isAccept;	
		private $_time;	
		private $_statusId;	
		private $_tag;
		private $_commentNum;
	
		function __construct($id, $content, $time, $isAccept, $statusId, $tag, $commentNum) {
			$this->_id = $id;
			$this->_content = $content;
			$this->_isAccept = $isAccept;
			$this->_time = $time;
			$this->_statusId = $statusId;
			$this->_tag = $tag;
			$this->_commentNum = $commentNum;
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
				case "statusId":
					return $this->_statusId;
					break;
				case "tag":
					return $this->_tag;
					break;
				case "commentNum":
					return $this->_commentNum;
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
				case "statusId":
					$this->_statusId = $value;
					break;
				case "tag":
					$this->_tag = $value;
					break;
				case "commentNum":
					$this->_commentNum = $value;
					break;
			}
		}
		
	}
	
	class StatusDAL {
	
		
		/*
		 * 获取已发布的消息
		 * @param  start  开始 条码
		 * @param  num    获取的条数
		 * @param  tagToArray   是否把tag转换成数组
		 * @return 数组$list，元素为StatusMessage
		 */
		public function getAccepted($start, $num, $tagToArray = true) {
			
			$start = (int)$start; 
			$num = (int)$num; 
			$query = "SELECT id, content, time, statusId, tag, commentNum FROM status WHERE isAccept=1 ORDER BY id DESC LIMIT $start,$num";
			$result = mysql_query($query);
			$list = array();
			
			while ($row = mysql_fetch_array($result , MYSQL_ASSOC)) {
				$tag = ($tagToArray && $row['tag']!=NULL) ? split(' ', $row['tag']) : $row['tag'] ;
				$tempMsg = new StatusData($row['id'], $row['content'], $row['time'], 1, $row['statusId'], $tag, $row['commentNum']);
				$list[]=$tempMsg;				
			}
			
			return $list;
			
		}
		
		
		/*
		 * 获取未发布的消息
		 * @param  start  开始 条码
		 * @param  num    获取的条数
		 * @return 数组$list，元素为StatusMessage
		 */
		public function getNoAccept($start, $num) {
			
			$start = (int)$start; 
			$num = (int)$num; 
			$query = "SELECT id, content, time, statusId, tag, commentNum FROM status WHERE isAccept=0 ORDER BY id DESC LIMIT $start,$num";
			$result = mysql_query($query);
			$list = array();
			
			while ($row = mysql_fetch_array($result , MYSQL_ASSOC)) {
				$tempMsg = new StatusData($row['id'], $row['content'], $row['time'], 1, $row['statusId'], $row['tag'], $row['commentNum']);
				$list[]=$tempMsg;				
			}
			
			return $list;
		}
		
		
		/*
		 * 获取tag对应的消息
		 * @param  $tag  开始 条码
		 * @param  $start  开始 条码
		 * @param  $num    获取的条数
		 * @return 数组$list，元素为StatusMessage
		 */
		public function getByTag($tag, $start, $num) {
			
			$tag = escape_data($tag);
			$start = (int)$start; 
			$num = (int)$num; 
			
			$query = "SELECT id, content, time, statusId, tag, commentNum FROM status WHERE tag LIKE '%$tag%' ORDER BY id DESC LIMIT $start,$num";
			$result = mysql_query($query);
			$list = array();
			
			while ($row = mysql_fetch_array($result , MYSQL_ASSOC)) {
				$tagRead = $row['tag']==NULL ? $row['tag'] : split(' ', $row['tag']);
				$tempMsg = new StatusData($row['id'], $row['content'], $row['time'], 1, $row['statusId'], $tagRead, $row['commentNum']);
				$list[]=$tempMsg;				
			}
			
			return $list;
		}
		
		
		/*
		 * 获取指定ID的消息
		 * @param  $id  消息id
		 * @return StatusData实例
		 */
		public function getStatusById($id) {
			
			$id = (int)$id; 
			$query = "SELECT id, content, time, statusId, tag, commentNum FROM status WHERE id=$id";
			$result = mysql_query($query);
			if ($row = mysql_fetch_array($result)) {
				$tag = $row[4]==NULL ? $row[4] : split(' ', $row[4]);
				$tempMsg = new StatusData($row[0], $row[1], $row[2], 1, $row[3], $tag, $row[5]);
			}
			return $tempMsg;
		}
		
		
		/*
		 * 获取tag对应的消息条数
		 * @param  $tag  消息tag
		 * @return int 消息条数
		 */
		public function countByTag($tag) {
			$query = "SELECT COUNT(*) FROM status WHERE tag LIKE '%$tag%'";
			$result = mysql_query($query);
			$count = mysql_fetch_array($result);
			return $count[0];
		}
		
		
		/*
		 * 获取已发布的消息条数
		 * @return int 消息条数
		 */
		public function countNoAccept() {
			$query = "SELECT COUNT(*) FROM status WHERE isAccept=0";
			$result = mysql_query($query);
			$count = mysql_fetch_array($result);
			return $count[0];
		}
		
		
		/*
		 * 获取未发布的消息条数
		 * @return int 消息条数
		 */
		public function countAccepted() {
			$query = "SELECT COUNT(*) FROM status WHERE isAccept=1";
			$result = mysql_query($query);
			$count = mysql_fetch_array($result);
			return $count[0];
		}
		
		/*
		 * 插入消息
		 * @param  content  要插入的消息内容
		 * @param  tag  	标签
		 * @param  statusId  	饭否消息ID
		 * @return 成功时返回true
		 * @throw  Exception
		 */
		public function insertStatus($content, $tag, $statusId = NULL) {
		
			$content = escape_data($content);
			$tag = escape_data($tag);
			if (mb_strlen($content, 'utf-8') > 140) {
				$content = mb_substr($content, 0, 140, 'utf-8');
			}			
			$tag = eregi_replace('　|,|，','y', $tag);
			if (mb_strlen($tag, 'utf-8') > 20) {
				$tag = mb_substr($tag, 0, 20, 'utf-8');
			}			
			if ($statusId == NULL) {
				$isAccept = 0;
			} else {
				$isAccept = 1;
			}
			
			$query = "INSERT INTO `status`(content, time, tag, isAccept, statusId) VALUES ('$content', NOW(), '$tag', '$isAccept', '$statusId')";
			mysql_query($query);
		
			if (mysql_affected_rows() == 1) {
				return true;
			}
			else {
				throw new Exception('插入消息出错：'.mysql_error());
			}
		}
		
		
		/*
		 * 更新消息
		 * @param  id  		     要更新的消息的id
		 * @param  statusId   要更新的statusId
		 * @param  tag   要更新的tag
		 * @return 成功时返回true
		 * @throw  Exception
		 */
		public function updataStatus($id, $statusId, $tag) {
			$id = escape_data($id);
			$query = "UPDATE `status` SET isAccept=1, statusId='$statusId', tag='$tag' WHERE id=$id";
			mysql_query($query);
			
			if (mysql_affected_rows() == 1) {
				return true;
			} else {
				throw new Exception('更新消息出错：'.mysql_error());
			}
		}
		
	
		/*
		 * 更新评论条数
		 * @param  id  		     要更新的消息的id
		 * @return 成功时返回true
		 * @throw  Exception
		 */
		public function updateCommentNum($id, $delete = false) {
			$id = escape_data($id);
			$query = "SELECT commentNum FROM status WHERE id=$id";
			$result = mysql_query($query);
			if (mysql_num_rows($result) == 0) {
				throw new Exception('没有找到id为'.$id.'的消息');
			}
			
			$row = mysql_fetch_array($result);
			if ($delete == true) {
				$commentNum = (int)$row[0]-1;
			} else {
				$commentNum = (int)$row[0]+1;
			}
			$query = "UPDATE `status` SET commentNum=$commentNum WHERE id=$id";
			mysql_query($query);
			
			if (mysql_affected_rows() == 1) {
				return true;
			} else {
				throw new Exception('更新评论条数出错：'.mysql_error());
			}
		}
		
		
		
		/*
		 * 删除所有未发布的消息
		 * @return 成功时返回删除的条数
		 * @throw  Exception
		 */
		public function deleteNoAccept() {
			$query = "DELETE FROM `status` WHERE isAccept=0";
			mysql_query($query);
			if (mysql_affected_rows() >= 1) {
				return mysql_affected_rows();
			} else {
				$msg = mysql_error()? mysql_error():'未接受的消息已空';
				throw new Exception('删除消息出错：'.$msg);
			}
		}
		
		
		/*
		 * 删除消息
		 * @param  id  要删除的消息的id
		 * @return 成功时返回true
		 * @throw  Exception
		 */
		public function deleteById($id){
			$query = "DELETE FROM `status` WHERE id=$id";
			mysql_query($query);
			if (mysql_affected_rows()==1) {
				return true;
			} else {
				$msg = mysql_error()? mysql_error():'id为' . $id . '的消息不存在';
				throw new Exception('删除消息出错：'.$msg);
			}
		}
		
		
	}
	
?>