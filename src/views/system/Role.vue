/**
 * 系统管理  角色管理
 */
<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>角色管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索筛选 -->
    <div v-if="jur[5].check!='on'">
      <h1 style="color: red">暂无权限</h1>
    </div>
    <el-form :inline="true" :model="formInline" class="user-search" v-if="jur[5].check=='on'">
      <el-form-item label="搜索：">
        <el-select size="small" v-model="formInline.state" placeholder="请选择">
          <el-option label="全部" value=""></el-option>
          <el-option label="有效" value="1"></el-option>
          <el-option label="无效" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="">
        <el-input size="small" v-model="formInline.name" placeholder="角色名称" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-search" @click="search" :disabled="jur[5].check!='on'">搜索</el-button>
        <el-button size="small" type="primary" icon="el-icon-plus" @click="handleEdit()" :disabled="jur[6].check!='on'">添加</el-button>
        <el-button size="small" type="info"  icon="el-icon-refresh-left" @click="empty">清除搜索信息</el-button>
        <el-button size="small" type="danger" icon="el-icon-delete"  @click="deleteUserAll" :disabled="jur[7].check!='on'">删除选中</el-button>
      </el-form-item>
    </el-form>
    <!--列表-->
    <el-table size="small" @selection-change="selectChange" :data="listData" highlight-current-row v-loading="loading" border element-loading-text="拼命加载中" style="width: 100%;" v-if="jur[5].check=='on'">
      <el-table-column align="center" type="selection" width="120">
      </el-table-column>
      <el-table-column label="序号"  type="index" width="80" align="center" >
      </el-table-column>
      <el-table-column sortable prop="rolecode" label="角色编码" width="120">
      </el-table-column>
      <el-table-column sortable prop="name" label="角色名称" width="120">
      </el-table-column>
      <el-table-column align="center" sortable prop="create_By" label="创建人" min-width="80">
      </el-table-column>
      <el-table-column align="center" sortable prop="last_Update_By" label="最后修改人" min-width="100">
      </el-table-column>
      <el-table-column sortable prop="creation_Date" label="创建时间" width="200">
        <template slot-scope="scope">
          <div>{{scope.row.creation_Date|timestampToTime}}</div>
        </template>
      </el-table-column>

<!--      <el-table-column sortable prop="stoptime" label="失效时间" width="180">-->
<!--        <template slot-scope="scope">-->
<!--          <div>{{scope.row.stoptime|timestampToTime}}</div>-->
<!--        </template>-->
<!--      </el-table-column>-->
      <el-table-column align="center" sortable prop="state" label="状态" min-width="80">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.state=='1'?nshow:fshow" active-color="#13ce66" inactive-color="#ff4949" @change="editType(scope.$index, scope.row)" :disabled="jur[8].check!='on'">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" min-width="300">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)" :disabled="jur[8].check!='on'">编辑</el-button>
          <el-button size="mini" type="danger" @click="deleteUser(scope.$index, scope.row)" :disabled="jur[7].check!='on'">删除</el-button>
          <el-button size="mini" type="success" @click="menuAccess(scope.$index, scope.row)" :disabled="jur[9].check!='on'">设置权限</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <Pagination v-bind:child-msg="pageparm" @callFather="callFather" v-if="jur[5].check=='on'"></Pagination>

    <!-- 编辑界面 -->
    <el-dialog :title="title" :visible.sync="editFormVisible" width="30%" @click='closeDialog("edit")'>
      <el-form label-width="120px" :model="editForm" ref="editForm" :rules="rules">
        <el-form-item label="角色编码" prop="rolecode">
          <el-input size="small" v-model="editForm.rolecode" auto-complete="off" placeholder="请输入角色编码"></el-input>
        </el-form-item>
        <el-form-item label="角色名称" prop="name">
          <el-input size="small" v-model="editForm.name" auto-complete="off" placeholder="请输入角色名称"></el-input>
        </el-form-item>
