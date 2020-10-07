<template>
  <div>
    <div style="margin-top: 20px;text-align: center">
      <!--<Card class="web-info-card">-->
        <!--<countTo class="web-info-content" :startVal='onlineCount/2' :endVal='onlineCount' :duration='2000'></countTo>-->
        <!--<div class="web-info-text">在线用户数</div>-->
      <!--</Card>-->
      <Card class="web-info-card">
        <div class="web-info-content" v-if="requestCountSecond<=10">
          {{requestCountSecond}}
        </div>
        <countTo class="web-info-content" v-if="requestCountSecond>10" :startVal='requestCountSecond/2'
                 :endVal='requestCountSecond'
                 :duration='2000'></countTo>
        <div class="web-info-text">每秒请求数</div>
      </Card>
      <Card class="web-info-card">
        <countTo class="web-info-content" :startVal='requestSumCount/2' :endVal='requestSumCount'
                 :duration='2000'></countTo>
        <div class="web-info-text">今日请求总量</div>
      </Card>
    </div>
    <div id="echats" class="chats"></div>
  </div>
</template>

<script>
  import countTo from 'vue-count-to';

  export default {
    name: "webData",
    components: {countTo},
    data() {
      return {
        onlineCount: 0,
        requestCountSecond: 0,
        requestSumCount: 0
      }
    },
    methods: {
      getOnlineUserCount() {
        let _this = this;
        _this.$ajax({
          url: _this.managerUrl + "/webData/getOnlineUserCount.do",
          method: "post",
          params: {}
        }).then((response) => {
          let data = response.data;
          if (data.code === 1) {
            _this.onlineCount = data.data;
          }
        }).catch((error) => {

        });
      },
      getRequestCountSecond() {
        let _this = this;
        _this.$ajax({
          url: _this.managerUrl + "/webData/getRequestCountSecond.do",
          method: "post",
          params: {}
        }).then((response) => {
          let data = response.data;
          if (data.code === 1) {
            _this.requestCountSecond = data.data;
          }
        }).catch((error) => {
        });
      },
      getRequestSumCount() {
        let _this = this;
        _this.$ajax({
          url: _this.managerUrl + "/webData/getRequestSumCount.do",
          method: "post",
          params: {}
        }).then((response) => {
          let data = response.data;
          if (data.code === 1) {
            _this.requestSumCount = data.data;
          }
        }).catch((error) => {
        });
      },
      getRequestHourList() {
        let _this = this;
        _this.$ajax({
          url: _this.managerUrl + "/webData/getRequestHourList.do",
          method: "post",
          params: {}
        }).then((response) => {
          let data = response.data;
          if (data.code === 1) {
            data = data.data;
            let myChart = this.echarts.init(document.getElementById("echats"));
            let date = [];
            for (let i = 0; i < data.length; i++) {
              date.push(i + "时");
            }
            let option = {
              title: {
                text: '今日流量统计',
                subtext: '每隔一小时统计一次',
                x: 'center'
              },
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
                    html += '<p>当前小时访问量  ' + params[i].data + '</p>'
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
                data: data,
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
      }
    }, mounted() {
      this.getOnlineUserCount();
      this.getRequestCountSecond();
      this.getRequestSumCount();
      this.getRequestHourList();
    }
  }
</script>
<style scoped>
  .web-info-card {
    width: 200px;
    height: 100px;
    text-align: center;
    display: inline-block;
    margin-left: 10px;
  }

  .web-info-content {
    font-size: 27px;
    font-weight: bold;
  }

  .web-info-text {
    margin-top: 8px;
  }

  .chats {
    width: 100%;
    height: 500px;
    margin-top: 20px;
  }
</style>
