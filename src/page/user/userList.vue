<template>
  <div>
    <div style="margin-top: 10px;">
      <Select v-model="searchType" style="width:200px">
        <Option value="roleName">角色名</Option>
        <Option value="permissionName">权限名</Option>
        <Option value="mwId">mwId</Option>
        <Option value="alias">用户名</Option>
      </Select>
      <Input v-show="showSearchInput" v-model="searchContent" style="width: 200px;"/>
      <Select v-show="showRole" v-model="searchRole" style="width:200px">
        <Option v-for="(item,index) in roleList" :value="item.roleName" :key="index" :label="item.roleName"></Option>
      </Select>
      <Select v-show="showPermission" v-model="searchPermission" style="width:200px">
        <Option v-for="(item,index) in permissionList" :key="index" :value="item.permissionName"
                :label="item.describe"></Option>
      </Select>
      <Button @click="startSearch">搜索</Button>
      <Button @click="reset">重置</Button>
    </div>
    <Modal
      v-model="roleModal"
      title="选择角色"
      @on-ok="selectRoleMethod">
      <CheckboxGroup v-model="selectRole">
        <Checkbox v-for="(item,index) in roleList" :key="index"
                  :label="item.id">{{item.roleName}}
        </Checkbox>
      </CheckboxGroup>
    </Modal>
    <Modal
      v-model="permissionModal"
      title="请选择权限"
      @on-ok="selectPermissionMethod">
      <CheckboxGroup v-model="selectPermission">
        <Checkbox v-for="(item,index) in permissionList" :key="index"
                  :label="item.id">{{item.describe}}
        </Checkbox>
      </CheckboxGroup>
    </Modal>
    <Table stripe :loading="loading" :columns="userColumns" :data="userList" style="margin-top: 10px;"></Table>
    <Page v-show="showPage" @on-change="pageChange" :page-size="pageSize" :total="total" show-elevator
          style="width: 700px;margin: 0 auto;position: relative;top: 10px;"/>
  </div>
</template>

