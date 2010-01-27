package webbang.draw
{
	public class Utility
	{
		public static function extendParam (defaultParam:Object, param:Object):void {
			for (var key in param) {
				defaultParam[key] = param[key];
			}
		}
	}
}