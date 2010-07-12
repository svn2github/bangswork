<?php
	
	/*
	 * 储存饭否消息的数据结构
	 */
	class FanfouStatusData {
		
		private $_id;
		private $_name;
		private $_content;
		private $_time;
		private $_statusId;
		private $_imgurl;
		private $_source;
		
		function __construct($id='', $name='', $content='', $time='', $statusId='', $imgurl='', $source='') {
			$this->_id = $id;
			$this->_name = $name;
			$this->_content = $content;
			$this->_time = $time;
			$this->_statusId = $statusId;
			$this->_imgurl = $imgurl;
			$this->_source = $source;
		}
		
		
		function __get($getName) {
			switch ($getName) {
				case 'name':
					return $this->_name;
					break;
				case 'content':
					return $this->_content;
					break;
				case 'time':
					return $this->_time;
					break;
				case 'id':
					return $this->_id;
					break;
				case 'statusId':
					return $this->_statusId;
					break;			
				case 'imgurl':
					return $this->_imgurl;
					break;		
				case 'source':
					return $this->_source;
					break;					
				default:
					return null;
			}
		}
		
		function __set($setName, $value) {
			switch ($setName) {
				case 'name':
					$this->_name = $value;
					break;
				case 'content':
					$this->_content = $value;
					break;
				case 'time':
					$this->_time = $value;
					break;
				case 'id':
					$this->_id = $value;
					break;
				case 'statusId':
					$this->_statusId = $value;
					break;	
				case 'imgurl':
					$this->_imgurl = $value;
					break;		
				case 'source':
					$this->_source = $value;
					break;				
			}
		}
		
	}
	
	class FanfouUserData {
		
		private $_id;
		private $_name;
		private $_location;
		private $_friends;
		private $_followers;
		private $_favourites;
		private $_statuses;
		
		function __construct($id='', $name='', $location='', $friends='', $followers='', $favourites='', $statuses='') {
			$this->_id = $id;
			$this->_name = $name;
			$this->_location = $location;
			$this->_friends = $friends;
			$this->_followers = $followers;
			$this->_favourites = $favourites;
			$this->_statuses = $statuses;
		}
		
		
		function __get($getName) {
			switch ($getName) {
				case 'id':
					return $this->_id;
					break;
				case 'name':
					return $this->_name;
					break;
				case 'location':
					return $this->_location;
					break;
				case 'friends':
					return $this->_friends;
					break;
				case 'followers':
					return $this->_followers;
					break;			
				case 'favourites':
					return $this->_favourites;
					break;		
				case 'statuses':
					return $this->_statuses;
					break;					
				default:
					return null;
			}
		}
		
		function __set($setName, $value) {
			switch ($setName) {
				case 'id':
					$this->_id = $value;
					break;
				case 'name':
					$this->_name = $value;
					break;
				case 'location':
					$this->_location = $value;
					break;
				case 'friends':
					$this->_friends = $value;
					break;
				case 'followers':
					$this->_followers = $value;
					break;	
				case 'favourites':
					$this->_favourites = $value;
					break;		
				case 'statuses':
					$this->_statuses = $value;
					break;				
			}
		}
		
	}
		/*
	 * 储存私信的数据结构
	 */
	class MessageData {
		private $_senderId;
		private $_senderName;
		private $_content;
		private $_time;
		private $_msgId;
		private $_type;	//0:普通 1:已经发布
		private $_imgurl;
		function __get($getName) {
			switch ($getName) {
				case 'senderId':
					return $this->_senderId;
					break;
				case 'senderName':
					return $this->_senderName;
					break;
				case 'time':
					return $this->_time;
					break;
				case 'content':
					return $this->_content;
					break;
				case 'msgId':
					return $this->_msgId;
					break;		
				case 'type':
					return $this->_type;
					break;			
				case 'imgurl':
					return $this->_imgurl;
					break;					
				default:
					return null;
			}
		}
		
		function __set($setName, $value) {
			switch ($setName) {
				case 'senderId':
					$this->_senderId = $value;
					break;
				case 'senderName':
					$this->_senderName = $value;
					break;
				case 'time':
					$this->_time = $value;
					break;
				case 'content':
					$this->_content = $value;
					break;
				case 'msgId':
					$this->_msgId = $value;
				case 'type':
					$this->_type = $value;
					break;		
				case 'imgurl':
					$this->_imgurl = $value;
					break;		
			}
		}
	}
	
	
	class Fanfou {
		
		/*
		 * API地址
		 */
		const API_URL			  = 'http://api.fanfou.com';   
	    const PATH_STATUS_PUBLIC  = '/statuses/public_timeline';
	    const PATH_STATUS_FRIENDS = '/statuses/friends_timeline';
	    const PATH_STATUS_USER    = '/statuses/user_timeline';
	    const PATH_STATUS_SHOW    = '/statuses/show';
	    const PATH_STATUS_UPDATE  = '/statuses/update';
	    const PATH_STATUS_REPLIES = '/statuses/replies';
	    const PATH_STATUS_DESTROY = '/statuses/destroy';
	
	    const PATH_USER_FRIENDS   = '/users/friends';
	    const PATH_USER_FOLLOWERS = '/users/followers';
	    const PATH_USER_SHOW      = '/users/show';
	
	    const PATH_DM_MESSAGES    = '/direct_messages';
	    const PATH_DM_SENT        = '/direct_messages/sent';
	    const PATH_DM_NEW         = '/direct_messages/new';
	    const PATH_DM_DESTROY     = '/direct_messages/destroy';
	
	    const PATH_FRIEND_CREATE  = '/friendships/create';
	    const PATH_FRIEND_DESTROY = '/friendships/destroy';
	    const PATH_FRIEND_EXISTS  = '/friendships/exists';
	
	    const PATH_ACCT_VERIFY    = '/account/verify_credentials';
	    const PATH_ACCT_END_SESS  = '/account/end_session';
	    const PATH_ACCT_ARCHIVE   = '/account/archive';
	    const PATH_ACCT_LOCATION  = '/account/update_location';
	    const PATH_ACCT_DEVICE    = '/account/update_delivery_device';
	
	    const PATH_FAV_FAVORITES  = '/favorites';
	    const PATH_FAV_CREATE     = '/favorites/create';
	    const PATH_FAV_DESTROY    = '/favorites/destroy';
	
	    const PATH_NOTIF_FOLLOW   = '/notifications/follow';
	    const PATH_NOTIF_LEAVE    = '/notifications/leave';
	
	    const PATH_BLOCK_CREATE   = '/blocks/create';
	    const PATH_BLOCK_DESTROY  = '/blocks/destroy';
	
	    const PATH_HELP_TEST      = '/help/test';
	    const PATH_HELP_DOWNTIME  = '/help/downtime_schedule';
		
	    
		/*
		 * 用户名密码私有变量
		 */
		private $_userName = '';
		private $_userPW = '';
		
		
		/*
		 * 构造函数
		 */
		function __construct($userName = null, $userPW = null) {
			$this->setAuth($userName, $userPW);
		}
		
		
		/*
		 * 设置用户名密码
		 */
	    public function setAuth($userName, $userPW)
    	{
	        $this->_userName = $userName;
	        $this->_userPW = $userPW;
	
	        return $this;
	    }
	    
	    
	    public function getPublicTimelineUser() {
	    	$url = self::PATH_STATUS_PUBLIC . '.xml';
	    	$data = $this->_makeRequest($url);
	    	
			$xmlData = simplexml_load_string($data);
			$userArr = array();
			
			foreach ($xmlData->status as $status) {
				$id  	= $status->user->id;
				$userArr[] = $id;
			}
			
			return $userArr;
			
	    }
	    
	    public function getUserInfo($id) {
	    	$url = self::PATH_USER_SHOW . '.xml';
	    	$url .= '?id=' . $id;
	    	$data = $this->_makeRequest($url);
	    	if ($data != '验证失败') {
				$xmlData = simplexml_load_string($data);
				$userData = new FanfouUserData;
				
				$userData->id  			= $xmlData->id;
				$userData->name  		= $xmlData->name;
				$userData->location  	= $xmlData->location;
				$userData->friends    	= $xmlData->friends_count;
				$userData->followers	= $xmlData->followers_count;
				$userData->favourites	= $xmlData->favourites_count;
				$userData->statuses 	= $xmlData->statuses_count;
				
		    	return $userData;
	    	} else {
				$userData = new FanfouUserData;
				$userData->id = $id;
				$userData->friends    	= 0;
				$userData->statuses 	= 0;
				$userData->favourites = -1;
		    	return $userData;
	    	}
	    }
	    
	    
	    public function getFriendList($id, $page = 1) {
	    	$url = self::PATH_USER_FRIENDS . ".xml?id=$id&page=$page";
	    	$data =  $this->_makeRequest($url);
			$xmlData = simplexml_load_string($data);
			$userArr = array();
			
			foreach ($xmlData->user as $user) {
				
				$userData = new FanfouUserData;
				$userData->id  			= $user->id;
				$userData->name  		= $user->name;
				$userData->location  	= $user->location;
				$userData->friends    	= 0;
				$userData->followers	= $user->followers_count;
				$userData->favourites	= 0;
				$userData->statuses 	= 0;
				$userArr[] = $userData;
				
			}
			
			return $userArr;
	    }
	    
	
	    public function getFriendIdList($id, $page = 1) {
	    	$url = self::PATH_USER_FRIENDS . ".xml?id=$id&page=$page";
	    	$data =  $this->_makeRequest($url);
			$xmlData = simplexml_load_string($data);
			$userIdArr = array();
			
			foreach ($xmlData->user as $user) {
				$userIdArr[] = $user->id;
			}
			
			return $userIdArr;
	    	
	    }
	    
	    /*
	     * 发布消息
		 * @param  msg 要发布的内容
		 * @return 成功时返回statusId
		 * @throw  Exception
	     */
		public function updateStatus($content) {
			
			//发送消息的URL
	        $url =  self::PATH_STATUS_UPDATE . '.xml';
        	
        	//检查要发送的消息
        	$content = $this->_checkMsg($content);
        	
        	//发送消息
        	$data = $this->_makeRequest($url, true, $content);
        	
        	//验证是否发布成功
        	if (strpos($data,'created_at')) {
				$xmlData = simplexml_load_string($data);
				$statusId = $xmlData->id;
				return $statusId;
        	} else {
        		throw new Exception('发布消息失败');
        	}
        	
		}
		
		/*
		 * 获取私信
		 * @param page     页码，默认第一页
		 * @param sinceId  从某ID开始读取，默认为空
		 * @param count    数量，默认20
		 * @return 返回数组，元素类型为MessageData
		 */
		public function getMsg($page = 0, $sinceId = '', $count = 0) {
			
			$url = self::PATH_DM_MESSAGES . '.xml';		
			$args = array();
			
			if ($page > 0) {
				$args[] = "page={$page}";
			}
			
			if ($count > 0 && $count <= 20) {
				$args[] = "count={$count}";
			}
			
			if ($sinceId != '') {
				$args[] = "sinceId={$sinceId}";
			}
			
			if (count($args)) {
				$url .= '?' . implode('&', $args);
			}
			
			return $this->_msgToArray($this->_makeRequest($url, true));
			
		}
		
		/*
		 * 通过id获取用户名
		 * @param   id     	饭否ID
		 * @return  字符串	饭否名字或空字符串
		 */
		public function getNameById($id) {
			$url = self::PATH_USER_SHOW . '.xml?id=' . $id;
			$data = $this->_makeRequest($url);
			if (strpos($data,'name')) {
				$xmlData = simplexml_load_string($data);
				return $xmlData->name;
			} else {
				return '';
			}
		}
		
		
		/*
		 * 获取发送给用户的消息
		 * @param page     页码，默认第一页
		 * @param clear    是否去除@
		 * @param sinceId  从某ID开始读取，默认为空
		 * @param count    数量，默认20
		 * @return 返回数组，元素类型为FanfouStatusData
		 */
		public function getReplies($page = 0, $count = 0, $sinceId = '') {
			$url = self::PATH_STATUS_REPLIES . '.xml';		
			$args = array();
			
			if ($page > 0) {
				$args[] = "page={$page}";
			}
			
			if ($count > 0 && $count <= 20) {
				$args[] = "count={$count}";
			}
			
			if ($sinceId != '') {
				$args[] = "sinceId={$sinceId}";
			}
			
			if (count($args)) {
				$url .= '?' . implode('&', $args);
			}
			
			return $this->_statusToArray($this->_makeRequest($url, true));
		}

		
		/*
		 * 将饭否消息转换成数组
		 * 参数：字符串形式的XML
		 * 返回：数组类型，数组元素为FanfouStatusData类
		 */
		private function _statusToArray($data) {
			$xmlData = simplexml_load_string($data);
			$statusArr = array();
			
			foreach ($xmlData->status as $status) {
				$tempData = new FanfouStatusData;
				
				$tempData->name  	= $status->user->name;
				$tempData->id  		= $status->user->id;
				$tempData->content  = $status->text;
				$tempData->time     = date('Y-m-d H:i:s ', strtotime($status->created_at));
				$tempData->statusId = $status->id;
				$tempData->imgurl	= $status->user->profile_image_url;
				$tempData->source	= strip_tags($status->source);		//去除HTML标签
				
				$statusArr[] = $tempData;
			}
			
			return $statusArr;
			
		}
		
		
		/*
		 * 将私信数据转换成数组
		 * @param  data  获取的xml字符串
		 * @return 返回数组，元素类型为MessageData
		 */
		private function _msgToArray($data) {
			$xmlData = simplexml_load_string($data);
			$msgArr = array();
			foreach ($xmlData->direct_message as $msg) {
				
				$tempData = new MessageData;
				
				$tempData->senderId 	= $msg->sender_id;
				$tempData->senderName 	= $msg->sender_screen_name;
				$tempData->content 		= $msg->text;
				$tempData->msgId 		= $msg->id;
				$tempData->type 		= 0;
				$tempData->time 		= date('Y-m-d H:i:s ', strtotime($msg->created_at));
				$tempData->imgurl 		= $msg->sender->profile_image_url;
				$msgArr[] = $tempData;
				
			}
			
			return $msgArr;
			
		}
		
	
		
		/*
		 * 检查提交的消息
		 * @param  content  要检查的内容
		 * @return 检查过滤后的内容
		 */
		private function _checkMsg($content) {
			
        				
			//截取大于140的字符串
			if (mb_strlen($content, 'utf-8') > 140) {
				$content = mb_substr($content, 0, 140, 'utf-8');
			}
			        	
			return $content;
		}
		
		
		/*
		 * 执行请求
		 * @param  url   要提交的URL地址
		 * @param  auth  是否需要验证用户密码
		 * @return 执行请求后返回的XML字符串
		 */
		private function _makeRequest($url, $auth = false, $post = '') {
			
			//初始化curl请求
			$ch = curl_init();
			curl_setopt($ch, CURLOPT_URL, self::API_URL . $url);
			curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
			
			if ($post != '') {
           		curl_setopt($ch, CURLOPT_POST, true);
            	curl_setopt($ch, CURLOPT_POSTFIELDS, 'status='.$post.'&source=mifan');
			}
			
			//验证用户名密码
			if ($auth) {
				curl_setopt($ch, CURLOPT_USERPWD, "{$this->_userName}:{$this->_userPW}");
			}
			//执行以及关闭curl
			$data = curl_exec($ch);
			curl_close($ch);
			return $data;
		}
	}
?>