<template>
  <div class="mygraph">
    <div class="toolbar" ref="toolbar">

    </div>
    <div class="mainwindow" ref="mainwindow">
      <div class="manager" ref="promanager">
        POU管理器
      </div>
      <div class="dragLineVer" ref="dragLineVer1"></div>
      <div class="leftmain" ref="leftmain">
        <div class="top" ref="variables">
          <el-input v-model="text_variables" type="textarea" :rows="6"></el-input>
        </div>
        <div class="dragLineHor1" ref="dragLineHor1"></div>
        <div class="sfcarea" ref="sfcarea">
          sfc绘制
        </div>
        <div class="dragLineHor2" ref="dragLineHor2"></div>
        <div class="bottom" ref="assembly">
          预编译结果
        </div>
      </div>
      <div class="dragLineVer" ref="dragLineVer2"></div>
      <div class="right" ref="right">
        <div class="toolItemBar" v-show="currentTab=='tb'">
          <ul>
            <li v-for="item in toolBarItems" ref="toolItem">
              <img :src="item.icon" :alt="item.title">
              <span>{{ item.title }}</span>
            </li>
            <li>
              <button @click="exportXml">xml</button>
            </li>
          </ul>
        </div>
        <div class="properties" v-show="currentTab=='pro'">
          <span>这里显示组件属性</span>
        </div>
        <div class="footer">
          <button ref="toolbarbtn" class="righttoolbarcontrol" @click="changeCurrentTab('tb')">工具栏</button>
          <button ref="propertiesbtn" class="righttoolbarcontrol" @click="changeCurrentTab('pro')">属性</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import $ from 'jquery'
import '@/api/leonard/testCall'
import {toolBarItems} from "@/api/leonard/toolBarItems";

