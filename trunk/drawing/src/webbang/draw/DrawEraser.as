package webbang.draw
{
	import flash.events.MouseEvent;
	
	import mx.core.Container;
	import mx.core.UIComponent;
	
	public class DrawEraser extends DrawElement
	{
		private var eraserArea:UIComponent;
		public function DrawEraser(drawContainer:Container)
		{
			super(drawContainer, {lineColor:0xffffff, lineWeight:25});	
					
		}
		
		override protected function onDrawMouseDown(e:MouseEvent):void{
			
			drawContainer.addEventListener(MouseEvent.MOUSE_MOVE, onDrawMouseMove);
			drawContainer.addEventListener(MouseEvent.MOUSE_UP, onDrawMouseUp);
			
			eraserArea = new UIComponent();
			drawContainer.addElement(eraserArea); 
			
			eraserArea.graphics.lineStyle(this.lineWeight, this.lineColor);
			startPoint.x = drawContainer.mouseX;
			startPoint.y = drawContainer.mouseY;
			eraserArea.graphics.moveTo(drawContainer.mouseX, drawContainer.mouseY)
			
		}
		
		override protected function onDrawMouseMove(e:MouseEvent):void{
			eraserArea.graphics.lineTo(drawContainer.mouseX, drawContainer.mouseY);
		}
		
		override protected function onDrawMouseUp(e:MouseEvent):void{
			drawContainer.removeEventListener(MouseEvent.MOUSE_MOVE, onDrawMouseMove);
			drawContainer.removeEventListener(MouseEvent.MOUSE_UP, onDrawMouseUp);
		}
		
		
	}
}