<template>
  <div class="login-background">
    <img src=""/>
    <Card dis-hover class="form-container">
      <div slot="title">
        <div class="title">美文登录</div>
      </div>
      <div>
        <Input placeholder="请输入手机号或者美文号" id="username" v-model="loginUsername">
             <span slot="prepend">
                <svg class="icon" aria-hidden="true" style="font-size: 20px;">
                     <use xlink:href="#icon-yonghu"></use>
                </svg>
             </span>
        </Input>
      </div>
      <div>
        <Input style="margin-top: 10px;" placeholder="请输入密码" type="password" id="pwd" v-model="loginPwd">
             <span slot="prepend">
                <svg class="icon" aria-hidden="true" style="font-size: 20px">
                     <use xlink:href="#icon-mima"></use>
                </svg>
             </span>
        </Input>
      </div>
      <div>
        <Row>
          <Col :span="14">
            <Input style="margin-top: 10px;" id="verificationCode" placeholder="请输入验证码" v-model="loginVerificationCode">
                <span slot="prepend">
                   <svg class="icon" aria-hidden="true" style="font-size: 20px">
                     <use xlink:href="#icon-yanzhengma"></use>
                  </svg>
                </span>
            </Input>
          </Col>
          <Col :span="10">
            <img style="margin-top: 12px;" :src="verificationCodeImage" class="verificationCodeImage"
                 @click="getVerificationCodeImage"/>
          </Col>
        </Row>
      </div>
      <div>
        <Row>
          <Col>
            <Button style="margin-top: 25px;" :loading="loginLoading" type="primary" class="confirm" @click="login">
              <span v-if="loginLoading">
                登陆中...
              </span>
              <span v-else>
                登录
              </span>
            </Button>
          </Col>
        </Row>
      </div>
    </Card>
  </div>
</template>

<script>
  export default {
    name: "login",
    data() {
      return {
        loginLoading:false,
        verificationCodeImage: "../../static/images/loadingCode.gif",
        loginUsername: '',
        loginPwd: '',
        loginVerificationCode: '',
        codeKey: ""
      }
    },
    mounted() {
      this.getVerificationCodeImage();
    },
    methods: {
      getVerificationCodeImage() {
        let _this = this;
        this.$ajax({
          url: _this.managerUrl + "/getVerificationCode.do",
          method: "post",
          responseType: 'arraybuffer',
          param: {}
        }).then((response) => {
          _this.verificationCodeImage = 'data:image/png;base64,' + btoa(
            new Uint8Array(response.data)
              .reduce((data, byte) => data + String.fromCharCode(byte), '')
          );
          _this.codeKey = response.headers.key;
        }).catch((error) => {
        });
      },
      login() {
        this.loginLoading  = true;
        if (this.loginUsername == "") {
          this.$Message.warning('账号不能为空');
          this.loginLoading  =false;
          return;
        }
        if (this.loginPwd == "") {
          this.$Message.warning('密码不能为空');
          this.loginLoading  =false;
          return;
        }
        if (this.loginVerificationCode == "") {
          this.$Message.warning('验证码不能为空');
          this.loginLoading  =false;
          return;
        }
        let _this = this;
        _this.getRoleList().then((roleList) => {
          let hasAuthorization = false;
          let userRole = [];
          if (roleList != null) {
            for (let i = 0; i < roleList.length; i++) {
              userRole.push(roleList[i].roleName);
              if (roleList[i].roleName === "admin" || roleList[i].roleName === "superAdmin") {
                hasAuthorization = true;
              }
            }
          }
          _this.$store.commit("USER_ROLES", JSON.stringify(userRole));
          if (hasAuthorization) {
            _this.loginLoading  =true;
            _this.$ajax({
              url: _this.managerUrl + "/login.do",
              method: "post",
              params: {
                username: _this.loginUsername,
                pwd: _this.loginPwd,
                key: _this.codeKey,
                code: _this.loginVerificationCode
              }
            }).then((response) => {
              _this.loginLoading  =false;
              let data = response.data;
              if (data.code === 1) {
                _this.$store.commit("LOGIN", data.data);
                _this.$router.push("/home/userList");
              } else {
                _this.getVerificationCodeImage();
              }
            }).catch((error) => {
              _this.loginLoading  =false;
            })
          } else {
            _this.$Message.error("您没有权限登录");
            _this.getVerificationCodeImage();
          }
        });
      },
      getRoleList() {
        let _this = this;
        return new Promise((resolve, reject) => {
          _this.$ajax({
            url: _this.managerUrl + "/authorization/getRoleList.do",
            method: "post",
            params: {
              mwId: _this.loginUsername
            }
          }).then((response) => {
            _this.loginLoading  =false;
              let data = response.data;
              if (data.code === 1) {
                resolve(data.data);
              } else {
                _this.$Message.error(data.message);
              }
            }
          ).catch((error) => {
            _this.loginLoading  =false;
            reject(error)
          });
        });
      }
    }
  }
</script>
<style>
  body {
    background-color: #F6F6F6;
  }
</style>
<style scoped>
  .form-container {
    width: 300px;
    height: 270px;
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    margin: auto;
    z-index: 1111;
  }

  .switch {
    text-align: center;
    margin-top: 10px;
  }

  .switch span {
    color: blue;
    cursor: Pointer;
  }

  .confirm {
    margin-left: 25px;
    width: 220px;
  }

  #login > div, #register > div {
    margin-top: 10px;
  }

  .title {
    text-align: center;
    font-size: 20px;
  }

  .describe {
    text-align: center;
    margin-top: 10px
  }

  .verificationCodeImage {
    width: 105px;
    height: 25px;
    margin-top: 4px;
    margin-left: 5px
  }

  .login-background {
    position: absolute;
    width: 100%;
    height: 100%;
    background: url("../../../static/images/backgroup.jpg") no-repeat;
    background-size:100% 100%;
  }
</style>
