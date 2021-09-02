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
          <el-form-item label="订单ID" prop='orderId'>
            <el-input
              v-model="searchData.orderId"
              style="width: 150px"
              size="small"
            />
          </el-form-item>

          <el-form-item label="用户手机号" prop='userMobile'>
            <el-input
              v-model="searchData.userMobile"
              style="width: 150px"
              size="small"
            />
          </el-form-item>

          <el-form-item label="会员等级" prop='vipLevel'>
            <el-select
              v-model="searchData.vipLevel"
              size="small"
              style="width: 150px"
            >
             <el-option
              label='全部'
              value=''>
            </el-option>
              <el-option
                v-for="item in objfunction(consumetype)"
                :key="item.key"
                :label="item.val"
                :value="item.key"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="订单状态" prop='orderStatus'>
            <el-select
              v-model="searchData.orderStatus"
              size="small"
              style="width: 150px"
            >
              <el-option
                v-for="item in orderStatusList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="三方名称" prop='channelName'>
            <el-select
              v-model="searchData.channelName"
              size="small"
              style="width: 150px"
            >
            <el-option label='全部' value=''>
            </el-option>
              <el-option
                v-for="item in channelList"
                :key="item"
                :label="item"
                :value="item"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="订单生成时间">
            <el-date-picker
              v-model="date"
              type="daterange"
              range-separator=""
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              size="medium"
              @change="datechange"
            >
            </el-date-picker>
          </el-form-item>

          <el-form-item label="订单完成时间">
            <el-date-picker
              v-model="date1"
              type="daterange"
              range-separator=""
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              size="medium"
              @change="datechange1"
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
          </el-form-item>
        </el-form>
      </div>
      <Table border :columns="columns1" :data="data1" style="margin-top: 10px">
        <template slot-scope="{ row, index }" slot="slotstatus">
          {{ statusobj[row.orderStatus] }}
        </template>

        <template slot-scope="{ row, index }" slot="action">
          <Button type="primary" size="small" @click="packClick(row)" v-if='btndetails'
            >详情</Button
          >
        </template>
      </Table>
      <div class="Page_warp">
        <Page
          show-total
          :total="loan_list_size"
          :page-size="10"
          show-elevator
          :current="1"
          :page-size-opts="[1, 10]"
          show-sizer
          @on-change="pagechange"
          @on-page-size-change="sizechange"
        ></Page>
      </div>
    </div>

    <el-dialog title="详情" :visible.sync="applymodel" width="1000px">
      <div>申请资料</div>
      <div class="table" style="margin-top: 20px">
        <div v-for="(item, index) in particularslist" :key="index">
          <template v-if="item.configType != 'picture'">
            <div class="tableClass">{{ item.configTitle }}</div>
            <div class="value tableClass">
              {{ item.configValue }}
              <span class='coya_class'
               v-clipboard="item.configValue"
               v-clipboard:success="clipboardSuccessHandler"
               v-clipboard:error="clipboardErrorHandler">
              复制</span>
            </div>
          </template>
        </div>
      </div>
      <div class="img_warp_concent">
        <div
          class="img_warp"
          v-for="(item, index) in particularslist"
          v-if="item.configType == 'picture'"
          :key="index"
        >
          <img :src="item.configValue" alt="" class="img_calss" />
          <div>{{ item.configTitle }}</div>
        </div>
      </div>

      <div style="margin-top: 40px; padding-bottom: 40px">开通成功参数信息</div>

      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="120px"
        class="demo-ruleForm"
      >
        <div v-for="item in List">
          <el-form-item
            :label="item.configTitle"
            :prop="item.configKey"
            v-if="item.configType == 'text'"
          >
            <el-input v-model="ruleForm[item.configKey]"></el-input>
          </el-form-item>

          <el-form-item
            :label="item.configTitle"
            :prop="item.configKey"
            v-if="item.configType == 'select'"
          >
            <el-select
              v-model="ruleForm[item.configKey]"
              placeholder="请选择活动区域"
            >
              <el-option
                :label="items"
                :value="items"
                v-for="items in functionList(item.configPrompt)"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item
            :label="item.configTitle"
            :prop="item.configKey"
            v-if="item.configType == 'picture'"
          >
            <div style="float: left">
              <el-upload
                class="avatar-uploader"
                action="#"
                :show-file-list="false"
                :http-request="httpRequest(item.configKey)"
                :before-upload="beforeUpload(item)"
              >
                <img
                  v-if="ruleForm[item.configKey]"
                  :src="ruleForm[item.configKey]"
                  class="avatar"
                />
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </div>
            <span style="margin-left: 10px"
              >(请上传{{ item.configSize }}大小不超过{{
                item.configLimit
              }}M的png/jpg的图片)</span
            >
          </el-form-item>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button
          type="danger"
          @click="submiterror"
          :disabled="orderStatus != 'opening'"
          >开通失败</el-button
        >
        <el-button
          type="primary"
          @click="submitForm('ruleForm')"
          :disabled="orderStatus != 'opening'"
          >开通成功</el-button
        >
        <el-button @click="cancel('ruleForm')">取 消</el-button>
      </span>
    </el-dialog>

    <el-dialog title="操作确认" :visible.sync="err_model" width="500px">
      <div class="error_class">
        <div>请确认是否将该订单的状态变更为开通失败？</div>
        <el-form
          :model="err_ruleForm"
          :rules="err_rules"
          ref="err_ruleForm"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="失败原因" prop="failReason">
            <el-input
              v-model="err_ruleForm.failReason"
              type="textarea"
              :rows="5"
            ></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer">
          <el-button type="primary" @click="err_submitForm('err_ruleForm')"
            >确认</el-button
          >
          <el-button @click="err_cancel('ruleForm')">取消</el-button>
        </span>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { dateFormat, btnjust } from '@/utils/tools.js'
