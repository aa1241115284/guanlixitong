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

          <el-form-item label="订单ID" prop="orderId">
            <el-input
              v-model="searchData.orderId"
              style="width: 150px"
              size="small"
            />
          </el-form-item>

          <el-form-item label="订单类型" prop="orderType">
            <el-select
              v-model="searchData.orderType"
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

          </el-form-item>
        </el-form>
      </div>
      <Table border :columns="columns1" :data="data1" style="margin-top: 10px">
        <template slot-scope="{ row, index }" slot="slotstatus">
          {{ statusobj[row.orderType] }}
        </template>

        <template slot-scope="{ row, index }" slot="action">
          <Button type="primary" size="small" @click='pack_Click(row.id)' v-if='btndetails'>详情</Button>
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

    <el-dialog
      title="账号开通审核订单"
      :visible.sync="applymodel"
      width="800px"
    >
      <table class="table">
        <tr>
          <td>用户ID</td>
          <td class="value">{{detailsobj.userId}}</td>
          <td>订单ID</td>
          <td class="value">{{detailsobj.orderId}}</td>
          <td>用户账号</td>
          <td class="value">{{detailsobj.account}}</td>
        </tr>
        <tr>
          <td>会员等级</td>
          <td class="value">{{detailsobj.vipLevel}}</td>
          <td>应收金额</td>
          <td class="value">{{detailsobj.orderAmount}}</td>
          <td>创建时间</td>
          <td class="value">{{detailsobj.createTime}}</td>
        </tr>
        <tr>
          <td>订单类型</td>
          <td class="value">{{statusobj[detailsobj.orderType]}}</td>
          <td>收款类型</td>
          <td class="value">{{paymentobj[detailsobj.payType]}}</td>
          <td></td>
          <td class="value"></td>
        </tr>
      </table>

      <img :src="itemimg" alt="" class='img_calss' v-for='(itemimg,index) in detailsobj.payProofUrl' :key='index' style='margin-right:10px'>
         <span slot="footer" class="dialog-footer">
        <el-button type="danger" size='small' @click='errClick'>收款失败</el-button>
        <el-button type="primary" size='small' @click='scuessClick'>收款成功</el-button >
        <el-button size='small'>取消</el-button >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { dateFormat, btnjust } from '@/utils/tools.js'
import { accountAuditlist, financecollection, financedetails } from '@/api/api'
export default {
  data () {
    return {
      btndetails: btnjust('财务管理', '账号开通审核', 'onestop:accountAudit:details'),
      iid: '',
      title: '',
      detailsobj: {},
      applymodel: false,
      loan_list_size: 1,
      datetime: [],
      searchData: {
        pageNum: 1,
        pageSize: 10,
        userId: '',
        orderId: '',
        orderType: '',
        createTimeBegin: '',
        createTimeEnd: ''
      },
      ruleForm: {
        accout: '',
        password: '',
        role: ''
      },
      rules: {
        accout: [{ required: true, message: '请输入登陆账号' }],
        password: [{ required: true, message: '请输入登陆密码' }],
        role: [{ required: true, message: '请选择角色' }]
      },
      statusobj: {
        'opening': '账号开通'
      },
      paymentobj: {
        'wechat': '微信支付',
        'alipay': '支付宝支付',
        'bankpay': '银行卡转账'
      },
      options: [
        {
          value: '',
          label: '全部'
        },
        {
          value: 'opening',
          label: '账号开通'
        }
      ],
      columns1: [
        {
          title: '用户ID',
          key: 'userId',
          align: 'center'
        },
        {
          title: '订单ID',
          key: 'orderId',
          align: 'center'
        },
        {
          title: '订单类型',
          slot: 'slotstatus',
          align: 'center'
        },
        {
          title: '用户账号',
          key: 'userAccount',
          align: 'center'
        },
        {
          title: '会员等级',
          key: 'vipLevel',
          align: 'center'
        },
        {
          title: '应收金额',
          key: 'payAmount',
          align: 'center'
        },
        {
          title: '创建时间',
          key: 'createTime',
          align: 'center'
        },
        {
          title: '有效期至',
          key: 'validityDate',
          align: 'center'
        },
        {
          title: '发起人',
          key: 'applicant',
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
    init () {
      accountAuditlist(this.searchData).then((res) => {
        // console.log(res)
        this.data1 = res.data.data.records
        this.loan_list_size = res.data.data.total
      })
    },
    // 日期选择
    datechange (date) {
      if (date != null) {
        this.searchData.createTimeBegin = dateFormat(date[0])
        this.searchData.createTimeEnd = dateFormat(date[1])
      } else {
        this.searchData.createTimeBegin = ''
        this.searchData.createTimeEnd = ''
      }
    },
    handleSearch () {
      this.init()
    },
    // 重置按钮
    handleReset () {
      this.searchData.createTimeBegin = ''
      this.searchData.createTimeEnd = ''
      this.$refs.searchForm.resetFields()
      this.datetime = []
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
    pack_Click (id) {
      this.iid = id
      financedetails({id: this.iid}).then((res) => {
        if (res.data.code) {
          this.applymodel = true
          this.detailsobj = res.data.data
          this.detailsobj.payProofUrl = res.data.data.payProofUrl.split('，')
        } else {
          this.message.error(res.code.msg)
        }
      })
    },
    // 收款失败
    errClick () {
      financecollection({
        id: this.iid,
        effective: 'fail'
      }).then((res) => {
        console.log(res)
        if (res.data.code == '0') {
          this.applymodel = false
          this.init()
        } else {
          this.message.error(res.code.msg)
        }
      })
    },
    // 收款成功
    scuessClick () {
      financecollection({
        id: this.iid,
        effective: 'success'
      }).then((res) => {
        console.log(res)
        if (res.data.code == '0') {
          this.applymodel = false
          this.init()
        } else {
          this.message.error(res.code.msg)
        }
      })
    }
  },
  mounted () { this.init() }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.body {
  width: 100%;
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
.img_calss{
  width: 150px;
  height: 150px;
  margin-top: 20px;
}
</style>
