<template>
  <div class="mygraph">
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
        <div class="toolItemBar">
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
        <div class="properties">

        </div>
        <div class="footer">
          <button ref="toolbarbtn" class="righttoolbarcontrol">工具栏</button>
          <button ref="propertiesbtn" class="righttoolbarcontrol">属性</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import mxgraph from '@/api/leonard/mxgraph'
const {
  mxGraph,
  mxEvent,
  mxConstants,
  mxUtils,
  mxRubberband,
  mxPoint,
  mxCodec
  /*......*/
} = mxgraph;
import {toolBarItems} from "@/api/leonard/toolBarItems";
import '@/api/leonard/testCall'
import $ from 'jquery'

export default {
  name: 'index',
  data() {
    return {
      programName:'newSFC',
      change: false,
      graph: null,
      stepList: [],
      branchList: [],
      actionList: [],
      transitionList: [],
      jumpList: [],
      macroList: [],
      left: 5,
      top: 5,
      text_variables:''
    }
  },
  computed: {
    toolBarItems: () => toolBarItems
  },
  mounted() {
    this.dragVertical1();
    this.dragVertical2();
    this.dragHorizontal1();
    this.dragHorizontal2();
    this.createMxGraph();
    this.initMxGraph();
    this.initToolBar();
    this.globalEventListener();
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
    //创建画布，左侧sfc
    createMxGraph() {
      this.graph = new mxGraph(this.$refs.sfcarea);
      new mxRubberband(this.graph)
      this.graph.foldingEnabled = false
      this.graph.setTooltips(true)
      // this.graph.foldingEnabled(false)
      this.graph.convertValueToString = (cell)=>{
        return cell.value;
      }
      var style = this.graph.getStylesheet().getDefaultEdgeStyle();
      delete style['endArrow'];
      this.graph.popupMenuHandler.autoExpand = true;
      var _this  = this;
      this.graph.popupMenuHandler.factoryMethod = (menu, cell, event) => {
        if(cell){
          if (/step[0-9]+/.test(cell.value)) {
            menu.addItem('delete step', null, function () {
              let outgoingEdges = _this.graph.getOutgoingEdges(cell,_this.graph.getDefaultParent());
              let incomingEdges = _this.graph.getIncomingEdges(cell,_this.graph.getDefaultParent());

              outgoingEdges.map((item)=>{
                var target = item.target;
                if(/action[0-9]+/.test(target.value)){

                  target.removeFromParent();
                  _this.graph.refresh(target)
                }
                item.removeFromParent()
                _this.graph.refresh(item)
              })
              cell.removeFromParent()
              _this.graph.refresh(cell)
              _this.top=_this.top-(cell.getGeometry().height+20)
            })
          }else if(/action[0-9]+/.test(cell.value)){
            menu.addItem('delete action', null, function () {
              let connections = _this.graph.getConnections(cell,_this.graph.getDefaultParent());
              connections.map((item)=>{
                item.removeFromParent()
                _this.graph.refresh(item)
              })
              cell.removeFromParent()
              _this.graph.refresh(cell)
            })
          }
        }
      }
    },
    /*初始化sfc画布*/
    initMxGraph() {
      this.graph.setCellsMovable(false)
      this.graph.setCellsResizable(false)
      this.graph.setAllowDanglingEdges(false)
      this.graph.setEnterStopsCellEditing(true)
      mxEvent.disableContextMenu(this.$refs.sfcarea)
    },
    /*初始化右侧工具栏*/
    initToolBar() {
      const itemArray = this.$refs.toolItem;
      if (!(itemArray instanceof Array) || itemArray.length <= 0) {
        return
      }
      itemArray.forEach((dom, domIndex) => {
        const item = this.toolBarItems[domIndex];
        const {width, height} = item
        const dropHandler = (graph, evt, cell, x, y) => {
          let target = this.graph.getCellAt(x, y);
          //画布不为空而且没有放置到其他元素的point或者port上
          if (target == null && this.top != 5) {
            return
          } else {
            this.dragToCanvas(item, target, x, y)
          }
        }
        const dragPreview = () => {
          const elt = document.createElement('div');
          elt.style.border = '2px dotted black'
          elt.style.width = `${width}px`
          elt.style.height = `${height}px`
          return elt
        }
        mxUtils.makeDraggable(dom, this.graph, dropHandler, dragPreview(), 0, 0, false, true);
      })
    },
    /*右侧工具栏拖拽到sfc画布上*/
    dragToCanvas(toolItem, target, x, y) {
      const {width, height} = toolItem
      const styleObj = toolItem.style;
      const stylestr = Object.keys(styleObj).map((attr) => `${attr}=${styleObj[attr]}`).join(';');
      mxConstants.HANDLE_FILLCOLOR = '#99ccff';
      mxConstants.HANDLE_STROKECOLOR = '#0088cf';
      mxConstants.VERTEX_SELECTION_COLOR = '#00a8ff';

      const parent = this.graph.getDefaultParent();
      this.graph.getModel().beginUpdate();
      try {
        switch (toolItem.title) {
          case 'step':
            let vertex = this.graph.insertVertex(parent, null, 'step' + this.stepList.length, this.left, this.top, width, height, stylestr)
            if(target){
              let edge = this.graph.insertEdge(parent, null, null, target, vertex, 'strokeColor=#000000')
            }
            this.stepList.push(vertex)
            /*上边的连接点*/
            let port1 = this.graph.insertVertex(vertex, null, null, 0.5, 1, 10, 10)
            port1.geometry.offset = new mxPoint(-5, 0)
            port1.geometry.relative = true
            port1.setConnectable(true)
            this.top += height + 20
                break;
          //动作只能放在步上
          case 'action':
            if (target != null && (/step[0-9]+/.test(target.value))) {
              let action = this.graph.insertVertex(parent, null, 'action'+this.actionList.length, target.getGeometry().width + target.getGeometry().x + 30, target.getGeometry().y, width, height, stylestr);
              let actionEdge = this.graph.insertEdge(parent, null, null, target, action, 'strokeColor=#000000');
              this.actionList.push(action)
            }
            return
          case 'branch':
            return
          case 'transition':
            return
          case 'macro':
            return
          case 'jump':
            return
        }
        this.change = true;
      } finally {
        this.graph.getModel().endUpdate();
      }

    },

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
          dragLineHor2.releaseCapture && dragLineHor2.releaseCapture() // 当你不在需要继续获得鼠标消息就要应该调用ReleaseCapture()释放掉
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
    }
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
