<template>
  <div>
    <Form label-position="right" :label-width="100" class="form">
      <FormItem label="原密码">
        <Input v-model="originalPwd"/>
      </FormItem>
      <FormItem label="新密码">
        <Input v-model="newPwd"/>
      </FormItem>
      <FormItem label="再次输入新密码">
        <Input v-model="againPwd"/>
      </FormItem>
      <FormItem>
        <Button type="primary" class="save" @click="save">保存</Button>
      </FormItem>
    </Form>
  </div>
</template>

<script>
  export default {
    name: "setting",
    data() {
      return {
        originalPwd: '',
        newPwd: '',
        againPwd: ''
      }
    }, methods: {
      save() {
        if (this.originalPwd == '') {
          this.$Message.warning("请输入原密码");
          return;
        }
        if (this.newPwd == '') {
          this.$Message.warning("请输入新密码");
          return;
        }
        if (this.againPwd == '') {
          this.$Message.warning("再次输入新密码");
          return;
        }
        if (this.newPwd != this.againPwd) {
          this.$Message.warning("两次密码输入不一致,请重新输入");
          return;
        }
        let _this = this;
        let p = new Promise((resolve, reject) => {
          this.$ajax({
            url: _this.managerUrl + "/user/changePwd.do",
            method: "post",
            params: {
              originalPwd: _this.originalPwd,
              newPwd: _this.newPwd
            }
          }).then((response) => {
            let data = response.data;
            if (data.code == 1) {
              resolve(data);
            }
          }).catch((error) => {

          })
        });
        p.then((response) => {
          _this.$ajax({
            url: _this.managerUrl + "/loginOut.do",
            method: "post",
            params: {}
          }).then((loginOut) => {
            data = loginOut.data;
            if (data.code == 1) {
              this.$Message.error("正在退出...")
              setTimeout(() => {
                _this.$store.state.account = false;
                _this.$router.push({
                  path: "/login"
                });
              }, 1500);
            }
          })
        }).catch((error) => {

        })
      }
    }
  }
</script>

<style scoped>

  .form {
    position: relative;
    top: 30px;
    left: -30px;
    width: 400px;
    margin: 0 auto;
  }

  .save {
    width: 100px;
    margin-left: 100px;
  }
</style>
