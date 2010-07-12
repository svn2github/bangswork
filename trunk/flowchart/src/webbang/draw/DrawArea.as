package webbang.draw
{
	import flash.events.KeyboardEvent;
	import flash.events.MouseEvent;
	import flash.geom.Point;
	
	import mx.core.Container;
	import mx.core.UIComponent;

	//元素放置容器类
	public class DrawArea extends Container
	{
		//绘制边框的容器
		private var border:UIComponent = new UIComponent();
		
		//是否锁定选择
		public var isLockSelected = false;
		
		//拖动前鼠标的坐标，用于自定义拖动
		private var beforeDragMousePoint:Point = new Point();
		
		//拖动前元素的坐标，用于自定义拖动
		private var beforeDragPoint:Point = new Point();
		
		//选中的所有元素，用于自定义拖动，所有元素跟随着拖动，由dragMutileElements(elements:Array)传入
		private var selectedElements:Array;
		
		
		public function DrawArea()
		{
			this.addElement(border); 
		}
		
		/********单元素选择区***********/
		
		/**
		 * 让元素可以选择、拖动，添加对应鼠标事件
		 */
		public function startSelect():void {
			this.addEventListener(MouseEvent.ROLL_OVER, rollOver);
			this.addEventListener(MouseEvent.ROLL_OUT, rollOut);
			this.addEventListener(MouseEvent.MOUSE_DOWN, mouseDown);
			this.addEventListener(MouseEvent.MOUSE_UP, mouseUp);
		}
		
		/**
		 * 停止让元素选择、拖动，移除对应鼠标事件
		 */
		public function stopSelect():void{
			this.removeEventListener(MouseEvent.ROLL_OVER, rollOver);
			this.removeEventListener(MouseEvent.ROLL_OUT, rollOut);
			this.removeEventListener(MouseEvent.MOUSE_DOWN, mouseDown);
			this.removeEventListener(MouseEvent.MOUSE_UP, mouseUp);
		}
		
		private function rollOver(e:MouseEvent):void {
			//元素锁定选择时不作反应
			if (!isLockSelected) {
				selected();
			}
		}
				
		private function rollOut(e:MouseEvent):void {		
			//元素锁定选择时不作反应
			if (!isLockSelected) {
				unSelected();
			}
		}
		
		private function mouseDown(e:MouseEvent):void {
			//拖动元素，并置顶元素
			this.startDrag();
			this.parent.setChildIndex(this, parent.numChildren-1);
		}
		
		private function mouseUp(e:MouseEvent):void {			
			//停止拖动元素
			this.stopDrag();
		}
		
		
		
		
		
		/******共用函数区******/
		
		/**
		 * 选中当前元素，显示红色边框，添加键盘侦听事件
		 */
		private function selected():void {	
					
			//放置边框的显示对象
			border.graphics.lineStyle(0, 0xFF0000);
			border.graphics.moveTo(-2, -2);
     		border.graphics.drawRect(-2, -2, this.width + 4, this.height + 4);
     		
     		//添加键盘事件
			this.parentApplication.addEventListener(KeyboardEvent.KEY_DOWN, onSelectKeyDown);
			
		}
		
		
		/**
		 * 取消选择，移除红色边框，移除键盘事件
		 */
		private function unSelected():void{		
			this.parentApplication.removeEventListener(KeyboardEvent.KEY_DOWN, onSelectKeyDown);
			border.graphics.clear();
		}
		
		
		/**
		 * 键盘侦听事件，当前元素被选中时侦听
		 */
		private function onSelectKeyDown(e:KeyboardEvent):void {
			
			switch (e.keyCode) {
				case 37:
					this.x -= 1;
					break;
				case 38:
					this.y -= 1;
					break;
				case 39:
					this.x += 1;
					break;
				case 40:
					this.y += 1;
					break;
				//按键是del
				case 46:
					this.parent.removeChild(this);
			}
		}
		
		
		
		
		
		/********多元素选择区***********/
		
		/**
		 * 开始多元素自定义拖动
		 * 
		 * @param elements 所有需要跟着一起拖动的元素
		 * 
		 */
		public function dragMutileElements(elements:Array):void{
			this.selectedElements = elements;
			//锁定选择
			this.lockSelected();
			//开始自定义拖动
			this.customStartDrag();
		}
		
		/**
		 * 停止多元素自定义拖动
		 */
		public function stopDragMutileElements():void{
			this.unLockSelected();
			this.customStopDrag();
		}
		
		/**
		 * 锁定选择当前元素
		 */
		private function lockSelected():void {
			isLockSelected = true;
			selected();
		}
		
		/**
		 * 取消锁定选择当前元素
		 */
		private function unLockSelected():void {
			isLockSelected = false;
			unSelected();
		}
		
		/**
		 * 自定义拖动函数，开始拖动
		 */
		private function customStartDrag():void {	
			this.addEventListener(MouseEvent.MOUSE_DOWN, customDragMouseDown);
			this.addEventListener(MouseEvent.MOUSE_UP, customDragMouseUp);
		}
		/**
		 * 自定义拖动函数，停止拖动
		 */
		private function customStopDrag():void {	
			this.removeEventListener(MouseEvent.MOUSE_DOWN, customDragMouseDown);
			this.removeEventListener(MouseEvent.MOUSE_UP, customDragMouseUp);
		}
		
		/**
		 * 自定义拖动MouseDown事件
		 * 设定鼠标初始位置
		 * 为每个selectedElements设定初始位置
		 * 添加MouseMove事件
		 */
		private function customDragMouseDown(e:MouseEvent):void {	
			
			beforeDragMousePoint.x = this.parent.mouseX; 
			beforeDragMousePoint.y = this.parent.mouseY; 	
			
			for (var i:int = 0; i < selectedElements.length; i++) { 
				selectedElements[i].beforeDragPoint.x = selectedElements[i].x;
				selectedElements[i].beforeDragPoint.y = selectedElements[i].y;
			}
			
			//把鼠标事件绑定在画板DrawCanvas
			//如果直接在this上侦听事件，鼠标移出当前对象时会导致无反应			
			this.parent.addEventListener(MouseEvent.MOUSE_MOVE,customDragMouseMove);
			
		}
		/**
		 * 自定义拖动MouseUp事件，移除MouseMove侦听
		 */
		private function customDragMouseUp(e:MouseEvent):void {		
			this.parent.removeEventListener(MouseEvent.MOUSE_MOVE, customDragMouseMove);	
		}
		
		/**
		 * 自定义拖动MouseMove事件，鼠标移动时selectedElements里的元素跟着移动
		 */
		private function customDragMouseMove(e:MouseEvent):void {
			for (var i:int = 0; i < selectedElements.length; i++) {
				//(this.parent.mouseX - beforeDragMousePoint.x)为鼠标移动差值
				//加上selectedElements[i].beforeDragPoint.x即为selectedElements[i]要移动到的位置
				selectedElements[i].x += (this.parent.mouseX - beforeDragMousePoint.x + selectedElements[i].beforeDragPoint.x - selectedElements[i].x);
				selectedElements[i].y += (this.parent.mouseY - beforeDragMousePoint.y + selectedElements[i].beforeDragPoint.y - selectedElements[i].y);
			}
		}
		
		
	}
}