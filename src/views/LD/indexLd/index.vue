<template>
<h2>hello world</h2>
  
</template>

<script>

import Treeselect from "@riophae/vue-treeselect";

export default {
  name:"index",
  dicts:["sys_normal_disable",],
  components:{Treeselect},
  data(){
    return {

    };
  },
  created(){

  },
  methods:{
    /** 查询部门列表 */
    getList() {
      this.loading = true;
      listDept(this.queryParams).then(response => {
        this.deptList = this.handleTree(response.data, "deptId");
        this.loading = false;
      });
    },

  },
};

</script>
