<template>
  <div class="body">
    <div class="concent">
      <div class="v-search">
        <el-form
          ref="searchForm"
          :inline="true"
          :model="searchData"
          class="search-form-inline"
        >
          <el-form-item label="员工账号" prop="account">
            <el-input
              v-model="searchData.account"
              style="width: 150px"
              size="small"
            />
          </el-form-item>

          <el-form-item label="角色名称" prop="roleName">
            <el-select
              v-model="searchData.roleName"
              size="small"
              style="width: 150px"
            >
            <el-option label='全部' value=''>
            </el-option>
              <el-option
                v-for="item in options"
                :key="item.roleId"
                :label="item.title"
                :value="item.title"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="当前状态" prop="enable">
            <el-select
              v-model="searchData.enable"
              size="small"
              style="width: 150px"
            >
                          <el-option

                label="全部"
                value=""
              >
              </el-option>
              <el-option
                v-for="item in statusList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="创建时间查询" prop="date">
            <el-date-picker
              v-model="datetime"
              type="daterange"
              range-separator=""
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              size="medium"
              @change="datechange"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button
              icon="el-icon-search"
              type="danger"
              size="small"
              @click="handleSearch"
              >搜索</el-button
            >
            <el-button type="default" size="small" @click="handleReset"
              >重置</el-button
            >
            <el-button
              type="primary"
              size="small"
              @click="operationclick('add','id')"
              v-if='btnadd'
              >添加账号</el-button
            >
          </el-form-item>
        </el-form>
      </div>
      <Table border :columns="columns1" :data="data1" style="margin-top: 10px">
                <template slot-scope="{ row, index }" slot="slotstatus" >
           {{statusobj[row.enabled]}}
        </template>

        <template slot-scope="{ row, index }" slot="action">
          <Button type="primary" size="small" @click="operationclick('compile',row.id)" v-if='btnupdate'>编辑</Button>
          <Button type="success" size="small" @click="personnel('冻结',row.id)" v-if='row.enabled==true && btnupdateStatus'>冻结</Button>
          <Button type="info" size="small" @click="personnel('开启',row.id)" v-if='row.enabled==false && btnupdateStatus' >开启</Button>
          <Button type="error" size="small"  @click="personnel('删除',row.id)" v-if='row.enabled==false && btndelete' >删除</Button>
        </template>
      </Table>
      <div class="Page_warp">
        <Page
          show-total
          :total="loan_list_size"
          :page-size="10"
          show-elevator
          :current="1"
          :page-size-opts="[1,10]"
          show-sizer
          @on-change="pagechange"
          @on-page-size-change="sizechange"
        ></Page>
      </div>
    </div>

         <el-dialog :title="title" :visible.sync="applymodel" width="30%">

        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="150px"
          class="demo-ruleForm"
        >

            <el-form-item
              label="公司登陆账号"
              prop="account"

            >
              <el-input v-model="ruleForm.account"></el-input>
            </el-form-item>

               <el-form-item
              label="公司登陆密码"
              prop="password"

            >
              <el-input v-model="ruleForm.password" show-password></el-input>
            </el-form-item>

            <el-form-item
              label="角色"
              prop="roleId"

            >
              <el-select
                v-model="ruleForm.roleId"
                placeholder="请选择角色"
              >
                <el-option
                  v-for="item in options"
                  :key="item.roleId"
                  :label="item.title"
                  :value="item.roleId"
                >
                </el-option>
              </el-select>
            </el-form-item>

        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button @click="cancel('ruleForm')">取 消</el-button>
          <el-button type="primary" @click="submitForm('ruleForm')"
            >确 定</el-button
          >
        </span>

      </el-dialog>
  </div>
</template>

