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
          <el-form-item label="网红公司名称" prop="channelName">
            <el-input
              v-model="searchData.channelName"
              style="width: 150px"
              size="small"
            />
          </el-form-item>

          <el-form-item label="当前状态" prop="templateStatus">
            <el-select
              v-model="searchData.templateStatus"
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
          {{ statusobj[row.templateStatus] }}
        </template>

        <template slot-scope="{ row, index }" slot="action">
            <Button
              type="primary"
              size="small"
              @click="operationclick('compile',row.templateId)"
              v-if='btnupdate'
              >编辑</Button
            >

            <Button type="success" size="small" @click="personnel('开启','enable',row.templateId)" v-if='row.templateStatus=="disable" && btnupdateStatus' >开启</Button >
             <Button type="error" size="small" @click="personnel('冻结','disable',row.templateId)" v-if='row.templateStatus=="enable" && btnupdateStatus' >冻结</Button >

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
        label-width="120px"
        class="demo-ruleForm"
      >
        <el-form-item label="网红公司名称" prop="channelName">
          <el-input
            v-model="ruleForm.channelName"
            style="width: 500px"
          ></el-input>
        </el-form-item>

        <el-form-item label="网红公司简介" prop="channelIntroduce">
          <el-input
            type="textarea"
            placeholder="请输入内容"
            v-model="ruleForm.channelIntroduce"
            maxlength="100"
            show-word-limit
            style="width: 500px"
            :rows="5"
          >
          </el-input>
        </el-form-item>

        <div class="teshu_class">
          <el-form-item
            label="网红公司LOGO:  (请上传100*100,大小不超过1M的png/jpg的图片)"
            prop="channelLogo"
          >
            <el-upload
              class="avatar-uploader"
              action="#"
              :show-file-list="false"
              :http-request="httpRequest"
              :before-upload="beforeUpload"
            >
              <img v-if="ruleForm.channelLogo" :src="ruleForm.channelLogo" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
        </div>
      </el-form>

      <div class="par_title">参数信息配置</div>
      <configmodule @updated="updatedClick" ></configmodule>

      <div class="par_title" style="margin-top: 20px">回传信息配置</div>
      <configmodule1 @updated="return_updatedClick" ></configmodule1>
      <el-button style='margin-top:50px' type="primary" size="small" @click="submClick('ruleForm')" >提交</el-button>
    </el-dialog>
  </div>
</template>

<script>
import { btnjust } from '@/utils/tools.js'
import { celebritylist, celebrityStatus, addCelebrity, celebrityedit, celebrityupdate, ossupload } from '@/api/api'
import configmodule from '@/components/configmodule'
import configmodule1 from '@/components/configmodule1'
import eventBus from '@/utils/bus'
export default {
  components: { configmodule, configmodule1 },
  data () {
    return {
      btnupdateStatus: btnjust('设置', '网红开通参数配置', 'onestop:celebrityConfig:updateStatus'),
      btnadd: btnjust('设置', '网红开通参数配置', 'onestop:celebrityConfig:add'),
      btnupdate: btnjust('设置', '网红开通参数配置', 'onestop:celebrityConfig:update'),
      ruleForm: {
        channelName: '',
        channelIntroduce: '',
        channelLogo: '',
        echoConfigs: [],
        submitConfigs: []
      },
      type: '',
      rules: {
        channelName: [{ required: true, message: '请输入网红公司名称' }],
        channelIntroduce: [{ required: true, message: '请输入网红公司简介' }],
        channelLogo: [{ required: true, message: '请上传网红公司LOGO' }]
      },
      title: '支付方添加',
      applymodel: false,
      loan_list_size: 1,
      datetime: [],
      searchData: {
        channelName: '',
        templateStatus: '',
        pageNum: 1,
        pageSize: 10
      },

      statusobj: {
        'enable': '已开启',
        'disable': '已冻结'
      },
      options: [
        {
          value: '',
          label: '全部'
        },
        {
          value: 'enable',
          label: '已开启'
        },
        {
          value: 'disable',
          label: '已冻结'
        }
      ],
      columns1: [
        {
          title: '支付方名称',
          key: 'channelName',
          align: 'center'
        },
        {
          title: '创建时间',
          key: 'createTime',
          align: 'center'
        },
        {
          title: '操作人',
          key: 'operator',
          align: 'center'
        },
        {
          title: '最后更新时间',
          key: 'updateTime',
          align: 'center'
        },
        {
          title: '当前状态',
          slot: 'slotstatus',
          align: 'center'
        },

        {
          title: '操作',
          slot: 'action',
          align: 'center'
        }
      ],
      data1: [],
      parList: [],
      parList1: []
    }
  },
  watch: {
    applymodel (val) {
      if (val == false) {
        eventBus.$emit('applymodel', val)
        this.$refs.ruleForm.resetFields()
        this.parList = []
        this.parList1 = []
      }
    }
  },
  methods: {
    init () {
      celebritylist(this.searchData).then((res) => {
        this.data1 = res.data.data.records
        this.loan_list_size = res.data.data.total
      })
    },
    submClick (formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) return
        this.ruleForm.echoConfigs = this.parList
        this.ruleForm.submitConfigs = this.parList1
        console.log(this.ruleForm)
        if (this.type == 'add') {
          addCelebrity(this.ruleForm).then((res) => {
            console.log(res)
            if (res.data.code == '0') {
              this.applymodel = false
              this.init()
            } else {
              this.$message.error(res.data.msg)
            }
          })
        } else {
          celebrityupdate(this.ruleForm).then((res) => {
            if (res.data.code == '0') {
              this.applymodel = false
              this.init()
            } else {
              this.$message.error(res.data.msg)
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
    operationclick (type, templateId) {
      this.applymodel = true
      this.type = type
      if (type == 'add') {
        this.title = '网红公司添加'
        delete this.ruleForm.templateId
      } else {
        this.ruleForm.templateId = templateId
        this.title = '网红公司编辑'
        celebrityedit({templateId: templateId}).then((res) => {
          console.log(res)
          for (let key in this.ruleForm) {
            this.ruleForm[key] = res.data.data[key]
          }
          eventBus.$emit('List', this.ruleForm)
        })
      }
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
    personnel (text, type, templateId) {
      this.$confirm(`是否${text}`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
        .then(() => {
          celebrityStatus({templateId: templateId, templateStatus: type}).then((res) => {
            this.init()
          })
        })
        .catch(() => {})
    },
    updatedClick (List) {
      this.parList = List
    },
    return_updatedClick (List) {
      this.parList1 = List
    },
    httpRequest (file) {
      const reader = new FileReader()
      reader.readAsDataURL(file.file)
      reader.onload = (e) => {
        ossupload({base64: e.target.result}).then((res) => {
          console.log(res)
          this.ruleForm.channelLogo = res.data.data
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
  mounted () {
    this.init()
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
</style>
