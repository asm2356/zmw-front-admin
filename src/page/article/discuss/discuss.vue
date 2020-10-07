<template>
  <div>
    <div style="margin-top: 10px;">
      <Select v-model="searchType" style="width:200px">
        <Option value="discussId" label="id"></Option>
        <Option value="articleId" label="文章Id"></Option>
        <Option value="content" label="评论内容"></Option>
        <Option value="mwId" label="评论者Id"></Option>
      </Select>
      <Input v-model="searchContent" style="width: 200px;"/>
      <Button @click="startSearch">搜索</Button>
      <Button @click="rest">重置</Button>
    </div>
    <Table stripe  :loading="loading" :columns="discussColumns" :data="discussList" style="margin-top: 10px;"></Table>
    <Page @on-change="pageChange" :page-size="pageSize" :total="total" show-elevator
          style="width: 700px;margin: 0 auto;position: relative;top: 10px;"/>
  </div>
</template>

<script>
  export default {
    name: "discussList",
    data() {
      return {
        pageSize: 5,
        searchContent: '',
        searchType: '',
        total: 0,
        loading:true,
        discussColumns: [
          {
            title: "id",
            key: "discussId"
          },
          {
            title: "文章的Id",
            key: "articleId"
          },
          {
            title: "评论内容",
            key: "commentContent"
          },
          {
            title: "评论人mwId",
            key: "commentPerson"
          },
          {
            title: "评论时间",
            key: "commentTime"
          },
          {
            title: "评论赞量",
            key: "praiseNumber"
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
                      this.deleteDiscuss(params)
                    }
                  }
                }, '删除')
              ])
            }
          }
        ],
        discussList: [],
        params: {
          startNum: 0,
          pageSize: 5
        }
      }
    },
    methods: {
      pageChange(page) {
        this.params.startNum = (--page) * this.pageSize;
        this.getDiscussList(this.params);
      },
      startSearch() {
        if (this.searchContent == '') {
          this.$Message.error("请输入要搜索的内容");
          return;
        }
        this.params.startNum = 0;
        this.params[this.searchType] = this.searchContent;
        this.getDiscussCount(this.params);
        this.getDiscussList(this.params);
      },
      rest() {
        this.params = {
          startNum: 0,
          pageSize: this.pageSize
        };
        this.discussList = [];
        this.getDiscussList(this.params);
        this.getDiscussCount(this.params);
      },
      getDiscussList(params) {
        let _this = this;
        this.loading = true;
        _this.discussList = [];
        this.$ajax({
          url: this.managerUrl + "/discuss/getOnlyDiscussList.do",
          method: "post",
          params: params
        }).then((response) => {
          let data = response.data;
          if (data.code === 1) {
            _this.loading = false;
            data = data.data;
            for (let i = 0; i < data.length; i++) {
              _this.discussList.push({
                discussId: data[i].discussId,
                articleId: data[i].articleId,
                commentContent: data[i].content,
                commentPerson: data[i].userBaseInfo.mwId,
                commentTime: _this.myUtils.timestampToTime(data[i].discussTime),
                praiseNumber: data[i].praiseNumber
              });
            }
          }
        }).catch((error) => {
        });
      },
      getDiscussCount(params) {
        let _this = this;
        this.$ajax({
          url: this.managerUrl + "/discuss/getOnlyDiscussCount.do",
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
      deleteDiscuss(params) {
        let discussId = params.row.discussId;
        let _this = this;
        this.$ajax({
          url: this.managerUrl + "/discuss/deleteDiscuss.do",
          method: "post",
          params: {
            discussId: discussId
          }
        }).then((response) => {
          let data = response.data;
          if (data.code === 1) {
            _this.$Message.success("删除成功");
            _this.getDiscussList(_this.params);
            _this.getDiscussCount(_this.params);
          }
        }).catch((error) => {
        });
      }
    },
    mounted() {
      this.getDiscussList(this.params);
      this.getDiscussCount(this.params);
    }
  }
</script>
<style scoped>
</style>
