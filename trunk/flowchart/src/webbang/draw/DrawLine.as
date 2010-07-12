package webbang.draw
{
	import flash.events.MouseEvent;
	
	import mx.core.Container;

	public class DrawLine extends DrawElement
	{
		
		public function DrawLine(drawContainer:Container, customParam:Object)
		{
			var param:Object = {
				hasKeyEvent: true
			};
			Utility.extendParam(param, customParam);
			
			super(drawContainer, param);
		}
		
		override protected function onDrawMouseDown(e:MouseEvent):void{
			
			
			drawArea = new DrawArea();
			drawContainer.addElement(drawArea); 
			
			drawArea.graphics.lineStyle(this.lineWeight, this.lineColor);
			startPoint.x = drawContainer.mouseX;
			startPoint.y = drawContainer.mouseY;
			drawArea.graphics.moveTo(drawContainer.mouseX, drawContainer.mouseY);
			
			drawContainer.addEventListener(MouseEvent.MOUSE_MOVE, onDrawMouseMove);
			drawContainer.addEventListener(MouseEvent.MOUSE_UP, onDrawMouseUp);
			
		}
		
		
		override protected function onDrawMouseMove(e:MouseEvent):void{
			drawLine(startPoint.x, startPoint.y, drawContainer.mouseX, drawContainer.mouseY);
		}
		
		protected function drawLine(s_x:Number, s_y:Number, m_x:Number, m_y:Number) {
	  		
	  		if (this.keycode == 16) {
	  			var x:Number = Math.abs(m_x - s_x);
	  			var y:Number = Math.abs(m_y - s_y);
	  			var k:Number = y/x;
	  			
	  			if ( k > 2) {
	  				m_x = s_x;
	  			} else if ( k < 0.5) {
	  				m_y = s_y;
	  			} else {
		  			if (s_x > m_x)
		  				m_x = s_x - Math.abs(m_y - s_y);
		  			else
		  				m_x = s_x + Math.abs(m_y - s_y);
		  		}
		  	}
		  
			drawArea.graphics.clear();
			drawArea.graphics.moveTo(s_x, s_y);
			drawArea.graphics.lineStyle(this.lineWeight, this.lineColor);
			drawArea.graphics.lineTo(m_x, m_y);
			
		}
		
		override protected function onDrawMouseUp(e:MouseEvent):void{
			
			var s_x:Number = startPoint.x;
			var s_y:Number = startPoint.y;
			var m_x:Number = drawContainer.mouseX;
			var m_y:Number = drawContainer.mouseY;
			
			if (this.keycode == 16) {
	  			var x:Number = Math.abs(m_x - s_x);
	  			var y:Number = Math.abs(m_y - s_y);
	  			var k:Number = y/x;
	  			
	  			if ( k > 2) {
	  				m_x = s_x;
	  			} else if ( k < 0.5) {
	  				m_y = s_y;
	  			} else {
		  			if (s_x > m_x)
		  				m_x = s_x - Math.abs(m_y - s_y);
		  			else
		  				m_x = s_x + Math.abs(m_y - s_y);
		  		}
		  	}
		  	
			//分四种情况 左上 右上 左下 右下	
			drawArea.width = Math.abs(m_x - s_x);
			drawArea.height = Math.abs(m_y - s_y);
			
			drawArea.x = (m_x > s_x ? s_x: m_x) ;
			drawArea.y = (m_y > s_y ? s_y: m_y);
			
			if ( (m_x >= s_x) && (m_y >= s_y) ) {
				//右下
				drawLine(0, 0, Math.abs(m_x - s_x), Math.abs(m_y - s_y));
			} else if ( (m_x <= s_x) && (m_y >= s_y) ) {
				//左下
				drawLine(Math.abs(m_x - s_x), 0, 0, Math.abs(m_y - s_y));
			} else if ( (m_x <= s_x) && (m_y <= s_y) ) {
				//左上
				drawLine(0, 0, Math.abs(m_x - s_x), Math.abs(m_y - s_y));
			} else if ( (m_x >= s_x) && (m_y <= s_y) ) {
				//右上
				drawLine(Math.abs(m_x - s_x), 0, 0, Math.abs(m_y - s_y));
			}
			
			
			drawContainer.removeEventListener(MouseEvent.MOUSE_MOVE, onDrawMouseMove);
			drawContainer.removeEventListener(MouseEvent.MOUSE_UP, onDrawMouseUp);
		}
		
		
	}
}