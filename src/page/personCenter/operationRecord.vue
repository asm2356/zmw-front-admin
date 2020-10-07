<template>
  <div>
    <div style="margin-top: 10px;">
      <Select @on-change="typeChange" v-model="searchType" style="width:200px">
        <Option v-for="(item,index) in opLogColumns" v-if="item.key!='operation'"
                :value="item.key" :label="item.title" :key="index">
        </Option>
      </Select>
      <Input v-show="showSearchInput" v-model="searchContent" style="width: 250px;"/>
      <DatePicker v-show="showDatePicker" @on-change="getDate" format="yyyy/MM/dd HH:mm" type="datetimerange"
                  placeholder="请选择时间区间"
                  style="width: 250px"></DatePicker>
      <Button @click="startSearch">搜索</Button>
      <Button @click="reset">重置</Button>
    </div>
    <Table stripe :loading="loading" :columns="opLogColumns" :data="opLogList" style="margin-top: 10px;"></Table>
    <Page v-show="showPage" @on-change="pageChange" :page-size="pageSize" :total="total" show-elevator
          style="width: 700px;margin: 0 auto;position: relative;top: 10px;"/>
  </div>
</template>

<script>
  export default {
    name: "operationRecord",
    data() {
      return {
        showPage: false,
        startTime: null,
        endTime: null,
        showSearchInput: true,
        showDatePicker: false,
        searchType: 'describe',
        searchContent: '',
        pageSize: 10,
        currentPage: 1,
        total: 0,
        loading: true,
        opLogColumns: [{
          title: 'id',
          key: 'id'
        },
          {
            title: '操作说明',
            key: 'describe'
          },
          {
            title: '操作时间',
            key: 'opTimeText'
          },
          {
            title: '操作方法',
            key: 'method'
          }, {
            title: '操作者IP',
            key: 'remoteIP'
          },
          {
            title: '请求参数',
            key: 'inputParams'
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
                      this.deleteOpLog(params);
                    }
                  }
                }, '删除')
              ])
            }
          }],
        opLogList: [],
        condition: null//当前的搜索条件
      }
    },
    watch: {
      showSearchInput: function (newValue, oldValue) {
        if (newValue) {
          this.startTime = null;
          this.endTime = null;
        }
      },
      showDatePicker: function (newValue, oldValue) {
        if (newValue) {
          this.searchContent = null;
        }
      }
    },
    mounted() {
      this.reset();
    },
    methods: {
      getDate(date) {
        this.startTime = new Date(date[0]).getTime();
        this.endTime = new Date(date[1]).getTime();
      },
      typeChange(value) {
        if (value == 'opTimeText') {
          this.showDatePicker = true;
          this.showSearchInput = false;
        } else {
          this.showDatePicker = false;
          this.showSearchInput = true;
        }
      },
      pageChange(page) {
        this.currentPage = page;
        this.getOpLogList(page, this.condition);
      },
      startSearch() {
        this.condition = {};
        if (this.searchType == 'opTimeText') {
          //按照时间搜索
          this.condition = {
            time: {
              startTime: this.startTime,
              endTime: this.endTime
            }
          }
        } else {
          //其他属性搜索
          if (this.searchContent == '') {
            this.$Message.warning("请输入搜索内容");
            return;
          }
          this.$set(this.condition, this.searchType, this.searchContent);
        }
        this.getOpLogList(this.currentPage, this.condition);
        this.getOpLogNumber(this.condition);
      },
      getOpLogList(page, condition) {
        this.loading = true;
        let params = {
          startNum: (--page) * this.pageSize,
          pageSize: this.pageSize,
          condition: condition != null ? condition = JSON.stringify(condition) : null
        };
        let _this = this;
        _this.opLogList = [];
        this.$ajax({
          url: _this.managerUrl + "/opLog/getOpLog.do",
          method: "post",
          params: params
        }).then((response) => {
          _this.loading = false;
          let data = response.data;
          if (data.code === 1) {
            data = data.data;
            for (let i = 0; i < data.length; i++) {
              _this.$set(data[i], "opTimeText", _this.myUtils.timestampToTime(data[i].opTime));
              _this.opLogList.push(data[i]);
            }
          }
        }).catch((error) => {
        });
      },
      reset() {
        this.getOpLogNumber(null);
        this.getOpLogList(1, null);
      },
      deleteOpLog(params) {
        let id = params.row.id;
        let _this = this;
        _this.$ajax({
          url: _this.managerUrl + "/opLog/deleteOpLog.do",
          method: "post",
          params: {
            id: id
          }
        }).then((response) => {
          let data = response.data;
          if (data.code === 1) {
            if (data.data == 1) {
              _this.$Message.success("删除成功");
              _this.getOpLogList(_this.currentPage, _this.condition);
              _this.getOpLogNumber( _this.condition);
            } else {
              _this.$Message.warning("删除失败");
            }
          }
        }).catch((error) => {
        });
      },
      getOpLogNumber(condition) {
        let _this = this;
        this.$ajax({
          url: _this.managerUrl + "/opLog/getOpLogNumber.do",
          method: "post",
          params: {
            condition: condition != null ? condition = JSON.stringify(condition) : null
          }
        }).then((response) => {
          let data = response.data;
          if (data.code === 1) {
            _this.total = data.data;
            _this.total >= _this.pageSize ? _this.showPage = true : _this.showPage = false;
          }
        }).catch((error) => {

        })
      }
    }
  }
</script>

<style scoped>

</style>
