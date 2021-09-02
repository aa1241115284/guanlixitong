<template>
  <div class="body">
        <div class="tabwarp">
        <!-- <div class='par_title'>参数信息配置</div> -->
        <el-tabs type="border-card" v-model="activeName" style='width:300px"'>
          <el-tab-pane label="添加输入项" name="a">
            <span>
              <el-input
                v-model="title_model"
                style="width: 200px"
                size="small"
                placeholder="请填写输入项标题"
            /></span>
            <span style="margin: 0 10px">:</span>
            <span>
              <el-input
                v-model="title_text"
                style="width: 200px"
                size="small"
                placeholder="请填写输入项提示文字"
            /></span>
            <span
              ><el-button
                type="primary"
                size="small"
                @click="initemadd('text')"
                style="margin-left: 10px"
                :disabled="title_model == '' || title_text == ''"
                >添加</el-button
              ></span
            >
          </el-tab-pane>

          <el-tab-pane label="添加选择项" name="b">
            <span>
              <el-input
                v-model="option_model"
                style="width: 200px"
                size="small"
                placeholder="请填写选择项标题"
            /></span>
            <span style="margin: 0 10px">:</span>
            <span>
              <el-input
                v-model="option_text"
                style="width: 300px"
                size="small"
                placeholder="请填写选择项列表内容用 '/' 隔开"
            /></span>
            <span
              ><el-button
                type="primary"
                size="small"
                style="margin-left: 10px"
                @click="initemadd('select')"
                :disabled="option_model == '' || option_text == ''"
                >添加</el-button
              ></span
            >
          </el-tab-pane>

          <el-tab-pane label="添加图片上传" name="c">
            <span>
              <el-input
                v-model="img_name"
                style="width: 150px"
                size="small"
                placeholder="请填写图片上传标题"
            /></span>
            <span style="margin: 0 10px">:</span>
            <span>
              <el-input
                v-model="img_width"
                style="width: 150px"
                size="small"
                placeholder="请填写图片宽度(px)"
            /></span>
            <span>
              <el-input
                v-model="img_height"
                style="width: 150px"
                size="small"
                placeholder="请填写图片高度(px)"
            /></span>
            <span>
              <el-input
                v-model="img_size"
                style="width: 150px"
                size="small"
                placeholder="请填写图片限制大小"
            /></span>

            <span
              ><el-button
                type="primary"
                size="small"
                @click="initemadd('picture')"
                style="margin-left: 10px"
                :disabled="
                  img_name == '' ||
                  img_width == '' ||
                  img_height == '' ||
                  img_size == ''
                "
              >
                添加</el-button
              >
            </span>
          </el-tab-pane>
        </el-tabs>
      </div>

      <div class="title_preview">效果预览</div>

      <el-card class="box-card">
        <vuedraggable class="wrapper" v-model="previewlist">
          <transition-group>
            <div
              v-for="(item, index) in previewlist"
              :key="index"
              class='StyleClass'
              style="margin-top: 10px"
            >
            <img src="@/assets/images/tz.png" alt="" class='tzClass'>
              <div v-if="item.configType == 'text'" style='float:left'>
                <div class='title_Class'>{{ item.configTitle }}：</div>
                <span>
                  <el-input
                    v-model="cable"
                    style="width: 200px"
                    size="small"
                    :placeholder="item.configPrompt"
                    disabled
                /></span>
              </div>

              <div v-if="item.configType == 'select'" style='float:left'>
                <div class='title_Class'>{{ item.configTitle }}：</div>
                <el-select v-model="aaa" size="small">
                  <el-option
                    v-for="(items, index) in functionList(item.configPrompt)"
                    :key="index"
                    :label="items"
                    :value="items"
                  >
                  </el-option>
                </el-select>
              </div>

              <div v-if="item.configType == 'picture'" class="imgconcent_warp" style='float:left'>
                <div class=" title_Class">{{ item.configTitle }}：</div>
                <div class="center_warp">
                  <img src="@/assets/images/work.png" alt="" />
                </div>
                <div class="right_title">
                  (请上传{{ item.configSize}},大小不超过{{
                    item.configLimit
                  }}M的PNG/jpg的图片)
                </div>
              </div>
              <div class='btn_warp'><el-button @click='removeClick(index)' size='small' type='danger'>删除</el-button></div>
            </div>
          </transition-group>
        </vuedraggable>
      </el-card>
  </div>
</template>

<script>
import vuedraggable from 'vuedraggable'
import eventBus from '@/utils/bus'
export default {
  components: { vuedraggable },
  data () {
    return {
      aaa: '',
      option_imgmodel: '',
      previewlist: [],
      cable: '',
      title_model: '',
      title_text: '',
      option_model: '',
      option_text: '',
      img_name: '',
      img_size: '',
      img_width: '',
      img_height: '',
      activeName: 'a'

    }
  },

  updated () {
    this.$emit('updated', this.previewlist)
  },
  methods: {
    removeClick (index) {
      this.previewlist.splice(index, 1)
      console.log(index)
    },
    functionList (list) {
      return list.split('/')
    },
    initemadd (type) {
      if (type == 'text') {
        this.previewlist.push({
          configType: type,
          configTitle: this.title_model,
          configPrompt: this.title_text
        })
        this.title_model = ''
        this.title_text = ''
      } else if (type == 'select') {
        this.previewlist.push({
          configType: type,
          configTitle: this.option_model,
          configPrompt: this.option_text
        })
        this.option_model = ''
        this.option_text = ''
      } else if (type == 'picture') {
        this.previewlist.push({
          configType: type,
          configTitle: this.img_name,
          configSize: this.img_width + '*' + this.img_height,
          // width: this.img_width,
          // height: this.img_height,
          configLimit: this.img_size
        })
        this.img_name = ''
        this.img_width = ''
        this.img_height = ''
        this.img_size = ''
      }
      console.log(this.previewlist)
    }

  },
  mounted () {
    eventBus.$on('applymodel', (val) => {
      if (val == false) {
        this.title_model = ''
        this.title_text = ''
        this.option_model = ''
        this.option_text = ''
        this.img_name = ''
        this.img_width = ''
        this.img_height = ''
        this.img_size = ''
        // this.$refs.searchForm.resetFields()
      }
    })
    eventBus.$on('List', (val) => {
      if (val.echoConfigs) {
        this.previewlist = val.echoConfigs
      } else {
        this.previewlist = []
      }
    })
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.body {

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
  width: 50px;
  height: 60px;
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
.tzClass{
  width: 20px;
  height: 20px;
  float: left;
  margin-top: 5px;
}
.StyleClass{
  overflow: hidden;
}
.title_Class{
  width: 100px;
  text-align: right;
  float: left;
  margin-right: 20px;
  margin-top: 6px;
}
.par_title{
  font-size: 15px;
  padding-bottom: 20px;
}
.box-card{
  min-height: 100px;
}
.btn_warp{
  float: left;
  margin-left: 20px;
}
</style>
