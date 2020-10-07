<template>
  <div>
    <div style="margin-top: 10px;">
      <Select v-model="searchType" style="width:200px">
        <Option value="replyDiscussId" label="id"></Option>
        <Option value="discussId" label="回复者Id"></Option>
        <Option value="mwId" label="评论人mwId"></Option>
        <Option value="toContent" label="回复内容"></Option>
        <Option value="replyContent" label="评论内容"></Option>
      </Select>
      <Input v-model="searchContent" style="width: 200px;"/>
      <Button @click="startSearch">搜索</Button>
      <Button @click="rest">重置</Button>
    </div>
    <Table stripe :loading="loading" :columns="replyDiscussColumns" :data="replyDiscussList" style="margin-top: 10px;"></Table>
    <Page @on-change="pageChange" :page-size="pageSize" :total="total" show-elevator
          style="width: 700px;margin: 0 auto;position: relative;top: 10px;"/>
  </div>
</template>

<script>
  export default {
    name: "replyDiscussList",
    data() {
      return {
        pageSize: 5,
        searchContent: '',
        searchType: '',
        total: 0,
        loading:true,
        replyDiscussColumns: [
          {
            title: "id",
            key: "replyDiscussId"
          },
          {
            title: "回复者Id",
            key: "discussId"
          }, {
            title: "评论人mwId",
            key: "mwId"
          },
          {
            title: "回复内容",
            key: "toContent"
          },
          {
            title: "评论内容",
            key: "replyContent"
          },
          {
            title: "评论时间",
            key: "replyDiscussTime"
          },
          {
            title: "评论赞量",
            key: "replyPraiseNumber"
          },
          {
            title: "操作",
            key: 'operation',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'error',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.deleteReplyDiscuss(params);
                    }
                  }
                }, '删除')
              ])
            }
          }
        ],
        replyDiscussList: [],
        params: {
          startNum: 0,
          pageSize: 5
        }
      }
    }, methods: {
      pageChange(page) {
        this.params.startNum = (--page) * this.pageSize;
        this.getReplyDiscussList(this.params);
      },
      startSearch() {
        if (this.searchContent == '') {
          this.$Message.error("请输入要搜索的内容");
          return;
        }
        this.params.startNum = 0;
        this.params[this.searchType] = this.searchContent;
        this.getReplyDiscussCount(this.params);
        this.getReplyDiscussList(this.params);
      },
      rest() {
        this.params = {
          startNum: 0,
          pageSize: this.pageSize
        };
        this.getReplyDiscussList(this.params);
        this.getReplyDiscussCount(this.params);
      },
      getReplyDiscussList(params) {
        let _this = this;
        this.loading = true;
        _this.replyDiscussList = [];
        this.$ajax({
          url: _this.managerUrl + "/discuss/getReplyDiscussList.do",
          method: "post",
          params: params
        }).then((response) => {
          let data = response.data;
          if (data.code === 1) {
            this.loading = false;
            data = data.data;
            for (let i = 0; i < data.length; i++) {
              _this.replyDiscussList.push({
                replyDiscussId: data[i].replyDiscussId,
                discussId: data[i].discussId,
                mwId: data[i].userBaseInfo.mwId,
                toContent: data[i].toContent == null ? "" : data[i].toContent,
                replyContent: data[i].content,
                replyDiscussTime: _this.myUtils.timestampToTime(data[i].discussTime),
                replyPraiseNumber: data[i].replyPraiseNumber
              })
            }
          }
        }).catch((error) => {
        });
      },
      getReplyDiscussCount(params) {
        let _this = this;
        this.$ajax({
          url: _this.managerUrl + "/discuss/getReplyDiscussCount.do",
          method: "post",
          params: params
        }).then((response) => {
          let data = response.data;
          if (data.code === 1) {
            _this.total = data.data;
          }
        }).catch((error) => {
        });
      },
      deleteReplyDiscuss(params) {
        let replyDiscussId = params.row.replyDiscussId;
        let _this = this;
        this.$ajax({
          url: this.managerUrl + "/discuss/deleteReplyDiscuss.do",
          method: "post",
          params: {
            replyDiscussId: replyDiscussId
          }
        }).then((response) => {
          let data = response.data;
          if (data.code === 1) {
            _this.$Message.success("删除成功");
            _this.getReplyDiscussList(_this.params);
            _this.getReplyDiscussCount(_this.params);
          }
        }).catch((error) => {
        });
      }
    }, mounted() {
      this.getReplyDiscussList(this.params);
      this.getReplyDiscussCount(this.params);
    }
  }
</script>

<style scoped>

</style>
