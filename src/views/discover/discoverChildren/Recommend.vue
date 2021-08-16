<template>
    <div class="recommend">
        <my-swiper
            :swiper-list="swiperList"
        />
            <h3>推荐歌单 
                <i class="ifonfont el-icon-arrow-right"></i>
            </h3>
            <list-card
            :listCardData="topsongList"
            @clickListCardItem="clickListCardItem"
        />
        
    </div>
</template>

<script>
import MySwiper from '@/components/main/recommend/MySwiper.vue'
import ListCard from '@/components/main/recommend/ListCard.vue'

export default {
    components: {
        MySwiper,
        ListCard
    },
    data() {
        return {
            swiperList: [],
            topsongList: [],
            //轮播图参数通过父组件传给子组件
            // swiperOption: {
            //     pagination: {
            //     el: '.swiper-pagination'
            //     },
            //     loop: true,
            //     autoplay: true
            // },
        }
    },
    created() {
        this.fetchSwiperList();
        this.fetchTopsongList();
    },
    methods: {
        async fetchSwiperList() {
            const res = await this.$http.get('/banner');
            this.swiperList = res.data.banners.map(item => ({img: item.imageUrl}));
        },
        async fetchTopsongList() {
            const res = await this.$http.get('/personalized', {
                params: {
                    limit: 10
                }
            });
            this.topsongList = res.data.result.map(item => ({
                pic: item.picUrl,
                name: item.name,
                id: item.id
                }));
             
        },
        clickListCardItem(id){
            this.$router.push({ name: "musicListDetail", params: { id } });
        }
    }
}
</script>
<style scoped>
.recommend{
    margin-top: 0;
}
/* h3{
    padding-left: 200px;
} */
</style>