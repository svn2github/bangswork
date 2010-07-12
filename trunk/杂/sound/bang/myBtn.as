package bang{
	import flash.display.MovieClip;
	import flash.events.MouseEvent;
	import flash.text.TextField;
	public class myBtn extends MovieClip{
		public function myBtn(){
			this.addEventListener(MouseEvent.ROLL_OVER,rollOver)
			this.addEventListener(MouseEvent.ROLL_OUT,rollOut)
			this.addEventListener(MouseEvent.MOUSE_DOWN,onPress);
			this.addEventListener(MouseEvent.MOUSE_UP,onRelease);
				
		}
		private function rollOver(e:MouseEvent){
			this.gotoAndStop(2);
		}
		private function rollOut(e:MouseEvent){
			this.gotoAndStop(3);
		}
		private function onPress(e:MouseEvent){
			this.gotoAndStop(4);
		}
		private function onRelease(e:MouseEvent){
			this.gotoAndStop(5);
		}
	}
}