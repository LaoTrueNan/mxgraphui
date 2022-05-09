<script>
import draggable from 'vuedraggable'
import render from '@/utils/generator/render'
import "../../../../dist/static/css/ladder.css"

const components = {
  itemBtns(h, element, index, parent) {
    const { copyItem, deleteItem } = this.$listeners
    return [
      <span class="drawing-item-copy" title="复制" onClick={event => {
        copyItem(element, parent); event.stopPropagation()
      }}>
        <i class="el-icon-copy-document" />
      </span>,
      <span class="drawing-item-delete" title="删除" onClick={event => {
        deleteItem(index, parent); event.stopPropagation()
      }}>
        <i class="el-icon-delete" />
      </span>
    ]
  }
}

const layouts = {
  colFormItem(h, element, index, parent) {
    const { activeItem } = this.$listeners
    let className = this.activeId === element.formId ? 'drawing-item active-from-item' : 'drawing-item'
    if (this.formConf.unFocusedComponentBorder) className += ' unfocus-bordered'
    if(element.tag=='Network'){
      return (
          <el-col span={element.span} style="padding-left:0;padding-right:0">
            <div class="rung rung-template">
              <div class="short-wire wire-left">
                <div class="wire-visible"/>
              </div>
              <div class="wire">
                <div class="wire-visible"/>
              </div>
              <div class="short-wire wire-right">
                <div class="wire-visible"/>
              </div>
            </div>
          </el-col>
      )
    }
    if(element.class==="branch"){
      return (
        <el-col span={4} style="padding-left:0;padding-right:0;margin-top:40px">
          <div class="ladder-element">
            <div class="ladder-element-bool">
              <div class="circuit-element">
                <div class="wire wire-left">
                  <div class="wire-visible"></div>
                </div>
                <div class={element.class}></div>
                <div class="wire wire-right">
                  <div class="wire-visible"></div>
                </div>
              </div>
            </div>
          </div>
        </el-col>
      )
    }
    return (
      <el-col span={4} style="padding-left:0;padding-right:0;margin-top:40px">
        <div class="ladder-element xic-template">
          <div class="ladder-element-bool">
            <div class="circuit-element">
              <div class="wire wire-left">
                <div class="wire-visible"></div>
              </div>
              <div class={element.class}></div>
              <div class="wire wire-right">
                <div class="wire-visible"></div>
              </div>
            </div>
          </div>
        </div>
      </el-col>
    )
  },
  rowFormItem(h, element, index, parent) {
    const { activeItem } = this.$listeners
    const className = this.activeId === element.formId ? 'drawing-row-item active-from-item' : 'drawing-row-item'
    let child = renderChildren.apply(this, arguments)
    if (element.type === 'flex') {
      child = <div class="xic"></div>
    }
    return (
      <el-col span={element.span} style="padding-left:0;padding-right:0">
        <draggable list={element.children} animation={340} group="componentsGroup" class="rung rung-template">
          <div class="short-wire wire-left">
            <div class="wire-visible"/>
          </div>
          {child}
          <div class="wire">
            <div class="wire-visible"/>
          </div>
          <div class="short-wire wire-right">
            <div class="wire-visible"/>
          </div>
        </draggable>
      </el-col>
    )
  }
}

function renderChildren(h, element, index, parent) {
  if (!Array.isArray(element.children)) return null
  return element.children.map((el, i) => {
    const layout = layouts[el.layout]
    if (layout) {
      return layout.call(this, h, el, i, element.children)
    }
    return layoutIsNotFound()
  })
}

function layoutIsNotFound() {
  throw new Error(`没有与${this.element.layout}匹配的layout`)
}

export default {
  components: {
    render,
    draggable
  },
  props: [
    'element',
    'index',
    'drawingList',
    'activeId',
    'formConf'
  ],
  render(h) {
    const layout = layouts[this.element.layout]

    if (layout) {
      return layout.call(this, h, this.element, this.index, this.drawingList)
    }
    return layoutIsNotFound()
  }
}
</script>
