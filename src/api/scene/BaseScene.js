'use strict'
/**
 * 图片处理场景类
 * @author
 * @since 2020-09-02
 * @param
 */
import JBaseLogic from "../logic/BaseLogic";
class JBaseScene {
	constructor() {
		let self = this
		this.m_Scale = 1.0             // 缩放
		this.m_Rotate = 0.0            // 旋转
		this.m_translateX = 0.0        // 平移
		this.m_translateY = 0.0
		this.m_baseLogic = new JBaseLogic() // 逻辑类接口
		self.update()
	}
	setRotate(rotate) {
		this.m_Rotate = rotate
		this.update()
	}
	setScale(scale) {
		this.m_Scale = scale/100.0
		this.update()
	}
	// 更新参数
	update() {
		this.draw()
	}
	draw()
	{
	}
}
export default JBaseScene