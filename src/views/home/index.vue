<template>
  <el-container>
    <el-header>
      <el-row :gutter="20" style="margin: 0;">
        <el-col :span="16" :offset="4" style="min-width: 1200px">
          <div class="grid-content bg-purple-light">
            <el-row :gutter="20">
              <el-col :span="4">
                <div class="grid-content bg-purple-light">
                  <img src="@/assets/img/logo.png" alt="title-logo" class="nav-logo" style="height: 60px">
                </div>
              </el-col>
              <el-col :span="20">
                <div class="grid-content bg-purple-light">
                  <el-menu
                          :default-active="activeIndex"
                          class="el-menu-demo"
                          mode="horizontal"
                          @select="handleSelect"
                          background-color="#545c64"
                          text-color="#fff"
                          active-text-color="#ffd04b" style="float: right">
                    <el-menu-item index="1">处理中心</el-menu-item>
                    <el-submenu index="2">
                      <template slot="title">我的工作台</template>
                      <el-menu-item index="2-1">选项1</el-menu-item>
                      <el-menu-item index="2-2">选项2</el-menu-item>
                      <el-menu-item index="2-3">选项3</el-menu-item>
                      <el-submenu index="2-4">
                        <template slot="title">选项4</template>
                        <el-menu-item index="2-4-1">选项1</el-menu-item>
                        <el-menu-item index="2-4-2">选项2</el-menu-item>
                        <el-menu-item index="2-4-3">选项3</el-menu-item>
                      </el-submenu>
                    </el-submenu>
                    <el-menu-item index="3" disabled>消息中心</el-menu-item>
                    <el-menu-item index="4"><a href="https://www.ele.me" target="_blank">订单管理</a></el-menu-item>
                  </el-menu>
                </div>
              </el-col>
            </el-row>
          </div>
        </el-col>
      </el-row>
    </el-header>
    <el-container :style="{height: height}">
      <el-aside >
        <el-radio-group v-model="isCollapse">
          <el-radio-button :label="false">展开</el-radio-button>
          <el-radio-button :label="true">收起</el-radio-button>
        </el-radio-group>
        <div>
          <input type="file" id="browsefile" hidden @change="onEditChange()">
          <el-button type="primary" @click="onOpen" plain>打开图片</el-button>
          <el-button type="success" @click="saveImage" plain>保存图片</el-button>
        </div>

        <el-menu default-active="1-4-1" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose" :collapse="isCollapse">
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span slot="title">导航一</span>
            </template>
            <el-menu-item-group>
              <span slot="title">分组一</span>
              <el-menu-item index="1-1">选项1</el-menu-item>
              <el-menu-item index="1-2">选项2</el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group title="分组2">
              <el-menu-item index="1-3">选项3</el-menu-item>
            </el-menu-item-group>
            <el-submenu index="1-4">
              <span slot="title">选项4</span>
              <el-menu-item index="1-4-1">选项1</el-menu-item>
            </el-submenu>
          </el-submenu>
          <el-menu-item index="2">
            <i class="el-icon-menu"></i>
            <span slot="title">导航二</span>
          </el-menu-item>
          <el-menu-item index="3" disabled>
            <i class="el-icon-document"></i>
            <span slot="title">导航三</span>
          </el-menu-item>
          <el-menu-item index="4">
            <i class="el-icon-setting"></i>
            <span slot="title">导航四</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-main>
<!--        <div style="position: relative" class="margin">-->
<!--          <img id="myImg" src="@/assets/img/1.jpg" style="max-width: 800px;" />-->
<!--          <canvas id="myCanvas" />-->
<!--        </div>-->
          <el-row style="background-color: #42b983">
            <div id="scene" :style="{height: height}" v-loading="loading" @wheel="onMouseWheel" />
          </el-row>
      </el-main>
    </el-container>
    <el-footer>
      <el-row :gutter="20" style="margin: 0;">
        <el-col :span="16" :offset="4" style="min-width: 1200px">
          <div class="grid-content bg-purple-light">
            <div style="text-align: center">
              <h5>
                Copyright&copy; {{date}} All rights reserved
                <a href="http://www.miitbeian.gov.cn/" target="_blank"><i style="background: url(@/assets/img/icon-police.png?v=md5) 0 0 no-repeat;display: inline-block;width: 14px;height: 16px;margin-right: 6px;vertical-align: middle;margin-top: -4px;"></i>闽ICP备18026158号</a>
              </h5>
            </div>
          </div>
        </el-col>
      </el-row>
    </el-footer>
  </el-container>