<script>
  import qs from 'qs';

  export default {
    name: "userList",
    data() {
      return {
        selectRole: [],
        roleModal: false,
        permissionModal: false,
        selectPermission: [],
        total: 0,
        showPage: false,
        showRole: false,
        showPermission: false,
        showSearchInput: true,
        pageSize: 10,
        startNum: 0,
        searchRole: null,
        searchPermission: null,
        roleList: [],
        permissionList: [],
        mwId: null,
        alias: null,
        searchType: 'alias',
        searchContent: '',
        loading: true,
        userColumns: [
          {
            title: "mwId",
            align: "center",
            key: 'mwId'
          },
          {
            title: "用户名",
            align: "center",
            key: 'alias'
          },
          {
            title: "登录次数",
            align: "center",
            key: 'loginNumber'
          },
          {
            title: "角色",
            align: "center",
            key: 'roleText'
          },
          {
            title: "操作",
            align: "center",
            key: 'operation',
            render: (h, params) => {
              return h('div', [
                h('a', {
                  on: {
                    click: () => {
                      this.changeUserStatus(params)
                    }
                  }
                }, '变更用户状态'),
                h('a', {
                  props: {
                    type: 'error',
                    size: 'small'
                  },
                  style: {
                    marginLeft: "10px"
                  },
                  on: {
                    click: () => {
                      this.changeRole(params)
                    }
                  }
                }, '修改角色'),
                h('a', {
                  style: {
                    marginLeft: "10px"
                  },
                  on: {
                    click: () => {
                      this.changePermission(params);
                    }
                  }
                }, '修改权限')
              ])
            }
          }
        ],
        userList: [],
        selectCurrentUser: null
      }
    },
    watch: {
      //搜索类型改变，搜索框条件改变
      searchType: function (newValue, oldValue) {
        switch (newValue) {
          case "roleName":
            this.showSearchInput = false;
            this.showRole = true;
            this.showPermission = false;
            this.searchContent = null;
            this.searchPermission = null;
            break;
          case "permissionName":
            this.showSearchInput = false;
            this.showRole = false;
            this.showPermission = true;
            this.searchContent = null;
            this.searchRole = null;
            break;
          default:
            this.showSearchInput = true;
            this.showRole = false;
            this.showPermission = false;
            this.searchPermission = null;
            this.searchRole = null;
            break;
        }
      }
    },
    mounted() {
      this.getRoleList();
      this.getPermissionList();
      this.getUserList({
        startNum: 0,
        pageSize: this.pageSize
      });
      this.getUserNumber({});
    },
    methods: {
      addRole(mwId, roleIdList) {
        if (roleIdList != null && roleIdList.length > 0) {
          let _this = this;
          this.$ajax({
            url: _this.managerUrl + "/authorization/addRole.do",
            method: "post",
            params: {
              mwId: mwId,
              roleIdListJson: qs.stringify(roleIdList)
            }
          }).then((response) => {
              let data = response.data;
              if (data.code === 1) {
                let newRole = [];
                //生成新的角色数组
                for (let i = 0; i < _this.roleList.length; i++) {
                  for (let j = 0; j < _this.selectRole.length; j++) {
                    if (_this.selectRole[j] == _this.roleList[i].id) {
                      newRole.push(_this.roleList[i]);
                    }
                  }
                }
                //将新的角色列表加入userList 当中
                for (let i = 0; i < _this.userList.length; i++) {
                  if (_this.userList[i].mwId == _this.selectCurrentUser.mwId) {
                    _this.userList[i].roleList = [];
                    _this.userList[i].roleList.push(...newRole);
                    _this.userList[i].roleText = "";
                    for (let j = 0; j < newRole.length; j++) {
                      _this.userList[i].roleText = _this.userList[i].roleText + newRole[j].roleName + " ";
                    }
                  }
                }
                _this.$Message.success("添加新角色成功");
              }
            }
          ).catch((error) => {
          });

        }
      },
      removeRole(mwId, roleIdList) {
        let _this = this;
        if (roleIdList != null && roleIdList.length > 0) {
          _this.$ajax({
            url: _this.managerUrl + "/authorization/removeRole.do",
            method: "post",
            params: {
              mwId: mwId,
              roleIdListJson: qs.stringify(roleIdList)
            }
          }).then((response) => {
              let data = response.data;
              if (data.code === 1) {
                let newRole = [];
                //生成新的角色数组
                for (let i = 0; i < _this.roleList.length; i++) {
                  for (let j = 0; j < _this.selectRole.length; j++) {
                    if (_this.selectRole[j] == _this.roleList[i].id) {
                      newRole.push(_this.roleList[i]);
                    }
                  }
                }
                //将新的角色列表加入userList 当中
                for (let i = 0; i < _this.userList.length; i++) {
                  if (_this.userList[i].mwId == _this.selectCurrentUser.mwId) {
                    _this.userList[i].roleList = [];
                    _this.userList[i].roleList.push(...newRole);
                    _this.userList[i].roleText = "";
                    for (let j = 0; j < newRole.length; j++) {
                      _this.userList[i].roleText = _this.userList[i].roleText + newRole[j].roleName + " ";
                    }
                  }
                }
                _this.$Message.success("移除角色成功");
              }
            }
          ).catch((error) => {
          });
        }
      },
      addPermission(mwId, permissionIdList) {
        if (permissionIdList != null && permissionIdList.length > 0) {
          let _this = this;
          this.$ajax({
            url: _this.managerUrl + "/authorization/addPermission.do",
            method: "post",
            params: {
              mwId: mwId,
              permissionIdListJson: qs.stringify(permissionIdList)
            }
          }).then((response) => {
              let data = response.data;
              if (data.code === 1) {
                let newPermission = [];
                //生成新的角色数组
                for (let i = 0; i < _this.permissionList.length; i++) {
                  for (let j = 0; j < _this.selectPermission.length; j++) {
                    if (_this.selectPermission[j] == _this.permissionList[i].id) {
                      newPermission.push(_this.permissionList[i]);
                    }
                  }
                }
                //将新的角色列表加入userList 当中
                for (let i = 0; i < _this.userList.length; i++) {
                  if (_this.userList[i].mwId == _this.selectCurrentUser.mwId) {
                    _this.userList[i].permissionList = [];
                    _this.userList[i].permissionList.push(...newPermission);
                  }
                }
                _this.$Message.success("添加新权限成功");

              }
            }
          ).catch((error) => {

          });
        }
      },
      removePermission(mwId, permissionIdList) {
        let _this = this;
        if (permissionIdList != null && permissionIdList.length > 0) {
          this.$ajax({
            url: _this.managerUrl + "/authorization/removePermission.do",
            method: "post",
            params: {
              mwId: mwId,
              permissionIdListJson: qs.stringify(permissionIdList)
            }
          }).then((response) => {
              let data = response.data;
              if (data.code === 1) {
                let newPermission = [];
                //生成新的角色数组
                for (let i = 0; i < _this.permissionList.length; i++) {
                  for (let j = 0; j < _this.selectPermission.length; j++) {
                    if (_this.selectPermission[j] == _this.permissionList[i].id) {
                      newPermission.push(_this.permissionList[i]);
                    }
                  }
                }
                //将新的角色列表加入userList 当中
                for (let i = 0; i < _this.userList.length; i++) {
                  if (_this.userList[i].mwId == _this.selectCurrentUser.mwId) {
                    _this.userList[i].permissionList = [];
                    _this.userList[i].permissionList.push(...newPermission);
                  }
                }
                _this.$Message.success("移除权限成功");
              }
            }
          ).catch((error) => {
          });
        }
      },
      selectRoleMethod() {
        let mwId = this.selectCurrentUser.mwId;
        let originalRoleList = this.selectCurrentUser.roleList;
        let originalRoleIdList = [];
        for (let temp of originalRoleList) {
          originalRoleIdList.push(temp.id);
        }
        let addIdRoleList = this.selectRole.diff(originalRoleIdList);
        let removeIdRoleList = originalRoleIdList.diff(this.selectRole);
        this.removeRole(mwId, removeIdRoleList);
        this.addRole(mwId, addIdRoleList);
      },
      selectPermissionMethod() {
        let mwId = this.selectCurrentUser.mwId;
        let originalPermissionList = this.selectCurrentUser.permissionList;
        let originalPermissionIdList = [];
        for (let temp of originalPermissionList) {
          originalPermissionIdList.push(temp.id);
        }
        let addIdPermissionList = this.selectPermission.diff(originalPermissionIdList);
        let removeIdPermissionList = originalPermissionIdList.diff(this.selectPermission);
        this.removePermission(mwId, removeIdPermissionList);
        this.addPermission(mwId, addIdPermissionList);
      },
      getRoleList() {
        let _this = this;
        this.$ajax({
          url: _this.managerUrl + "/authorization/getRoleList.do",
          method: "post",
          params: {}
        }).then((response) => {
            let data = response.data;
            if (data.code === 1) {
              data = data.data;
              _this.roleList.push(...data);
            }
          }
        ).catch((error) => {
        });
      },
      getPermissionList() {
        let _this = this;
        this.$ajax({
          url: _this.managerUrl + "/authorization/getPermissionList.do",
          method: "post",
          params: {}
        }).then((response) => {
            let data = response.data;
            if (data.code === 1) {
              data = data.data;
              let roles = JSON.parse(_this.myUtils.getStore("roles"));
              let superPermission = ['addRole', 'removeRole', 'removeUserAllRole', 'addPermission', 'removeUserAllPermission', 'removePermission'];
              if (!roles.contains("superAdmin")) {
                for (let i = 0; i < data.length; i++) {
                  if (!superPermission.contains(data[i].permissionName)) {
                    _this.permissionList.push(data[i]);
                  }
                }
              }else{
                _this.permissionList.push(...data)
              }
            }
          }
        ).catch((error) => {
        });
      },
      changePermission(params) {
        this.permissionModal = true;
        this.selectCurrentUser = params.row;
        this.selectPermission = [];
        if (this.selectCurrentUser != null) {
          let permissionList = this.selectCurrentUser.permissionList;
          for (let i = 0; i < permissionList.length; i++) {
            this.selectPermission.push(this.selectCurrentUser.permissionList[i].id);
          }
        }
      },
      getUserNumber(params) {
        let _this = this;
        this.$ajax({
          url: _this.managerUrl + "/user/getManagerUserNumber.do",
          method: "post",
          params: params
        }).then((response) => {
          let data = response.data;
          if (data.code === 1) {
            _this.total = data.data;
            _this.total > _this.pageSize ? _this.showPage = true : _this.showPage = false;
          }
        }).catch((error) => {

        })
      },
      changeRole(params) {
        this.roleModal = true;
        this.selectCurrentUser = params.row;
        this.selectRole = [];
        if (this.selectCurrentUser != null) {
          let roleList = this.selectCurrentUser.roleList;
          for (let i = 0; i < roleList.length; i++) {
            this.selectRole.push(this.selectCurrentUser.roleList[i].id);
          }
        }
      },
      getUserList(params) {
        this.loading = true;
        let _this = this;
        this.userList = [];
        this.$ajax({
          url: _this.managerUrl + "/user/getUserList.do",
          method: "post",
          params: params
        }).then((response) => {
            _this.loading = false;
            let data = response.data;
            if (data.code === 1) {
              data = data.data;
              for (let i = 0; i < data.length; i++) {
                let roleText = "";
                let roleList = data[i].account.roleList;
                for (let j = 0; j < roleList.length; j++) {
                  roleText = roleText + " " + roleList[j].roleName;
                }
                _this.userList.push({
                  mwId: data[i].account.mwId,
                  alias: data[i].userBaseInfo.alias,
                  loginNumber: data[i].loginNumber,
                  roleText: roleText,
                  status: data[i].account.status,
                  roleList: data[i].account.roleList,
                  permissionList: data[i].account.permissionList
                });
              }
            }
          }
        ).catch((error) => {
        });
      },
      pageChange(page) {
        this.getUserList({
          startNum: (--page) * this.pageSize,
          pageSize: this.pageSize,
          roleName: this.searchRole,
          permissionName: this.searchPermission,
          mwId: this.mwId,
          alias: this.alias
        })
      },
      reset() {
        this.getUserList({
          startNum: 0,
          pageSize: this.pageSize
        });
        this.getUserNumber({});
      },
      startSearch() {
        let _this = this;
        if (this.searchContent == '') {
          this.$Message.warning("请输入要搜索的内容");
          return;
        }
        let params = {
          startNum: 0,
          pageSize: _this.pageSize,
          roleName: _this.searchRole,
          permissionName: _this.searchPermission,
          mwId: null,
          alias: null
        };
        if (this.searchType == "mwId") {
          params.mwId = this.searchContent;
        } else if (this.searchType == "alias") {
          params.alias = this.searchContent;
        }
        this.getUserList(params);
      },
      changeUserStatus(params) {
        let _this = this;
        let status = 1;
        if (params.row.status == 1) {
          status = 2;
        }
        this.$ajax({
          url: _this.managerUrl + "/user/changeUserStatus.do",
          method: "post",
          params: {
            mwId: params.row.mwId,
            status: status
          }
        }).then((response) => {
          let data = response.data;
          if (data.code === 1) {
            let showMessage = "用户恢复正常";
            if (status === 2) {
              showMessage = "用户禁用成功";
            }
            for (let i = 0; i < _this.userList.length; i++) {
              if (_this.userList[i].mwId == params.row.mwId) {
                _this.userList[i].status = status;
                break;
              }
            }
            _this.$Message.success(showMessage);

          }
        }).catch((error) => {

        })
      }
    }
  }
</script>

<style scoped>

</style>
