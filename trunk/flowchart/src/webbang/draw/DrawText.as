package webbang.draw
{
	
	import flash.display.Graphics;
	import flash.events.MouseEvent;
	import flash.geom.*;
	
	import mx.core.Container;
	
	import spark.primitives.RichEditableText;
	
	import webbang.component.*;

	public class DrawText extends DrawElement
	{
		private var color:uint;
		private var size:Number;
		private var textInput:CustomTextInput;
		
		public function DrawText(drawContainer:Container, customParam:Object)
		{
			super(drawContainer, customParam);
		}
		
		override protected function onDrawMouseDown(e:MouseEvent):void{
			if (!(e.target is RichEditableText)) {
				
				drawContainer.addEventListener(MouseEvent.MOUSE_MOVE, onDrawMouseMove);
				drawContainer.addEventListener(MouseEvent.MOUSE_UP, onDrawMouseUp);
				
				drawArea = new DrawArea();
				drawContainer.addElement(drawArea); 
				
				drawArea.graphics.lineStyle(0, 0);
				startPoint.x = drawContainer.mouseX;
				startPoint.y = drawContainer.mouseY;
				drawArea.graphics.moveTo(drawContainer.mouseX, drawContainer.mouseY);
				
			}
			
			
		}
		
		override protected function onDrawMouseMove(e:MouseEvent):void{
			var g:Graphics = drawArea.graphics;
			var s_x:Number = startPoint.x;
			var s_y:Number = startPoint.y;
			var m_x:Number = drawContainer.mouseX;
			var m_y:Number = drawContainer.mouseY;
			
			g.clear();
			g.lineStyle(this.lineWeight, this.lineColor);
			
	  		g.moveTo(s_x, s_y);
     		g.drawRect(s_x, s_y, m_x-s_x, m_y-s_y);
     		
			
			
		}
		
		override protected function onDrawMouseUp(e:MouseEvent):void{
			drawArea.graphics.clear();
			
			var width:Number = Math.abs(drawContainer.mouseX - startPoint.x);
			var height:Number = this.size + 8;
			
			drawArea.width=width;
			drawArea.height = height;
			
			textInput = new CustomTextInput();
			textInput.name = "customTextInput";
			textInput.text = "请输入文字";
			textInput.setStyle("fontSize", this.textSize);
			textInput.setStyle("color", this.textColor);
			
			textInput.width = width;
			textInput.height = height;
			
			drawArea.x = startPoint.x;
			drawArea.y = startPoint.y;
			
			textInput.styleName = "customTextInput";
			drawArea.addChild(textInput);
			
			
			drawContainer.removeEventListener(MouseEvent.MOUSE_MOVE, onDrawMouseMove);
			drawContainer.removeEventListener(MouseEvent.MOUSE_UP, onDrawMouseUp);
		}
	}
}