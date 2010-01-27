package webbang.draw
{
	import flash.events.MouseEvent;
	
	import mx.core.Container;

	public class DrawPoint extends DrawElement
	{
		private var max_x:Number = 0;
		private var max_y:Number = 0;
		public function DrawPoint(drawContainer:Container, customParam:Object)
		{
			super(drawContainer, customParam);
		}
		
		override protected function onDrawMouseDown(e:MouseEvent):void{
			
			
			drawArea = new DrawArea();
			drawContainer.addElement(drawArea); 
			
			startPoint.x = drawContainer.mouseX;
			startPoint.y = drawContainer.mouseY;
			
			drawArea.graphics.lineStyle(this.lineWeight, this.lineColor);
			drawArea.graphics.moveTo(drawContainer.mouseX, drawContainer.mouseY);
			
			drawContainer.addEventListener(MouseEvent.MOUSE_MOVE, onDrawMouseMove);
			drawContainer.addEventListener(MouseEvent.MOUSE_UP, onDrawMouseUp);
			
		}
		
		
		override protected function onDrawMouseMove(e:MouseEvent):void{
			drawArea.graphics.lineTo(drawContainer.mouseX, drawContainer.mouseY);
			if (max_x < drawContainer.mouseX) max_x = drawContainer.mouseX;
			if (max_y < drawContainer.mouseY) max_y = drawContainer.mouseY;
		}
		
		protected function drawLine(s_x:Number, s_y:Number, m_x:Number, m_y:Number) {
	  		
			drawArea.graphics.clear();
			drawArea.graphics.moveTo(s_x, s_y);
			drawArea.graphics.lineStyle(this.lineWeight, this.lineColor);
			drawArea.graphics.lineTo(m_x, m_y);
			
		}
		
		override protected function onDrawMouseUp(e:MouseEvent):void{
			
			drawArea.width = max_x;
			drawArea.height = max_y;
			
			drawContainer.removeEventListener(MouseEvent.MOUSE_MOVE, onDrawMouseMove);
			drawContainer.removeEventListener(MouseEvent.MOUSE_UP, onDrawMouseUp);
		}
		
		
	}
}