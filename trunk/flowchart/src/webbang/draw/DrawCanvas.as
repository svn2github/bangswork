package webbang.draw
{
	import com.adobe.images.JPGEncoder;
	
	import flash.display.BitmapData;
	import flash.net.*;
	import flash.utils.ByteArray;
	
	import mx.containers.Canvas;
	import mx.styles.*;
	
	import webbang.component.CustomTextInput;
	
	public class DrawCanvas extends Canvas
	{
		private var drawElement:IDrawElement = null;
		
		public function DrawCanvas()
		{
			super();
			this.width = 900;
			this.height = 700;
			
			this.graphics.lineStyle(0, 0);
			this.graphics.beginFill(0xffffff);
     		this.graphics.drawRect(0, 0, this.width, this.height);
     		this.graphics.endFill();
			/*
			var nameText:TextInput = new TextInput();
			
			nameText.styleName = "test";
			nameText.text = "sdfsdf";
			this.addChild(nameText);
			*/

			
		}
		
		public function drawRectangle(param:Object):void{
			reset();
			drawElement = new DrawRectangle(this, param);
			drawElement.startDraw();
		}
		
		public function drawRoundRectangle(param:Object):void{
			reset();
			drawElement = new DrawRoundRectangle(this, param);
			drawElement.startDraw();
		}
		
		public function drawRectangleText(param:Object):void{
			reset();
			drawElement = new DrawRectangleText(this, param);
			drawElement.startDraw();
		}		
		
		public function drawLine(param:Object):void{
			reset();
			drawElement = new DrawLine(this, param);
			drawElement.startDraw();
		}
		
		public function drawPoint(param:Object):void{
			reset();
			drawElement = new DrawPoint(this, param);
			drawElement.startDraw();
		}
		
		public function drawCircle(param:Object):void{
			reset();
			drawElement = new DrawCircle(this, param);
			drawElement.startDraw();
		}
		
		public function drawText(param:Object):void{
			reset();
			drawElement = new DrawText(this, param);
			drawElement.startDraw();
			enableTextInput();
		}
		
		public function drawEraser():void{
			reset();
			drawElement = new DrawEraser(this);
			drawElement.startDraw();
		}
		
		public function pointer3():void{
			reset();
			for (var i:uint = 0; i < this.numChildren; i++) {
				if (this.getChildAt(i) is DrawArea) {
					var children = this.getChildAt(i);
					children.startSelect();
				}
			}
		}
		
		
		public function pointer():void{
			reset();
			drawElement = new DrawPointer(this);
			drawElement.startDraw();
		}
		
		
		public function reset():void{
			if (drawElement != null) {
				drawElement.stopDraw();
			}
			disableTextInput();
			stopPointer();
			if (drawElement is DrawPointer) {
				(drawElement as DrawPointer).endSelect();
			}
		}
		
		private function disableTextInput():void{
			for (var i:uint = 0; i < this.numChildren; i++) {
				if (this.getChildAt(i) is DrawArea) {
					var children:DrawArea = this.getChildAt(i) as DrawArea;
					var text = children.getChildByName("customTextInput")
					if (text is CustomTextInput){
						text.enabled = false;
					}				
				}
			}
		}
		
		private function enableTextInput():void{
			for (var i:uint = 0; i < this.numChildren; i++) {
				if (this.getChildAt(i) is DrawArea) {
					var children:DrawArea = this.getChildAt(i) as DrawArea;
					var text = children.getChildByName("customTextInput")
					if (text is CustomTextInput){
						text.enabled = true;
					}
				}
			}
		}
		
		private function stopPointer():void{
			for (var i:uint = 0; i < this.numChildren; i++) {
				if (this.getChildAt(i) is DrawArea) {
					var children = this.getChildAt(i);
					children.stopSelect();
				}
			}
		}
		
		public function changeSetting(param:Object):void {
			if (drawElement != null) {
				drawElement.changeSetting(param);
			}
		}
		
		public function clear():void{
			var len:uint = this.numChildren;
			while (len > 0) {
				this.removeChildAt(0);
				len--;
			}
		}
		
		
		public function savePic():void{
			
			var jpgSource:BitmapData = new BitmapData (this.width, this.height);
			jpgSource.draw(this);
			var jpgEncoder:JPGEncoder = new JPGEncoder(100);
			var jpgStream:ByteArray = jpgEncoder.encode(jpgSource);
			
			var header:URLRequestHeader = new URLRequestHeader("Content-type", "application/octet-stream");
			var jpgURLRequest:URLRequest = new URLRequest("jpg_encoder_download.php");				
			jpgURLRequest.requestHeaders.push(header);
			jpgURLRequest.method = URLRequestMethod.POST;				
			jpgURLRequest.data = jpgStream;				
			navigateToURL(jpgURLRequest, "_blank");
			
		}
		
	}
}