<script>
import { dateFormat, btnjust } from '@/utils/tools.js'
import { settinglist, rolelist, accountadd, accountupdate, submupdate, settingfreeze, settingdel } from '@/api/api'
export default {
  data () {
    return {
      btnupdate: btnjust('设置', '员工账号管理', 'onestop:account:update'),
      btnupdateStatus: btnjust('设置', '员工账号管理', 'onestop:account:updateStatus'),
      btndelete: btnjust('设置', '员工账号管理', 'onestop:account:delete'),
      btnadd: btnjust('设置', '员工账号管理', 'onestop:account:add'),
      iid: '',
      title: '',
      applymodel: false,
      loan_list_size: 1,
      datetime: [],
      searchData: {
        account: '',
        enable: '',
        roleName: '',
        createTimeStart: '',
        createTimeEnd: '',
        pageSize: 10,
        pageNum: 1
      },
      ruleForm: {
        account: '',
        password: '',
        roleId: ''
      },
      rules: {
        account: [{required: true, message: '请输入登陆账号'}],
        password: [{required: true, message: '请输入登陆密码'}],
        roleId: [{required: true, message: '请选择角色'}]
      },
      statusobj: {
        true: '已开启',
        false: '已冻结'
      },
      options: [],
      statusList: [
        {
          value: 1,
          label: '已开启'
        },
        {
          value: 0,
          label: '已冻结'
        }
      ],
      columns1: [
        {
          title: '员工账号',
          key: 'account',
          align: 'center'
        },
        {
          title: '角色名称',
          key: 'roleName',
          align: 'center'
        },
        {
          title: '创建时间',
          key: 'createTime',
          align: 'center'
        },
        {
          title: '当前状态',
          slot: 'slotstatus',
          align: 'center'
        },
        {
          title: '最后更新时间',
          key: 'updateTime',
          align: 'center'
        },
        {
          title: '操作人',
          key: 'operator',
          align: 'center'
        },
        {
          title: '操作',
          slot: 'action',
          align: 'center'
        }
      ],
      data1: [],
      type: ''
    }
  },
  methods: {
    init () {
      settinglist(this.searchData).then((res) => {
        console.log(res)
        if (res.data.data) {
          this.data1 = res.data.data.records
          this.loan_list_size = res.data.data.total
        }
      })
    },
    roleinit () {
      rolelist().then((res) => {
        this.options = res.data.data
      })
    },
    // 日期选择
    datechange (date) {
      if (date != null) {
        this.searchData.createTimeStart = dateFormat(date[0])
        this.searchData.createTimeEnd = dateFormat(date[1])
      } else {
        this.searchData.createTimeStart = ''
        this.searchData.createTimeEnd = ''
      }
    },
    handleSearch () {
      this.init()
    },
    // 重置按钮
    handleReset () {
      this.searchData.createTimeStart = ''
      this.searchData.createTimeEnd = ''
      this.$refs.searchForm.resetFields()
      this.datetime = []
      this.init()
    },
    operationclick (type, id) {
      const List = this.rules['password']
      this.iid = id
      this.applymodel = true
      this.type = type
      if (type == 'add') {
        this.title = '员工账号添加'
        delete this.ruleForm.id
        for (let i = 0; i < List.length; i++) {
          const el = List[i]
          el.required = true
        }
      } else {
        for (let i = 0; i < List.length; i++) {
          const el = List[i]
          el.required = false
        }
        this.title = '员工账号编辑'
        this.ruleForm.id = id
        accountupdate({id: id}).then((res) => {
          for (let key in this.ruleForm) {
            this.ruleForm[key] = res.data.data[key]
          }
        })
      }
    },
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) return
        if (this.type == 'add') {
          accountadd(this.ruleForm).then((res) => {
            if (res.data.code == '0') {
              this.init()
              this.applymodel = false
              this.$message.success('新增成功')
            } else {
              this.$message.error(res.data.msg)
            }
          })
        } else {
          submupdate(this.ruleForm).then((res) => {
            if (res.data.code == '0') {
              this.init()
              this.applymodel = false
              this.$message.success('编辑成功')
            } else {
              this.$message.error(res.data.msg)
            }
          })
        }
      })
    },
    cancel (formName) {
      this.applymodel = false
      this.ruleForm = {}
      this.$refs[formName].resetFields()
    },
    sizechange (e) {
      this.searchData.pageSize = e
      this.init()
    },
    pagechange (e) {
      this.searchData.pageNum = e
      this.init()
    },
    // 操作
    personnel (type, id) {
      console.log(id)
      this.$confirm(`是否${type}`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
        .then(() => {
          if (type != '删除') {
            settingfreeze({id: id}).then((res) => {
              console.log(res)
              if (res.data.code == '0') {
                this.init()
              } else {
                this.$message.error(res.data.msg)
              }
            })
          } else {
            settingdel({id: id}).then((res) => {
              console.log(res)
              if (res.data.code == '0') {
                this.init()
              } else {
                this.$message.error(res.data.msg)
              }
            })
          }
        })
        .catch(() => {})
    }
  },
  mounted () {
    this.init()
    this.roleinit()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.body {
  width: 100%;
  /* min-height: 100vh; */
}
.concent {
  width: 95%;
  margin: 0 auto;
}
.Page_warp {
  margin-top: 10px;
}
</style>
