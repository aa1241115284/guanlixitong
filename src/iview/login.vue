<template>
  <div class="body">
    <div class="auto">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="登录账号" prop="username">
          <el-input v-model="ruleForm.username"></el-input>
        </el-form-item>

        <el-form-item label="登录密码" prop="password" style="margin-top: 20px">
          <el-input v-model="ruleForm.password" show-password></el-input>
        </el-form-item>

        <!-- <div class='forget' @click='forgetClick'>忘记密码</div> -->

        <div class="btn_warp">
          <el-button
          type="primary"
          @click="submitForm('ruleForm')"
          :loading="loginLoading"
            >登录</el-button
          >
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import { login, currentMenu } from '@/api/api'
import { encrypt } from '@/utils/tools'
import { setItem, getItem, removeItem } from '@/utils/localStorage'
export default {
  name: 'login',
  data () {
    return {
      loginLoading: false,
      ruleForm: {
        username: '',
        password: ''
      },
      rules: {
        username: [{ required: true, message: '请输入账号' }],
        password: [{ required: true, message: '请输入密码' }]
      }
    }
  },
  computed: {},
  methods: {
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) return
        this.ruleForm.password = encrypt(this.ruleForm.password)
        this.loginLoading = true
        login(this.ruleForm).then((res) => {
          const data = res.data
          this.loginLoading = false
          if (data.code == '0') {
            setItem('Authentication', data.data.token)
            setItem('username', data.data.userInfo.username)
            currentMenu().then((res) => {
              var Array = res.data.data
              for (let i = 0; i < Array.length; i++) {
                const el = Array[i].children
                for (let a = 0; a < el.length; a++) {
                  const al = el[a]
                  al.current = a
                }
              }
              setItem('List', Array)
              this.$router.push({ path: '/', query: { val: '用户管理', current: '0' }})
            })
          } else {
            this.$Message.warning(data.msg)
          }
        })
        // this.$router.push({path: '/'})
      })
    },
    forgetClick () {
      this.$router.push({path: '/chpassword'})
    }
  },
  mounted () {

  },
  destroyed () {}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.auto {
  width: 400px;
  margin: 0 auto;
  margin-top: 300px;
}
.btn_warp {
  text-align: center;
  margin-top: 20px;
}
.forget{
  font-size: 12px;
  color: #409EFF;
  margin-left: 100px;
  cursor: pointer;
}
</style>
