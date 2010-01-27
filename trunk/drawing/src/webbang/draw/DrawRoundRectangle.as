package webbang.draw
{
	import flash.display.Graphics;
	import flash.events.MouseEvent;
	import flash.geom.*;
	
	import mx.core.Container;
	import mx.core.UIComponent;
	import mx.graphics.GradientEntry;
	import mx.graphics.LinearGradient;

	public class DrawRoundRectangle extends DrawRectangle
	{
		
		
		public function DrawRoundRectangle(drawContainer:Container, customParam:Object)
		{
			var param:Object = {
				hasKeyEvent: true
			};
			Utility.extendParam(param, customParam);
			
			super(drawContainer, param);
		}
		
		
		override protected function drawRectangle(s_x:Number, s_y:Number, m_x:Number, m_y:Number):void {
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
	  		var g2:GradientEntry = new GradientEntry(this.fillColor,NaN,0.5);
	    		
	   		fill.entries = [ g1, g2 ];
	  		fill.rotation = 90;
	  		
	  		g.moveTo(s_x, s_y);
	  		fill.begin(g, new Rectangle(s_x, s_y, m_x, m_y));
	  		
     		g.drawRoundRect(s_x+0.5, s_y+0.5, m_x-s_x, m_y-s_y, 20, 20);
		  	fill.end(g);
		}
		
		
		
	}
}