package
{
	import mx.controls.dataGridClasses.DataGridItemRenderer;
	
	public class DateItemRenderer extends DataGridItemRenderer
	{
		
	    public function DateItemRenderer()
	    {
	    	
	    }
	    override public function set data(value:Object):void
        {
            super.data = value + "dsf"; 
        }                      

	}

}