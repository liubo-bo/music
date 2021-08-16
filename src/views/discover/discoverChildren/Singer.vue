<template>
    <div class="singercontainer">
        <div class="singer">
            <!-- 歌手分类选择 -->
            <div class="selectors">
                <div class="selectorItem">
                    <div class="title">语种：</div>
                    <second-nav-bar
                    :SecondNavBarData="languageSort"
                    @clickSecondBarItem="areaItem"
                    class="secondNavBar"
                    ></second-nav-bar>
                </div>

                <div class="selectorItem">
                    <div class="title">分类：</div>
                    <second-nav-bar
                    :SecondNavBarData="typeSort"
                    @clickSecondBarItem="typeItem"
                    class="secondNavBar"
                    ></second-nav-bar>
                </div>

                <div class="selectorItem">
                    <div class="title">筛选：</div>
                    <second-nav-bar
                    :SecondNavBarData="initialSort"
                    @clickSecondBarItem="initialItem"
                    class="secondNavBar"
                    ></second-nav-bar>
                </div>
            </div>
            <div class="listCardContainer">
                 <!-- 歌手列表 -->
                <list-card
                    class="listCar"
                    :listCardData="singerList"
                    @clickListCardItem="clickListCardItem"
                    :isLoad="true"
                    @bottomLoad="bottomLoad"
                ></list-card>
            </div>
        </div>
    </div>
</template>
<script>
import SecondNavBar from '@/components/secondNavBar/SecondNavBar.vue'
import ListCard from '@/components/main/recommend/ListCard.vue'

export default {
    name: "singer",
    components: {
        SecondNavBar,
        ListCard
    },
    data() {
        return {
            languageSort: [
                { area: -1, name: '全部' },
                { area: 7, name: '华语' },
                { area: 8, name: '欧美' },
                { area: 96, name: '日本' },
                { area: 16, name: '美国' },
                { area: 0, name: '其他' },
            ],
            typeSort:[
                { type: -1, name: '全部' },
                { type: 1, name: '男歌手' },
                { type: 2, name: '女歌手' },
                { type: 3, name: '乐队组合' },
            ],
            initialSort: [
                { initial: -1, name: '热门' },
                { initial: 0, name: '#' },
                { initial: "a", name: "A" },
                { initial: "b", name: "B" },
                { initial: "c", name: "C" },
                { initial: "d", name: "D" },
                { initial: "e", name: "E" },
                { initial: "f", name: "F" },
                { initial: "g", name: "G" },
                { initial: "h", name: "H" },
                { initial: "i", name: "I" },
                { initial: "j", name: "J" },
                { initial: "k", name: "K" },
                { initial: "l", name: "L" },
                { initial: "m", name: "M" },
                { initial: "n", name: "N" },
                { initial: "o", name: "O" },
                { initial: "p", name: "P" },
                { initial: "q", name: "Q" },
                { initial: "r", name: "R" },
                { initial: "s", name: "S" },
                { initial: "t", name: "T" },
                { initial: "u", name: "U" },
                { initial: "v", name: "V" },
                { initial: "w", name: "W" },
                { initial: "x", name: "X" },
                { initial: "y", name: "Y" },
                { initial: "z", name: "Z" },
            ],
            area: -1,
            type: -1,
            initial: -1,
            //当前所在页数
            currentPage: 1,
            singerList: [],
            isMore: false
        }
    },
    methods: {
        //请求歌手列表
        async getSingerList(){
            let res = await this.$http.get('/artist/list', {
                params: {
                    type: this.type,
                    area: this.area,
                    initial: this.initial,
                    offset: (this.currentPage - 1) * 30
                }
            });
            // let singerlist1 = res.data.artists.map(item => ({
            //     pic: item.img1v1Url,
            //     name: item.name
            // }));
            this.singerList.push(...res.data.artists);
            this.isMore = res.data.more;
        },
        //语种 分类 筛选
        areaItem(index){
            console.log(index)
            console.log(this.languageSort[index].area);
            this.area = this.languageSort[index].area;
            //清空list，请求数据
            this.singerList = [];
            this.currentPage += 1;
            this.getSingerList();
        },
        typeItem(index){
            console.log(this.typeSort[index].type)
            this.singerList = [];
            this.currentPage = 1;
            this.type = this.typeSort[index].type;
            this.getSingerList();
        },
        initialItem(index){
            console.log(this.initialSort[index].initial)
            this.singerList = [];
            this.currentPage = 1;
            this.initial = this.initialSort[index].initial;
            this.getSingerList();
        },
        clickListCardItem(id){
             this.$router.push({ name: 'singerDetail', params: { id } });
             console.log(id);
        },
        // 懒加载
        bottomLoad(){
            //  console.log("bottomLoad")
            if(this.isMore == true){
                console.log('bt')
                this.currentPage += 1;
                this.getSingerList();
            }
        }
    },
    created () {
        this.getSingerList();
    },
    mounted () {
        
    }
    
}
</script>
<style scoped>
.singercontainer{
    display: flex;
    justify-content: center;
}
.singer{
    padding: 0 10px;
    max-width: 1000px
}
.selectorItem{
    display: flex;
}
.title{
    font-size: 12px;
    width: 40px;
    line-height: 40px;
}
.secondNavBar{
    width: calc(100% -60px)
}
.listCardContainer{
    width: 100%;
    display: flex;
    justify-content: center;
}
</style>