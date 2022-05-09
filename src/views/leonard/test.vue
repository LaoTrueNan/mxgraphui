<template>
  <div class="app-content">
    <div id="graph" class="base">
      <!-- Graph Here -->
    </div>
    <div id="status" class="base" align="right" style="white-space:nowrap;">
      <!-- Status Here -->
    </div>
  </div>
</template>
<script>
import $ from 'jquery'
import '@/api/leonard/testCall'
export default {
  name:'testEditor',
  data(){
    return {

    }
  },
  methods:{},
  mounted() {
    $.initEditor('workfloweditor')
  },
  created() {
  },

}
</script>
