<?php
	class UserDAL {
	
	
    public function provinceStat() {
      
      $provinceArr = array('广东','江苏','山东','四川','台湾','浙江','辽宁','河南','湖北','福建','河北','湖南','上海','香港','北京','黑龙江','天津','重庆','江西','山西','安徽','陕西','海南','云南','甘肃','内蒙古','贵州','新疆','西藏','青海','广西','澳门','宁夏','吉林');
      $countArr = array();
      
      foreach ($provinceArr as $provinceName) {
        $query = "SELECT COUNT(*) FROM `user` WHERE location LIKE '%$provinceName%'";
        $result = mysql_query($query);
        $count = mysql_fetch_array($result);
        $countArr[$provinceName] = $count[0];
      }
      arsort($countArr);
      return $countArr;
    }
    
    
    public function statusStat() {
        $countArr = array(); 
		$data = array('10000~以上', '5000~10000','3000~5000','1000~3000','500~1000','300~500','200~300','100~200','50~100','1~50');
		foreach ($data as $num) {
			$str = explode('~',$num);
			$start = $str[0];
			$end = $str[1];
			if ($end == '以上') {
				$end = 800000;
			}
			$query = "SELECT COUNT(*) FROM `user` WHERE statuses>$start and statuses<$end";
			$count =  mysql_fetch_array(mysql_query($query));
			$countArr[$num] = $count[0];
			
		}
       	
		return $countArr;
    }
	
    public function statusProvince() {
      $provinceArr = array('广东','江苏','山东','四川','台湾','浙江','辽宁','河南','湖北','福建','河北','湖南','上海','香港','北京','黑龙江','天津','重庆','江西','山西','安徽','陕西','海南','云南','甘肃','内蒙古','贵州','新疆','西藏','青海','广西','澳门','宁夏','吉林');
      $countArr = array();
      
      foreach ($provinceArr as $provinceName) {
        $query = "SELECT avg(statuses) FROM `user` WHERE location LIKE '%$provinceName%'";
        $result = mysql_query($query);
        $count = mysql_fetch_array($result);
        $countArr[$provinceName] = floor($count[0]);
      }
      arsort($countArr);
      return $countArr;
    }
    
		public function insertUser($user) {
			$id = $user->id;
			$name = $user->name;
			$location = $user->location;
			$friends = $user->friends;
			$followers = $user->followers;
			$favourites = $user->favourites;
			$statuses = $user->statuses;
			
			$query = "INSERT INTO `user` (id, name, location, friends, followers, favourites, statuses) VALUES ('$id', '$name', '$location', '$friends', '$followers', '$favourites', '$statuses')";
			
			$result = mysql_query($query);
			if (mysql_affected_rows() == 1) {
				return true;
			}
			else {
				return false;
			}
		}
		
		public function updateUser($user) {
			$id = $user->id;
			$friends = $user->friends;
			$favourites = $user->favourites;
			$statuses = $user->statuses;
			echo $id . '<br/>';
			$query = "UPDATE `user` SET friends='$friends', favourites='$favourites', statuses='$statuses' WHERE id='$id'";
			
			$result = mysql_query($query);
			if (mysql_affected_rows() == 1) {
				return true;
			}
			else {
				echo mysql_error(). '<br/>';;
			}
		}
		public function getTopFollower($num) {
			$num = (int)$num;
			$query = "SELECT id, name, followers FROM user ORDER BY followers DESC LIMIT 0,$num";
			$result = mysql_query($query);
			$list = array();
			while ($row = mysql_fetch_array($result , MYSQL_NUM)) {
				$temp[0] = $row[0];
				$temp[1] = $row[1];
				$temp[2] = $row[2];
				$list[] = $temp;
			}
			return $list;
		}
		public function getTopFriend($num) {
			$num = (int)$num;
			$query = "SELECT id, name, friends FROM user ORDER BY statuses DESC LIMIT 0,$num";
			$result = mysql_query($query);
			$list = array();
			while ($row = mysql_fetch_array($result , MYSQL_NUM)) {
				$temp[0] = $row[0];
				$temp[1] = $row[1];
				$temp[2] = $row[2];
				$list[] = $temp;
			}
			return $list;
		}
	
		public function getTopStatus($num) {
			$num = (int)$num;
			$query = "SELECT id, name, statuses FROM user ORDER BY statuses DESC LIMIT 0,$num";
			$result = mysql_query($query);
			$list = array();
			while ($row = mysql_fetch_array($result , MYSQL_NUM)) {
				$temp[0] = $row[0];
				$temp[1] = $row[1];
				$temp[2] = $row[2];
				$list[] = $temp;
			}
			return $list;
		}
	
		public function getTopProvince($province, $num) {
			$province = escape_data($province);
			$num = (int)$num;
			$query = "SELECT id, name, statuses, friends, followers FROM user WHERE location LIKE '%$province%' ORDER BY followers DESC LIMIT 0,$num";
			$result = mysql_query($query);
			$list = array();
			while ($row = mysql_fetch_array($result , MYSQL_NUM)) {
				$temp[0] = $row[0];
				$temp[1] = $row[1];
				$temp[2] = $row[2];
				$temp[3] = $row[3];
				$temp[4] = $row[4];
				$list[] = $temp;
			}
			return $list;
		}
		
		public function getNeedUpdate($num) {
			$query = "SELECT id FROM user WHERE friends=0 and statuses=0 and favourites=0 ORDER BY id LIMIT 40,$num";
			$result = mysql_query($query);
			$list = array();
			while ($row = mysql_fetch_array($result , MYSQL_NUM)) {
				$list[] = $row[0];
			}
			return $list;
			
		}
	}
?>