/**
 * 系统管理 用户管理
 */
<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
    </el-breadcrumb>
    <div v-if="jur[3].check!='on'">
      <h1 style="color: red">暂无权限</h1>
    </div>
    <!-- 搜索筛选 -->
    <el-form :inline="true" :model="formInline" class="user-search" v-if="jur[3].check=='on'">
      <el-form-item label="搜索：" >
        <el-select size="small" v-model="formInline.state" placeholder="请选择" >
          <el-option label="全部" value=""></el-option>
          <el-option label="有效" value="1"></el-option>
          <el-option label="无效" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="">
        <el-input size="small" v-model="formInline.nickname" placeholder="输入用户名" clearable ></el-input>
      </el-form-item>
      <el-form-item label="">
        <el-input size="small" v-model="formInline.name" placeholder="姓名" clearable></el-input>
      </el-form-item>
      <el-form-item label="最后修改时间:" >
        <el-date-picker
          size="small"
          v-model="formInline.date"
          type="datetimerange"
          :picker-options="pickerOptions"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          align="right">
        </el-date-picker>
        <!--        <el-input size="small" v-model="formInline.userMobile" placeholder="开始时间 格式：yyyy-mm-dd"></el-input>-->
      </el-form-item>

      <el-form-item>

        <el-button size="small" type="primary" icon="el-icon-search" @click="search" :disabled="jur[3].check!='on'">搜索</el-button>
        <el-button size="small" type="primary" icon="el-icon-plus" @click="handleEdit()" :disabled="jur[0].check!='on'" >添加</el-button>
        <el-button size="small" type="info" icon="el-icon-refresh-left"  @click="empty">清除搜索信息</el-button>
        <el-button size="small" type="danger" icon="el-icon-delete"   @click="deleteUserAll" :disabled="jur[1].check!='on'" >删除选中</el-button>
      </el-form-item>
    </el-form>
    <!--列表-->
    <el-table size="small" @selection-change="selectChange" :data="this.userData" :height="440" v-loading="loading" border element-loading-text="拼命加载中" style="width: 100%;" v-if="jur[3].check=='on'">
      <el-table-column align="center" type="selection" width="50">
      </el-table-column>
      <el-table-column label="序号"  type="index" width="80" align="center" >
      </el-table-column>
      <el-table-column align="center" sortable prop="nickname" label="用户名" width="90">
      </el-table-column>
      <el-table-column align="center" sortable prop="name" label="姓名" width="90">
      </el-table-column>
      <el-table-column align="center" sortable prop="sex" label="性别" min-width="80">
      </el-table-column>
      <el-table-column align="center" sortable prop="create_By" label="创建人" min-width="100">
      </el-table-column>
      <el-table-column align="center" sortable prop="last_Update_By" label="最后修改人" min-width="120">
      </el-table-column>
      <el-table-column align="center" sortable prop="phone" label="手机" width="120">
      </el-table-column>
      <el-table-column align="center" sortable prop="email" label="邮箱" min-width="120">
      </el-table-column>
      <el-table-column align="center" sortable prop="creation_Date" label="修改时间" min-width="120">
        <template slot-scope="scope">
          <div>{{scope.row.creation_Date|timestampToTime}}</div>
        </template>
      </el-table-column>
      <el-table-column align="center" sortable prop="last_Updated_Date" label="最后修改时间" min-width="120">
        <template slot-scope="scope">
          <div>{{scope.row.last_Updated_Date|timestampToTime}}</div>
        </template>
      </el-table-column>
      <el-table-column align="center" sortable prop="state" label="状态" min-width="80" >
        <template slot-scope="scope">
          <el-switch v-model="scope.row.state=='1'?nshow:fshow" active-color="#13ce66" inactive-color="#ff4949" @change="editType(scope.$index, scope.row)" :disabled="jur[2].check!='on'">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" min-width="280">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)" :disabled="jur[2].check!='on'" >编辑</el-button>
          <el-button size="mini" type="danger" @click="deleteUser(scope.$index, scope.row)" :disabled="jur[1].check!='on'" >删除</el-button>
          <el-button size="mini" type="success" @click="dataAccess(scope.$index, scope.row)" :disabled="jur[4].check!='on' || scope.row.nickname ==user.nickname" >设置角色</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <Pagination v-bind:child-msg="pageparm" @callFather="callFather" v-if="jur[3].check=='on'"></Pagination>
    <!-- 编辑界面 -->
    <el-dialog :title="title" :visible.sync="editFormVisible" width="30%" @click='closeDialog("edit")'>
      <el-form label-width="80px" ref="editForm" :model="editForm" :rules="rules">
        <el-form-item label="用户名" prop="nickname">
          <el-input size="small" v-model="editForm.nickname" auto-complete="off" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input size="small" v-model="editForm.name" auto-complete="off" placeholder="请输入姓名"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input size="small" type="password"  v-model="editForm.password" auto-complete="off" placeholder="请输入密码"></el-input>
        </el-form-item>
