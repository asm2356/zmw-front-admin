<template>
  <div>
    <div style="margin-top: 10px;">
      <Select @on-change="typeChange" v-model="searchType" style="width:200px;" ref="searchType">
        <Option v-for="(item,index) in loginHistoryColumns" v-if="item.key!='operation'" :key="index" :value="item.key" :label="item.title"></Option>
      </Select>
      <Input v-show="showSearchInput" v-model="searchContent" style="width: 250px;"/>
      <DatePicker v-show="showDatePicker" @on-change="getDate" format="yyyy/MM/dd HH:mm" type="datetimerange"
                  placeholder="请选择时间区间"
                  style="width: 250px"></DatePicker>
      <Button @click="startSearch">搜索</Button>
    </div>
    <Table stripe :loading="loading" :columns="loginHistoryColumns" :data="loginHistoryList" style="margin-top: 10px"></Table>
    <Page v-show="isShowPage" @on-change="pageChange" :page-size="pageSize" :total="total" show-elevator
          style="width: 700px;margin: 0 auto;position: relative;top: 10px;"/>
  </div>
</template>

<script>
  export default {
    name: "loginHistory",
    data() {
      return {
        pageSize: 10,
        showDatePicker: false,
        searchContent: null,
        searchType: 'id',
        total: 0,
        isShowPage: false,
        showSearchInput: true,
        loading:true,
        loginHistoryColumns: [
          {
            title: "id",
            key: "id"
          },
          {
            title: "mwId",
            key: "mwId"
          },
          {
            title: "手机号",
            key: "phone"
          },
          {
            title: "登录IP地址",
            key: "ip"
          },
          {
            title: "登录地点",
            key: "loginAddress"
          }, {
            title: "登录时间",
            key: "loginTimeText"
          },
          {
            title: "使用的浏览器",
            key: "browser"
          }, {
            title: "登录设备",
            key: "loginEquipment"
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
                      this.deleteLoginHistory(params)
                    }
                  }
                }, '删除')
              ])
            }
          }

        ],
        loginHistoryList: [],
        startTime: -1,
        endTime: -1
      }
    },
    watch: {
      showSearchInput: function (newValue, oldValue) {
        if (newValue) {
          this.startTime = -1;
          this.endTime = -1;
        }
      },
      showDatePicker: function (newValue, oldValue) {
        if (newValue) {
          this.searchContent = null;
        }
      }
    },
    mounted() {
      this.getLoginHistoryList({
        startNum: 0,
        pageSize: this.pageSize,
        loginHistoryJson: null,
        startTime: -1,
        endTime: -1
      });
      this.getLoginHistoryNumber({
        loginHistoryJson: null,
        startTime: -1,
        endTime: -1
      })
    }, methods: {
      pageChange(page) {
        let loginHistory = {};
        if (this.searchContent != null) {
          this.$set(loginHistory, this.searchType, this.searchContent)
        }
        this.getLoginHistoryList({
          startNum: (--page) * this.pageSize,
          pageSize: this.pageSize,
          loginHistoryJson: JSON.stringify(loginHistory),
          startTime: this.startTime,
          endTime: this.endTime
        });
        this.getLoginHistoryNumber({
          loginHistoryJson: JSON.stringify(loginHistory),
          startTime: this.startTime,
          endTime: this.endTime
        });
      },
      getLoginHistoryNumber(params) {
        let _this = this;
        this.$ajax({
          url: _this.managerUrl + "/loginHistory/getLoginHistoryNumber.do",
          method: "post",
          params: params
        }).then((response) => {
          let data = response.data;
          if (data.code === 1) {
            _this.total = data.data;
            _this.total > _this.pageSize ? _this.isShowPage = true : _this.isShowPage = false;
          }
        }).catch((error) => {
        });
      },
      getLoginHistoryList(params) {
        this.loading =true;
        this.loginHistoryList = [];
        let _this = this;
        this.$ajax({
          url: _this.managerUrl + "/loginHistory/getLoginHistory.do",
          method: "post",
          params: params
        }).then((response) => {
          _this.loading= false;
          let data = response.data;
          if (data.code === 1) {
            for (let i = 0; i < data.data.length; i++) {
              data.data[i].loginTimeText = _this.myUtils.timestampToTime(data.data[i].loginTime);
              _this.loginHistoryList.push(data.data[i]);
            }
          }
        }).catch((error) => {
        });
      },
      startSearch() {
        let _this = this;
        let loginHistory = {};
        if (this.searchContent != null) {
          this.$set(loginHistory, this.searchType, this.searchContent)
        } else if (this.searchContent == '') {
          this.$Message.warning("请输入要搜索的内容");
          return;
        }
        this.getLoginHistoryList({
          startNum: 0,
          pageSize: _this.pageSize,
          loginHistoryJson: JSON.stringify(loginHistory),
          startTime: _this.startTime,
          endTime: _this.endTime
        });
        this.getLoginHistoryNumber({
          loginHistoryJson: JSON.stringify(loginHistory),
          startTime: _this.startTime,
          endTime: _this.endTime
        });
      },
      typeChange(value) {
        if (value == 'loginTimeText') {
          this.showDatePicker = true;
          this.showSearchInput = false;
        } else {
          this.showDatePicker = false;
          this.showSearchInput = true;
        }
      },
      getDate(date) {
        this.startTime = new Date(date[0]).getTime();
        this.endTime = new Date(date[1]).getTime();
      },
      deleteLoginHistory(params) {
        let loginHistory = params.row;
        let _this = this;
        this.$ajax({
          url: _this.managerUrl + "/loginHistory/deleteLoginHistory.do",
          method: "post",
          params: {
            id: loginHistory.id
          }
        }).then((response) => {
          let data = response.data;
          if (data.code === 1) {
            for (let i = 0; i < _this.loginHistoryList.length; i++) {
              if (_this.loginHistoryList[i].id = loginHistory.id) {
                _this.loginHistoryList.delete(i);
                _this.startSearch();
                _this.$Message.success("删除成功");
                break;
              }
            }
          }
        }).catch((error) => {

        })
      }
    }
  }
</script>

<style scoped>


</style>
