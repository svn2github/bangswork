<?php
	class Message{
		public function chectMessage($messages) {
			foreach ($messages as $msg) {
				$msgId = escape_data($msg->msgId);
				$query = "SELECT id FROM `message` WHERE id='$msgId' LIMIT 0, 1";
				$result = mysql_query($query);
				$msg->type = mysql_num_rows($result);
			}
			return $messages;
		}
		public function insertMessage($msgId) {
			$query = "INSERT INTO `message`(id) VALUES ('$msgId')";
			mysql_query($query);
			if (mysql_affected_rows() == 1) {
				return true;
			}
			else {
				throw new Exception('插入message出错：'.mysql_error());
			}
		}
	}
?>