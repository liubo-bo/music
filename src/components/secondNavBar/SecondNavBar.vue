<template>
    <div class="secondnavbar">
        <div
        class="barItem"
        :class="index == activeNum ? 'active':''"
        v-for="(item, index) in SecondNavBarData"
        :key="index"
        @click="clickSecondBarItem(index)"
        >
        {{item.name}}
        </div>
    </div>
</template>
<script>
export default {
    data () {
        return {
            activeNum: 0
        }
    },
    props: {
        SecondNavBarData:{
            type: Array
        },
        itemWidth: {
            type: Number
        },
        currentTag: {
            type: Object
        }
    },
    methods: {
        clickSecondBarItem(index){
            this.activeNum = index;
            this.$emit("clickSecondBarItem", index);
        }
    }
}
</script>
<style scoped>
.secondnavbar{
    width: 100%;
    display: flex;
    flex-wrap: wrap;
}
.barItem{
    width: 60px;
    font-size: 12px;
    text-align: center;
    line-height: 34px;
    margin: 4px -2px;
    transform: scale(0.9, 0.9);
    cursor: pointer;
}
.active{
    background-color: #fdf5f5;
    color: #ec4747;
    border-radius: 11px;
}
</style>