<!--        <el-form-item label="开始时间">-->
<!--          <el-date-picker-->
<!--            v-model="editForm.stime"-->
<!--            type="datetime"-->
<!--            placeholder="选择日期时间">-->
<!--          </el-date-picker>-->
<!--        </el-form-item>-->
<!--        <el-form-item label="结束时间">-->
<!--          <el-date-picker-->
<!--            v-model="editForm.ptime"-->
<!--            type="datetime"-->
<!--            placeholder="选择日期时间">-->
<!--          </el-date-picker>-->
<!--        </el-form-item>-->
        <el-form-item label="状态" >
          <el-radio v-model="editForm.state" label="1">有效</el-radio>
          <el-radio v-model="editForm.state" label="2">无效</el-radio>
        </el-form-item>
        <el-form-item label="备注" >
          <el-input size="small" v-model="editForm.description" placeholder="请输入备注"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click='closeDialog("edit")'>取消</el-button>
        <el-button size="small" type="primary" :loading="loading" class="title" @click="submitForm('editForm')">保存</el-button>
      </div>
    </el-dialog>
    <!-- 菜单权限 -->
    <el-dialog title="设置权限" :visible.sync="menuAccessshow" width="30%" @click='closeDialog("perm")'>
<!-- RoleRight所有权限    checkmenu这个用户拥有的权限    -->
      <el-tree ref="tree" default-expand-all="" :data="RoleRight" :props="RoleRightProps" :default-checked-keys="checkmenu" node-key="id" show-checkbox>
      </el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click='closeDialog("perm")'>取消</el-button>
        <el-button size="small" type="primary" :loading="loading" class="title" @click="menuPermSave">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  roleList,
  roleSave,
  roleUpdate,
  roleDelete,
  roleState,
  RoleRightTree,
  RoleRightSave, userLock
} from '../../api/userMG'
import Pagination from '../../components/Pagination'
export default {
  data() {
    return {
      user:{},
      jur:{},//登录用户的权限
      nshow: true, //switch开启
      fshow: false, //switch关闭
      loading: false, //是显示加载
      editFormVisible: false, //控制编辑页面显示与隐藏
      menuAccessshow: false, //控制数据权限显示与隐藏
      title: '添加',
      editForm: {
        id: '',
        rolecode: '',
        name: '',
        create_By:'',
        last_Update_By:'',
        stime: '',
        ptime:'',
        description:'',
        token: localStorage.getItem('logintoken')
      },
      //时间
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
      // rules 表单验证
      rules: {
        rolecode: [
          { required: true, message: '请输入角色编码', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ],
      },
      formInline: {
        page: 1,
        limit: 10,
        name: '',
        state: '',
        token: localStorage.getItem('logintoken')
      },
      // 删除
      seletedata: {
        ids: '',
        token: localStorage.getItem('logintoken')
      },
      userparm: [], //搜索权限
      listData: [], //用户数据
      // 选择数据
      selectdata: [],
      // 数据权限
      RoleRight: [],
      RoleRightProps: {
        children: 'children',
        label: 'name'
      },
      // 选中
      checkmenu: [],
      //参数role
      saveroleId: '',
      // 分页参数
      pageparm: {
        currentPage: 1,
        pageSize: 10,
        total: 10
      }
    }
  },
  // 注册组件
  components: {
    Pagination
  },
  /**
   * 数据发生改变
   */

  watch: {},

  /**
   * 创建完毕
   */

  created() {
    this.getdata(this.formInline)
    this.jur = JSON.parse(localStorage.getItem('jur'))
    this.user = JSON.parse(localStorage.getItem('userdata'))
  },

  /**
   * 里面的方法只有被调用才会执行
   */

  methods: {
    empty(){
      this.formInline.state='',
        this.formInline.name=''
    },
    // 获取角色列表
    getdata(parameter) {


      /***
       * 调用接口，注释上面模拟数据 取消下面注释
       */
      roleList(parameter)
        .then(res => {
          this.loading = false
          if (res.success === false) {
            this.$message({
              type: 'info',
              message: res.msg
            })
          } else {
            this.listData = res.date
            // 分页赋值
            this.pageparm.currentPage = this.formInline.page
            this.pageparm.pageSize = this.formInline.limit
            this.pageparm.total = res.total
          }
        })
        .catch(err => {
          this.loading = false
          this.$message.error('获取角色列表失败，请稍后再试！')
        })
    },
    // 修改type
    editType: function(index, row) {
      this.loading = true
      let parm = {
        state: '',
        id: '',
        token: localStorage.getItem('logintoken')
      }
      parm.id = row.id
      let state = row.state
      if (state == '1') {
        parm.state = '2'
      } else {
        parm.state = '1'
      }
      // 修改状态
      roleState(parm).then(res => {
        this.loading = false
        if (res.success == false) {
          this.$message({
            type: 'info',
            message: res.msg
          })
        } else {
          this.$message({
            type: 'success',
            message: '状态修改成功'
          })
          this.getdata(this.formInline)
        }
      })
    },
    // 分页插件事件
    callFather(parm) {
      this.formInline.page = parm.currentPage
      this.formInline.limit = parm.pageSize
      this.getdata(this.formInline)
    },
    // 搜索事件
    search() {
      this.getdata(this.formInline)
    },
    //显示编辑界面
    handleEdit: function(index, row) {
      this.editFormVisible = true
      if (row != undefined && row != 'undefined') {
        this.title = '修改'
        this.editForm.id=row.id
        this.editForm.rolecode = row.rolecode
        this.editForm.name = row.name
        this.editForm.last_Update_By=this.user.nickname
        this.editForm.create_By=''
        this.editForm.stime = row.startime
        this.editForm.ptime = row.stoptime
        this.editForm.state=row.state.toString()
        this.editForm.description=row.description
      } else {
        this.title = '添加'
        this.editForm.id= ''
        this.editForm.rolecode = ''
        this.editForm.name = ''
        this.editForm.last_Update_By=''
        this.editForm.create_By=this.user.nickname
        this.editForm.stime = ''
        this.editForm.ptime = ''
        this.editForm.state='1'
        this.editForm.description= ''
      }
    },
    // 编辑、增加页面保存方法
    submitForm(editData) {
      this.$refs[editData].validate(valid => {
        if (valid) {
            if (this.title==="修改"){
              roleUpdate(this.editForm)
                .then(res => {
                  this.editFormVisible = false
                  this.loading = false
                  if (res.errorCode==200) {
                    this.getdata(this.formInline)
                    this.$message({
                      type: 'success',
                      message: '角色保存成功！'
                    })
                  } else {
                    this.$message({
                      type: 'info',
                      message: res.msg
                    })
                  }
                })
                .catch(err => {
                  this.editFormVisible = false
                  this.loading = false
                  this.$message.error('角色保存失败，请稍后再试！')
                })
            }else {
              roleSave(this.editForm)
                .then(res => {
                  this.editFormVisible = false
                  this.loading = false
                  if (res.errorCode==200) {
                    this.getdata(this.formInline)
                    this.$message({
                      type: 'success',
                      message: '角色保存成功！'
                    })
                  } else {
                    this.$message({
                      type: 'info',
                      message: res.msg
                    })
                  }
                })
                .catch(err => {
                  this.editFormVisible = false
                  this.loading = false
                  this.$message.error('角色保存失败，请稍后再试！')
                })
            }

        } else {
          return false
        }
      })
    },    // 选择复选框事件
    selectChange(val) {
      this.selectdata = val
    },
    // 删除角色
    deleteUser(index, row) {
      this.$confirm('确定要删除吗?', '信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          roleDelete(row.id)
            .then(res => {
              if (res.errorCode==200) {
                this.$message({
                  type: 'success',
                  message: '角色已删除！'
                })
                this.getdata(this.formInline)
              } else {
                this.$message({
                  type: 'info',
                  message: res.msg
                })
              }
            })
            .catch(err => {
              this.loading = false
              this.$message.error('角色删除失败，请稍后再试！')
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 删除一堆角色
    deleteUserAll(index, row) {
      let ids=new Array()
      this.selectdata.forEach(element=>{
        ids.push(element.id)
      })
      this.$confirm('确定要删除吗?', '信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          roleDelete(ids)
            .then(res => {
              if (res.errorCode==200) {
                this.$message({
                  type: 'success',
                  message: '角色已删除！'
                })
                this.getdata(this.formInline)
              } else {
                this.$message({
                  type: 'info',
                  message: res.msg
                })
              }
            })
            .catch(err => {
              this.loading = false
              this.$message.error('角色删除失败，请稍后再试！')
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 数据权限
    menuAccess: function(index, row) {
      this.menuAccessshow = true
      this.saveroleId = row.id
      console.log(this.saveroleId)
      RoleRightTree(this.saveroleId)
        .then(res => {
          if (res.data.errorCode === 200) {
            this.$message({
              type: 'success',
              message: '获取权限成功'
            })
            // this.changemenu(res.data.data)
            this.changemenu(res.data.checked)
            this.RoleRight = this.changeArr(res.data.date)
            console.log(res.data.checked)
            console.log(this.checkmenu)
            //this.RoleRight = this.changeArr(res.data.date)
          } else {


            this.$message({

              type: 'info',
              message: res.data.msg
            })
          }
        })
        .catch(err => {
          this.loading = false
          this.$message.error('获取权限失败，请稍后再试！')
        })
    },
    // 选中菜单
    changemenu(arr) {
      let change = []
      for (let i = 0; i < arr.length; i++) {
        if (arr[i]) {
          change.push(arr[i])
        }
      }
      this.checkmenu = change
    },
    // tree 递归
    changeArr(list) {
      var temptree = [],
        tree = [],
        items = []
      for (var i in list) {
        if (!temptree[list[i].id]) {
          var trow = {
            id: list[i].id,
            pId: list[i].pId,
            name: list[i].name,
            open: list[i].open,
            checked: list[i].checked,
            children: []
          }
          temptree[list[i].id] = trow
          items.push(trow)
        }
        if (list[i].uid > 0) {
          temptree[list[i].id]['children'].push({
            id: list[i].id,
            pId: list[i].pId,
            name: list[i].name,
            open: list[i].open,
            checked: list[i].checked,
            children: []
          })
        }
      }

      for (var j in items) {
        if (temptree[items[j].pId]) {
          temptree[items[j].pId]['children'].push(temptree[items[j].id])
        } else {
          tree.push(temptree[items[j].id])
        }
      }
      temptree = null
      items = null
      return tree
    },
    // 菜单权限-保存
    menuPermSave() {
      let parm = {
        rid: this.saveroleId,
        moduleIds: ''
      }
      let node = this.$refs.tree.getCheckedNodes()
      let moduleIds = new Array()
      if (node.length != 0) {
        for (let i = 0; i < node.length; i++) {
          moduleIds.push(node[i].id)
        }
        parm.moduleIds = JSON.stringify(moduleIds)
      }

      RoleRightSave(parm)
        .then(res => {
          if (res.errorCode==200) {
            this.$message({
              type: 'success',
              message: '权限保存成功'
            })
            this.menuAccessshow = false
            this.getdata(this.formInline)
          } else {
            this.$message({
              type: 'info',
              message: res.msg
            })
          }
        })
        .catch(err => {
          this.loading = false
          this.$message.error('权限保存失败，请稍后再试！')
        })
    },
    // 关闭编辑、增加弹出框
    closeDialog(dialog) {
      if (dialog == 'edit') {
        this.editFormVisible = false
      } else if (dialog == 'perm') {
        this.menuAccessshow = false
      }
    }
  }
}
</script>

<style scoped>
.user-search {
  margin-top: 20px;
}
.userRole {
  width: 100%;
}
</style>

