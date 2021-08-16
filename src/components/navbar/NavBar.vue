<template>
<div class="navbarcontainer">
    <div class="navbar">
      <div
      class="barItem"
      :class="index == activeNum ? 'active':''"
      v-for="(item, index) in navList"
      :key="index"
      @click="clickBarItem(item.path, index)"
      >
        {{item.name}}
      </div>
    </div>
</div>
</template>

<script>
export default {
  data() {
    return {
     activeNum: 0
    }
  },
  props: {
    navList: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  methods: {
    clickBarItem(path, index){
      this.activeNum = index;
      this.$emit('clickBarItem', path);
      this.isClick = true;
    },
    //初始化路径时，定位到recommend
    // navactive(path){
    //   if(path === this.$router.path){
    //     return true;
    //   }
    //   if(path === '/recommend' && this.$router.path === '/'){
    //     return true;
    //   }
    //   return false;
    // }
  }
}
</script>
<style scoped>
.navbarcontainer{
  height: 60px;
  width: 100%;
}
.navbar{
  display: flex;
  width: 100%;
  align-items: center;
  padding: 10px 0 20px 20px;
}
.barItem{
  font-size: 13px;
  margin: 0 10px;
  text-align: center;
  cursor: pointer;
}
.active{
  font-size: 16px;
  color: black;
  font-weight: 600;
  padding-bottom: 5px;
  border-bottom: 3px solid #ec4141;
  transform: translateY(4px);
}
</style>
