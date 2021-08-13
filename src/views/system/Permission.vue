/**
* 系统管理  系统环境变量
*/
<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>系统菜单管理</el-breadcrumb-item>
    </el-breadcrumb>
    <div v-if="jur[10].check!='on'">
      <h1 style="color: red">暂无权限</h1>
    </div>
    <!-- 搜索筛选 -->
    <el-form :inline="true" :model="formInline" class="user-search" v-if="jur[10].check=='on'">
<!--      <el-form-item label="搜索：">-->
<!--        <el-select size="small" v-model="formInline.state" placeholder="请选择状态">-->
<!--          <el-option label="全部" value=""></el-option>-->
<!--          <el-option label="正常" value="1"></el-option>-->
<!--          <el-option label="已锁定" value="0"></el-option>-->
<!--        </el-select>-->
<!--      </el-form-item>-->
      <el-form-item label="搜索:">
        <el-select size="small" v-model="formInline.menu_Type" placeholder="请选择菜单类型">
          <el-option label="全部" value="0"></el-option>
          <el-option label="目录" value="1"></el-option>
          <el-option label="菜单" value="2"></el-option>
          <el-option label="功能" value="3"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="">
        <el-input size="small" v-model="formInline.name" placeholder="输入菜单名称" ></el-input>
      </el-form-item>


      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-search" @click="search" :disabled="jur[10].check!='on'">搜索</el-button>
        <el-button size="small" type="primary" icon="el-icon-plus" @click="handleEdit()" :disabled="jur[13].check!='on'">添加</el-button>
        <el-button size="small" type="info" icon="el-icon-refresh-left" @click="clear">清除搜索信息</el-button>
        <el-button size="small" type="danger" icon="el-icon-delete"  @click="deleteArray()" :disabled="jur[12].check!='on'">删除选中</el-button>
      </el-form-item>
    </el-form>
    <!--列表-->
    <el-table size="small" @selection-change="selectChange" :data="listData" highlight-current-row v-loading="loading" border element-loading-text="拼命加载中" style="width: 100%;" v-if="jur[10].check=='on'">
      <el-table-column align="center" type="selection" width="60">
      </el-table-column>
      <el-table-column sortable  type="index" label="序号" width="50">
      </el-table-column>
      <el-table-column sortable prop="name" label="菜单名称" width="150">
      </el-table-column>
      <el-table-column sortable prop="father_Name" label="上级菜单" width="150">
        <template slot-scope="scope">{{ scope.row.father_Name === null ? '无' : scope.row.father_Name }}</template>
      </el-table-column>
      <el-table-column sortable prop="menu_Type" label="菜单类型" width="150">
        <template slot-scope="scope">{{ scope.row.menu_Type == 1 ? '目录' : scope.row.menu_Type == 2 ? '菜单' : '功能' }}</template>
      </el-table-column>
      <el-table-column sortable prop="sign" label="菜单标识" width="150">
      </el-table-column>
      <el-table-column sortable prop="url" label="菜单地址" width="200">
      </el-table-column>
      <!-- <el-table-column sortable prop="icon" label="菜单图标" width="100">
      </el-table-column> -->
