package
{
	public class Utility
	{		
	    public function Utility()
	    {
	    }
			
		public static function dateFormat( date:Date )
		{
			var m:String, d:String, mn:Number, dn:Number;
			mn = date.getMonth() + 1;
			m = mn < 10 ? "0"+mn : ""+mn;
			dn = date.getDate() + 1;
			d = dn < 10 ? "0"+dn : ""+dn;
			return date.getFullYear() + "-" + m + "-" + d;
		}
		/**
		
			private function itemClickTemp(e:ListEvent):void
			{   
				var txt:String = "表头为: "+(e.target as DataGrid).columns[e.columnIndex].headerText+"\n"  
				txt+="选中第 "+e.columnIndex+" 列\n"
				txt+="选中第 "+e.rowIndex+" 行\n"
				txt+="选中的行的数据为:\n"  
				var dat:Object = (e.target as DataGrid).selectedItem   
				for(var i:* in dat){   
					txt+="　"+i+":"+dat[i]+"\n"  
				}   
				txt+="选中的单元可格的数据为 "+(e.target as DataGrid).selectedItem[(e.target as DataGrid).columns[e.columnIndex].dataField]+" \n"  
				trace(txt)   
			}
			
			private function console(o:Object) 
			{
				for (var i in o) {
					trace(i + ":" + o[i]);
				}
			}
			*/
	}

}