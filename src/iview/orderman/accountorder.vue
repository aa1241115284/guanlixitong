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
          <el-form-item label="订单ID" prop="orderId">
            <el-input
              v-model="searchData.orderId"
              style="width: 150px"
              size="small"
            />
          </el-form-item>

             <el-form-item label="用户手机号" prop="userMobile">
            <el-input
              v-model="searchData.userMobile"
              style="width: 150px"
              size="small"
            />
          </el-form-item>

          <el-form-item label="消费类型" prop="consumeType">
            <el-select
              v-model="searchData.consumeType"
              size="small"
              style="width: 150px"
            >
              <el-option
                v-for="item in consumetype"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="订单状态" prop="orderStatus">
            <el-select
              v-model="searchData.orderStatus"
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

              <el-form-item label="支付方式" prop="payType">
            <el-select
              v-model="searchData.payType"
              size="small"
              style="width: 150px"
            >
              <el-option
                v-for="item in paymenttype"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="订单生成时间" prop="date">
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

              <el-form-item label="支付时间" prop="date">
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
          <template slot-scope="{ row, index }" slot="consumeType" >
           {{consumeobj[row.consumeType]}}
         </template>

          <template slot-scope="{ row, index }" slot="payType" >
           {{paymentobj[row.payType]}}
         </template>

        <template slot-scope="{ row, index }" slot="slotstatus" >
           {{statusobj[row.orderStatus]}}
        </template>

      </Table>
      <div class="Page_warp">
        <Page
          show-total
          :total="loan_list_size"
          :page-size="10"
          show-elevator
          :current="1"
          :page-size-opts="[10]"
          show-sizer
          @on-change="pagechange"
          @on-page-size-change="sizechange"
        ></Page>
      </div>
    </div>

  </div>
</template>

<script>
import { dateFormat, btnjust } from '@/utils/tools.js'
import { accountOrderlist } from '@/api/api.js'
export default {
  data () {
    return {
      btndetails: btnjust('订单管理', '账号费用订单', 'onestop:accountAudit:details'),
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
        consumeType: '',
        orderStatus: '',
        payType: '',
        createTimeBegin: '',
        createTimeEnd: '',
        payTimeBegin: '',
        payTimeEnd: ''

      },
      ruleForm: {
        accout: '',
        password: '',
        role: ''
      },
      rules: {
        accout: [{required: true, message: '请输入登陆账号'}],
        password: [{required: true, message: '请输入登陆密码'}],
        role: [{required: true, message: '请选择角色'}]
      },
      statusobj: {
        'paying': '支付中',
        'pay_fail': '支付失败',
        'pay_success': '支付成功'
      },
      consumeobj: {
        'opening': '账号开通',
        'renew': '账号续费',
        'upgrade': '账号升级'

      },
      consumetype: [
        {
          value: '',
          label: '全部'
        },
        {
          value: 'opening',
          label: '账号开通'
        },
        {
          value: 'renew',
          label: '账号续费'
        },
        {
          value: 'upgrade',
          label: '账号升级'
        }
      ],
      paymentobj: {
        'wechat': '微信支付',
        'alipay': '支付宝支付',
        'bankpay': '银行卡转账'
      },
      paymenttype: [
        {
          value: '',
          label: '全部'
        },
        {
          value: 'wechat',
          label: '微信支付'
        },
        {
          value: 'alipay',
          label: '支付宝支付'
        },
        {
          value: 'bankpay',
          label: '银行卡转账'
        }
      ],
      options: [
        {
          value: '',
          label: '全部'
        },
        {
          value: 'paying',
          label: '支付中'
        },
        {
          value: 'pay_fail',
          label: '支付失败'
        },
        {
          value: 'pay_success',
          label: '支付成功'
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
          title: '消费类型',
          slot: 'consumeType',
          align: 'center'
        },
        {
          title: '订单金额',
          key: 'orderAmount',
          align: 'center'
        },

        {
          title: '订单状态',
          slot: 'slotstatus',
          align: 'center'
        },

        {
          title: '优惠金额',
          key: 'couponAmount',
          align: 'center'
        },
        {
          title: '实付金额',
          key: 'payAmount',
          align: 'center'
        },
        {
          title: '订单生成时间',
          key: 'createTime',
          align: 'center'
        },
        {
          title: '支付方式',
          slot: 'payType',
          align: 'center'
        },
        {
          title: '支付时间',
          key: 'payTime',
          align: 'center'
        }

      ],
      data1: []
    }
  },
  methods: {
    init () {
      accountOrderlist(this.searchData).then((res) => {
        // console.log(res)
        this.data1 = res.data.data.records
        this.loan_list_size = res.data.data.total
      })
    },

    // 订单生成时间日期选择
    datechange (date) {
      if (date != null) {
        this.searchData.createTimeBegin = dateFormat(date[0])
        this.searchData.createTimeEnd = dateFormat(date[1])
      } else {
        this.searchData.createTimeBegin = ''
        this.searchData.createTimeEnd = ''
      }
    },
    // 支付时间
    datechange1 (date) {
      if (date != null) {
        this.searchData.payTimeBegin = dateFormat(date[0])
        this.searchData.payTimeEnd = dateFormat(date[1])
      } else {
        this.searchData.payTimeBegin = ''
        this.searchData.payTimeEnd = ''
      }
    },
    handleSearch () {
      this.init()
    },
    // 重置按钮
    handleReset () {
      this.searchData.createTimeBegin = ''
      this.searchData.createTimeEnd = ''
      this.searchData.payTimeBegin = ''
      this.searchData.payTimeEnd = ''
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
    }

  },
  mounted () { this.init() }
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
