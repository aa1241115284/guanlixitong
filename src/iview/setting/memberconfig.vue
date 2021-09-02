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
          <el-form-item label="会员名称" prop="membersName">
            <el-input
              v-model="searchData.membersName"
              style="width: 150px"
              size="small"
            />
          </el-form-item>

          <el-form-item label="当前状态" prop="status">
            <el-select
              v-model="searchData.status"
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
            <el-button
              type="primary"
              size="small"
              @click="operationclick('add','add')"
              v-if='btnadd'
              >新增</el-button
            >
          </el-form-item>
        </el-form>
      </div>
      <Table border :columns="columns1" :data="data1" style="margin-top: 10px">
        <template slot-scope="{ row, index }" slot="slotstatus">
          {{ statusobj[row.status] }}
        </template>

          <template slot-scope="{ row, index }" slot="onlinePayment">
          {{ row.onlinePayment==0 ? '是' : '否' }}
        </template>
           <template slot-scope="{ row, index }" slot="membersValidity">
          {{ membersValobj[row.membersValidity ]}}
        </template>

        <template slot-scope="{ row, index }" slot="action">
          <div >
            <Button
              type="primary"
              size="small"
              @click="operationclick('compile',row.id)"
              v-if='btnupdate'
              >编辑</Button
            >
            <Button type="success" size="small" @click="personnel('冻结',row.id)" v-if='row.status=="0" && btnupdateStatus'>冻结</Button>
            <Button type="info" size="small" @click="personnel('开启',row.id)" v-if='row.status=="1" && btnupdateStatus' >开启</Button>
          </div>

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

    <el-dialog :title="title" :visible.sync="applymodel" width="1000px">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="140px"
        class="demo-ruleForm"
      >
        <el-form-item label="会员名称" prop="membersName">
          <el-input
            v-model="ruleForm.membersName"
            style="width: 500px"
          ></el-input>
        </el-form-item>

        <el-form-item label="会员权益简介" prop="membersDescribe">
          <el-input
            type="textarea"
            placeholder="请输入内容"
            v-model="ruleForm.membersDescribe"
            maxlength="100"
            show-word-limit
            style="width: 500px"
            :rows="5"
          >
          </el-input>
        </el-form-item>

        <div class="teshu_class">
          <el-form-item
            label="会员展示图标:  (请上传100*100,大小不超过1M的png/jpg的图片)"
            prop="membersIcon"
          >
            <el-upload
              class="avatar-uploader"
              action="#"
              :show-file-list="false"
              :http-request="httpRequest"
              :before-upload="beforeUpload"
            >
              <img v-if="ruleForm.membersIcon" :src="ruleForm.membersIcon" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
        </div>

          <el-form-item label="有效期至" prop="membersValidity">
          <!-- <el-input
            v-model="ruleForm.membersValidity"
            style="width: 500px"
          ></el-input> -->
            <el-select
              v-model="ruleForm.membersValidity"
              size="small"
            >
              <el-option
                label="一年"
                value="1Y"
              >
              </el-option>
            </el-select>
        </el-form-item>

          <el-form-item label="原价" prop="payableAmount">
          <el-input
            v-model="ruleForm.payableAmount"
            style="width: 500px"
          ></el-input>
        </el-form-item>

            <el-form-item label="现价" prop="payAmount">
          <el-input
            v-model="ruleForm.payAmount"
            style="width: 500px"
          ></el-input>
        </el-form-item>

            <el-form-item label="是否支持线上收款" prop="online">
          <el-radio v-model="ruleForm.online" :label='true'>是</el-radio>
          <el-radio v-model="ruleForm.online" :label='false'>否</el-radio>
        </el-form-item>

        <el-form-item label="会员权益" prop="moduleIds" class="teshu_class">
          <el-checkbox-group v-model="ruleForm.moduleIds">
          <el-checkbox :label="item.moduleId" v-for ='(item,index) in List' :key='index'>{{item.moduleName}}</el-checkbox>
        </el-checkbox-group>
        </el-form-item>

      </el-form>

      <el-button style='margin-top:50px' type="primary" size="small" @click="submClick('ruleForm')" >提交</el-button>
    </el-dialog>
  </div>
</template>

