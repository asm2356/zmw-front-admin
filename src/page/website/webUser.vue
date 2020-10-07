<template>
  <div>
    <Tabs @on-click="tabClick">
      <TabPane label="用户活跃率" name="tab1">
        <div class="date-filter">
          <span v-for="(item,index) in timeList"
                :class="{'timeSelect':currentTimeClass==index,'timeUnSelect':currentTimeClass!=index}"
                @click="timeSelect(item,index)">{{item.text}}</span>
        </div>
        <div id="tab1" class="tab"></div>
      </TabPane>
      <TabPane label="新增用户量" name="tab2">
        <div class="date-filter">
          <span v-for="(item,index) in timeList"
                :class="{'timeSelect':currentTimeClass==index,'timeUnSelect':currentTimeClass!=index}"
                @click="timeSelect(item,index)">{{item.text}}</span>
        </div>
        <div id="tab2" class="tab"></div>
      </TabPane>
      <TabPane label="总用户量用户" name="tab3">
        <div class="date-filter">
          <span v-for="(item,index) in timeList"
                :class="{'timeSelect':currentTimeClass==index,'timeUnSelect':currentTimeClass!=index}"
                @click="timeSelect(item,index)">{{item.text}}</span>
        </div>
        <div id="tab3" class="tab"></div>
      </TabPane>
      <TabPane label="活跃率排行" name="tab4">
        <div id="tab4" class="tab"></div>
      </TabPane>
    </Tabs>
  </div>
</template>

