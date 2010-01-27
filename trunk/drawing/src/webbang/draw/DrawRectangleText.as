package webbang.draw
{
	import flash.events.MouseEvent;
	import flash.geom.*;
	
	import mx.core.Container;
	
	import spark.primitives.RichEditableText;
	
	import webbang.component.*;

	public class DrawRectangleText extends DrawRectangle
	{
		private var textInput:CustomTextInput;
		
		public function DrawRectangleText(drawContainer:Container, customParam:Object)
		{
			var param:Object = {
				hasKeyEvent: true
			};
			Utility.extendParam(param, customParam);
			
			super(drawContainer, param);
		}
		
		override protected function onDrawMouseDown(e:MouseEvent):void{
			if (!(e.target is RichEditableText)) {
				
				startPoint.x = drawContainer.mouseX;
				startPoint.y = drawContainer.mouseY;
			
				drawArea = new DrawArea();
				drawContainer.addElement(drawArea); 
			
				this.drawRectangle(0, 0, 100, 30);
				
				drawArea.width = 100;
				drawArea.height = 30;
				
				drawArea.x = startPoint.x ;
				drawArea.y = startPoint.y;
						
			
				var width:Number = 85;
				var height:Number = 25;
				
				var drawTextArea:DrawArea = new DrawArea();
				drawContainer.addElement(drawTextArea); 
				drawTextArea.width=width;
				drawTextArea.height = height;
				
				textInput = new CustomTextInput();
				textInput.name = "customTextInput";
				textInput.text = "请输入文字";
				textInput.setStyle("fontSize", 14);
				textInput.setStyle("color", this.textColor);
				
				textInput.width = width;
				textInput.height = height;
				drawTextArea.x = startPoint.x + 10;
				drawTextArea.y = startPoint.y + 3;
				textInput.styleName = "customTextInput";
				
				drawTextArea.addChild(textInput);
						
			}
		}
				
		
	}
}