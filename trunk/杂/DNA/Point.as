package{
	import flash.display.Sprite
	public class Point extends Sprite
	{
		public var xpos:Number
		public var ypos:Number
		public var zpos:Number
		public var cx:Number
		public var cy:Number
		public var cz:Number
		public var vpX:Number
		public var vpY:Number
		public var scale:Number
		public var fl:Number=300
		public var cosX,cosY,sinX,sinY:Number
		public function Point(color:Number,radius:Number,xpos:Number=0,ypos:Number=0,zpos:Number=0)
		{
		this.xpos=xpos
		this.ypos=ypos
		this.zpos=zpos
		this.graphics.beginFill(color)
		this.graphics.lineStyle(1)
		this.graphics.drawCircle(0,0,radius)
		this.graphics.endFill()
		}
		public function setVanishingPoint(vpX:Number,vpY:Number):void
		{
			this.vpX=vpX
			this.vpY=vpY
		}
		public function rotateX(angleX:Number):void
		{
			var sinX:Number=Math.sin(angleX)
			var cosX:Number=Math.cos(angleX)
			var y1=ypos*cosX-zpos*sinX
			var z1=zpos*cosX+ypos*sinX
			ypos=y1
			zpos=z1
		}
		public function rotateY(angleY:Number):void
		{
			var sinY:Number=Math.sin(angleY)
			var cosY:Number=Math.cos(angleY)
			var x1=xpos*cosY-zpos*sinY
			var z1=zpos*cosY+xpos*sinY
			xpos=x1
			zpos=z1
		}
		public function setPerspective()
		{
			if(zpos>-fl)
			{
			scale=fl/(fl+zpos)
			this.scaleX=this.scaleY=scale
			this.alpha=scale
			this.x=vpX+xpos*scale
			this.y=vpY+ypos*scale
			this.visible=true
			}
			else
			{
				this.visible=false
			}
		}			
	}
}
			
			
			
			