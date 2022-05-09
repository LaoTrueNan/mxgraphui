/**
 * 应该封装初始化、组件事件监听、
 * @param dom
 * @returns {*}
 */
(function (factory) {
  if (typeof define === 'function' && define.amd) {
    define(['jquery', './mxgraph','./toolBarItems'], factory)
    console.log('import testCall.js1 successfully')
  } else if (typeof exports === 'object') {
    module.exports = factory(require('jquery'))
    console.log('import testCall.js2 successfully')
  } else {
    factory(jQuery)
    console.log('import testCall.js3 successfully')
  }
}(function (jQuery, mxgraph, tbi) {
  'use strict'
  var $ = jQuery
  const {
    mxGraph,
    mxEvent,
    mxConstants,
    mxUtils,
    mxRubberband,
    mxPoint,
    mxCodec,
    mxKeyHandler,
    mxGeometry,
    mxCell,
    mxEditor,
    mxDragSource,
    /*......*/
  } = mxgraph.default;
  var _win = window
  var _doc = document
  var $window = $(_win)
  tbi = tbi.toolBarItems
  // 初始化画布
  const initGraph = (dom) => {
    //创建画布，左侧sfc
    let graph = new mxGraph(dom);
    new mxRubberband(graph)
    // let keyHandler = new mxKeyHandler(graph)
    // keyHandler.bindKey(46, function (evt) {
    //   if (graph.isEnabled()) {
    //     alert('点击了delete')
    //   }
    // })
    graph.foldingEnabled = false
    graph.setTooltips(true)
    graph.setMultigraph(false)
    graph.setHtmlLabels(true)
    graph.isCellEditable = (cell) => {
      return !graph.model.isEdge(cell)
    }
    graph.convertValueToString = (cell) => {
      return cell.value;
    }
    var style = graph.getStylesheet().getDefaultEdgeStyle();
    delete style['endArrow']
    graph.popupMenuHandler.autoExpand = true
    return graph
  }
  // 初始化工具栏
  const initToolBar = (itemArray,graph)=>{
    if (!(itemArray instanceof Array) || itemArray.length <= 0) {
      return
    }
    itemArray.forEach((dom, domIndex) => {
      const item = tbi[domIndex];
      const {width, height} = item
      const dropHandler = (graph, evt, cell, x, y) => {
        let target = graph.getCellAt(evt.offsetX, evt.offsetY)
        //画布不为空而且没有放置到其他元素的point或者port上
        if (target == null && !graph.getModel().cells ) {
          return
        } else {
          console.log(item)
          // dragToCanvas(item, target, x, y,graph)
        }
      }
      const dragPreview = () => {
        const elt = document.createElement('div');
        elt.style.border = '2px dotted black'
        elt.style.width = `${width}px`
        elt.style.height = `${height}px`
        return elt
      }
      let a = mxUtils.makeDraggable(dom, graph, dropHandler, dragPreview(), 0, 0, false, true,true,function(x,y){
        return graph.getCellAt(x,y)
      })
      /*添加了这句话会有红色指示虚线*/
      // a.setGuidesEnabled(true)
    })
  }

  /**
   * 拖拽回调方法
   * @param item 要添加的dom元素，也就是dragSource
   * @param target 放置的位置上的mxCell对象
   * @param x 横坐标
   * @param y 纵坐标
   * @param graph 画布
   */
  const dragToCanvas = (item,target,x,y,graph)=>{
      const {width, height} = item
      const styleObj = item.style;
      const stylestr = Object.keys(styleObj).map((attr) => `${attr}=${styleObj[attr]}`).join(';');
      mxConstants.HANDLE_FILLCOLOR = '#99ccff';
      mxConstants.HANDLE_STROKECOLOR = '#0088cf';
      mxConstants.VERTEX_SELECTION_COLOR = '#00a8ff';
      mxConstants.EDGE_SELECTION_COLOR = '#6600ff'
  }
  // 加载mxEditor
  const a = (configname) => {
    let node = mxUtils.load('/mxgraph/config/' + configname + '.xml').getDocumentElement()
    console.log(node)
    let editor = new mxEditor(node)
    return editor
  }
  $.extend({initEditor: a, initGraph: initGraph,initToolBar:initToolBar})
}));