<!--      <el-table-column align="state" sortable prop="menuEnabled" label="状态" min-width="70">-->
<!--        <template slot-scope="scope">-->
<!--          <el-switch v-model=" scope.row.state == '1' ?nshow:fshow" active-color="#13ce66" inactive-color="#ff4949"-->
<!--                     @change="editType(scope.$index, scope.row)">-->
<!--          </el-switch>-->
<!--        </template>-->
<!--      </el-table-column>-->
      <el-table-column align="center" label="操作" min-width="300">
        <template slot-scope="scope">
          <el-button size="mini" type="primary"  @click="handleEdit(scope.$index, scope.row,'添加')" v-bind:disabled="scope.row.menu_Type=='3' || jur[13].check!='on'" >添加</el-button>
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row,'修改')" :disabled="jur[11].check!='on'" >修改</el-button>
          <el-button size="mini" type="danger" @click="deleteMenu(scope.$index, scope.row) " :disabled="jur[12].check!='on'">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <Pagination v-bind:child-msg="pageparm" @callFather="callFather" v-if="jur[10].check=='on'"></Pagination>
    <!-- 编辑界面 -->
    <el-dialog :title="title" :visible.sync="editFormVisible" width="30%" @click="closeDialog">
      <el-form label-width="120px" :model="editForm" :rules="rules" ref="editForm">
        <el-form-item label="菜单类型" prop="menu_Type"  >
          <el-select size="small" v-model="editForm.menu_Type" placeholder="请选择" :disabled="false" @change="selectParentName(editForm)"  v-bind:disabled="editForm.id!=''">
            <el-option label="目录" value='1'></el-option>
            <el-option label="菜单" value='2'></el-option>
            <el-option label="功能" value='3'></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="菜单名称" prop="name">
          <el-input size="small" v-model="editForm.name" auto-complete="off" placeholder="菜单名称"></el-input>
        </el-form-item>
        <el-form-item label="父级菜单" prop="father_Name" >
          <el-select size="small" v-model="editForm.father_Name" placeholder="请选择" :disabled="editForm.menu_Type=='1'">
            <el-option v-for="item in menuParentData" :key="item.id" :label="item.name" :value="item.name"></el-option>
          </el-select>
        </el-form-item>

        <!-- <el-form-item label="父级菜单路径" prop="menuPath">
          <el-input size="small" v-model="menuPathData" auto-complete="off" placeholder="菜单路径"></el-input>
        </el-form-item> -->
        <el-form-item label="菜单路径" prop="url" v-if="editForm.menu_Type=='2'" >
          <el-input size="small" v-model="editForm.url" auto-complete="off" placeholder="菜单路径" ></el-input>
        </el-form-item>
        <el-form-item label="菜单标识" prop="sign" v-if="editForm.menu_Type=='3'" >
          <el-input size="small" v-model="editForm.sign" auto-complete="off" placeholder="菜单标识" ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="closeDialog">取消</el-button>
        <el-button size="small" type="primary" :loading="loading" class="title" @click="submitForm('editForm')">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  menuList,
  menuAdd,
  menuDelete,
  menuParentList,
  menuSave,
  menuState
} from '../../api/userMG'
import Pagination from '../../components/Pagination'
export default {
  data() {
    return {

      jur:{},
      nshow: true, //switch开启
      fshow: false, //switch关闭
      loading: false, //是显示加载
      editFormVisible: false, //控制编辑页面显示与隐藏
      menuParentData: [], //父级菜单数据
      menuPathData: [],
      title: '添加',
      editForm: {
        menuDisabled:false,
        id: '0',
        menu_Type: '',
        father_Name:'',
        name: '',
        state:'',
        sign: '',
        url: '',
        icon:'',
        enabled: '',
        flag:'',
        token: localStorage.getItem('logintoken')
      },
      id:[],
      // rules表单验证
      rules: {
        varLable: [
          { required: true, message: '请输入变量描述', trigger: 'blur' }
        ],
        varName: [
          { required: true, message: '请输入变量名称', trigger: 'blur' }
        ],
        varValue: [
          { required: true, message: '请输入变量名称', trigger: 'blur' }
        ]
      },
      formInline: {
        page: 1,
        limit: 10,
        name:'',
        state:'',
        menu_Type:'',
        token: localStorage.getItem('logintoken')
      },

      // 删除
      seletedata: {
        ids: '',
        token: localStorage.getItem('logintoken')
      },
      userparm: [], //搜索权限
      listData: [], //菜单数据
      item: [],

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

  },

  /**
   * 里面的方法只有被调用才会执行
   */
  methods: {
    //初始化下拉菜单
    selectParentName(parameter){
      // debugger;
      menuParentList(parameter)
        .then(res => {
          // console.log(JSON.stringify(res))
          // debugger;
          console.log("success="+JSON.stringify(res).length)//>=2就行
          this.loading = false;
          console.log();
          if (res.errorCode!=200) {
            this.$message({
              type: 'info',
              message: res.msg
            })
          } else {
            this.menuParentData=res.date
          }
        })
        .catch(err => {
          this.loading = false
          this.$message.error('父级菜单加载失败，请稍后再试！')
        })
    },

    // 获取数据方法
    async getdata(parameter) {
      this.loading = true
      /***
       * 调用接口，注释上面模拟数据 取消下面注释
       */
      parameter = {
        page: parameter.page,
        limit: parameter.limit,
        name: this.formInline.name,
        menu_Type: this.formInline.menu_Type,
        state: this.formInline.state,
        // ids: this.formInline.ids,
      }
      menuList(parameter)
        .then(res => {
          console.log(JSON.stringify(res))
          this.loading = false
          if (res.success == false) {
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
          this.$message.error('菜单加载失败，请稍后再试！')
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
    //批量删除
    deleteArray(index,row){
      let ids=new Array()
      this.selectdata.forEach(element=>{
        ids.push(element.id)
      })
      console.log(ids)

      this.$confirm('确定要删除吗?', '信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })

        .then(() => {
          menuDelete(ids)
            .then(res => {
              if (res.errorCode==200) {
                this.$message({
                  type: 'success',
                  message: res.msg
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
              this.$message.error('系统环境变量删除失败，请稍后再试！')
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 修改type
    editType: function(index, row) {
      this.loading = true
      let parm = {
        state: '0',
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
      menuState(parm).then(res => {
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
    handleEdit: function(index, row,name) {
      this.editFormVisible = true
      console.log(row)
      if ( row != undefined && row != 'undefined') {
        if (name=='修改'){
          this.title = '修改'
          this.editForm.id = row.id
          this.editForm.name = row.name
          this.editForm.sign=row.sign
          this.editForm.url=row.url
          this.editForm.menu_Type = row.menu_Type
          this.editForm.father_Name=row.father_Name
          this.editForm.parentId = row.parentId
          this.editForm.parentName = row.parentName
          this.editForm.state=row.state
          this.editForm.flag = true
          this.editForm.menuDisabled=true
        }else {
          this.title = '添加'
          this.editForm.id = ''
          this.editForm.name = ''
          this.editForm.sign=''
          this.editForm.url=''
          this.editForm.menu_Type = (parseInt(row.menu_Type)+1).toString()
          this.editForm.father_Name=row.name
          this.editForm.state='1'
          this.editForm.flag = false
          this.editForm.menuDisabled=false
        }
      } else {
        this.title = '添加'
        this.editForm.id = ''
        this.editForm.name = ''
        this.editForm.sign=''
        this.editForm.url=''
        this.editForm.menu_Type = ''
        this.editForm.father_Name=''
        this.editForm.state='1'
        this.editForm.flag = false
        this.editForm.menuDisabled=false
      }
      if(this.editForm.menuDisabled==true){
        this.selectParentName(this.editForm)
      }
    },
    selectChange(val){
      this.selectdata=val
    },
    clear(){
      this.formInline.menuName=''
      this.formInline.menuType=''
      this.formInline.isLock=''
    },
    // 修改、增加页面保存方法
    submitForm(editForm) {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          if(this.title== '修改' ){
            menuSave(this.editForm)
              .then(res => {
                this.editFormVisible = false
                this.loading = false
                if (res.errorCode!=200) {
                  this.$message({
                    type: 'info',
                    message: res.msg
                  })
                } else {
                  this.getdata(this.formInline)
                  this.$message({
                    type: 'success',
                    message: '菜单信息修改成功！'
                  })
                }
              })
              .catch(err => {
                this.editFormVisible = false
                this.loading = false
                this.$message.error('菜单信息修改失败，请稍后再试！')
              })
          }
          else{
            menuAdd(this.editForm)
              .then(res => {
                this.editFormVisible = false
                this.loading = false

                if (res.errorCode!=200) {
                  console.log(res.errorCode)
                  this.$message({
                    type: 'info',
                    message: res.msg
                  })
                } else {
                  this.getdata(this.formInline)
                  this.$message({
                    type: 'success',
                    message: '菜单添加成功！'
                  })
                }
              })
              .catch(err => {
                this.editFormVisible = false
                this.loading = false
                this.$message.error('菜单添加失败，请稍后再试！')
              })
          }
        } else {
          return false
        }
      })
    },
    // 删除权限
    deleteMenu(index, row) {
      this.$confirm('确定要删除吗?', '信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          menuDelete(row.id)
            .then(res => {
              if (res.errorCode==200) {
                this.$message({
                  type: 'success',
                  message: res.msg
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
              this.$message.error('系统环境变量删除失败，请稍后再试！')
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 关闭编辑、增加弹出框
    closeDialog() {
      this.editForm=[]
      this.editFormVisible = false
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
