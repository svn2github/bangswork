package bang{
	import flash.media.*
    import flash.filters.*;
	import flash.display.Sprite
	import flash.display.BitmapData
	import flash.display.Bitmap
	import flash.display.BlendMode;
	import flash.net.URLRequest;
	import flash.events.Event;
	import flash.events.MouseEvent;
	import flash.media.SoundChannel;
	import flash.utils.ByteArray;
    import flash.geom.Point;
    import flash.geom.Rectangle;
	import flash.text.*;
	public class mySound extends Sprite{
		private var sound:Sound;
		private var url:URLRequest;
		private var position:Number=0;
		private var channel:SoundChannel;
		private var soundByte:ByteArray=new ByteArray();
		private var _draw:Sprite=new Sprite();
		private var soundArea:Sprite=new Sprite()
		private var bmpData:BitmapData=new BitmapData(300,300,true,0x000000)
        private var bmp:Bitmap=new Bitmap(bmpData);
		private var colorM:ColorMatrixFilter=new ColorMatrixFilter([
           		.98,0,0	,0,0,
            	0,.98,0		,0,0,
            	0,0,0.98	,0,0,
            	0,0,0		,0.9,0,
        ])
        private var blur:BlurFilter = new BlurFilter(7,7,BitmapFilterQuality.LOW);
        private var r:Rectangle=new Rectangle(0,0,300,300);
        private var p:Point=new Point(0,0);
		private var c:Number=0;
		private var color:Number=0x2AEAEB;
		private var filterChanged:Boolean=false;
		public function mySound(){
			url=new URLRequest("http://webbang.net/lab/sound/canon.mp3");
			sound=new Sound(url);
			addEventListener(Event.ENTER_FRAME,enterF);
			child()
			soundArea.blendMode=BlendMode.ADD;
			_draw.x=130;
			_draw.y=130;
		}
		private function child(){
			var playBtn:myBtn=new myBtn();
			var colorBtn:myBtn=new myBtn();
			var filterBtn:myBtn=new myBtn();
			playBtn.x=100;
			playBtn.y=300;
			colorBtn.x=200;
			colorBtn.y=300;
			filterBtn.x=300;
			filterBtn.y=300;
			playBtn.btnText.text="play";
			colorBtn.btnText.text="color";
			filterBtn.btnText.text="filter";
			playBtn.addEventListener(MouseEvent.CLICK,soundPlay);
			colorBtn.addEventListener(MouseEvent.CLICK,changeColor)
			filterBtn.addEventListener(MouseEvent.CLICK,changeFilter)
			soundArea.addChild(_draw)
			soundArea.addChild(bmp);
			soundArea.x=100;
			addChild(soundArea)
			addChild(playBtn);
			addChild(colorBtn);
			addChild(filterBtn);
		}
		private function soundPlay(e:MouseEvent){
			if(e.currentTarget.btnText.text=="play"){
				channel=sound.play(position) ;
				e.currentTarget.btnText.text="pause"
			}else{
				position=channel.position
				channel.stop()
				e.currentTarget.btnText.text="play"
			}
				
		}
		private function enterF(e:Event){
			if(c%2==0){
           	 	bmpData.draw(soundArea);
        		bmpData.applyFilter(bmpData,r,p,colorM);
        		bmpData.applyFilter(bmpData,r,p,blur);
       		}
       		c++;
			if(c>=10) c=2
			SoundMixer.computeSpectrum(soundByte,false,0);
			_draw.graphics.clear();
			_draw.graphics.lineStyle(2,color);
			_draw.graphics.moveTo(100,0);
			_draw.rotation+=50
			for(var xx=0;xx<512;xx++){
				var n=soundByte.readFloat()*30
				_draw.graphics.lineTo(Math.cos(xx/256*Math.PI)*100+n,Math.sin(xx/256*Math.PI)*100+n);
			}
		}
		private function changeColor(e:MouseEvent){
			color=0xffffff*(Math.random()+0.5);
		}
		private function changeFilter(e:MouseEvent){
			if(!filterChanged){
			colorM=new ColorMatrixFilter([
            	.91,0,0			,0,0,
            	0,.91,0			,0,0,
            	0,0,.91			,0,0,
            	0,0,0			,0.90,0,
        	])
				filterChanged=true
			}
			else {
			colorM=new ColorMatrixFilter([
           		.98,0,0	,0,0,
            	0,.98,0		,0,0,
            	0,0,0.98	,0,0,
            	0,0,0		,0.9,0,
        	])
				filterChanged=false
			}
		}
	}
}