<!--        <el-form-item label="确认密码" prop="password">-->
<!--          <el-input size="small" v-model="editForm.password" auto-complete="off" placeholder="请输入确认密码"></el-input>-->
<!--        </el-form-item>-->
        <el-form-item label="手机号" prop="phone">
          <el-input size="small" v-model="editForm.phone" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input size="small" v-model="editForm.email" placeholder="请输入邮箱地址"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-radio v-model="editForm.sex" label="男">男</el-radio>
          <el-radio v-model="editForm.sex" label="女">女</el-radio>
        </el-form-item>
        <el-form-item label="状态" prop="state">
          <el-radio v-model="editForm.state" label="1">有效</el-radio>
          <el-radio v-model="editForm.state" label="2">无效</el-radio>
        </el-form-item>
        <el-form-item label="备注" prop="">
          <el-input size="small" v-model="editForm.description" placeholder="请输入备注"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click='closeDialog("edit")'>取消</el-button>
        <el-button size="small" type="primary" :loading="loading" class="title" @click="submitForm('editForm')">保存</el-button>
      </div>
    </el-dialog>
    <!-- 数据权限 -->
    <el-dialog title="设置角色" :visible.sync="dataAccessshow" width="30%" @click='closeDialog("perm")'>
      <el-tree ref="tree" default-expand-all="" :data="UserDept" :props="defaultProps" :default-checked-keys="checkmenu" node-key="id" show-checkbox>
      </el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click='closeDialog("perm")'>取消</el-button>
        <el-button size="small" type="primary" :loading="loading" class="title" @click="menuPermSave">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// 导入请求方法
