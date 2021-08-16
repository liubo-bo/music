<template>
    <div class="myswiper">
        <!-- 轮播插件 -->
        <!-- <swiper :options="swiperOption" v-if="swiperList.length">
            <swiper-slide v-for="(item, index) of swiperList"
            :key="index">
                <img :src="item.img" alt="233">
            </swiper-slide>
            <div class="swiper-pagination" slot="pagination"></div>
        </swiper> -->
        <div class="carousel">
            <el-carousel height="180px" type="card" :interval="3000">
                <el-carousel-item
                    v-for="(item, index) of swiperList"
                    :key="index"
                >
                    <img :src="item.img" alt="">
                </el-carousel-item>
            </el-carousel>
        </div>
    </div>
</template>
<script>
//import 'swiper/swiper-bundle.css'
 
//import { swiper, swiperSlide } from 'vue-awesome-swiper'

export default {
    props: {
        swiperList:{
            type: Array,
            required: true
        },
        // swiperOption:{
        //     type: Object,
        //     required: true
        // }
    },
    components: {
        // swiper,
        // swiperSlide
    }
}
</script>

<style scoped>
/* .myswiper{
    display: flex;
}
swiper{
justify-content: center;
flex: 1;
}
img{
    width: 60%;
    height: 200px;
    margin-left: 20%;
} */
.carousel{
    width: 100%;
}
.el-carousel{
    margin: auto;
    width: 800px;
}
.el-carousel__item{
    border-radius: 10px;
}
.el-carousel__item img{
    height: 100%;
}
</style>
