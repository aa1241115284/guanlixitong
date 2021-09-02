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
          <el-form-item label="用户ID" prop="userId">
            <el-input
              v-model="searchData.userId"
              style="width: 150px"
              size="small"
            />
          </el-form-item>

          <el-form-item label="用户账号" prop="userName">
            <el-input
              v-model="searchData.userName"
              style="width: 150px"
              size="small"
            />
          </el-form-item>

          <el-form-item label="会员等级" prop="membersId">
            <el-select
              v-model="searchData.membersId"
              size="small"
              style="width: 150px"
            >
              <el-option
                v-for="item in objfunction(consumetype)"
                :key="item.key"
                :label="item.val"
                :value="item.key"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="创建时间查询" prop="datetime">
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

          <el-form-item label="到期时间查询" prop="datetime1">
            <el-date-picker
              v-model="datetime1"
              type="daterange"
              range-separator=""
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              size="medium"
              @change="datechange1"
            >
            </el-date-picker>
          </el-form-item>

          <el-form-item label="用户状态" prop="userStatus">
            <el-select
              v-model="searchData.userStatus"
              size="small"
              style="width: 150px"
            >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
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
            <el-button type="primary" size="small" @click="addClick" v-if='btnadd'
              >添加</el-button
            >
          </el-form-item>
        </el-form>
      </div>
      <Table border :columns="columns1" :data="data1" style="margin-top: 10px">
        <template slot-scope="{ row, index }" slot="slotstatus">
         {{row.vipLevel}}
        </template>
        <template slot-scope="{ row, index }" slot="slotuserStatus">
         {{statusobj[row.userStatus]}}
        </template>

        <template slot-scope="{ row, index }" slot="action">
          <Button type="primary" size="small" v-if='btndetails' @click="pack_Click(row.userId)">详情</Button>
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

    <el-dialog
      title="账号开通审核订单"
      :visible.sync="applymodel"
      width="800px"
    >
      <div class="h1_title">用户信息</div>
      <table class="table">
        <tr>
          <td>用户手机号</td>
          <td class="value">{{detailsobj.contactMobile}}</td>
          <td>用户邮箱</td>
          <td class="value">{{detailsobj.contactEmail}}</td>
          <td>会员等级</td>
          <td class="value">{{detailsobj.vipLevel}}</td>
        </tr>
        <tr>
          <td>开户时间</td>
          <td class="value">{{detailsobj.createDate}}</td>
          <td>有效期至</td>
          <td class="value">{{detailsobj.vipValidity}}</td>
          <td>续费次数</td>
          <td class="value">{{detailsobj.renewalNumber}}</td>
        </tr>
        <tr>
          <td>当前状态</td>
          <td class="value">{{statusobj[detailsobj.userStatus]}}</td>
        </tr>
      </table>

      <div class="h1_title">店铺信息</div>
      <div class="class_have" v-if='store_data.length==0'>用户还未创建商城</div>
      <div v-else>
      <Table
        border
        :columns="store_columns"
        :data="store_data"
        style="margin-top: 10px"
      >
        <template slot-scope="{ row, index }" slot="action">
          <el-button  type="primary" size="small"  @click='detailsClick(row.orderId)'>详情</el-button>
        </template>
        <template slot-scope="{ row, index }" slot="slotorderStatus">
          {{orderStatusobj[row.orderStatus]}}
        </template>

      </Table>
      </div>

      <div>

       <div class="table" style="margin-top: 20px" v-if='detailsmodel'>
         <div class="h1_title">店铺详情</div>
        <div v-for="(item, index) in particularslist" :key="index">
          <template >
            <div class="tableClass">{{ item.configTitle }}</div>
            <div class="value tableClass classurl" v-if="item.paramsType == 'url'">
              <a :href="item.configValue" target="_blank">{{ item.configValue }}</a>
            </div>
                <div class="value tableClass" v-else>
              {{ item.configValue }}
            </div>
          </template>
        </div>
      </div>

      </div>
    </el-dialog>

    <el-dialog title="新增" :visible.sync="addmodel" width="800px">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="120px"
        class="demo-ruleForm"
      >
        <el-form-item label="用户登录账号" prop="userName">
          <el-input v-model="ruleForm.userName"></el-input>
        </el-form-item>
        <el-form-item label="用户登录密码" prop="userPassword">
          <el-input v-model="ruleForm.userPassword"></el-input>
        </el-form-item>
        <el-form-item label="联系人姓名" prop="contactName">
          <el-input v-model="ruleForm.contactName"></el-input>
        </el-form-item>
        <el-form-item label="联系人手机号" prop="contactMobile">
          <el-input v-model="ruleForm.contactMobile"></el-input>
        </el-form-item>
        <el-form-item label="联系人邮箱" prop="contactEmail">
          <el-input v-model="ruleForm.contactEmail"></el-input>
        </el-form-item>

        <el-form-item label="会员等级" prop="membersId">
          <el-select
            v-model="ruleForm.membersId"
          >
            <el-option
              v-for="item in objfunction(consumetype)"
              :key="item.key"
              :label="item.val"
              :value="item.key"
            >
            </el-option>
          </el-select>
        </el-form-item>
         <el-form-item label="会员有效期" prop="validityValue">
          <el-select
            v-model="ruleForm.validityValue"
          >
            <el-option
              v-for="item in membersValList"
              :key="item.key"
              :label="item.val"
              :value="item.key"
            >
            </el-option>
          </el-select>
        </el-form-item>
                  <el-form-item
            label="上传支付凭证"
            prop="payVoucher"
          >
            <el-upload
              class="avatar-uploader"
              action="#"
              :show-file-list="false"
              :http-request="httpRequest"
              :before-upload="beforeUpload"
            >
              <img v-if="ruleForm.payVoucher" :src="ruleForm.payVoucher" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
      </el-form>
     <div slot="footer" class="dialog-footer">
     <el-button  type="primary" size="small" @click="submClick('ruleForm')" :loading='subloading'>提交</el-button>
     </div>
    </el-dialog>
  </div>
