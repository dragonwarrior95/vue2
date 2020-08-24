<template>
  <div>
    <el-container>
      <el-header>
        <el-row style="padding-left: 200px">
          <el-col :span="10">
            <span class="scale">缩放：</span>
            <el-button type="primary" plain @click="onScale(-1)">缩小</el-button>
            <el-col :span="6"><el-slider v-model="scaleValue" :step="0.01" :min="0" :max="4" @input="onValueChange" /></el-col>
            <el-button type="primary" plain @click="onScale(1)">放大</el-button>
            <el-button type="primary" plain @click="onScale(0)">自适应</el-button>
            <el-button type="primary" plain @click="onScale(0)">1：1</el-button>
          </el-col>
          <el-col :span="12">
            <span class="rotate">旋转：</span>
            <el-col :span="10"><el-slider v-model="rotateValue" :step="1" :min="0" :max="360" show-input @input="onRotateChange" /></el-col>
            <el-button type="primary" plain @click="onRotae(1)">90</el-button>
            <el-button type="primary" plain @click="onRotae(2)">270</el-button>
            <el-button type="primary" plain @click="onRotae(3)">水平镜像</el-button>
            <el-button type="primary" plain @click="onRotae(4)">垂直镜像</el-button>
          </el-col>
          <el-col :span="2">
            <input type="file" id="browsefile" hidden @change="onEditChange()">
            <el-button type="primary" @click="onOpen" plain>打开图片</el-button>
            <el-button type="success" @click="saveImage" plain>保存图片</el-button>
            <!--        <span><input type="textfield" id="filepath"></span>-->
          </el-col>
        </el-row>
      </el-header>
      <el-container>
        <el-aside width="200px">
          <p ><span>gamma</span><span><el-slider width="144" v-model="AdjustmentValue.gamma" :step="0.1" :min="0" :max="5.0" @input="onFilterValueChanged" /></span><span>{{AdjustmentValue.gamma}}</span></p>
            <p ><span>saturation</span><el-slider v-model="AdjustmentValue.saturation" :step="0.1" :min="0" :max="5.0" @input="onFilterValueChanged" /></p>
            <p ><span>contrast</span><el-slider v-model="AdjustmentValue.contrast" :step="0.1" :min="0" :max="5.0" @input="onFilterValueChanged" /></p>
            <p ><span>brightness</span><el-slider v-model="AdjustmentValue.brightness" :step="0.1" :min="0" :max="5.0" @input="onFilterValueChanged" /></p>
            <p ><span>red</span><el-slider v-model="AdjustmentValue.red" :step="0.1" :min="0" :max="5.0" @input="onFilterValueChanged" /></p>
            <p ><span>green</span><el-slider v-model="AdjustmentValue.green" :step="0.1" :min="0" :max="5.0" @input="onFilterValueChanged" /></p>
            <p ><span>blue</span><el-slider v-model="AdjustmentValue.blue" :step="0.1" :min="0" :max="5.0" @input="onFilterValueChanged" /></p>
            <p ><span>alpha</span><el-slider v-model="AdjustmentValue.alpha" :step="0.1" :min="0" :max="1.0" @input="onFilterValueChanged" /></p>
            <div></div>
        </el-aside>
        <el-main>
          <el-row><div id="scene" v-loading="loading" @wheel="onMouseWheel" /></el-row>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import * as PIXI from 'pixi.js'
import * as filters from 'pixi-filters'
import $ from 'jquery'