export default {
  name: 'index',
  data() {
    return {
      /*当前右侧标签*/
      currentTab:'tb',
      programName:'newSFC',
      change: false,
      graph: null,
      stepList: [],
      branchList: [],
      actionList: [],
      transitionList: [],
      jumpList: [],
      macroList: [],
      left: 25,
      top: 5,
      text_variables:''
    }
  },
  computed: {
    toolBarItems:()=>toolBarItems
  },
  mounted() {
    this.dragVertical1();
    this.dragVertical2();
    this.dragHorizontal1();
    this.dragHorizontal2();
    this.graph =  $.initGraph(this.$refs.sfcarea);
    this.globalEventListener();
    $.initToolBar(this.$refs.toolItem,this.graph)
    this.stPlaceHolder();
  },
  created() {
  },
  methods: {
    stPlaceHolder(){
      this.text_variables =  'PROGRAM '+this.programName+'\n'+
        'VAR\n' +
        '\n' +
        'END_VAR'
    },

    /*初始化sfc画布*/
    // initMxGraph() {
    //   this.graph.setCellsMovable(false)
    //   this.graph.setCellsResizable(false)
    //   this.graph.setAllowDanglingEdges(false)
    //   this.graph.setEnterStopsCellEditing(true)
    //   this.graph.htmlLabels = true
    //   mxEvent.disableContextMenu(this.$refs.sfcarea)
    // },
    /*初始化右侧工具栏*/

    /*右侧工具栏拖拽到sfc画布上*/


    /*拖拽垂直线*/
    dragVertical1() {
      const mainwindow = this.$refs.mainwindow;
      const resize = this.$refs.dragLineVer1;
      const resize2 = this.$refs.dragLineVer2;
      const leftmain = this.$refs.leftmain;
      const right = this.$refs.right;
      const promanager = this.$refs.promanager;
      resize.onmousedown = (ev) => {
        resize.style.background = '#ff0000';
        const startX = ev.clientX;
        resize.left = resize.offsetLeft;
        const rightW = right.offsetWidth;
        document.onmousemove = function (e) {
          const endX = e.clientX
          let moveLen = resize.left + (endX - startX)
          const maxT = mainwindow.clientWidth - resize.offsetWidth - resize2.offsetWidth - rightW
          if (moveLen < 200) moveLen = 200
          if (moveLen > maxT - 800) moveLen = maxT - 800

          resize.style.left = moveLen
          promanager.style.width = moveLen + 'px'
          leftmain.style.width = (mainwindow.clientWidth - moveLen - rightW - 10) + 'px'
        }
        // 鼠标松开事件
        document.onmouseup = function (evt) {
          // 颜色恢复
          resize.style.background = '#C0C4CC'
          document.onmousemove = null
          document.onmouseup = null
          resize.releaseCapture && resize.releaseCapture()
        }
        resize.setCapture && resize.setCapture()
        return false
      }
    },
    dragVertical2() {
      const mainwindow = this.$refs.mainwindow;
      const promanager = this.$refs.promanager;
      const resize1 = this.$refs.dragLineVer1;
      const leftmain = this.$refs.leftmain;
      const resize = this.$refs.dragLineVer2;
      const right = this.$refs.right;
      resize.onmousedown = (ev) => {
        resize.style.background = '#ff0000';
        const startX = ev.clientX;
        const managerW = promanager.offsetWidth;
        resize.left = resize.offsetLeft - managerW;
        document.onmousemove = function (e) {
          const endX = e.clientX
          let moveLen = resize.left + (endX - startX)
          const maxT = mainwindow.clientWidth - resize.offsetWidth - resize1.offsetWidth - managerW
          if (moveLen < 800) moveLen = 800
          if (moveLen > maxT - 300) moveLen = maxT - 300

          resize.style.left = moveLen
          leftmain.style.width = moveLen + 'px'
          right.style.width = (mainwindow.clientWidth - moveLen - managerW - 10) + 'px'
        }
        // 鼠标松开事件
        document.onmouseup = function (evt) {
          // 颜色恢复
          resize.style.background = '#C0C4CC'
          document.onmousemove = null
          document.onmouseup = null
          resize.releaseCapture && resize.releaseCapture()
        }
        resize.setCapture && resize.setCapture()
        return false
      }
    },
    /*拖拽水平线*/
    dragHorizontal1() {
      const mainwindow = this.$refs.mainwindow;
      const variables = this.$refs.variables;
      const dragLineHor1 = this.$refs.dragLineHor1;
      const sfcarea = this.$refs.sfcarea;
      const dragLineHor2 = this.$refs.dragLineHor2;
      const assembly = this.$refs.assembly;
      dragLineHor1.onmousedown = (ev) => {
        dragLineHor1.style.background = '#ff0000'
        const startY = ev.clientY;
        const assemblyH = assembly.offsetHeight;
        dragLineHor1.top = variables.offsetHeight
        document.onmousemove = (e) => {
          const endY = e.clientY;
          let moveLen = dragLineHor1.top + (endY - startY);
          const maxT = mainwindow.clientHeight - dragLineHor1.offsetHeight - dragLineHor2.offsetHeight - assemblyH;
          if (moveLen < 200) moveLen = 200
          if (moveLen > maxT - 400) moveLen = maxT - 400

          dragLineHor1.style.height = moveLen

          variables.style.height = moveLen + 'px'
          sfcarea.style.height = (mainwindow.clientHeight - assemblyH - moveLen - 20) + 'px'
        }
        document.onmouseup = function (evt) {
          // 颜色恢复
          dragLineHor1.style.background = '#C0C4CC'
          document.onmousemove = null
          document.onmouseup = null
          dragLineHor1.releaseCapture && dragLineHor1.releaseCapture() // 当你不在需要继续获得鼠标消息就要应该调用ReleaseCapture()释放掉
        }
        dragLineHor1.setCapture && dragLineHor1.setCapture()
        return false
      }
    },
    dragHorizontal2() {
      const mainwindow = this.$refs.mainwindow;
      const variables = this.$refs.variables;
      const dragLineHor1 = this.$refs.dragLineHor1;
      const sfcarea = this.$refs.sfcarea;
      const dragLineHor2 = this.$refs.dragLineHor2;
      const assembly = this.$refs.assembly;
      dragLineHor2.onmousedown = (ev) => {
        dragLineHor2.style.background = '#ff0000'
        const startY = ev.clientY;
        dragLineHor2.top = sfcarea.offsetHeight;
        const variablesH = variables.offsetHeight;
        document.onmousemove = (e) => {
          const endY = e.clientY;
          let moveLen = dragLineHor2.top + (endY - startY);
          const maxT = mainwindow.clientHeight - dragLineHor1.offsetHeight - dragLineHor2.offsetHeight - variablesH;
          if (moveLen < 400) moveLen = 400
          if (moveLen > maxT - 100) moveLen = maxT - 100

          dragLineHor2.style.height = moveLen

          sfcarea.style.height = moveLen + 'px'
          assembly.style.height = (mainwindow.clientHeight - moveLen - variablesH - 20) + 'px'
        }
        document.onmouseup = function (evt) {
          // 颜色恢复
          dragLineHor2.style.background = '#C0C4CC'
          document.onmousemove = null
          document.onmouseup = null
          dragLineHor2.releaseCapture && dragLineHor2.releaseCapture()
        }
        dragLineHor2.setCapture && dragLineHor2.setCapture()
        return false
      }
    },
    globalEventListener() {
      window.onbeforeunload = (e) => {
        e = e || window.event
        if (this.change) {
          return '您还未保存，若继续操作，当前更改将会丢失'
        }
        return
      }
    },
    exportXml() {
      let codec = new mxCodec(mxUtils.createXmlDocument());
      let encode = codec.encode(this.graph.getModel());
      let prettyXml = mxUtils.getPrettyXml(encode);
      this.download('/sfc/sfcdownloadxml', {prettyXml}, `1.xml`)
    },
    changeCurrentTab(tabName){
      this.currentTab = tabName
    },
  }
}
</script>
<style scoped>
.mygraph {
  overflow: scroll;
}

