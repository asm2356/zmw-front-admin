<template>
  <div>
    <Affix class="ivu-affix">
      <my-header/>
    </Affix>
    <Row>
      <Col :span="4">
        <Menu @on-select="selectMenu" :open-names="openNames" :active-name="defaultActive"
              @on-open-change="onOpenChange"
              ref="side_menu">
          <Submenu name="user">
            <template slot="title">
              <svg class="icon menu-icon" aria-hidden="true">
                <use xlink:href="#icon-yonghu1"></use>
              </svg>
              用户管理
            </template>
            <MenuItem name="userList">
              <svg class="icon menu-icon" aria-hidden="true">
                <use xlink:href="#icon-yonghuliebiao"></use>
              </svg>
              用户列表
            </MenuItem>
            <MenuItem name="loginHistory">
              <svg class="icon menu-icon" aria-hidden="true">
                <use xlink:href="#icon-3lishi"></use>
              </svg>
              登录历史
            </MenuItem>
          </Submenu>
          <Submenu name="article">
            <template slot="title">
              <svg class="icon menu-icon" aria-hidden="true">
                <use xlink:href="#icon-wenzhangguanli"></use>
              </svg>
              文章管理
            </template>
            <MenuItem name="articleList">
              <svg class="icon menu-icon" aria-hidden="true">
                <use xlink:href="#icon-wenzhangliebiaoxiangqing"></use>
              </svg>
              文章列表
            </MenuItem>
            <MenuItem name="discussList">
              <svg class="icon menu-icon" aria-hidden="true">
                <use xlink:href="#icon-fzst-ping"></use>
              </svg>
              评论列表
            </MenuItem>
          </Submenu>
          <Submenu name="system" v-show="showSystemManager">
            <template slot="title">
              <svg class="icon menu-icon" aria-hidden="true">
                <use xlink:href="#icon-xitongguanli"></use>
              </svg>
              系统管理
            </template>
            <!--<MenuItem name="db">-->
            <!--数据库监控-->
            <!--</MenuItem>-->
            <MenuItem name="config">
              <svg class="icon menu-icon" aria-hidden="true">
                <use xlink:href="#icon-xitongcanshu"></use>
              </svg>
              参数配置
            </MenuItem>
          </Submenu>
          <Submenu name="website">
            <template slot="title">
              <svg class="icon menu-icon" aria-hidden="true">
                <use xlink:href="#icon-wangzhanguanli"></use>
              </svg>
              网站管理
            </template>
            <MenuItem name="webUser">
              <svg class="icon menu-icon" aria-hidden="true">
                <use xlink:href="#icon-menu-yonghujiankong"></use>
              </svg>
              用户监控
            </MenuItem>
            <MenuItem name="webData">
              <svg class="icon menu-icon" aria-hidden="true">
                <use xlink:href="#icon-jiankong"></use>
              </svg>
              网站监控
            </MenuItem>
            <!--<MenuItem name="messageManager">-->
            <!--<svg class="icon menu-icon" aria-hidden="true">-->
            <!--<use xlink:href="#icon&#45;&#45;xiaoxizhongxin"></use>-->
            <!--</svg>-->
            <!--消息中心-->
            <!--</MenuItem>-->
          </Submenu>
          <Submenu name="personCenter">
            <template slot="title">
              <svg class="icon menu-icon" aria-hidden="true">
                <use xlink:href="#icon-gerenzhongxin"></use>
              </svg>
              个人中心
            </template>
            <MenuItem name="setting">
              <svg class="icon menu-icon" aria-hidden="true">
                <use xlink:href="#icon-gerenshezhi"></use>
              </svg>
              设置
            </MenuItem>
            <MenuItem name="operationRecord">
              <svg class="icon menu-icon" aria-hidden="true">
                <use xlink:href="#icon-qunfengcaozuojilu"></use>
              </svg>
              操作记录
            </MenuItem>
          </Submenu>
        </Menu>
      </Col>
      <Col :span="20">
        <router-view/>
      </Col>
    </Row>
  </div>
</template>

<script>
  export default {
    name: "home",
    data() {
      return {
        childPath: '',
        defaultActive: "",
        openNames: [],
        userBaseInfo: '',
        mwId: '',
        showSystemManager: false
      }
    },
    mounted() {
      this.init();
      this.menuOpen();
    },
    methods: {
      menuOpen() {
        let open_names = JSON.parse(window.localStorage.getItem("openNames"));
        let active_name = window.localStorage.getItem("defaultActive");
        if (open_names || active_name) {
          this.openNames = open_names || [];
          this.defaultActive = active_name || 0;
          this.$nextTick(() => {
            this.$refs.side_menu.updateOpened();
            this.$refs.side_menu.updateActiveName();
          });
        }
      },
      init() {
        let roles = JSON.parse(this.myUtils.getStore("roles"))
        if (roles != null) {
          if (roles.contains("superAdmin")) {
            this.showSystemManager = true;
          } else {
            this.showSystemManager = false;
          }
        }
      },

      onOpenChange(value) {
        window.localStorage.setItem("openNames", JSON.stringify(value));
      },
      selectMenu(path) {
        window.localStorage.setItem("defaultActive", path);
        path = "/home/" + path;
        this.$router.push(path);
      }
    }
  }
</script>

<style scoped>
  .menu-icon {
    font-size: 18px;
  }

  .ivu-affix {
    z-index: 1000 !important;
    position: relative;
    margin-left: 0;
    margin-right: 0;
    height: auto;
    zoom: 1;
    display: block;
  }
</style>
