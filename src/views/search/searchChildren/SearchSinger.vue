<template>
    <div class="searchsinger">
        <div class="title">找到 {{singerCount}} 位歌手</div>
        <list-card
            :listCardData="searchSingerList"
            @clickListCardItem="clickListCardItem"
            :isLoad="true"
            @bottomLoad="bottomLoad"
        ></list-card>
    </div>
</template>
<script>
import ListCard from '@/components/main/recommend/ListCard.vue';

export default {
    components: {
        ListCard,
    },
    data () {
        return {
            singerCount:0,
            searchSingerList: [],
            currentPage: 1,
        }
    },
    methods: {
        async getSearchSinger(){
            let res = await this.$http.get('/cloudsearch', {
                params: {
                    keywords: this.$route.params.id,
                    offset: 30 * (this.currentPage - 1),
                    type: 100
                }
            });
            console.log(res);
            this.singerCount = res.data.result.artistCount;
            this.searchSingerList.push(...res.data.result.artists);

        },
        clickListCardItem(id){
            this.$router.push({name: 'singerDetail', params: { id }});
        },
        //触底加载
        bottomLoad(){
            this.currentPage += 1;
            this.getSearchSinger();
        }
    },
    created () {
        this.getSearchSinger();
    }
}
</script>
<style scoped>
.searchsinger{
    margin: 20px;
}
</style>