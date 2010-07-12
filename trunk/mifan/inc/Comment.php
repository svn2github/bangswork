<?php

	/*
	 * 储存评论的数据结构
	 */
	class CommentData{
		
		private $_commentId;
		private $_content;
		private $_messageId;
		private $_authorId;
		private $_authorName;
	
		function __construct($content, $messageId, $authorId, $authorName, $commentId = -1) {
			$this->_commentId = $commentId;
			$this->_content = $content;
			$this->_messageId = $messageId;
			$this->_authorId = $authorId;
			$this->_authorName = $authorName;
		}
		
		function __get($name) {
			switch ($name) {
				case "commentId":
					return $this->_commentId;
					break;
				case "content":
					return $this->_content;
					break;
				case "messageId":
					return $this->_messageId;
					break;
				case "authorId":
					return $this->_authorId;
					break;
				case "authorName":
					return $this->_authorName;
					break;
			}
		}
		
	
		function __set($name, $value) {
			switch ($name) {
				case "commentId":
					$this->_commentId = $value;
					break;
				case "content":
					$this->_content = $value;
					break;
				case "messageId":
					$this->_messageId = $value;
					break;
				case "authorId":
					$this->_authorId = $value;
					break;
				case "authorName":
					$this->_authorName = $value;
					break;
			}
		}
		
	}
	
	class CommentDAL {
		
		/*
		 * 写入评论
		 * @param  comment  CommentData类型，要写入的私信 
		 * @return 成功时返回true
		 * @throw  Exception
		 */
		public function insertComment($comment) {
			$content = escape_data($comment->content);
			$messageId = escape_data($comment->messageId);
			$authorId = escape_data($comment->authorId);
			$authorName = escape_data($comment->authorName);
			if (mb_strlen($content, 'utf-8') > 200) {
				$content = mb_substr($content, 0, 200, 'utf-8');
			}
			if (mb_strlen($authorId, 'utf-8') > 20) {
				$authorId = mb_substr($authorId, 0, 20, 'utf-8');
			}
			
			if ($comment->authorName == '') {
				$query = "INSERT INTO `comment`(content, messageId, authorId)  VALUES ('$content','$messageId','$authorId')";
			} else {
				$query = "INSERT INTO `comment`(content, messageId, authorId, authorName) VALUES ('$content','$messageId','$authorId','$authorName')";
			}
			$result = mysql_query($query);
			
			if (mysql_affected_rows() == 1) {
				return true;
			}
			else {
				throw new Exception('写入评论出错');
			}
		}
		
		/*
		 * 获取特定消息的评论
		 * @param  messageId   消息Id
		 * @return 数组$list，元素为CommentData
		 */
		public function getComment($messageId) {
			
			$messageId = (int)$messageId;
			$query = "SELECT content, messageId, authorId, authorName, commentId FROM comment WHERE messageId=$messageId";
			$result = mysql_query($query);
			$list = array();
			
			while ($row = mysql_fetch_array($result, MYSQL_NUM)) {
				$tempComment = new CommentData($row[0], $row[1], $row[2], $row[3], $row[4]);
				$list[] = $tempComment;
			}
			
			return $list;
		}
		
		/*
		 * 获取所有评论
		 * @param  start  开始 条码
		 * @param  num    获取的条数
		 * @return 数组$list，元素为CommentData
		 */
		public function getAllComment($start, $num){
			$start = (int)$start; 
			$num = (int)$num; 
			$query = "SELECT content, messageId, authorId, authorName, commentId FROM comment ORDER BY commentId DESC LIMIT $start,$num";
			$result = mysql_query($query);
			$list = array();
			
			while ($row = mysql_fetch_array($result, MYSQL_NUM)) {
				$tempComment = new CommentData($row[0], $row[1], $row[2], $row[3], $row[4]);
				$list[] = $tempComment;
			}
			
			return $list;
		}
		
		/*
		 * 获取评论条数
		 * @return int 评论条数
		 */
		public function countComment(){
			
			$query = "SELECT COUNT(*) FROM comment";
			$result = mysql_query($query);
			$count = mysql_fetch_array($result);
			return $count[0];
			
		}
		
		
		/*
		 * 删除评论
		 * @param  commentId  要删除的评论的commentId
		 * @return 成功时返回true
		 * @throw  Exception
		 */
		public function deleteComment($commentId) {
			$commentId = escape_data($commentId);
			$query = "DELETE FROM `comment` WHERE commentId=$commentId";
			mysql_query($query);
			if (mysql_affected_rows()==1) {
				return true;
			} else {
				$msg = mysql_error()? mysql_error():'commentId为' . $commentId . '的评论不存在';
				throw new Exception('删除评论出错：'.$msg);
			}
		}
		
	
	}
?>