<template>
    <div 
    >
        <ul
        class="listcard"
        v-infinite-scroll='load'
        :infinite-scroll-disabled="disabled"
        :infinite-scroll-distance="20"
        infinite-scroll-immediate="false"
        ref="listCard">
            <li v-for="(item, index) of listCardData"
            class="listcardItem"
            :key="index"    
            @click="clickListCardItem(item.id)"
            >
             <div class="picsong">
                <img :src="(item.pic || item.picUrl || item.coverImgUrl)" alt="fail">
                <span class="title">{{item.name}}</span>
             </div> 
            </li>
        </ul>
    </div>
</template>
<script>
export default {
    props: {
        listCardData: {
            type: Array,
            default() {
                return [];
            }
        },
        isLoad: {
            type: Boolean,
            default() {
                return false;
            }
        }
    },
    data () {
        return {
            //无线滚动是否可用
            disabled: true
        }
    },
    methods: {
        clickListCardItem(id){
            this.$emit('clickListCardItem', id);
        },
        //上拉触底触发
        load() {
            this.$emit('bottomLoad');
            //触发load加载数据，
            this.disabled = true;
            console.log("触底了,正在加载下一组数据");
        },
    },
    watch: {
        // 数据更新后，再次运行触发load事件,false直行，true不执行
        listCardData() {
            if(this.isLoad == true){
                if(this.listCardData.length != 0){
                    this.disabled = false;
                }else{
                    this.disabled = true;
                }
            }
        }
    }
}
</script>
<style scoped>
.listcard{
    display: flex;
    flex-wrap: wrap;
}
ul{
    display: flex;
    flex-wrap: wrap;
    margin: 10px 0;
    justify-content: space-between;
}
li{
   width: 18%;
   margin-top: 0 2% 20px 0;  
}
img{
    width: 100%;
    height: 100%;
    border-radius: 10%;
}
.title{
    font-size: 12px;
}
</style>