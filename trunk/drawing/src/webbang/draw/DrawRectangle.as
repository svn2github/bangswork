package webbang.draw
{
	import flash.display.Graphics;
	import flash.events.MouseEvent;
	import flash.geom.*;
	
	import mx.core.Container;
	import mx.graphics.GradientEntry;
	import mx.graphics.LinearGradient;

	public class DrawRectangle extends DrawElement
	{
		
		
		public function DrawRectangle(drawContainer:Container, customParam:Object)
		{
			var param:Object = {
				hasKeyEvent: true
			};
			Utility.extendParam(param, customParam);
			
			super(drawContainer, param);
		}
		
		override protected function onDrawMouseDown(e:MouseEvent):void{
			
			drawContainer.addEventListener(MouseEvent.MOUSE_MOVE, onDrawMouseMove);
			drawContainer.addEventListener(MouseEvent.MOUSE_UP, onDrawMouseUp);
			
			drawArea = new DrawArea();
			drawContainer.addElement(drawArea); 
			
			startPoint.x = drawContainer.mouseX;
			startPoint.y = drawContainer.mouseY;
			drawArea.graphics.moveTo(drawContainer.mouseX, drawContainer.mouseY);
			
		}
		
		override protected function onDrawMouseMove(e:MouseEvent):void{
			drawRectangle(startPoint.x, startPoint.y, drawContainer.mouseX, drawContainer.mouseY);
		}
		
		protected function drawRectangle(s_x:Number, s_y:Number, m_x:Number, m_y:Number):void {
	  		//按住shift键时 画正方形
	  		if (this.keycode == 16) {
		  		if (m_x - s_x > m_y - s_y) {
		  			
		  			m_x = s_x + (m_y - s_y);	
		  		} else {
		  			m_y = s_y + (m_x - s_x);
		  		}
		  	} 
		  
			var g:Graphics = drawArea.graphics;
			
			g.clear();
			g.lineStyle(this.lineWeight, this.lineColor);
						
  			var fill:LinearGradient = new LinearGradient();
			var g1:GradientEntry = new GradientEntry(this.fillColor);
	  		var g2:GradientEntry = new GradientEntry(this.fillColor,NaN,0.7);
	    		
	   		fill.entries = [ g1, g2 ];
	  		fill.rotation = 90;
	  		
	  		g.moveTo(s_x, s_y);
	  		fill.begin(g, new Rectangle(s_x, s_y, m_x, m_y));
	  		
	  		//g.beginFill(this.fillColor);
     		g.drawRect(s_x, s_y, m_x-s_x, m_y-s_y);
		  	fill.end(g);
		}
		
		override protected function onDrawMouseUp(e:MouseEvent):void{
		
			var s_x:Number = startPoint.x;
			var s_y:Number = startPoint.y;
			var m_x:Number = drawContainer.mouseX;
			var m_y:Number = drawContainer.mouseY;
			
			drawRectangle(0, 0, Math.abs(drawContainer.mouseX - startPoint.x), Math.abs(drawContainer.mouseY - startPoint.y));
			
			drawArea.width = Math.abs(m_x - s_x);
			drawArea.height = Math.abs(m_y - s_y);
			
			drawArea.x = (m_x > s_x ? s_x: m_x) ;
			drawArea.y = (m_y > s_y ? s_y: m_y);
			
			drawContainer.removeEventListener(MouseEvent.MOUSE_MOVE, onDrawMouseMove);
			drawContainer.removeEventListener(MouseEvent.MOUSE_UP, onDrawMouseUp);
		}
		
		
	}
}