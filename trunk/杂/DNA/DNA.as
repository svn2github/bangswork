package{
	import flash.display.Sprite
	import flash.events.Event
	import flash.events.MouseEvent
	public class DNA extends Sprite{
		public var points:Array
		public var points2:Array
		private var numPoint=30
		private var vpX:Number=stage.stageWidth/2
		private var vpY:Number=stage.stageHeight/2
		public function DNA ()
		{
			init()
		}
		public function init()
		{
			points=new Array()
			points2=new Array()
			var color1:Number=0xffffff*Math.random()
			var color2:Number=0xffffff*Math.random()
			for(var i:uint=0;i<numPoint;i++)
			{
				var point:Point=new Point(color1,7,Math.cos(i/180*Math.PI*15)*35,15*i-200,Math.sin(i/180*Math.PI*15)*35)
				point.setVanishingPoint(vpX,vpY)
				points.push(point)
				addChild(point)
			}
			for(i=0;i<numPoint;i++)
			{
				var point2:Point=new Point(color2,7,-(Math.cos(i/180*Math.PI*15)*35),15*i-200,-(Math.sin(i/180*Math.PI*15)*35))
				point2.setVanishingPoint(vpX,vpY)
				points.push(point2)
				addChild(point2)
			}
			addEventListener(Event.ENTER_FRAME,onEnterFrame)
		}
		public function onEnterFrame(e:Event):void
		{
			var angleX:Number=(mouseY-vpY)/500
			var angleY:Number=(mouseX-vpX)/500
			for(var i:uint=0;i<numPoint*2;i++)
			{
				points[i].setPerspective()
				points[i].rotateY(angleY)
			}
				line()
		}
		public function sortZ(array)
		{
			array.sortOn("zpos",2|16)
			for(var i:uint=0;i<numPoint*2;i++)
			{
				var point:Point=array[i]
				setChildIndex(point,i)
			}
		}
		public function line()
		{
			this.graphics.clear()
			this.graphics.lineStyle(1)
			for(var i:uint=0;i<numPoint;i++){
				this.graphics.moveTo(points[i].x,points[i].y)
				this.graphics.lineTo(points[i+numPoint].x,points[i+numPoint].y)
			}
		}
				
	}
}