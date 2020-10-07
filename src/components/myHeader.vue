<template>
  <div>
    <Row class="header-container">
      <Col :span="4">
        <div class="system-title">美文管理系统</div>
      </Col>
      <Col :span="2" :offset="17">
        <Dropdown trigger="click" class="user" @on-click="dropDownClick">
          <a href="javascript:void(0)">
            {{userBaseInfo.alias}}
            <Icon type="ios-arrow-down"></Icon>
          </a>
          <DropdownMenu slot="list">
            <DropdownItem name="setting">设置</DropdownItem>
            <DropdownItem name="loginOut">退出</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </Col>
    </Row>
  </div>
</template>

<script>
  export default {
    name: "myHeader",
    data() {
      return {userBaseInfo: ''}
    }, mounted() {
      this.getUserBaseInfo();
    }, methods: {
      dropDownClick(name) {
        if (name == 'loginOut') {
          this.loginOut();
        } else if (name == 'setting') {
          this.setting();
        }
      },
      setting() {
        this.$router.push({
          name: 'setting'
        })
      },
      getUserBaseInfo() {
        let _this = this;
        this.$ajax({
          url: _this.managerUrl + "/user/getUserBaseInfo.do",
          method: "post",
          param: {}
        }).then((response) => {
          let data = response.data;
          if (data.code === 1) {
            _this.userBaseInfo = data.data;
          }
        }).catch((error) => {
        });
      },
      loginOut() {
        let _this = this;
        this.$ajax({
          url: _this.managerUrl + "/loginOut.do",
          method: "post",
          params: {}
        }).then((response) => {
          let data = response.data;
          if (data.code === 1) {
            _this.myUtils.removeStore("account")
            _this.$store.commit("LOGIN", null);
            _this.$router.push({
              name: 'login'
            })
          }
        }).catch((error) => {
        })
      }
    }
  }
</script>

<style scoped>
  .header-container {
    background-color: black;
  }

  .system-title {
    text-align: center;
    color: white;
    font-size: 18px;
    padding: 10px;
  }

  .user {
    font-size: 16px;
    margin-top: 10px;
    margin-left: 50px;
    width: 150px;
  }
</style>