import {
  userList,
  userSave,
  userUpdate,
  userDelete,
  userPwd,
  userExpireToken,
  userFlashCache,
  userLock,
  UserDeptTree,
  UserDeptSave,
  UserDeptdeptTree,
  UserChangeDept
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
      title: '添加用户',
      editFormVisible: false, //控制编辑页面显示与隐藏
      dataAccessshow: false, //控制数据权限显示与隐藏
      unitAccessshow: false, //控制所属单位隐藏与显示
      // 编辑与添加
      editForm: {
        id:'',
        nickname: '',
        create_By:'',
        last_Update_By:'',
        name: '',
        sex: '',
        phone: '',
        email: '',
        password: '',
        state: '',
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
      value1: '',
      value2: '',
      value3: '',

      // 部门参数
      unitparm: {
        userIds: '',
        deptId: '',
        deptName: ''
      },
      // 选择数据
      selectdata: [],
      // rules表单验证
      rules: {
        nickname: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        roleId: [{ required: true, message: '请选择角色', trigger: 'blur' }],
        password:[{
          required:true,message:'请输入密码',trigger:'blur'
        }],
        phone: [
          { required: false, message: '请输入手机号', trigger: 'blur' },
          {
            pattern: /^1(3\d|47|5((?!4)\d)|7(0|1|[6-8])|8\d)\d{8,8}$/,
            required: false,
            message: '请输入正确的手机号',
            trigger: 'blur'
          }
        ],
        email: [
          { required: false, message: '请输入邮箱', trigger: 'blur' },
          {
            pattern: /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
            required: false,
            message: '请输入正确的邮箱',
            trigger: 'blur'
          }
        ],
        sex: [{ required: false, message: '请选择性别', trigger: 'blur' }],
        state: [{ required: true, message: '请选择状态', trigger: 'blur' }]
      },
      // 删除用户
      seletedata: {
        ids: '',
        token: localStorage.getItem('logintoken')
      },
      // 重置密码
      resetpsd: {
        userId: '',
        token: localStorage.getItem('logintoken')
      },
      // 用户下线
      offline: {
        token: localStorage.getItem('logintoken')
      },
      // 请求数据参数
      formInline: {
        page: 1,
        limit: 10,
        state: '',
        nickname: '',
        name: '',
        date: ''
      },
      //用户数据
      userData: [],
      // 数据权限
      UserDept: [],
      defaultProps: {
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
    this.jur = JSON.parse(localStorage.getItem('jur'))
    this.user = JSON.parse(localStorage.getItem('userdata'))
    this.getdata(this.formInline)
    console.log("权限"+this.jur)
  },

  /**
   * 里面的方法只有被调用才会执行
   */
  methods: {
    empty(){
      this.formInline.name='',
        this.formInline.nickname='',
        this.formInline.state='',
        this.formInline.date=''
    },
    // 获取数据方法
    getdata(parameter) {
      this.loading = true
      /***
       * 调用接口，注释上面模拟数据 取消下面注释
       */
      //获取用户列表
      userList(parameter).then(res => {
        this.loading = false
        if (res.success === false) {
          this.$message({
            type: 'info',
            message: res.msg
          })
        } else {

          this.userData = res.date
          // 分页赋值
          this.pageparm.currentPage = this.formInline.page
          this.pageparm.pageSize = this.formInline.limit
          this.pageparm.total = res.total
          console.log(this.userData)
        }
      })
    },
    // 分页插件事件
    callFather(parm) {
      this.formInline.page = parm.currentPage
      this.formInline.limit = parm.pageSize
      this.getdata(this.formInline)
    },
    //搜索事件
    search() {
      this.getdata(this.formInline)
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
      userLock(parm).then(res => {
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
    //显示编辑界面
    handleEdit: function(index, row) {
      this.editFormVisible = true
      if (row != undefined && row != 'undefined') {
        this.title = '修改用户'
        this.editForm.id=row.id
        this.editForm.last_Update_By=this.user.nickname
        this.editForm.create_By=''
        this.editForm.nickname = row.nickname
        this.editForm.name = row.name
        this.editForm.sex=row.sex
        this.editForm.state=row.state.toString()
        this.editForm.email=row.email
        this.editForm.phone=row.phone
      } else {
        this.title = '添加用户'
        this.editForm.nickname = ''
        this.editForm.last_Update_By=''
        this.editForm.create_By=this.user.nickname
        this.editForm.name  = ''
        this.editForm.email = ''
        this.editForm.phone = ''
        this.editForm.sex = ''
        this.editForm.userEmail = ''
        this.editForm.userSex = ''
      }
    },
    // 编辑、添加提交方法
    submitForm(editData) {
      this.$refs[editData].validate(valid => {
        if (valid) {
          // 请求方法
          if (this.title==="修改用户"){
            userUpdate(this.editForm)
              .then(res => {
                this.editFormVisible = false
                this.loading = false
                if (res.errorCode==200) {
                  this.getdata(this.formInline)
                  this.$message({
                    type: 'success',
                    message: '数据保存成功！'
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
                this.$message.error('保存失败，请稍后再试！')
              })
          }else {
            this.editForm.create_By=this.user.nickname
            userSave(this.editForm)
              .then(res => {
                this.editFormVisible = false
                this.loading = false
                if (res.errorCode==200) {
                  this.getdata(this.formInline)
                  this.$message({
                    type: 'success',
                    message: '数据保存成功！'
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
                this.$message.error('保存失败，请稍后再试！')
              })
          }

        } else {
          return false
        }
      })
    },
    // 显示部门设置
    handleunit: function(index, row) {
      this.unitAccessshow = true
      let parms = 0
      UserDeptdeptTree(parms)
        .then(res => {
          if (res.data.success) {
            this.UserDept = this.changeArr(res.data.data)
          } else {
            this.$message({
              type: 'info',
              message: res.msg
            })
          }
        })
        .catch(err => {
          this.loading = false
          this.$message.error('配置权限失败,请稍后再试！')
        })
    },
    handleClick(data, checked, node) {
      if (checked) {
        this.$refs.tree.setCheckedNodes([])
        this.$refs.tree.setCheckedNodes([data])
        this.unitparm.deptId = data.id
        this.unitparm.deptName = data.name
        //交叉点击节点
      } else {
      }
    },
    // // 保存部门
    // unitPermSave() {
    //   let len = this.selectdata
    //   let ids = []
    //   if (len != 0) {
    //     for (let i = 0; i < len.length; i++) {
    //       ids.push(len[i].userId)
    //     }
    //   }
    //   this.unitparm.userIds = ids.join(',')
    //   UserChangeDept(this.unitparm)
    //     .then(res => {
    //       this.unitAccessshow = false
    //       if (res.success) {
    //         this.$message({
    //           type: 'success',
    //           message: '部门设置成功！'
    //         })
    //         this.getdata(this.formInline)
    //       } else {
    //         this.$message({
    //           type: 'info',
    //           message: res.msg
    //         })
    //       }
    //     })
    //     .catch(err => {
    //       this.loading = false
    //       this.$message.error('部门设置失败,请稍后再试！')
    //     })
    // },
    // 选择复选框事件
    selectChange(val) {
      this.selectdata = val
    },
    // 关闭编辑、增加弹出框
    closeDialog(dialog) {
      if (dialog == 'edit') {
        this.editFormVisible = false
      } else if (dialog == 'perm') {
        this.dataAccessshow = false
      } else if (dialog == 'unit') {
        this.unitAccessshow = false
      }
    },
    // 删除用户
    deleteUser(index, row) {
      this.$confirm('确定要删除吗?', '信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          // 删除
          userDelete(row.id)
            .then(res => {
              if (res.errorCode==200) {
                this.$message({
                  type: 'success',
                  message: '数据已删除!'
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
              this.$message.error('数据删除失败，请稍后再试！')
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除！'
          })
        })
    },
    // 删除一堆用户
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
          // 删除
          userDelete(ids)
            .then(res => {
              if (res.errorCode==200) {
                this.$message({
                  type: 'success',
                  message: '数据已删除!'
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
              this.$message.error('数据删除失败，请稍后再试！')
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除！'
          })
        })
    },
    // 重置密码
    resetpwd(index, row) {
      this.resetpsd.userId = row.userId
      this.$confirm('确定要重置密码吗?', '信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          userPwd(this.resetpsd)
            .then(res => {
              if (res.success) {
                this.$message({
                  type: 'success',
                  message: '重置密码成功！'
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
              this.$message.error('重置密码失败，请稍后再试！')
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '取消重置密码！'
          })
        })
    },
    // 数据权限
    dataAccess: function(index, row) {
      this.dataAccessshow = true
      this.saveroleId = row.id
      UserDeptTree(this.saveroleId)
        .then(res => {
          console.log(res.data.checked)
          console.log(res.data.errorCode)
          console.log(res.data.date)
          if (res.data.errorCode===200) {
            this.checkmenu = this.changemenu(res.data.checked)
            this.UserDept = this.changeArr(res.data.date)
            console.log(this.checkmenu)
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
    // //数据格式化
    // changeArr(data) {
    //   var pos = {}
    //   var tree = []
    //   var i = 0
    //   while (data.length != 0) {
    //       tree.push({
    //         id: data[i].id,
    //         name: data[i].name,
    //         rolecode: data[i].rolecode,
    //         startime: data[i].startime,
    //         stoptime: data[i].stoptime,
    //         children: []
    //       })
    //       pos[data[i].id] = [tree.length - 1]
    //       data.splice(i, 1)
    //       i--
    //     i++
    //     if (i > data.length - 1) {
    //       i = 0
    //     }
    //   }
    //   return tree
    // },
    // 选中菜单
    changemenu(arr) {
      let change = []
      for (let i = 0; i < arr.length; i++) {
        if (arr[i]) {
          change.push(arr[i])
        }
      }
      return change
    },
    // 菜单权限-保存
    menuPermSave() {
      let parm = {
        userId: this.saveroleId,
        deptIds: ''
      }
      let node = this.$refs.tree.getCheckedNodes()
      let moduleIds = []
      if (node.length != 0) {
        for (let i = 0; i < node.length; i++) {
          moduleIds.push(node[i].id)
        }
        parm.deptIds = JSON.stringify(moduleIds)
      }
      UserDeptSave(parm)
        .then(res => {
          if (res.errorCode==200) {
            this.$message({
              type: 'success',
              message: '角色保存成功'
            })
            this.dataAccessshow = false
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
    // 下线用户
    offlineUser(index, row) {
      this.$confirm('确定要让' + row.userName + '用户下线吗?', '信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          userExpireToken(row.userName)
            .then(res => {
              if (res.success) {
                this.$message({
                  type: 'success',
                  message: '用户' + row.userName + '强制下线成功！'
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
              this.$message.error('用户下线失败，请稍后再试！')
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
    },
    // 刷新缓存
    refreshCache(index, row) {
      userFlashCache(row.userName)
        .then(res => {
          if (res.success) {
            this.$message({
              type: 'success',
              message: '刷新成功！'
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
          this.$message.error('刷新失败，请稍后再试！')
        })
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

