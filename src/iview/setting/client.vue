<template>
  <div class="page_warp">
    <div v-if="!show" style="margin-top: 10px">
      <el-button type="primary" size="mini" @click="redactClick" v-if='btnupdate'
        >编辑</el-button
      >
    </div>
    <div v-if="show" style="margin-top: 10px">
      <el-button type="primary" size="mini" @click="subClick">保存</el-button>
      <el-button size="mini" @click="cancel_click">取消</el-button>
    </div>
    <el-table
      :data="tempData"
      :span-method="objectSpanMethod"
      border
      style="width: 100%; margin-top: 20px"
    >
      <el-table-column label="模板名称" width="180">
        <template slot-scope="scope">
          <!-- <el-checkbox
            v-model="scope.row.enableStatus"
            :disabled="disabledmodel"
            >{{ scope.row.moduleName }}</el-checkbox
          > -->
          <span>{{ scope.row.moduleName }}</span>
          <el-button
            type="primary"
            size="mini"
            @click="add_page(scope.row.moduleName, 'addpath')"
            style="margin-top: 10px"
            v-if="show"
            >新增页面</el-button
          >
        </template>
      </el-table-column>

      <el-table-column label="页面名称">
        <template slot-scope="scope">
          <el-checkbox
            v-model="scope.row.enableStatus"
            :disabled="disabledmodel"
            v-if="scope.row.pageName"
            >{{ scope.row.pageName }}</el-checkbox
          >
          <span v-if="scope.row.pageName">
            <i
              class="el-icon-edit"
              data-method="edit"
              v-if="show"
              @click="submClick(scope.row,'submpath')"
            />
          </span>
        </template>
      </el-table-column>
      <el-table-column label="权限">
        <template slot-scope="scope">
          <span
            v-for="(item, index) in scope.row.permissions"
            :key="index"
            style="margin-right: 10px"
          >
            <el-checkbox
              v-model="item.enableStatus"
              :disabled="disabledmodel"
              v-if="item.permissionName"
              >{{ item.permissionName }}</el-checkbox
            >
            <span v-if="item.permissionName">
              <i
                class="el-icon-edit"
                data-method="edit"
                v-if="show"
                @click="authority_subm(scope.row,item,'submjus')"
              />
            </span>
          </span>

          <span v-if="scope.row.pageName">
            <el-button
              size="small"
              @click="add_authority(scope.row,'addjust')"
              v-if="show"
              >新增权限</el-button
            >
          </span>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="titlemesg" :visible.sync="dialogVisible" width="30%">
      <el-form :model="Formmodel" ref="ValidateForm" label-width="100px">
        <el-form-item label="模块名称" prop="name">
          <el-input
            v-model="Formmodel.name"
            :disabled="disabled_name"
          ></el-input>
        </el-form-item>
        <el-form-item label="页面名称" prop="pageName" :rules="[{required:pagemust,message:'请输入页面名称',trigger:'blur'}]">
          <el-input
            v-model="Formmodel.pageName"
            :disabled="disabled_pagename"
          ></el-input>
        </el-form-item>
        <el-form-item label="页面权限值" prop="pagePermissionValue" :rules="[{required:pagemust,message:'请输入页面权限值',trigger:'blur'}]">
          <el-input
            v-model="Formmodel.pagePermissionValue"
            :disabled="disabled_jurisdiction"
          ></el-input>
        </el-form-item>
        <el-form-item label="页面路径" prop="pageUri" :rules="[{required:pagemust,message:'请输入页面权限值',trigger:'blur'}]">
          <el-input
            v-model="Formmodel.pageUri"
            :disabled="disabled_pagepath"
          ></el-input>
        </el-form-item>
        <el-form-item label="按钮名称" prop="permissionName" :rules="[{required:jurmust,message:'请输入按钮名称',trigger:'blur'}]">
          <el-input
            v-model="Formmodel.permissionName"
            :disabled="disabled_brnname"
          ></el-input>
        </el-form-item>
        <el-form-item label="按钮权限值" prop="permissionValue" :rules="[{required:jurmust,message:'请输入按钮权限值',trigger:'blur'}]">
          <el-input
            v-model="Formmodel.permissionValue"
            :disabled="disabled_authority"
          ></el-input>
        </el-form-item>
        <el-form-item label="按钮路径" prop="uri" :rules="[{required:jurmust,message:'请输入按钮路径',trigger:'blur'}]">
          <el-input
            v-model="Formmodel.uri"
            :disabled="disabled_path"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="batch_cancel">取 消</el-button>
        <el-button type="primary" @click="submitclick('ValidateForm')"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { modulelist, moduleupdate } from '@/api/api'