</template>

<script>

import * as PIXI from "pixi.js";
import * as filters from "pixi-filters";
import $ from "jquery";
import { dataURLtoBlob } from "@/utils/ImageUtil";

// import nodejs bindings to native tensorflow,
// not required, but will speed up things drastically (python required)
// import '@tensorflow/tfjs-node';
import * as faceapi from 'face-api.js';

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
  name: 'Home',
  data: function() {
    return {
      nets: "ssdMobilenetv1", // 模型
      options: null, // 模型参数
      withBoxes: true, // 边框or轮廓
      imgEl: null,
      canvasEl: null,


      height: 400,
      visible: false,
      isCollapse: true,
      activeIndex: '1',
      date: '',

      windowWidth: 0, // 窗口宽度
      windowHeight: 0, // 窗口高度
      // 变量别名
      // Application: PIXI.Application,
      loader: new PIXI.Loader(),
      // Sprite: PIXI.Sprite,
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
    this.loadImage('@assets/img/1.jpg')
  },
  created() {
    this.getHeight()
    window.addEventListener('resize', this.getHeight)
    this.date = new Date().getFullYear()
  },
  methods: {
    async initFaceDetect() {
      await faceapi.nets[this.nets].loadFromUri("/models");
      await faceapi.loadFaceLandmarkModel("/models");
      // 根据模型参数识别调整结果
      switch (this.nets) {
        case "ssdMobilenetv1":
          this.options = new faceapi.SsdMobilenetv1Options({
            minConfidence: 0.5, // 0.1 ~ 0.9
          })
          break
        case "tinyFaceDetector":
          this.options = new faceapi.TinyFaceDetectorOptions({
            inputSize: 512, // 160 224 320 416 512 608
            scoreThreshold: 0.5, // 0.1 ~ 0.9
          })
          break
        case "mtcnn":
          this.options = new faceapi.MtcnnOptions({
            minFaceSize: 20, // 1 - 50
            scaleFactor: 0.709, // 0.1 ~ 0.9
          })
          break
      }
    },
    async load(imgUrl) {
      Loge('load: ' + imgUrl)
      // fetch images from url as blobs
      // const blob = dataURLtoBlob(imgUrl)
      const blobs = await Promise.all(imgUrl => (fetch(imgUrl)).blob()
      )

      // convert blobs (buffers) to HTMLImage elements
      const image = await faceapi.bufferToImage(imgUrl)
      Loge('image: ' + image)
      return  image
    },
    async faceDetect(image) {
      Loge(image)
      // 节点属性化
      const results = await faceapi.detectAllFaces(image, this.options).withFaceLandmarks()
      Loge(results)
      if (this.graphics === null) {
        this.graphics = new PIXI.Graphics()
        this.graphics.lineStyle(4, 0xff0000, 1)
        this.sprite.addChild(this.graphics)
      }
      if (this.graphics) {
        // this.graphics.beginFill(0xFFFF00, 1)
        for(const i in results){
          const box = results[i].detection.box
          this.graphics.drawRect(box.x, box.y, box.width, box.height)
        }
        this.graphics.endFill()
      }
    },
    getHeight(){
      this.height = window.innerHeight - 120 + 'px'
    },
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    },

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
        this.sprite = PIXI.Sprite.from(this.imageName)
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
        // this.initFaceDetect().then(() => this.faceDetect())
      })
      this.initFaceDetect().then(() => this.faceDetect(this.load(this.imageName)))
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
        this.app = new PIXI.Application({
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

<style lang="scss" scoped>
  * {
    padding: 0;
    margin: 0;
  }
  .el-header, .el-footer {
    padding: 0;
    background-color: #222;
    color: #9d9d9d;
    /*color: #337ab7;*/
    text-align: center;
    line-height: 60px;
  }

  .el-aside {
    background-color: #D3DCE6;
    color: #333;
    text-align: center;
    width: auto;
  }

  .el-main {
    background-color: #E9EEF3;
    color: #333;
    text-align: center;
    margin: 0;
    padding: 0;
  }

  /*左侧导航栏*/
  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
  }

  /*走马灯样式*/
  .demonstration {
    font-size: 30px;
    color: #000;
    line-height: 1.4;
    margin: 80px auto 40px;
    text-align: center;
  }

  .el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 150px;
    margin: 0;
  }

  .el-carousel__item:nth-child(2n) {
    /*background-color: #99a9bf;*/
  }

  .el-carousel__item:nth-child(2n+1) {
    /*background-color: #d3dce6;*/
  }
</style>