</template>

<script>
import { dateFormat, btnjust } from '@/utils/tools.js'
import { usermanagerlist, membergetModules, ossupload, usermanageradd, managerdetails, userorderdetails } from '@/api/api'
export default {
  data () {
    return {
      btnadd: btnjust('用户管理', '用户管理', 'onstop:userManager:add'),
      btndetails: btnjust('用户管理', '用户管理', 'onstop:userManager:details'),
      particularslist: [],
      detailsobj: '',
      membersValList: [{key: '1Y', val: '一年'}],
      subloading: false,
      addmodel: false,
      title: '',
      applymodel: false,
      loan_list_size: 1,
      datetime: [],
      datetime1: [],
      searchData: {
        userId: '',
        userName: '',
        userStatus: '',
        membersId: '',
        createTimeStart: '',
        createTimeEnd: '',
        vipValidityStart: '',
        vipValidityEnd: '',
        pageNum: 1,
        pageSize: 10
      },
      ruleForm: {
        userName: '',
        userPassword: '',
        contactName: '',
        contactMobile: '',
        contactEmail: '',
        membersId: '',
        validityValue: '',
        payVoucher: ''
      },
      rules: {
        userName: [{ required: true, message: '请输入用户登陆账号' }],
        userPassword: [{ required: true, message: '请输入用户登陆密码' }],
        contactName: [{ required: true, message: '请输入用户联系人姓名' }],
        contactMobile: [{ required: true, message: '请输入用户联系人手机号' }],
        contactEmail: [{ required: true, message: '请输入用户联系人邮箱' }],
        membersId: [{ required: true, message: '请选择会员等级' }],
        validityValue: [{ required: true, message: '请选择会员有效期' }],
        payVoucher: [{ required: true, message: '请上传支付凭证' }]
      },
      statusobj: {
        'wait_checking': '待审核',
        'checking': '审核中',
        'checking_fail': '审核失败',
        'useing': '使用中',
        'expired': '已过期'
      },
      options: [
        {
          value: '',
          label: '全部'
        },
        {
          value: 'wait_checking',
          label: '待审核'
        },
        {
          value: 'checking',
          label: '审核中'
        },
        {
          value: 'checking_fail',
          label: '审核失败'
        },
        {
          value: 'useing',
          label: '使用中'
        },
        {
          value: 'expired',
          label: '已过期'
        }
      ],
      orderStatusobj: {
        'opening': '开通中',
        'openSucceed': '开通成功',
        'openFailure': '开通失败'
      },
      store_columns: [
        {
          title: '订单ID',
          key: 'orderId',
          align: 'center'
        },
        {
          title: '三方名称',
          key: 'channelName',
          align: 'center'
        },
        {
          title: '状态',
          slot: 'slotorderStatus',
          align: 'center'
        },
        {
          title: '申请时间',
          key: 'createTime',
          align: 'center'
        },
        {
          title: '创建时间',
          key: 'createTime',
          align: 'center'
        },
        {
          title: '操作',
          slot: 'action',
          align: 'center'
        }
      ],
      store_data: [],
      columns1: [
        {
          title: '用户ID',
          key: 'userId',
          align: 'center'
        },
        {
          title: '用户账号',
          key: 'userName',
          align: 'center'
        },
        {
          title: '会员等级',
          slot: 'slotstatus',
          align: 'center'
        },
        {
          title: '创建时间',
          key: 'createTime',
          align: 'center'
        },
        {
          title: '有效期至',
          key: 'vipValidity',
          align: 'center'
        },
        {
          title: '续费次数',
          key: 'renewalNumber',
          align: 'center'
        },
        {
          title: '当前状态',
          slot: 'slotuserStatus',
          align: 'center'
        },
        {
          title: '操作',
          slot: 'action',
          align: 'center'
        }
      ],
      data1: [],
      consumetype: [],
      detailsmodel: false
    }
  },
  watch: {
    applymodel (val) {
      if (val == false) {
        this.detailsmodel = false
      }
    }
  },
  methods: {
    // 店铺详情
    detailsClick (oid) {
      console.log(oid)
      userorderdetails({orderId: oid}).then((res) => {
        console.log(res)
        this.particularslist = res.data.data
        this.detailsmodel = true
      })
    },
    init () {
      usermanagerlist(this.searchData).then((res) => {
        this.data1 = res.data.data.records
        this.loan_list_size = res.data.data.total
      })
    },
    membinit () {
      membergetModules().then((res) => {
        this.consumetype = res.data.data
      })
    },
    objfunction (val) {
      var array = []
      for (let key in val) {
        array.push({
          key: key,
          val: val[key]
        })
      }
      return array
    },
    addClick () { this.addmodel = true },
    submClick (formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) return
        this.subloading = true
        usermanageradd(this.ruleForm).then((res) => {
          this.subloading = false
          if (res.data.code == '0') {
            this.init()
            this.addmodel = false
            this.$message.success('新增成功')
          } else {
            this.$message.error(res.data.msg)
          }
        })
      })
    },
    httpRequest (file) {
      const reader = new FileReader()
      reader.readAsDataURL(file.file)
      reader.onload = (e) => {
        ossupload({base64: e.target.result}).then((res) => {
          this.ruleForm.payVoucher = res.data.data
        })
      }
    },
    beforeUpload (file) {
      const type = 'image/jpg,image/png,image/jpeg'
      const accepts = type.split(',')
      const size = file.size / 1024 / 1024 < 1
      if (!accepts.includes(file.type)) {
        this.$message.error('请上传 png,jpg 类型的图片')
        return
      }
      if (!size) {
        this.$message.error(`上传图片大小不能超过 1MB!`)
      }
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
    datechange1 (date) {
      if (date != null) {
        this.searchData.vipValidityStart = dateFormat(date[0])
        this.searchData.vipValidityEnd = dateFormat(date[1])
      } else {
        this.searchData.vipValidityStart = ''
        this.searchData.vipValidityEnd = ''
      }
    },
    handleSearch () {
      this.init()
    },
    // 重置按钮
    handleReset () {
      this.searchData.createTimeStart = ''
      this.searchData.createTimeEnd = ''
      this.searchData.vipValidityStart = ''
      this.searchData.vipValidityEnd = ''
      this.$refs.searchForm.resetFields()
      this.datetime = []
      this.datetime1 = []
      this.init()
    },

    sizechange (e) {
      this.searchData.pageSize = e
      this.init()
    },
    pagechange (e) {
      this.searchData.pageNum = e
      this.init()
    },
    parClick () {},
    pack_Click (userId) {
      managerdetails({userId: userId}).then((res) => {
        console.log(res)
        if (res.data.code == '0') {
          this.applymodel = true
          this.detailsobj = res.data.data
          this.store_data = res.data.data.orders
        } else {
          this.$message.error(res.data.msg)
        }
      })
    }
  },
  mounted () {
    this.init()
    this.membinit()
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
table {
  border-collapse: initial;
}
.table {
  width: 100%;
  margin: 0;
  font-size: 12px;
  color: #333;
  background: #fff;
  border: 1px solid #e8eaec;
  table-layout: fixed;
  border-collapse: collapse;
  border-spacing: 0;
  white-space: normal;
  text-align: center;
  overflow: hidden;
}

.table td {
  padding-left: 6px;
  padding-right: 6px;
  border: 1px solid #e8eaec;
  height: 48px;
  vertical-align: middle;
}
.table tr .value {
  background: #f8f8f9;
}
.table tr {
  border: 1px solid #e8eaec;
}
.img_calss {
  width: 150px;
  height: 150px;
  margin-top: 20px;
}
.h1_title {
  padding-top: 20px;
  padding-bottom: 20px;
}
.class_have {
  width: 500px;
  height: 50px;
  line-height: 50px;
  box-sizing: border-box;
  border: 1px solid #ccc;
  text-align: center;
  margin: 0 auto;
  cursor: pointer;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader-icon:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.table {
  /* width: 720px; */
  margin: 0;
  font-size: 12px;
  color: #333;
  background: #fff;
  /* border: 1px solid #e8eaec; */
  overflow: hidden;
  box-sizing: border-box;
}

.table .tableClass {
  width: 16.66%;
  border: 1px solid #e8eaec;
  height: 48px;
  text-align: center;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  float: left;
  position: relative;
}

.table .value {
  background: #f8f8f9;
}
.classurl{
  color: blue;
  cursor: pointer;
}
</style>
