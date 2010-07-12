package webbang.draw
{
	import flash.events.KeyboardEvent;
	import flash.events.MouseEvent;
	import flash.geom.Point;
	
	import mx.core.Container;

	public class DrawElement implements IDrawElement
	{
		
		protected var startPoint:Point = new Point();
		protected var drawArea:DrawArea;
		protected var drawContainer:Container;
		protected var lineColor:uint;
		protected var fillColor:uint;
		protected var textColor:uint;
		protected var textSize:int;
		protected var lineWeight:Number;
		protected var keycode:int = 0;
		protected var hasKeyEvent:Boolean;
		
		public function DrawElement(drawContainer:Container, param:Object)
		{
			var defaultParam:Object = {
				fillColor: 0xffffff,
				lineColor: 0x000000,
				lineWeight: 1,
				textColor: 0x000000,
				textSize: 12,
				hasKeyEvent: false
			};
			Utility.extendParam(defaultParam, param);
			
			this.drawContainer = drawContainer;
			this.fillColor = defaultParam.fillColor;
			this.lineColor = defaultParam.lineColor;
			this.lineWeight = defaultParam.lineWeight;
			this.textColor = defaultParam.textColor;
			this.textSize = defaultParam.textSize;
			this.hasKeyEvent = defaultParam.hasKeyEvent;
		}
		
		
		public function startDraw():void{			
			drawContainer.addEventListener(MouseEvent.MOUSE_DOWN, onDrawMouseDown);
			if (hasKeyEvent) {
				drawContainer.parentApplication.addEventListener(KeyboardEvent.KEY_DOWN, onDrawKeyDown);
				drawContainer.parentApplication.addEventListener(KeyboardEvent.KEY_UP, onDrawKeyUp);
			}
		}
		
		public function stopDraw():void{
			drawContainer.removeEventListener(MouseEvent.MOUSE_DOWN, onDrawMouseDown);
			if (hasKeyEvent) {
				drawContainer.parentApplication.removeEventListener(KeyboardEvent.KEY_DOWN, onDrawKeyDown);
				drawContainer.parentApplication.removeEventListener(KeyboardEvent.KEY_UP, onDrawKeyUp);
			}
		}
		
		protected function onDrawKeyDown(e:KeyboardEvent):void{
			this.keycode = e.keyCode;
		}
		
		protected function onDrawKeyUp(e:KeyboardEvent):void{
			this.keycode = 0;
		}
		
		public function changeSetting(param:Object):void{
			var defaultParam:Object = {
				fillColor: 0xffffff,
				lineColor: 0x000000,
				lineWeight: 1,
				textColor: 0x000000,
				textSize: 12
			};
			Utility.extendParam(defaultParam, param);
			
			this.fillColor = defaultParam.fillColor;
			this.lineColor = defaultParam.lineColor;
			this.lineWeight = defaultParam.lineWeight;
			this.textColor = defaultParam.textColor;
		}
				
		protected function onDrawMouseDown(e:MouseEvent):void{
			
		}
		
		
		protected function onDrawMouseMove(e:MouseEvent):void{
			
		}
		
		protected function onDrawMouseUp(e:MouseEvent):void{
			drawContainer.removeEventListener(MouseEvent.MOUSE_MOVE, onDrawMouseMove);
			drawContainer.removeEventListener(MouseEvent.MOUSE_UP, onDrawMouseUp);
		}
		
		public function getDrawArea():DrawArea {
			return this.drawArea;
		}
		
	}
}