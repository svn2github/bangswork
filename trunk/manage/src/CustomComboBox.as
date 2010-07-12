package
{
	import mx.controls.ComboBox;
	import mx.core.IFactory;
	
	public class CustomComboBox implements IFactory
	{
		private var customData:Array;
		
	    public function CustomComboBox(data:Array)
	    {
	    	this.customData = data;
	    }
	
		public function newInstance():*
		{
			var combobox:ComboBox = new ComboBox();
			combobox.dataProvider = customData;
			combobox.editable = true;
			combobox.setStyle("fontWeight", "normal");
			return combobox;
		}
	}

}