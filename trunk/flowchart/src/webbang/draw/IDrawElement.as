package webbang.draw
{
	
	
	
	public interface IDrawElement
	{
		
		function startDraw():void;
		function stopDraw():void;
		function changeSetting(param:Object):void;
		function getDrawArea():DrawArea;
				
	}
}