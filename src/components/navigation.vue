<template>
  <div>
    <div class="flex_warp">
      <div class="nativewarp">
        <el-menu
          :default-active="valname"
          class="el-menu-vertical-demo"
          :collapse="isCollapse"
        >
          <div class="topClass"></div>
          <el-menu-item
            :index="item.name"
            @click="nativeClick(item)"
            v-for="(item, index) in nativeList"
            :key="index"
          >
            <i :class="item.calssname"></i>
            <span slot="title">{{ item.name }}</span>
          </el-menu-item>
          <!-- <el-menu-item index="4">
    <i class="el-icon-setting"></i>
    <span slot="title">导航四</span>
  </el-menu-item> -->
        </el-menu>
      </div>

      <div class="rightnative">
        <div class="right_top">
          <!-- <el-button  @click='shousuoClick'>收缩</el-button> -->
          <i :class="isclass" class="iconClass" @click="shousuoClick"></i>

          <div class="information">
            <i class="el-icon-user-solid text_icon"></i>
            <span>{{name}}</span>
            <!-- <el-button
              type="primary"
              size="mini"
              style="margin-left: 15px"
              @click="chpassword"
              >修改密码</el-button
            > -->
            <el-button type="primary" size="mini" style="margin-left: 15px" @click="logout"
              >退出登录</el-button
            >
          </div>
        </div>

        <ul class="childrenClass">
          <li
            v-for="(item, index) in childrenList"
            :key="index"
            @click="pathClick(item, index)"
            :class="{ active: index == current }"
          >
            {{ item.name }}
          </li>
        </ul>

        <router-view />
      </div>
    </div>

    <el-dialog title="修改密码" :visible.sync="dialogVisible" width="30%">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="120px"
        class="demo-ruleForm"
      >
        <el-form-item label="注册手机号" prop="account">
          <el-input v-model="ruleForm.account"></el-input>
        </el-form-item>

        <el-form-item label="短信验证码" prop="code">
          <el-input v-model="ruleForm.code" style="width: 200px"></el-input>

          <div class="loginImgBtn" id="btnSendCode">
            <el-button v-show="show" @click="getCode">获取验证码</el-button>
            <el-button v-show="!show" disabled
              >{{ count }}秒后重新获取</el-button
            >
          </div>
        </el-form-item>

        <el-form-item label="登录密码" prop="password" style="margin-top: 10px">
          <el-input v-model="ruleForm.password" show-password></el-input>
        </el-form-item>

        <el-form-item
          label="登录密码确认"
          prop="submpassword"
          style="margin-top: 10px"
        >
          <el-input v-model="ruleForm.submpassword" show-password></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { setItem, getItem, removeItem } from '@/utils/localStorage'
import { logout, currentMenu } from '@/api/api'
export default {
  data () {
    return {
      name: getItem('username'),
      count: '',
      show: true,
      ruleForm: {
        account: '',
        password: '',
        submpassword: '',
        code: ''
      },
      rules: {
        account: [{ required: true, message: '请输入账号' }],
        password: [{ required: true, message: '请输入密码' }],
        submpassword: [{ required: true, message: '请输入确认密码' }],
        code: [{ required: true, message: '请输入验证码' }]
      },
      dialogVisible: false,
      valname: '用户管理',
      isclass: 'el-icon-s-fold',
      isCollapse: false,
      childrenList: [],
      current: 0,
      nativeList: getItem('List')
    }
  },
  watch: {
    '$route.path': function (new1, old) {
      this.valname = this.$route.query.val
      this.current = this.$route.query.current
      var that = this
      var array = this.nativeList.filter(function (item) {
        if (item.name == that.valname) {
          return item.children[0].path
        }
      })
      this.childrenList = array[0].children
    }
  },
  methods: {
    nativeClick (item) {
      this.childrenList = item.children
      this.valname = item.name
      this.current = 0
      this.$router.push({
        path: item.children[0].path,
        query: { val: this.valname, current: item.children[0].current }
      })
    },
    pathClick (item, index) {
      this.$router.push({
        path: item.path,
        query: { val: this.valname, current: item.current }
      })

      this.current = item.current
    },

    shousuoClick () {
      this.isCollapse = !this.isCollapse
      if (this.isCollapse) {
        this.isclass = 'el-icon-s-unfold'
      } else {
        this.isclass = 'el-icon-s-fold'
      }
    },
    // 修改密码
    chpassword () {
      this.dialogVisible = true
    },
    // 退出登录
    logout () {
      this.$confirm('是否退出登录？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
        .then(() => {
          logout().then((res) => {
            const data = res.data
            if (data.code == '0') {
              this.$router.push({ path: '/login' })
              removeItem('Authentication')
              removeItem('username')
              removeItem('List')
            } else {
              this.$Message.warning(data.msg)
            }
          })
        })
        .catch(() => {
        })
    },
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) return
        console.log(this.ruleForm)
      })
    },

    // 验证码
    getCode () {
      const TIME_COUNT = 60
      if (!this.timer) {
        this.count = TIME_COUNT
        this.show = false
        this.timer = setInterval(() => {
          if (this.count > 0 && this.count <= TIME_COUNT) {
            this.count--
          } else {
            this.show = true
            clearInterval(this.timer)
            this.timer = null
          }
        }, 1000)
      }
    }
  },

  mounted () {
    if (this.$route.query.val) {
      this.valname = this.$route.query.val
      var that = this
      var array = this.nativeList.filter(function (item) {
        if (item.name == that.valname) {
          return item.children[0].path
        }
      })
      this.childrenList = array[0].children
    }
    if (this.$route.query.current) {
      this.current = this.$route.query.current
    }
      console.log(getItem('List'))
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.el-menu {
  background-color: rgba(67, 74, 80) !important;
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 100vh;
  background-color: rgba(67, 74, 80);
}
.el-menu-item {
  color: #fff;
}
.el-menu-item.is-active {
  color: #409eff;
}
.el-menu-item:hover {
  background: #fff;
  color: #409eff;
}
.el-menu-item:hover i {
  color: #409eff;
}
.el-menu {
  border: none;
}
.topClass {
  width: 100%;
  height: 100px;
  text-align: center;
  line-height: 100px;
  box-sizing: border-box;
  border-bottom: 1px solid #ccc;
}
.rightnative {
  height: 100px;
  /* background: blue; */
  flex: 1 1 auto;
  border-bottom: 1px solid #409eff;
  box-sizing: border-box;
}
.nativewarp {
  flex: 0 0 auto;
  min-height: 100vh;
  background-color: rgba(67, 74, 80);
}
.flex_warp {
  display: flex;
}
.right_top {
  overflow: hidden;
  height: 100px;
}
.childrenClass {
  overflow: hidden;
  width: 98%;
  margin: 0 auto;
  margin-top: 10px;
  margin-bottom: 20px;
}
.childrenClass li {
  /* background-color: #ecf5ff; */
  display: inline-block;
  height: 40px;
  padding: 0 20px;
  line-height: 40px;
  font-size: 14px;
  float: left;
  margin-right: 20px;
  cursor: pointer;
  border-top: 3px solid #fff;
}
.childrenClass li:hover {
  border-top: 3px solid #d9ecff;
}
.childrenClass .active {
  border-top: 3px solid #d9ecff;
}
.iconClass {
  font-size: 40px;
  line-height: 100px;
  margin-left: 10px;
}
.text_icon {
  font-size: 14px;
  margin-right: 10px;
}
.information {
  float: right;
  line-height: 100px;
  margin-right: 50px;
}
#btnSendCode {
  float: right;
}
</style>
