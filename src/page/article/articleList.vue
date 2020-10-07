<template>
  <div>
    <div style="margin-top: 10px;">
      <Select @on-change="typeChange" v-model="searchType" style="width:200px">
        <Option value="id" label="id"></Option>
        <Option value="mwId" label="mwId"></Option>
        <Option value="title" label="文章标题"></Option>
        <Option value="releaseTime" label="发布时间"></Option>
      </Select>
      <Input v-show="showSearchInput" v-model="searchContent" style="width: 250px;"/>
      <DatePicker v-show="showDatePicker" @on-change="getDate" format="yyyy/MM/dd HH:mm" type="datetimerange"
                  placeholder="请选择时间区间"
                  style="width: 250px"></DatePicker>
      <Button @click="startSearch">搜索</Button>
      <Button @click="reset">重置</Button>
    </div>
    <Table stripe :loading="loading" :columns="articleColumns" :data="articleList" style="margin-top: 10px;"></Table>
    <Page v-show="showPage" @on-change="pageChange" :page-size="pageSize" :total="total" show-elevator
          style="width: 700px;margin: 0 auto;position: relative;top: 10px;"/>
  </div>
</template>

<script>

  export default {
    name: "articleList",
    data() {
      return {
        showSearchInput: true,
        showDatePicker: false,
        loading: true,
        pageSize: 10,
        searchType: 'id',
        searchContent: '',
        articleColumns: [{
          title: "id",
          key: "id"
        },
          {
            title: "mwId",
            key: "mwId"
          },
          {
            title: "文章标题",
            key: "articleTitle"
          },
          {
            title: "点赞数",
            key: "praiseNumber"
          }, {
            title: "评论数",
            key: "commentNumber"
          },
          {
            title: "发布时间",
            key: "releaseTimeText"
          }, {
            title: "操作",
            key: "operation",
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'error',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.deleteArticle(params)
                    }
                  }
                }, '删除')
              ])
            }
          }
        ],
        articleList: [],
        startTime: -1,
        endTime: -1,
        total: 0,
        showPage: false
      }
    },
    mounted() {
      this.reset();
    },
    methods: {
      reset() {
        this.getArticleNumber({}).then((response) => {
          if (response.code == 1) {
            this.getArticleList({
              startNum: 0,
              pageSize: this.pageSize
            });
          }
        });
      },
      getDate(date) {
        this.startTime = new Date(date[0]).getTime();
        this.endTime = new Date(date[1]).getTime();
      },
      typeChange(value) {
        if (value == 'releaseTime') {
          this.showDatePicker = true;
          this.showSearchInput = false;
        } else {
          this.showDatePicker = false;
          this.showSearchInput = true;
        }
      },
      pageChange(page) {
        this.getArticleList({
          startNum: (--page) * this.pageSize,
          pageSize: this.pageSize
        });
      },
      getArticleList(params) {
        this.loading = true;
        this.articleList = [];
        let _this = this;
        this.$ajax({
          url: _this.managerUrl + "/article/getArticleList.do",
          method: "post",
          params: params
        }).then((response) => {
          _this.loading = false;
          let data = response.data;
          if (data.code === 1) {
            data = data.data;
            for (let i = 0; i < data.length; i++) {
              _this.articleList.push({
                id: data[i].articleId,
                mwId: data[i].userBaseInfo.mwId,
                articleTitle: data[i].title,
                praiseNumber: data[i].praiseNumber,
                commentNumber: data[i].commentNumber,
                releaseTime: data[i].releaseTime,
                releaseTimeText: _this.myUtils.timestampToTime(data[i].releaseTime)
              })
            }
          }
        }).catch((error) => {
        });
      },
      getArticleNumber(params) {
        let _this = this;
        return new Promise((resolve, reject) => {
          _this.$ajax({
            url: _this.managerUrl + "/article/getArticleNumber.do",
            method: "post",
            params: params
          }).then((response) => {
            let data = response.data;
            if (data.code === 1) {
              resolve(data);
              _this.total = data.data;
              _this.total > _this.pageSize ? _this.showPage = true : _this.showPage = false;
            }
          }).catch((error) => {
            reject(error);
          });
        });

      },
      startSearch() {
        if (this.searchContent == '') {
          this.$Message.error("请输入要搜索的内容");
          return;
        }
        if (this.searchType == "id") {
          this.getArticle(this.searchContent);
        } else if (this.searchType == "releaseTime") {
          let params ={
            startNum: 0,
            pageSize: this.pageSize,
            startTime: this.startTime,
            endTime: this.endTime
          };
          this.getArticleNumber(params).then((response) => {
            if (response.code == 1) {
              this.getArticleList(params);
            }
          });
        } else {
          let params = {
            startNum: 0,
            pageSize: this.pageSize
          };
          params[this.searchType] = this.searchContent;
          this.getArticleList(params);
          this.getArticleNumber(params).then((response) => {
            if (response.code == 1) {
              this.getArticleList(params);
            }
          });
        }
      },
      deleteArticle(params) {
        let articleId = params.row.id
        this.articleList = [];
        let _this = this;
        this.$ajax({
          url: _this.managerUrl + "/article/deleteArticle.do",
          method: "post",
          params: {
            articleId: articleId
          }
        }).then((response) => {
          let data = response.data;
          if (data.code === 1) {
            _this.startSearch();
            _this.$Message.info("删除成功");
          }
        }).catch((error) => {
        });
      },
      getArticle(articleId) {
        this.articleList = [];
        let _this = this;
        this.$ajax({
          url: _this.managerUrl + "/article/getArticle.do",
          method: "post",
          params: {
            articleId: articleId
          }
        }).then((response) => {
          let data = response.data;
          if (data.code === 1) {
            data = data.data;
            _this.articleList.push({
              id: data.articleId,
              mwId: data.userBaseInfo.mwId,
              articleTitle: data.title,
              praiseNumber: data.praiseNumber,
              commentNumber: data.commentNumber,
              releaseTime: data.releaseTime,
              releaseTimeText: _this.myUtils.timestampToTime(data.releaseTime)
            });
            _this.showPage = false;
            _this.total = 1;
          }
        }).catch((error) => {
        });
      }
    }
  }
</script>

<style scoped>

</style>