function Loge() {
  const type = arguments[0]
  switch (type) {
    default:
    case 'info':
      console.info.apply(console, arguments)
      break
    case 'warn':
      console.warn.apply(console, arguments)
      break
    case 'error':
      console.error.apply(console, arguments)
      break
    case 'debug':
      console.debug.apply(console, arguments)
      break
  }
}
document.oncontextmenu = function(event) {
  Loge(event)
  return false // 屏蔽右键菜单
}
export default {
  name: 'Scene',
  data() {
    return {
      windowWidth: 0, // 窗口宽度
      windowHeight: 0, // 窗口高度
      // 变量别名
      Application: PIXI.Application,
      loader: new PIXI.Loader(),
      Sprite: PIXI.Sprite,
      app: null, // 实例：app is pixi instance
      imageName: '', // 图片名称
      myCanvas: null, // 画布
      sprite: null, // 精灵,
      graphics: null, // 涂鸦
      buttonDown: false,
      startPoint: null,
      loading: true,
      scaleValue: 1.0,
      rotateValue: 0,
      adjustmentFilter: null,
      AdjustmentValue: {
        gamma: 1,
        saturation: 1,
        contrast: 1,
        brightness: 1,
        red: 1,
        green: 1,
        blue: 1,
        alpha: 1
      }
    }
  },
  computed: {
    // loadImage () {
    //   return this.$store.getters
    // }
  },
  watch: {
  },
  mounted() {
    this.windowWidth = $('#scene').width()
    this.windowHeight = $('#scene').height()
    // this.windowWidth = document.getElementById('scene').clientWidth
    // this.windowHeight = document.getElementById('scene').clientHeight
    Loge(this.windowWidth)
    Loge(this.windowHeight)
    const ctrlKey = this.keyboard()
    ctrlKey.press = (event) => {
      if (event.code === 'ControlLeft' || event.code === 'ControlRight') {
        this.ctrlDown = true
      } else if (event.code === 'ShiftLeft' || event.code === 'ShiftRight') {
        this.shiftDown = true
      }
      Loge('ctrlKey.press======\r\n')
    }
    ctrlKey.release = (event) => {
      if (event.code === 'ControlLeft' || event.code === 'ControlRight') {
        // eslint-disable-next-line no-empty
      } else if (event.code === 'ShiftLeft' || event.code === 'ShiftRight') {
      }
      Loge('ctrlKey.release======\r\n')
    }
    window.onresize = () => {
      return (() => {
        this.app.renderer.resize($('#app').width(), $('#app').height())
        this.myCanvas.x = this.app.screen.width / 2
        this.myCanvas.y = this.app.screen.height / 2
      })()
    }
    this.loadImage('/1.jpg')
  },
  created() {
    Loge('created======\r\n')
  },
  methods: {
    // 图像加载完成时调用
    async setup() {
      if (this.adjustmentFilter === null) {
        this.adjustmentFilter = new filters.AdjustmentFilter()
        this.adjustmentFilter.enabled = true
      }
      const factor = 3 // 缩放倍数
      if (this.sprite) {
        const texture = PIXI.Texture.from(this.imageName)
        texture.on('update', () => {
          console.log('load texture finished...')
          this.sprite.texture = new PIXI.Texture(texture)
          this.sprite.x = this.sprite.width * (factor - 1) / 2
          this.sprite.y = this.sprite.height * (factor - 1) / 2
          this.myCanvas.pivot.x = this.sprite.width * factor / 2
          this.myCanvas.pivot.y = this.sprite.height * factor / 2
          this.myCanvas.x = this.app.screen.width / 2
          this.myCanvas.y = this.app.screen.height / 2
        })
      } else {
        this.sprite = this.Sprite.from(this.imageName)
      }
      this.sprite.filters = [this.adjustmentFilter]
      this.sprite.x = this.sprite.width * (factor - 1) / 2
      this.sprite.y = this.sprite.height * (factor - 1) / 2
      if (this.myCanvas === null) {
        this.myCanvas = new PIXI.Graphics()
        this.myCanvas.filters = [this.adjustmentFilter]
        this.myCanvas.interactive = true
        this.myCanvas.buttonMode = true
        this.app.stage.addChild(this.myCanvas)
        this.myCanvas.on('pointerdown', this.onPointerDown)
        this.myCanvas.on('pointermove', this.onPointerMove)
        this.myCanvas.on('pointerup', this.onPointerUp)
        this.myCanvas.on('pointerupoutside ', this.onPointerUp)
      }
      this.myCanvas.addChild(this.sprite)
      this.myCanvas.pivot.x = this.sprite.width * factor / 2
      this.myCanvas.pivot.y = this.sprite.height * factor / 2
      this.myCanvas.x = this.app.screen.width / 2
      this.myCanvas.y = this.app.screen.height / 2
      this.myCanvas.beginFill(0xf0f1f5, 0.2)
      this.myCanvas.lineStyle(1, 0xff0000, 0)
      this.myCanvas.drawRect(0, 0, this.sprite.width * factor, this.sprite.height * factor)
      // 初始化画标记数据
      this.$nextTick(() => {
        this.init()
        this.loading = false
      })
    },
    saveImage() {
      if (this.myCanvas) {
        const images = this.app.renderer.plugins.extract.image(this.myCanvas)
        images.toDataURL()
      }
    },
    // loader加载图片
    loadImage(val) {
      this.loading = true
      this.imageName = val
      this.loader.reset()
      // 当前加载的图片
      if (!this.app) {
        this.app = new this.Application({
          width: this.windowWidth, // default: 800
          height: this.windowHeight, // default: 600
          antialias: true, // default: false
          transparent: false, // default: false
          resolution: 1, // default: 1
          backgroundColor: 0xf7f9fc
        })
        const scene = document.getElementById('scene')
        // scene.removeChild(scene.firstChild)
        scene.appendChild(this.app.view)
      }
      const options = {
        crossOrigin: true
      }
      // 当图片加载完成调用
      // Loge(imgPath)
      this.loader.add([{
        name: val,
        url: val,
        options: options
      }]).load(this.setup)
    },
    // 初始化时调的方法
    init() {
      Loge('')
    },
    onOpen() {
      $('#browsefile').click()
    },
    onEditChange() {
      const input = $('#browsefile')[0]
      let imgURL = ''
      try {
        let file = null
        if (input.files && input.files[0]) {
          file = input.files[0]
        } else if (input.files && input.files.item(0)) {
          file = input.files.item(0)
        }
        // Firefox 因安全性问题已无法直接通过input[file].value 获取完整的文件路径
        try {
          imgURL = file.getAsDataURL()
        } catch (e) {
          imgURL = window.URL.createObjectURL(file)
        }
      } catch (e) {
        if (input.files && input.files[0]) {
          const reader = new FileReader()
          reader.onload = function(e) {
            imgURL = e.target.result
          }
          reader.readAsDataURL(input.files[0])
        }
      }

      if (imgURL !== '') {
        this.loadImage(imgURL)
      }
    },
    onValueChange() {
      if (this.myCanvas && this.myCanvas.scale) {
        this.myCanvas.scale.x = this.scaleValue
        this.myCanvas.scale.y = this.scaleValue
      }
    },
    onFilterValueChanged() {
      if (this.adjustmentFilter && this.AdjustmentValue) {
        this.adjustmentFilter.gamma = this.AdjustmentValue.gamma
        this.adjustmentFilter.saturation = this.AdjustmentValue.saturation
        this.adjustmentFilter.contrast = this.AdjustmentValue.contrast
        this.adjustmentFilter.brightness = this.AdjustmentValue.brightness
        this.adjustmentFilter.red = this.AdjustmentValue.red
        this.adjustmentFilter.green = this.AdjustmentValue.green
        this.adjustmentFilter.blue = this.AdjustmentValue.blue
        this.adjustmentFilter.alpha = this.AdjustmentValue.alpha
      }
    },
    onRotateChange() {
      if (this.myCanvas && this.myCanvas.angle) this.myCanvas.angle = this.rotateValue // angle是角度制 rotation是弧度制
    },
    onScale(delta) {
      if (delta > 0) {
        this.myCanvas.scale.x *= 1.05
        this.myCanvas.scale.y *= 1.05
      } else if (delta < 0) {
        this.myCanvas.scale.x *= 0.95
        this.myCanvas.scale.y *= 0.95
      } else if (delta === 0) {
        this.myCanvas.scale.x = 1.0
        this.myCanvas.scale.y = 1.0
      }
      this.scaleValue = this.myCanvas.scale.x
    },
    onRotae(type) {
      if (type === 1) {
        this.myCanvas.angle = 90
      } else if (type === 2) {
        this.myCanvas.angle = 270
        // eslint-disable-next-line no-empty
      } else if (type === 3) {

        // eslint-disable-next-line no-empty
      } else if (type === 4) {

      }
    },
    // 滚轮放大缩小
    onMouseWheel(event) {
      // 获得图片真实大小
      // let imgHeight = this.sprite.height / this.sprite.scale.y
      // let imgWidth = this.sprite.width / this.sprite.scale.x
      // 判断点是否在精灵上
      // if (event.wheelDelta > 0) {
      //   this.myCanvas.scale.x *= 1.05
      //   this.myCanvas.scale.y *= 1.05
      // } else if (event.wheelDelta < 0) {
      //   this.myCanvas.scale.x *= 0.95
      //   this.myCanvas.scale.y *= 0.95
      // }
      this.onScale(event.wheelDelta | -event.deltaY)
    },
    keyboard() {
      const key = {}
      key.isDown = false
      key.isUp = true
      key.press = undefined
      key.release = undefined
      // The `downHandler`
      key.keyDown = event => {
        if (key.isUp && key.press) key.press(event)
        key.isDown = true
        key.isUp = false
        // event.preventDefault() // 不能加这句，否则键盘事件会被屏蔽
      }
      // The `upHandler`
      key.keyUp = event => {
        if (key.isDown && key.release) key.release(event)
        key.isDown = false
        key.isUp = true
        // event.preventDefault() // 不能加这句，否则键盘事件会被屏蔽
      }
      // Attach event listeners
      window.addEventListener('keydown', key.keyDown, false)
      window.addEventListener('keyup', key.keyUp, false)
      return key
    },

    // 鼠标按下、移动、弹起
    onPointerDown(event) {
      if (event.data.button === 2) {
        return // 鼠标右键按下返回
      }
      Loge('onPointerDown======\r\n')
      if (this.graphics === null) {
        this.graphics = new PIXI.Graphics()
        this.graphics.lineStyle(4, 0xff0000, 1)
        this.sprite.addChild(this.graphics)
        // this.graphics.x = 0
        // this.graphics.y = 0
      }
      this.buttonDown = true
      this.graphics.beginFill(0xff0000, 0)
      const global = event.data.global
      const pos = event.data.getLocalPosition(this.sprite) // 转sprite上的点
      const pt = this.sprite.toGlobal(pos) // 转鼠标上的点
      Loge('global: (', global.x, global.y, ')======\r\n')
      Loge('pos: (', pos.x, pos.y, ')======\r\n')
      Loge('pt: (', pt.x, pt.y, ')======\r\n')
      this.startPoint = pos
      this.graphics.moveTo(pos.x, pos.y)
    },
    onPointerMove(event) {
      if (this.buttonDown === true) {
        // Loge('onPointerMove======\r\n')
        const pos = event.data.getLocalPosition(this.sprite) // 转sprite上的点
        this.graphics.moveTo(this.startPoint.x, this.startPoint.y)
        this.graphics.lineTo(pos.x, pos.y)
        this.startPoint = pos
      }
    },
    onPointerUp: function(event) {
      event.data
      Loge('onPointerUp======\r\n')
      if (this.buttonDown) {
        this.graphics.endFill()
      }
      this.buttonDown = false
    },
    onPointerOut() {
      Loge('onPointerOut======\r\n')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .el-header, .el-footer {
    background-color: #B3C0D1;
    color: #333;
    text-align: center;
    line-height: 60px;
  }

  .el-aside {
    background-color: #D3DCE6;
    color: #333;
    text-align: center;
    /*line-height: 30px;*/
  }

  .el-main {
    background-color: #E9EEF3;
    color: #333;
    text-align: center;
    /*line-height: 160px;*/
  }

  .el-container:nth-child(5) .el-aside,
  .el-container:nth-child(6) .el-aside {
    line-height: 260px;
  }

  .el-container:nth-child(7) .el-aside {
    line-height: 320px;
  }

  #scene {
    /*border: 1px red solid;*/
    width: calc(100% - 180px);
    margin-left: 0px;
    min-height: calc(100vh - 300px);

    background: #f0f1f5;
    /*position: relative;*/
    /*float: left;*/
    display: block;
    /*overflow: hidden;*/
  }

  .el-row {
     margin-bottom: 20px;
  &:last-child {
     margin-bottom: 0;
   }
  }
  .el-col {
    border-radius: 4px;
  }
  .bg-purple-dark {
    background: #99a9bf;
  }
  .bg-purple {
    background: #d3dce6;
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }
  .el-aside .el-slider {
    width: 144px;
  }
</style>