import { paymentOrderlist, paymentOrderdetails, operation, getChannelMap, membergetModules, ossupload } from '@/api/api'
export default {
  data () {
    return {
      btndetails: btnjust('订单管理', '支付开通订单', 'onestop:paymentOrder:details'),
      submList: [],
      err_ruleForm: {
        failReason: ''
      },
      err_rules: {
        failReason: [{ required: true, message: '请输入失败原因' }]
      },
      orderStatus: '',
      err_model: false,
      orderId: '',
      particularslist: [],
      List: [],
      ruleForm: {},
      rules: {},
      title: '',
      applymodel: false,
      loan_list_size: 1,
      date: [],
      date1: [],
      searchData: {
        pageNum: 1,
        pageSize: 10,
        orderId: '',
        userMobile: '',
        vipLevel: '',
        orderStatus: '',
        channelName: '',
        createTimeBegin: '',
        createTimeEnd: '',
        finishTimeBegin: '',
        finishTimeEnd: ''
      },

      statusobj: {
        opening: '开通中',
        openSucceed: '开通成功',
        openFailure: '开通失败'
      },
      consumetype: [],
      channelList: [],
      orderStatusList: [
        {
          value: '',
          label: '全部'
        },
        {
          value: 'opening',
          label: '开通中'
        },
        {
          value: 'openFailure',
          label: '开通失败'
        },
        {
          value: 'openSucceed',
          label: '开通成功'
        }
      ],
      columns1: [
        {
          title: '订单ID',
          key: 'orderId',
          align: 'center'
        },
        {
          title: '用户手机号',
          key: 'userMobile',
          align: 'center'
        },
        {
          title: '会员等级',
          key: 'vipLevel',
          align: 'center'
        },
        {
          title: '商城名称',
          key: 'shopName',
          align: 'center'
        },
        {
          title: '三方名称',
          key: 'channelName',
          align: 'center'
        },

        {
          title: '订单状态',
          slot: 'slotstatus',
          align: 'center'
        },

        {
          title: '订单生成时间',
          key: 'createTime',
          align: 'center'
        },
        {
          title: '订单完成时间',
          key: 'finishTime',
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
      data1: []
    }
  },
  methods: {
    // 复制成功
    clipboardSuccessHandler () {
      this.$message.success('复制成功')
    },
    clipboardErrorHandler () {

    },
    init () {
      paymentOrderlist(this.searchData).then((res) => {
        // console.log(res)
        this.data1 = res.data.data.records
        this.loan_list_size = res.data.data.total
      })
    },
    // 三方名称
    getChannelMapinit () {
      getChannelMap(this.searchData).then((res) => {
        this.channelList = res.data.data
      })
    },
    membinit () {
      membergetModules().then((res) => {
        this.consumetype = res.data.data
        console.log(this.consumetype)
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
    // 订单生成时间
    datechange (date) {
      if (date != null) {
        this.searchData.createTimeBegin = dateFormat(date[0])
        this.searchData.createTimeEnd = dateFormat(date[1])
      } else {
        this.searchData.createTimeBegin = ''
        this.searchData.createTimeEnd = ''
      }
    },
    // 订单完成成时间
    datechange1 (date) {
      if (date != null) {
        this.searchData.finishTimeBegin = dateFormat(date[0])
        this.searchData.finishTimeEnd = dateFormat(date[1])
      } else {
        this.searchData.finishTimeBegin = ''
        this.searchData.finishTimeEnd = ''
      }
    },
    handleSearch () {
      this.init()
      console.log(this.searchData)
    },
    // 重置按钮
    handleReset () {
      this.searchData.createTimeBegin = ''
      this.searchData.createTimeEnd = ''
      this.searchData.finishTimeBegin = ''
      this.searchData.finishTimeEnd = ''
      this.$refs.searchForm.resetFields()
      this.date = []
      this.date1 = []
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
    // 初始化
    // getData () {
    //   return new Promise((resolve) => {
    //     setTimeout(() => {
    //       resolve([
    //         { configType: 'text', configTitle: '公司aaaa', configKey: '1' },
    //         { configType: 'text', configTitle: '公司地址', configKey: '2' },
    //         { configType: 'select', configTitle: '地区选择', configKey: '3' },
    //         { configType: 'picture', configTitle: '上传图片', configKey: 'imageUrl', rule: {size: 1, width: '1920', height: '743'}},
    //         { configType: 'picture', configTitle: '测试', configKey: 'imageUrl2', rule: {size: 2, width: '800', height: '533'} }

    //       ])
    //     }, 2000)
    //   })
    // },
    httpRequest (name) {
      return (file) => {
        const reader = new FileReader()
        reader.readAsDataURL(file.file)
        reader.onload = (e) => {
          ossupload({base64: e.target.result}).then((res) => {
            console.log(res)
            this.ruleForm = {
              ...this.ruleForm,
              [name]: res.data.data
            }
          })
        }
      }
    },

    // 上传图片前的拦截
    beforeUpload (rule) {
      return (file) => {
        var width = rule.configSize.split('*')[0]
        var height = rule.configSize.split('*')[1]
        var that = this
        const type = 'image/jpg,image/png,image/jpeg'
        const accepts = type.split(',')
        const size = file.size / 1024 / 1024 < rule.configLimit
        if (!accepts.includes(file.type)) {
          this.$message.error('请上传 png,jpg 类型的图片')
          return Promise.reject(false)
        }
        if (!size) {
          this.$message.error(`上传图片大小不能超过 ${rule.configLimit}MB!`)
          return Promise.reject(false)
        }

        var reader = new FileReader()
        reader.readAsDataURL(file)
        const fileOnLoad = function () {
          return new Promise((resolve, reject) => {
            reader.onload = function (event) {
              var txt = event.target.result
              var img = document.createElement('img')
              img.src = txt
              img.onload = function () {
                if (img.width != width || img.height != height) {
                  that.$message.error(`上传图片宽为${width}高为${height}`)
                  return reject(false)
                }
                return resolve(true)
              }
            }
          })
        }
        return fileOnLoad()
      }
    },
    submiterror () {
      this.err_model = true
    },
    err_cancel () {
      this.err_model = false
    },
    err_submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) return
        var obj = {}
        obj.orderId = this.orderId
        obj.operation = 'fail'
        obj.failReason = this.err_ruleForm.failReason
        operation(obj).then((res) => {
          if (res.data.code == '0') {
            this.applymodel = false
            this.err_model = false
            this.init()
          } else {
            this.$Message.error(res.data.msg)
          }
        })
      })
    },
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        // console.log(this.ruleForm)
        if (!valid) return

        this.$confirm('请确认是否将该订单的状态变更为开通成功？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        })
          .then(() => {
            var obj = {
              detailVos: []
            }
            obj.orderId = this.orderId
            obj.operation = 'success'
            for (let key in this.ruleForm) {
              for (let i = 0; i < this.submList.length; i++) {
                if (key == this.submList[i].configKey) {
                  this.submList[i].configValue = this.ruleForm[key]
                }
              }
            }
            obj.detailVos = this.submList
            operation(obj).then((res) => {
              if (res.data.code == '0') {
                this.applymodel = false
                this.init()
              } else {
                this.$Message.error(res.data.msg)
              }
            })
          })
          .catch(() => {})
      })
    },
    cancel (formName) {
      this.applymodel = false
      this.ruleForm = {}
      this.$refs[formName].resetFields()
    },
    packClick (row) {
      this.orderId = row.orderId
      this.orderStatus = row.orderStatus
      paymentOrderdetails({ orderId: row.orderId }).then((res) => {
        if (res.data.code == '0') {
          this.applymodel = true
          this.particularslist = res.data.data.details
          this.List = res.data.data.submits
          this.submList = res.data.data.submits
          res.data.data.submits.forEach((item) => {
            console.log(item)
            this.ruleForm = {
              [item.configKey]: ''
            }
            if (item.configType === 'text') {
              this.$set(this.rules, item.configKey, [
                { required: true, message: `${item.configTitle}不能为空` }
              ])
            }
            if (item.configType === 'select') {
              this.$set(this.rules, item.configKey, [
                { required: true, message: `${item.configTitle}不能为空` }
              ])
            }
            if (item.configType === 'picture') {
              this.$set(this.rules, item.configKey, [
                { required: true, message: `${item.configTitle}不能为空` }
              ])
            }
          })
          if (this.$refs.ruleForm) {
            this.$refs.ruleForm.resetFields()
          }
        } else {
          this.$Message.error(res.data.msg)
        }
      })
    },
    functionList (list) {
      return list.split('/')
    }
  },
  mounted () {
    this.init()
    this.getChannelMapinit()
    this.membinit()
    // this.getData().then((res) => {
    //   console.log(res)
    //   this.List = res
    //   res.forEach((item) => {
    //     console.log(item)
    //     this.ruleForm = {
    //       [item.configKey]: ''
    //     }
    //     if (item.configType === 'text') {
    //       this.$set(this.rules, item.configKey, [
    //         { required: true, message: `${item.configTitle}不能为空` }
    //       ])
    //     }
    //     if (item.configType === 'select') {
    //       this.$set(this.rules, item.configKey, [
    //         { required: true, message: `${item.configTitle}不能为空` }
    //       ])
    //     }
    //     if (item.configType === 'picture') {
    //       this.$set(this.rules, item.configKey, [
    //         { required: true, message: `${item.configTitle}不能为空` }
    //       ])
    //     }
    //   })
    //   console.log(res)
    // })
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
.coya_class{
  position:absolute;
  right: 10px;
  cursor: pointer;
  color:blue
}
.table .value {
  background: #f8f8f9;
}
.img_calss {
  width: 150px;
  height: 150px;
  margin-top: 20px;
}
.img_warp_concent {
  overflow: hidden;
}
.img_warp {
  float: left;
  text-align: center;
  margin-right: 20px;
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
.error_class >>> .el-form-item__content {
  margin-left: 0 !important;
}
.error_class >>> .el-form-item__label {
  float: none;
}
</style>
