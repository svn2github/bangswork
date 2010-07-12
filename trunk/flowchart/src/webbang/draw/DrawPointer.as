package webbang.draw
{
	import flash.display.Graphics;
	import flash.events.MouseEvent;
	import flash.geom.*;
	
	import mx.core.Container;

	public class DrawPointer extends DrawRectangle
	{
		
		private var isSelected:Boolean = false;
		public function DrawPointer(drawContainer:Container)
		{
			super(drawContainer, {});
		}
		
		
		
		override public function startDraw():void{			
			drawContainer.addEventListener(MouseEvent.MOUSE_DOWN, onDrawMouseDown);
			startSingleSelect();
		}
		
		override protected function onDrawMouseDown(e:MouseEvent):void{
			
			if (e.target is DrawCanvas) {
				drawContainer.addEventListener(MouseEvent.MOUSE_MOVE, onDrawMouseMove);
				drawContainer.addEventListener(MouseEvent.MOUSE_UP, onDrawMouseUp);
				
				drawArea = new DrawArea();
				drawContainer.addElement(drawArea); 
				
				startPoint.x = drawContainer.mouseX;
				startPoint.y = drawContainer.mouseY;
				drawArea.graphics.moveTo(drawContainer.mouseX, drawContainer.mouseY);
				clearSelect();
				
			}
				
		}
		
		private function startSingleSelect(){
			for (var i:uint = 0; i < drawContainer.numChildren; i++) {
				if (drawContainer.getChildAt(i) is DrawArea) {
					var children = drawContainer.getChildAt(i);
					children.startSelect();
				}
			}
		}
		
		private function stopSingleSelect(){
			for (var i:uint = 0; i < drawContainer.numChildren; i++) {
				if (drawContainer.getChildAt(i) is DrawArea) {
					var children = drawContainer.getChildAt(i);
					children.stopSelect();
				}
			}
		}
		private function clearSelect(){
			if (this.isSelected) {
				var elements:Array = new Array();
				for (var i:uint = 0; i < drawContainer.numChildren; i++) {
					if (drawContainer.getChildAt(i) is DrawArea) {
						var children = drawContainer.getChildAt(i);
						elements.push(children);
					}
				}
				for (var j:uint = 0; j < drawContainer.numChildren; j++) {
					if (drawContainer.getChildAt(j) is DrawArea) {
						var children2 = drawContainer.getChildAt(j);
						children2.stopDragMutileElements();
					}
				}
				this.isSelected = false;
				startSingleSelect();
			}
		}
		
		public function endSelect(){
			clearSelect();
			stopSingleSelect();
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
						
	  		g.moveTo(s_x, s_y);
     		g.drawRect(s_x, s_y, m_x-s_x, m_y-s_y);
		}
		
		override protected function onDrawMouseUp(e:MouseEvent):void{
			var s_x:Number = startPoint.x;
			var s_y:Number = startPoint.y;
			var m_x:Number = drawContainer.mouseX;
			var m_y:Number = drawContainer.mouseY;
			
			drawArea.width = Math.abs(m_x - s_x);
			drawArea.height = Math.abs(m_y - s_y);
			
			drawArea.x = (m_x > s_x ? s_x: m_x) ;
			drawArea.y = (m_y > s_y ? s_y: m_y);
			
			
			var elements:Array = new Array();
			var sxin,syin,exin,eyin,isContain;
			for (var i:uint = 0; i < drawContainer.numChildren; i++) {
				
				if (drawContainer.getChildAt(i) is DrawArea) {
					var children = drawContainer.getChildAt(i);
					sxin = children.x > drawArea.x;
					syin = children.y > drawArea.y;
					exin = children.x + children.width < drawArea.x + drawArea.width;
					eyin = children.y + children.height < drawArea.y + drawArea.height;
					isContain = sxin && syin && exin && eyin;
					if (isContain) {
						elements.push(children);
					}
				}
				
			}
			for (var j:uint = 0; j < elements.length; j++) {
				elements[j].dragMutileElements(elements);
			}
			
			if (elements.length > 0) {
				this.isSelected = true;
				stopSingleSelect();
			}
			
			drawContainer.removeEventListener(MouseEvent.MOUSE_MOVE, onDrawMouseMove);
			drawContainer.removeEventListener(MouseEvent.MOUSE_UP, onDrawMouseUp);
			drawArea.parent.removeChild(drawArea);
			
			
		}
		
	}
}