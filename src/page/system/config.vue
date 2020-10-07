<template>
  <div>
    <div style="margin-top: 10px;">
      <Input class="search-input" v-model="key" placeholder="配置key"/>
      <Input class="search-input" v-model="value" placeholder="配置value"/>
      <Input class="search-input" v-model="describe" placeholder="配置描述"/>
      <Button @click="searchConfig">搜索</Button>
      <Button @click="addConfig">添加</Button>
    </div>
    <Table :loading="loading" stripe :columns="configColumns" :data="configList" style="margin-top: 10px;"></Table>
    <Page v-show="pageSize<configNumber" @on-change="pageChange" :page-size="pageSize" :total="configNumber"
          show-elevator
          style="width: 700px;margin: 0 auto;position: relative;top: 10px;"/>
  </div>
</template>

<script>
  export default {
    name: "config",
    data() {
      return {
        startNum: 0,
        pageSize: 10,
        loading: false,
        key: null,
        value: null,
        describe: null,
        configColumns: [
          {
            title: 'key',
            key: 'key'
          },
          {
            title: 'value',
            key: 'value'
          },
          {
            title: '描述',
            key: 'describe'
          }, {
            title: "操作",
            key: "operation",
            width: 120,
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'error',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.deleteConfig(params)
                    }
                  }
                }, '删除')
              ])
            }
          }
        ], configList: [],
        configNumber: 0
      }
    }, mounted() {
      this.getConfigNumber();
      this.getConfigList();
    },
    methods: {
      deleteConfig(result) {
        let _this = this;
        let config = result.row;
        this.$ajax({
          url: _this.managerUrl + "/config/deleteConfig.do",
          method: "post",
          params: {
            key: config.key
          }
        }).then((response) => {
          let data = response.data;
          if (data.code === 1) {
            _this.$Message.success("删除成功");
            _this.searchConfig();
          }
        }).catch((error) => {
        });
      },
      addConfig() {
        let _this = this;
        if (this.key == null || this.key == '') {
          this.$Message.error("请输入key");
          return;
        }
        if (this.value == null || this.value == '') {
          this.$Message.error("请输入value");
          return;
        }
        this.$ajax({
          url: _this.managerUrl + "/config/addConfig.do",
          method: "post",
          params: {
            key: _this.key,
            value: _this.value,
            describe: _this.describe
          }
        }).then((response) => {
          let data = response.data;
          if (data.code === 1) {
            _this.$Message.success("添加成功");
            _this.key = null;
            _this.value = null;
            _this.describe = null;
            _this.searchConfig();
          }
        }).catch((error) => {

        });
      },
      pageChange(page) {
        this.startNum = (--page) * this.pageSize;
        this.getConfigList();
      },
      getConfigNumber() {
        let _this = this;
        this.$ajax({
          url: _this.managerUrl + "/config/getConfigNumber.do",
          method: "post",
          params: {
            startNum: _this.startNum,
            pageSize: _this.pageSize,
            key: _this.key,
            value: _this.value,
            describe: _this.describe
          }
        }).then((response) => {
          let data = response.data;
          if (data.code === 1) {
            _this.configNumber = data.data;
          }
        }).catch((error) => {
        });
      },
      getConfigList() {
        this.loading = true;
        this.configList = [];
        let _this = this;
        this.$ajax({
          url: _this.managerUrl + "/config/getConfigList.do",
          method: "post",
          params: {
            startNum: _this.startNum,
            pageSize: _this.pageSize,
            key:_this.myUtils.trim(_this.key),
            value: _this.myUtils.trim(_this.value),
            describe: _this.myUtils.trim(_this.describe)
          }
        }).then((response) => {
          this.loading = false;
          let data = response.data;
          if (data.code === 1) {
            _this.configList = data.data;
          }
        }).catch((error) => {

        });
      },
      searchConfig() {
        this.getConfigNumber();
        this.getConfigList();
      }
    }
  }
</script>

<style scoped>
  .search-input {
    width: 200px;
  }
</style>
