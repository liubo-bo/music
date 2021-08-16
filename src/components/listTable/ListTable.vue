<template>
    <div class="listtablecontainer">
        <div class="musicimg">
            <img :src="cover || officialListDetailItem.coverImgUrl" alt="">
        </div>
        <div class="musiclist">
            <table>
                <tr
                    class="listrows"
                    v-for="(item, index) in 
                            (officialListDetailItem.topSongs &&
                            (officialListDetailItem.isOpen
                                ? officialListDetailItem.topSongs
                                : officialListDetailItem.topSongs.slice(0, 10))) ||
                            officialListDetailItem.songs.slice(0, 10)"
                            :key="index"
                            @click="handleRowClick"
                            @dblclick="handleRowDbClick( officialListDetailItem.id || item.id, index)
                            "
                >
                    <td class="index">{{ index + 1 }}</td>
                    <td class="musicname">{{ item.name }}</td>
                    <td class="songtime">{{ item.dt}}</td>
                </tr>
            </table>
         <div
          class="checkAll"
          v-show="isCheckAllShow"
          @click="clickCheckAll(officialListDetailItem.id)"
        >
          查看全部 <i class="iconfont el-icon-arrow-right"></i>
        </div>
        </div>
    </div>
</template>
<script>


export default {
    props: {
        officialListDetailItem: {
            type: Object,
            default() {
                return {};
            }
        },
        cover: {
            type: String,
            default() {
                return "";
            }
        },
        listId: {
            type: String,
            default() {
                return "";
            }
        },
        isCheckAllShow: {
            type: Boolean,
            default() {
                return true;
            }
        }
         
    },
    methods: {
        handleRowClick(){
            console.log(11);
        },
        handleRowDbClick(id, index){
            let listId = this.listId;
            this.$emit("handleRowDbClick", { id, index, listId });

        },
        clickCheckAll(id){
            let listId = this.listId;
            this.$emit("clickCheckAll", { id, listId})
        }
    }
    
}
</script>
<style scoped>
.listtablecontainer{
    display: flex;
    
}
.musicimg{
    width: 150px;
    height: 150px;
    margin-right: 20px;
    cursor: pointer;
}
.musicimg img{
    width: 100%;
}
.musiclist{
    width: 100%;
}
.listrows {
  height: 30px;
  font-size: 12px;
  color: rgb(153, 153, 153);
  width: 100%;
  display: flex;
  align-items: center;
  position: relative;
}
.listrows:nth-child(odd) {
  background-color: #f9f9f9;
}
.listrows:hover {
  background-color: #f4f4f4;
}

.listrows td {
  transform: scale(0.9);
}
.songtime{
    position: absolute;
    right: 10px;
}
table{
    width: 100%;border-radius: 5px;
}
.musicname{
    color: #000;
    position: absolute;
    overflow: hidden;
    width: 80%;
}
.checkAll{
    font-size: 12px;
    color: #999;
    transform: scale(0.9);

}
</style>