import { btnjust } from '@/utils/tools.js'
export default {
  name: 'authority',
  data () {
    return {
      jurmust: true, // 新增编辑权限  必填开关
      pagemust: true, // 新增编辑页面  必填开关
      btnupdate: btnjust('设置', '客户系统权限配置', 'onestop:modulePermission:update'),
      type: '',
      tempName: '',
      show: false,
      row_item: {},
      row: {},
      justrow: {},
      disabledmodel: true,
      disabled_name: true,
      disabled_pagename: true,
      disabled_jurisdiction: true,
      disabled_pagepath: true,
      disabled_brnname: true,
      disabled_authority: true,
      disabled_path: true,
      titlemesg: '',
      dialogVisible: false,
      Formmodel: {
        name: '',
        pageName: '',
        pagePermissionValue: '',
        pageUri: '',
        permissionName: '',
        permissionValue: '',
        uri: ''
      },
      Formerules: { name: [{ required: true, message: '模块名称不能为空' }] },
      tempData: [],
      tableData: []
      // tableData: [{
      //   enableStatus: true,
      //   id: '1290',
      //   moduleName: '商户管理',
      //   pages: [{
      //     enableStatus: true,
      //     id: '1290',
      //     permissionId: '1291',
      //     pageName: '商户列表',
      //     pagePermissionValue: 'electricity:mer:read',
      //     pageUri: '/manage/mer/index1',
      //     permissions: [{
      //       enableStatus: true,
      //       id: '1292',
      //       permissionName: '修改商户状态',
      //       permissionValue: 'electricity:mer:updateStatus',
      //       uri: '/manage/mer/updateStatus',
      //       permissionId: '1291'
      //     }]
      //   }]
      // }
      // ]
    }
  },
  watch: {
    dialogVisible (val) {
      if (val == false) {
        this.$refs.ValidateForm.resetFields()
        this.Formmodel.name = ''
        this.Formmodel.pageName = ''
        this.Formmodel.pagePermissionValue = ''
        this.Formmodel.pageUri = ''

        this.Formmodel.permissionName = ''
        this.Formmodel.permissionValue = ''
        this.Formmodel.uri = ''
      }
    }
  },
  methods: {
    init () {
      // functiondetails({}).then((res) => {
      // this.tableData = res.data.data.moduleData
      var temp = []
      modulelist().then((res) => {
        console.log(res)
        this.tableData = res.data.data.modules
        this.tableData.forEach((item) => {
          if (item.pages.length === 0) {
            item.pages.push({
              permissionId: '',
              pageName: '',
              enableStatus: true,
              permissions: []
            })
          }

          item.pages.forEach((item1, index) => {
            item1.span = index === 0 ? item.pages.length : 0
            item1.moduleName = item.moduleName
            temp.push(item1)
          })
        })
        this.tempData = temp
      })

      // })
    },

    formateTempData () {
      var temp = []
      this.tableData.forEach((item) => {
        if (item.pages.length === 0) {
          item.pages.push({
            permissionId: '',
            pageName: '',
            enableStatus: true,
            permissions: []
          })
        }

        item.pages.forEach((item1, index) => {
          item1.span = index === 0 ? item.pages.length : 0
          item1.moduleName = item.moduleName
          temp.push(item1)
        })
      })
      this.tempData = temp
    },
    objectSpanMethod ({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        return {
          rowspan: row.span,
          colspan: 1
        }
      }
    },
    subClick () {
      console.log(this.tableData)
      moduleupdate({ modules: this.tableData }).then((res) => {
        this.disabledmodel = true
        console.log(res)
        if (res.data.code == '0') {
          this.init()
          this.$Message.success('保存成功')
          this.show = false
        } else {
          this.$Message.warning(res.data.msg)
        }
      })
    },
    // 编辑
    redactClick () {
      this.show = true
      this.disabledmodel = false
    },
    cancel_click () {
      this.show = false
      this.disabledmodel = true
    },
    // 新增页面
    add_page (tempName, type) {
      this.Formmodel.name = tempName
      this.tempName = tempName
      this.type = type
      this.disabled_pagename = false
      this.disabled_jurisdiction = false
      this.disabled_pagepath = false

      this.disabled_path = true
      this.disabled_authority = true
      this.disabled_brnname = true
      this.titlemesg = '新增'
      this.dialogVisible = true
      this.pagemust = true
      this.jurmust = false
    },
    // 新增权限
    add_authority (row, type) {
      this.Formmodel.name = row.moduleName
      this.Formmodel.pageName = row.pageName
      this.Formmodel.pagePermissionValue = row.pagePermissionValue
      this.Formmodel.pageUri = row.pageUri

      this.type = type
      this.justrow = row
      console.log(row)
      this.disabled_pagename = true
      this.disabled_jurisdiction = true
      this.disabled_pagepath = true

      this.disabled_path = false
      this.disabled_authority = false
      this.disabled_brnname = false
      this.titlemesg = '新增'
      this.dialogVisible = true
      this.pagemust = false
      this.jurmust = true
    },
    // 页面编辑
    submClick (row, type) {
      console.log(row)
      this.row = row
      this.type = type
      this.disabled_pagename = false
      this.disabled_jurisdiction = false
      this.disabled_pagepath = false
      this.titlemesg = '编辑'
      this.disabled_path = true
      this.disabled_authority = true
      this.disabled_brnname = true

      this.Formmodel.name = row.moduleName
      this.Formmodel.pageName = row.pageName
      this.Formmodel.pagePermissionValue = row.pagePermissionValue
      this.Formmodel.pageUri = row.pageUri
      this.dialogVisible = true
      this.pagemust = true
      this.jurmust = false
    },
    // 权限编辑
    authority_subm (row, item, type) {
      console.log(row)
      console.log(item)
      this.Formmodel.name = row.moduleName
      this.Formmodel.pageName = row.pageName
      this.Formmodel.pagePermissionValue = row.pagePermissionValue
      this.Formmodel.pageUri = row.pageUri

      this.Formmodel.permissionName = item.permissionName
      this.Formmodel.permissionValue = item.permissionValue
      this.Formmodel.uri = item.uri
      this.type = type

      this.row_item = item
      this.disabled_pagename = true
      this.disabled_jurisdiction = true
      this.disabled_pagepath = true
      this.titlemesg = '编辑'

      this.disabled_path = false
      this.disabled_authority = false
      this.disabled_brnname = false

      this.dialogVisible = true
      this.pagemust = false
      this.jurmust = true
    },
    batch_cancel () {
      this.dialogVisible = false
    },
    submitclick (form) {
      console.log(this.type)
      this.$refs[form].validate((valid) => {
        if (!valid) return
        // 新增页面
        if (this.type == 'addpath') {
          this.dialogVisible = false
          this.tableData = this.tableData.map((item) => {
            if (item.moduleName === this.tempName) {
              item.pages.push({
                pageName: this.Formmodel.pageName,
                pagePermissionValue: this.Formmodel.pagePermissionValue,
                pageUri: this.Formmodel.pageUri,
                enableStatus: true,
                permissions: []
              })
              return { ...item }
            }
            return { ...item }
          })
          console.log(this.tableData)
          this.formateTempData()
        } else if (this.type == 'addjust') {
          this.dialogVisible = false
          this.tableData = this.tableData.map((item) => {
            if (item.moduleName === this.justrow.moduleName) {
              item.pages = item.pages.map((item1) => {
                if (item1.pageName === this.justrow.pageName) {
                  item1.permissions.push({
                    // 权限
                    permissionName: this.Formmodel.permissionName,
                    permissionValue: this.Formmodel.permissionValue,
                    uri: this.Formmodel.uri,
                    enableStatus: true
                  })
                  return { ...item1 }
                }
                return { ...item1 }
              })
              return { ...item }
            }
            return { ...item }
          })
          this.formateTempData()
        } else if (this.type == 'submpath') {
          this.row.pageName = this.Formmodel.pageName
          this.row.pagePermissionValue = this.Formmodel.pagePermissionValue
          this.row.pageUri = this.Formmodel.pageUri
          this.dialogVisible = false
        } else if (this.type = 'submjus') {
          this.row_item.permissionName = this.Formmodel.permissionName
          this.row_item.permissionValue = this.Formmodel.permissionValue
          this.row_item.uri = this.Formmodel.uri
          this.dialogVisible = false
        }
      })
    }
  },

  mounted () {
    // this.formateTempData();
    this.init()
    console.log(this.tableData)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style  >
.el-icon-edit {
  padding: 4px;
  font-size: 22px;
  cursor: pointer;
  color: #666;
  transition: 0.2s ease;
}
.el-icon-edit:hover {
  color: #409eff;
}
.el-checkbox__input.is-disabled+span.el-checkbox__label{
  color: #111 !important;
}
.page_warp{
padding: 20px;
}
</style>
