import mxgraph from "@/api/leonard/mxgraph";
const {mxConstants,mxImage} = mxgraph
/*右侧工具栏，sfc的六个元素*/
const inputIcon = '/mxgraph/images/warning.gif';
const outputIcon = '/mxgraph/images/warning.gif';
export let toolBarItems = [
  {
    icon:'/mxgraph/images/step.gif',
    title: 'step',
    width: 70,
    height: 50,
    style: {
      fillColor: 'transparent',
      strokeColor: '#000000',
      strokeWidth: '1',
      color:'black',
      shape: mxConstants.SHAPE_RECTANGLE,
      align: mxConstants.ALIGN_CENTER,
      verticalAlign: mxConstants.ALIGN_BOTTOM,
      imageAlign: mxConstants.ALIGN_CENTER,
      imageVerticalAlign: mxConstants.ALIGN_TOP,
      image: outputIcon
    }
  },
  {
    icon:'/mxgraph/images/transition.gif',
    title: 'transition',
    width: 50,
    height: 50,
    style: {
      fillColor: '#f3c6c6', // 填充色
      strokeColor: '#000000', // 线条颜色
      strokeWidth: '1', // 线条粗细
      shape: mxConstants.SHAPE_LINE, // 形状
      align: mxConstants.ALIGN_CENTER, // 水平方向对齐方式
      verticalAlign: mxConstants.ALIGN_BOTTOM, // 垂直方向对齐方式
      imageAlign: mxConstants.ALIGN_CENTER, // 图形水平方向对齐方式
      imageVerticalAlign: mxConstants.ALIGN_TOP, // 图形垂直方向对齐方式
      image: inputIcon // 图形
    }
  },
  {
    icon:'/mxgraph/images/macro.gif',
    title: 'macro',
    width: 50,
    height: 50,
    style: {
      fillColor: '#f3c6c6', // 填充色
      strokeColor: '#000000', // 线条颜色
      strokeWidth: '1', // 线条粗细
      shape: mxConstants.SHAPE_DOUBLE_ELLIPSE, // 形状
      align: mxConstants.ALIGN_CENTER, // 水平方向对齐方式
      verticalAlign: mxConstants.ALIGN_BOTTOM, // 垂直方向对齐方式
      imageAlign: mxConstants.ALIGN_CENTER, // 图形水平方向对齐方式
      imageVerticalAlign: mxConstants.ALIGN_TOP, // 图形垂直方向对齐方式
      image: inputIcon // 图形
    }
  },
  {
    icon:'/mxgraph/images/branch.gif',
    title: 'branch',
    width: 50,
    height: 50,
    style: {
      fillColor: '#f3c6c6', // 填充色
      strokeColor: '#000000', // 线条颜色
      strokeWidth: '1', // 线条粗细
      shape: mxConstants.SHAPE_DOUBLE_ELLIPSE, // 形状
      align: mxConstants.ALIGN_CENTER, // 水平方向对齐方式
      verticalAlign: mxConstants.ALIGN_BOTTOM, // 垂直方向对齐方式
      imageAlign: mxConstants.ALIGN_CENTER, // 图形水平方向对齐方式
      imageVerticalAlign: mxConstants.ALIGN_TOP, // 图形垂直方向对齐方式
      image: inputIcon // 图形
    }
  },
  {
    icon:'/mxgraph/images/jump.gif',
    title: 'jump',
    width: 50,
    height: 50,
    style: {
      fillColor: '#f3c6c6', // 填充色
      strokeColor: '#000000', // 线条颜色
      strokeWidth: '1', // 线条粗细
      shape: mxConstants.SHAPE_ARROW, // 形状
      align: mxConstants.ALIGN_CENTER, // 水平方向对齐方式
      verticalAlign: mxConstants.ALIGN_BOTTOM, // 垂直方向对齐方式
      imageAlign: mxConstants.ALIGN_CENTER, // 图形水平方向对齐方式
      imageVerticalAlign: mxConstants.ALIGN_TOP, // 图形垂直方向对齐方式
      image: inputIcon // 图形
    }
  },
  {
    icon:'/mxgraph/images/action.gif',
    title: 'action',
    width: 70,
    height: 15,
    style: {
      fillColor: '#f3c6c6', // 填充色
      strokeColor: '#000000', // 线条颜色
      strokeWidth: '1', // 线条粗细
      shape: mxConstants.SHAPE_RECTANGLE, // 形状
      align: mxConstants.ALIGN_CENTER, // 水平方向对齐方式
      verticalAlign: mxConstants.ALIGN_BOTTOM, // 垂直方向对齐方式
      imageAlign: mxConstants.ALIGN_CENTER, // 图形水平方向对齐方式
      imageVerticalAlign: mxConstants.ALIGN_TOP, // 图形垂直方向对齐方式
      image: inputIcon // 图形
    }
  }
]