<script>

  export default {
    name: "user",
    data() {
      return {
        currentTimeClass: "",
        currentTimeType: 1,
        currentTabIndex: "tab1",
        rankingNumber: 10,
        timeList: [{id: 1, text: '近一周'}, {id: 2, text: '近一月'}, {id: 3, text: '近三月'}, {id: 4, text: '近一年'}]
      }
    },
    mounted() {
      this.getActivityRate(1);
    },
    methods: {
      parseStatisticsData(timeType, data) {
        let date = [];
        let count = [];
        for (let i = 0; i < data.length; i++) {
          if (timeType == 1) {
            date.push(this.myUtils.timestampToDate(data[i].date));
          } else if (timeType == 2 || timeType == 3) {
            date.push("第" + data[i].week + "周");
          } else if (timeType == 4) {
            let newDate = new Date(parseInt(data[i].date));
            let Y = newDate.getFullYear() + '-';
            let M = (newDate.getMonth() + 1 < 10 ? '0' + (newDate.getMonth() + 1) : newDate.getMonth() + 1);
            date.push(Y + M);
          }
          count.push(data[i].count);
        }
        return [date, count]
      },
      getActivityRate(timeType) {
        let _this = this;
        _this.$ajax({
          url: _this.managerUrl + "/webUser/getActivityRate.do",
          method: "post",
          params: {
            timeType: timeType
          }
        }).then((response) => {
          let data = response.data;
          if (data.code === 1) {
            let myChart = this.echarts.init(document.getElementById("tab1"));
            data = data.data;
            let date;
            let count;
            [date, count] = this.parseStatisticsData(timeType, data);
            let option = {
              tooltip: {
                noDataLoadingOption: {
                  text: '暂无数据',
                  effect: 'bubble'
                },
                trigger: 'axis',
                padding: [2, 5, 2, 5],
                backgroundColor: "#FFF",
                textStyle: {
                  color: "#000"
                },
                borderColor: "#ffc234",
                borderWidth: 2,
                formatter: function (params, ticket, callback) {
                  let html = "";
                  for (let i = 0; i < params.length; i++) {
                    html += '<p>用户活跃数  ' + params[i].data + '</p>'
                  }
                  return html;
                }
              },
              xAxis: {
                type: 'category',
                data: date
              },
              yAxis: {
                type: 'value',
                axisLine: {
                  show: true,
                  symbol: ['none', 'arrow'],
                  symbolSize: [8, 8],
                  symbolOffset: [0, 7]
                }
              },
              series: [{
                data: count,
                type: 'line',
                axisLine: {
                  show: true,
                  symbol: ['none', 'arrow'],
                  symbolSize: [8, 8],
                  symbolOffset: [0, 7]
                }
              }]
            };
            myChart.setOption(option);
          }
        }).catch((error) => {
        });
      },
      getAddUser(timeType) {
        let _this = this;
        _this.$ajax({
          url: _this.managerUrl + "/webUser/getAddUser.do",
          method: "post",
          params: {
            timeType: timeType
          }
        }).then((response) => {
          let data = response.data;
          if (data.code === 1) {
            let myChart = this.echarts.init(document.getElementById("tab2"));
            data = data.data;
            let date;
            let count;
            [date, count] = this.parseStatisticsData(timeType, data);
            let option = {
              tooltip: {
                trigger: 'axis',
                padding: [2, 5, 2, 5],
                backgroundColor: "#FFF",
                textStyle: {
                  color: "#000"
                },
                borderColor: "#ffc234",
                borderWidth: 2,
                formatter: function (params, ticket, callback) {
                  let html = "";
                  for (let i = 0; i < params.length; i++) {
                    html += '<p>新增用户数  ' + params[i].data + '</p>'
                  }
                  return html;
                }
              },
              xAxis: {
                type: 'category',
                data: date,
                axisLine: {
                  show: true,
                  symbol: ['none', 'arrow'],
                  symbolSize: [8, 8],
                  symbolOffset: [0, 7]
                }
              },
              yAxis: {
                type: 'value',
                axisLine: {
                  show: true,
                  symbol: ['none', 'arrow'],
                  symbolSize: [8, 8],
                  symbolOffset: [0, 7]
                }
              },
              series: [{
                data: count,
                type: 'line'
              }]
            };
            myChart.setOption(option);
          }
        }).catch((error) => {
        });
      },
      getUserSum(timeType) {
        let _this = this;
        _this.$ajax({
          url: _this.managerUrl + "/webUser/getUserSum.do",
          method: "post",
          params: {
            timeType: timeType
          }
        }).then((response) => {
          let data = response.data;
          if (data.code === 1) {
            let myChart = this.echarts.init(document.getElementById("tab3"));
            data = data.data;
            let date;
            let count;
            [date, count] = this.parseStatisticsData(timeType, data);
            let option = {
              tooltip: {
                trigger: 'axis',
                padding: [2, 5, 2, 5],
                backgroundColor: "#FFF",
                textStyle: {
                  color: "#000"
                },
                borderColor: "#ffc234",
                borderWidth: 2,
                formatter: function (params, ticket, callback) {
                  let html = "";
                  for (let i = 0; i < params.length; i++) {
                    html += '<p>总用户数  ' + params[i].data + '</p>'
                  }
                  return html;
                }
              },
              xAxis: {
                type: 'category',
                data: date,
                axisLine: {
                  show: true,
                  symbol: ['none', 'arrow'],
                  symbolSize: [8, 8],
                  symbolOffset: [0, 7]
                }
              },
              yAxis: {
                type: 'value',
                axisLine: {
                  show: true,
                  symbol: ['none', 'arrow'],
                  symbolSize: [8, 8],
                  symbolOffset: [0, 7]
                }
              },
              series: [{
                data: count,
                type: 'line'
              }]
            };
            myChart.setOption(option);
          }
        }).catch((error) => {
        });
      },
      getActivityRanking(number) {
        let _this = this;
        _this.$ajax({
          url: _this.managerUrl + "/webUser/getActivityRanking.do",
          method: "post",
          params: {
            number: number
          }
        }).then((response) => {
          let data = response.data;
          if (data.code === 1) {
            let myChart = this.echarts.init(document.getElementById("tab4"));
            data = data.data;
            let alias = [];
            let count = [];
            for (let i = 0; i < data.length; i++) {
              alias.push(data[i].userBaseInfo.alias);
              count.push(data[i].count);
            }
            let option = {
              tooltip: {
                trigger: 'axis',
                padding: [2, 5, 2, 5],
                backgroundColor: "#FFF",
                textStyle: {
                  color: "#000"
                },
                borderColor: "#ffc234",
                borderWidth: 2,
                formatter: function (params, ticket, callback) {
                  let html = "";
                  for (let i = 0; i < params.length; i++) {
                    let ranking = _this.rankingNumber - params[i].dataIndex;
                    html += '<p>Top:' + ranking + '  活跃度  ' + params[i].data + '</p>'
                  }
                  return html;
                }
              },
              xAxis: {
                type: 'value',
                axisLine: {
                  show: true,
                  symbol: ['none', 'arrow'],
                  symbolSize: [8, 8],
                  symbolOffset: [0, 7]
                },
              },
              yAxis: {
                type: 'category',
                data: alias,
                axisLine: {
                  show: true,
                  symbol: ['none', 'arrow'],
                  symbolSize: [8, 8],
                  symbolOffset: [0, 7]
                },
              },
              series: [{
                data: count,
                type: 'bar',
                barCategoryGap: '60%',
                itemStyle: {
                  normal: {
                    color: new _this.echarts.graphic.LinearGradient(1, 0, 0, 0, [
                      {offset: 0, color: '#190fff'},
                      {offset: 1, color: '#37BBF8'}]),
                    barBorderRadius: [0, 50, 50, 0],
                    opacity: 0.85
                  }
                }
              }]
            };
            myChart.setOption(option);
          }
        }).catch((error) => {
        });
      },
      tabClick(tabIndex) {
        this.currentTabIndex = tabIndex;
        if (tabIndex == "tab1") {
          this.getActivityRate(1);
        } else if (tabIndex == "tab2") {
          this.getAddUser(2);
        } else if (tabIndex == "tab3") {
          this.getUserSum(3);
        } else if (tabIndex == "tab4") {
          this.getActivityRanking(this.rankingNumber);//活跃度前十名
        }

      },
      timeSelect(item, index) {
        let _this = this;
        this.currentTimeClass = index;
        this.currentTimeType = item.id;
        if (this.currentTabIndex == "tab1") {
          this.getActivityRate(_this.currentTimeType);
        } else if (this.currentTabIndex == "tab2") {
          this.getAddUser(_this.currentTimeType);
        } else if (this.currentTabIndex == "tab3") {
          this.getUserSum(_this.currentTimeType);
        }
      }
    }
  }
</script>

<style scoped>
  .tab {
    width: 100%;
    height: 500px;
  }

  .date-filter {

  }

  .date-filter span {
    color: dodgerblue;
    cursor: pointer;
    margin-left: 10px;
    font-size: 15px;
    padding: 4px;
  }

  .timeUnSelect {
    border-bottom: none;
  }

  .timeSelect {
    border-bottom: 2px solid #2b27ff;
  }

  .date-filter span:hover {
    color: #97e4ff;
    cursor: pointer;
  }
</style>
