package{
	import flash.display.Sprite
	import flash.events.MouseEvent
	import flash.text.TextField
	import flash.text.TextFieldType
	public class triangle extends Sprite{
		private var btnS:Sprite=new Sprite()
		private var drawS:Sprite=new Sprite()
		var aside:TextField=createtxt(150,350,40,20)
		var bside:TextField=createtxt(200,350,40,20)
		var angle:TextField=createtxt(250,350,40,20)
		var ctrl:TextField=createtxt(350,350,40,20)
		public function triangle(){
			aside.type=TextFieldType.INPUT
			bside.type=TextFieldType.INPUT
			angle.type=TextFieldType.INPUT
			aside.text="边长a"
			bside.text="边长b"
			angle.text="ab夹角"
			btnS.graphics.beginFill(0x000000)
			btnS.graphics.drawRect(300,350,40,20)
			btnS.buttonMode=true
			btnS.addEventListener(MouseEvent.MOUSE_DOWN,onbtnDown)
			addChild(aside)
			addChild(bside)
			addChild(angle)
			addChild(btnS)
			addChild(ctrl)
		}
		private function createtxt (x:Number,y:Number,width:Number,height:Number):TextField{
			var result:TextField=new TextField()
			result.x=x
			result.y=y
			result.width=width
			result.height=height
			result.border=true
			addChild(result)
			return result
		}
		private function onbtnDown(event:MouseEvent){
			drawS.graphics.clear()
			var a=Number(aside.text)
			var b=Number(bside.text)
			var ag=Number(angle.text)
			if(ag<180){
			drawS.graphics.lineStyle(1)
			drawS.graphics.moveTo(100,50)
			drawS.graphics.lineTo(100+a,50)
			drawS.graphics.lineTo(100+a-b*Math.cos(ag/180*Math.PI),50+b*Math.sin(ag/180*Math.PI))
			drawS.graphics.lineTo(100,50)
			addChild(drawS)
			}else{
				ctrl.text="error"
			}
			
		}
	}
}