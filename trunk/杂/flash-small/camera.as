package{
	import flash.display.Sprite
	import flash.media.Camera
	import flash.events.MouseEvent
	import flash.display.BitmapData
	import flash.events.Event
	import flash.media.Video
	import flash.display.Bitmap
	public class camera extends Sprite{
		var mycamera:Camera=Camera.getCamera()
		var myvideo:Video=new Video()
		var bit:Array
		var vwidth=250
		var vheight=200
		var i:uint=1
		var playvideo:Bitmap=new Bitmap()
	public function camera (){
		myvideo.attachCamera(mycamera)
		myvideo.smoothing=true
		myvideo.width=vwidth
		myvideo.height=vheight
		myvideo.x=50
		myvideo.y=30
		addChild(myvideo)
		addChild(playvideo)
	}
	public function rec_btn(btn){
		btn.addEventListener(MouseEvent.MOUSE_DOWN,on_rec_btn)
	}
	public function play_btn(btn){
		btn.addEventListener(MouseEvent.MOUSE_DOWN,on_play_btn)
	}
	public function stop_btn(btn){
		btn.addEventListener(MouseEvent.MOUSE_DOWN,on_stop_btn)
	}
	public function on_rec_btn(event:MouseEvent){
		bit=new Array()
		i=1
		addEventListener(Event.ENTER_FRAME,onenterframe)
	}
	public function on_stop_btn(event:MouseEvent){
		removeEventListener(Event.ENTER_FRAME,onenterframe)
		removeEventListener(Event.ENTER_FRAME,onenterframeplay)
		
	}
	public function on_play_btn(event:MouseEvent){
		addEventListener(Event.ENTER_FRAME,onenterframeplay)
	}
	private function onenterframe(event:Event){
		var rec:BitmapData=new BitmapData(vwidth,vheight,true,0xff)
		rec.draw(myvideo)
		bit.push(rec)
	}
	private function onenterframeplay(event:Event){
		if(i<bit.length){
		playvideo=new Bitmap(bit[i])
		playvideo.x=360
		playvideo.y=30
		addChild(playvideo)
		i++
		}else{
		removeEventListener(Event.ENTER_FRAME,onenterframeplay)
		}
			
	}
	}
}