.mainwindow {
  width: 1700px;
  height: 900px;
  border: 1px #056768 solid;
}

.leftmain {
  width: 65%;
  height: 100%;
}

.manager {
  width: 15%;
  height: 100%;
  position: relative;
  background: white;
}

.sfcarea, .bottom {
  overflow: hidden;
}

.dragLineVer {
  width: 5px;
  height: 100%;
  background: #C0C4CC;
  cursor: w-resize;
}

.right {
  width: calc(20% - 10px);
  height: 100%;
  background: #ffffff;
  position: relative;
}

.manager, .leftmain, .dragLineVer, .right {
  float: left;
  overflow: hidden;
}

.dragLineHor1, .dragLineHor2 {
  height: 0.6vh;
  background: #C0C4CC;
  cursor: s-resize;
  position: relative;
}

.sfcarea {
  height: 45%;
  background: transparent;
  overflow: scroll;
}

.bottom {
  height: 20%;
  background: #ECF5FF;
}

.top {
  height: calc(35% - 1.2vh);
  background: #C6E2FF;
  overflow: scroll;
}

.toolItemBar {
  padding-left: 20px;
  padding-top: 20px;
}

.toolItemBar ul li {
  list-style: none;
  margin-bottom: 5px;
  cursor: pointer;
}

.toolItemBar ul li img {
  height: 15px;
  width: 15px;
}

.right .footer {
  border-top: 1px solid black;
  position: absolute;
  bottom: 0;
  width: 100%;
  background: white;
}

.right .footer .righttoolbarcontrol {
  height: 20px;
  border-radius: 2px;
  border: 2px solid transparent;
}

.right .footer .righttoolbarcontrol:focus {
  border-radius: 2px;
  background: #b5dbef;
  color: red;
}

.right .footer .righttoolbarcontrol:active {
  border-radius: 2px;
  border: 1px solid black;
  background: #b5dbef;
  color: black;
}
</style>