<script>
import { btnjust } from '@/utils/tools.js'
import { memberlist, memberupdateStatus, memberadd, configmembergetModules, membergetMemberConfig, memberconfigedit, ossupload } from '@/api/api'
import configmodule from '@/components/configmodule'
export default {
  components: { configmodule },
  data () {
    return {
      btnupdateStatus: btnjust('设置', '会员信息配置', 'onestop:memberConfig:updateStatus'),
      btnadd: btnjust('设置', '会员信息配置', 'onestop:memberConfig:add'),
      btnupdate: btnjust('设置', '会员信息配置', 'onestop:memberConfig:update'),
      List: [],
      membersValobj: {
        '1Y': '一年'
      },
      ruleForm: {
        membersName: '',
        membersDescribe: '',
        membersIcon: '',
        membersValidity: '',
        payableAmount: '',
        payAmount: '',
        online: true,
        moduleIds: []
      },
      rules: {
        membersName: [{ required: true, message: '请输入会员名称' }],
        membersDescribe: [{ required: true, message: '请输入会员简介' }],
        membersIcon: [{ required: true, message: '请上传会员LOGO' }],
        membersValidity: [{ required: true, message: '请选择有效期' }],
        payableAmount: [{ required: true, message: '请输入原价' }],
        payAmount: [{ required: true, message: '请输入现价' }],
        online: [{ required: true }],
        moduleIds: [{ required: true, message: '请选择会员权益' }]
      },
      title: '建站运营商添加',
      applymodel: false,
      loan_list_size: 1,
      datetime: [],
      searchData: {
        pageNum: 1,
        pageSize: 10,
        membersName: '',
        status: ''
      },

      statusobj: {
        0: '已开启',
        1: '已冻结'
      },
      options: [
        {
          value: '',
          label: '全部'
        },
        {
          value: '0',
          label: '已开启'
        },
        {
          value: '1',
          label: '已冻结'
        }
      ],
      columns1: [
        {
          title: '会员名称',
          key: 'membersName',
          align: 'center'
        },
        {
          title: '会员有效期',
          slot: 'membersValidity',
          align: 'center'
        },
        {
          title: '原价',
          key: 'payableAmount',
          align: 'center'
        },
        {
          title: '现价',
          key: 'payAmount',
          align: 'center'
        },
        {
          title: '是否支持线上收款',
          slot: 'onlinePayment',
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
  watch: {
    applymodel (val) {
      if (val == false) {
        this.$refs.ruleForm.resetFields()
      }
    }
  },

  methods: {
    init () {
      memberlist(this.searchData).then((res) => {
        console.log(res)
        this.data1 = res.data.data.records
        this.loan_list_size = res.data.data.total
      })
    },
    memberinit () {
      configmembergetModules().then((res) => {
        this.List = res.data.data
      })
    },
    submClick (formName) {
      this.$refs[formName].validate((valid) => {
        console.log(this.ruleForm)
        if (!valid) return
        if (this.type == 'add') {
          memberadd(this.ruleForm).then((res) => {
            if (res.data.code == '0') {
              this.applymodel = false
              this.init()
            } else {
              this.$message.error(res.data.mesg)
            }
          })
        } else {
          memberconfigedit(this.ruleForm).then((res) => {
            if (res.data.code == '0') {
              this.applymodel = false
              this.init()
            } else {
              this.$message.error(res.data.mesg)
            }
          })
        }
      })
    },

    handleSearch () {
      this.init()
    },
    // 重置按钮
    handleReset () {
      this.$refs.searchForm.resetFields()
      this.init()
    },
    operationclick (type, id) {
      this.type = type
      this.applymodel = true
      if (type == 'add') {
        delete this.ruleForm.id
        this.title = '会员添加'
      } else {
        this.title = '会员编辑'
        this.ruleForm.id = id
        membergetMemberConfig({id: id}).then((res) => {
          console.log(res)
          for (let key in this.ruleForm) {
            this.ruleForm[key] = res.data.data[key]
          }
          console.log(this.ruleForm)
        })
      }
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
      this.$confirm(`是否${type}`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
        .then(() => {
          var status
          type == '冻结' ? status = '1' : status = '0'
          memberupdateStatus({
            status: status,
            id: id
          }).then((res) => {
            if (res.data.code == '0') {
              this.init()
            }
          })
        })
        .catch(() => {})
    },

    httpRequest (file) {
      const reader = new FileReader()
      reader.readAsDataURL(file.file)
      reader.onload = (e) => {
        ossupload({base64: e.target.result}).then((res) => {
          this.ruleForm.membersIcon = res.data.data
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
    }
  },
  mounted () { this.init(); this.memberinit() }
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
.tabwarp {
  width: 800px;
}
.title_preview {
  margin-top: 10px;
  margin-bottom: 10px;
}
.left_title {
  float: left;
  margin-right: 10px;
}
.center_warp {
  float: left;
  width: 100px;
  height: 50px;
}
.center_warp img {
  width: 100%;
  height: 100%;
}
.right_title {
  float: left;
  margin-left: 10px;
}
.imgconcent_warp {
  overflow: hidden;
}
.tzClass {
  width: 20px;
  height: 20px;
  float: left;
  margin-top: 5px;
}
.StyleClass {
  overflow: hidden;
}
.title_Class {
  width: 100px;
  text-align: right;
  float: left;
  margin-right: 20px;
  margin-top: 6px;
}
.par_title {
  font-size: 15px;
  padding-bottom: 20px;
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
.teshu_class >>> .el-form-item__label {
  float: none;
}
>>> .el-checkbox-group{
  width: 400px;
}
</style>
