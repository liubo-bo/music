<template>
    <div class="circulationsingercontainer">
        <div class="circulationsinger">
            <div v-if="count != 0">
                <div class="title">收藏的歌手{{count}}</div>
                <list-card
                    :listCardData="circulationSingerList"
                    @clickListCardItem="clickListCardItem"
                >
                </list-card>
            </div>
            <div v-else>
                <span>暂无收藏歌手</span>
            </div>
        </div>
    </div>
</template>
<script>
import ListCard from '@/components/main/recommend/ListCard'

export default {
    components: {
        ListCard
    },
    data () {
        return {
            count: 0,
            circulationSingerList: [],
        }
    },
    methods: {
        //获取收藏歌手列表
        async getCirculationSingerList(){
            let timestamp = Date.parse(new Date());
            let res = await this.$http.get('/artist/sublist', {
                params: {
                    timestamp,
                }
            });
            //console.log(res);
            this.circulationSingerList = res.data.data;
            this.count = res.data.count;
        },
        clickListCardItem(id){
            this.$router.push({name: "singerDetail", params: { id } });
        }
    },
    created () {
        this.getCirculationSingerList();
    }
}
</script>