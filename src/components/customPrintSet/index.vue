<!-- 套打设置组件。 -->
<template>
  <div :class="{hidden:!dialogTableVisible}" class="print-set ">
    <!-- <el-scrollbar style="height:100%;width:100%;"> -->
    <div class="tool-bar">
      <!-- <el-button-group> -->
      <!-- <p style="font-size:20px;margin-top:20px;margin-bottom:10px;text-align:center">模板选择</p>
        <el-select v-if="employTemplateData" :value="employTemplateData.templatename" value-key="templatename" placeholder="请选择模板" @change="changeTemplate">
          <el-option v-for="item in templateData" :key="item.templatename" :label="item.templatename" :value="item.templatename" @click.native="optionClick(item)">
            <div class="inner-text">
              <span>{{ item.templatename }}</span>
              <span class="el-icon-edit" @click="modifyTitle(item)" />
            </div>
          </el-option>
        </el-select> -->
      <el-button style="margin-top:20px" plain type="primary" icon="el-icon-close" @click="close">退出设置</el-button>
      <!-- <el-button plain type="primary" icon="el-icon-sort" @click="returnDefault">恢复默认</el-button> -->
      <!-- <el-button plain type="primary" icon="el-icon-view" @click="tablePrintPreview">打印预览</el-button>
        <el-button plain type="primary" icon="el-icon-printer" @click="tablePrint">开始打印</el-button>
        <el-button plain type="primary" icon="el-icon-document" @click="tablePrintExport">导出表格</el-button>
        <el-button plain type="primary" icon="el-icon-circle-check-outline" @click="savePrintData">保存模板</el-button>
        <el-button plain type="primary" icon="el-icon-plus" @click="addTemplate">新增模板</el-button>
        <el-button plain type="primary" icon="el-icon-remove-outline" @click="removeTemplate">删除模板</el-button>
        <el-button plain type="primary" icon="el-icon-remove-outline" @click="setup">详细设计</el-button> -->

      <!-- </el-button-group> -->
    </div>
    <div class="ueditor">
      <vue-ueditor-wrap v-model="msg" />

    </div>

    <!-- </el-scrollbar> -->
  </div>
</template>

<script>
// import printItemControl from './printItemControl'
import Bus from '@/utils/Bus'
import { getLodop } from '@/assets/LodopFuncsNew' // 导入模块
// import { savePrintTemplateData, removePrintTemplateData } from '@/api/webPrint'
import VueUeditorWrap from 'vue-ueditor-wrap'

export default {
  components: {
    VueUeditorWrap // 富文本编辑器
  },
  props: {
    printData: {
      type: Array,
      required: false,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      // templateData
      // checkedTexts: [],
      // printHeadHeight: '10',
      msg: `
123
      `,

      myConfig: {
        // 编辑器不自动被内容撑高
        autoHeightEnabled: false,
        // 初始容器高度
        initialFrameHeight: 240,
        // 初始容器宽度
        initialFrameWidth: 800,
        tableDragable: true
        // 上传文件接口（这个地址是我为了方便各位体验文件上传功能搭建的临时接口，请勿在生产环境使用！！！）
        // serverUrl: 'http://35.201.165.105:8000/controller.php'
        // UEditor 资源文件的存放路径，如果你使用的是 vue-cli 生成的项目，通常不需要设置该选项，vue-ueditor-wrap 会自动处理常见的情况，如果需要特殊配置，参考下方的常见问题2
        // UEDITOR_HOME_URL: '/static/UEditor/'
      },
      dialogTableVisible: false,
      LODOP: '' // 准备用来调用getLodop获取LODOP对象
    }
  },

  computed: {
  },

  watch: {
  },

  created() {
    Bus.$off('tablePrintSet')
    Bus.$on('tablePrintSet', () => {
      this.tablePrintSet()
    })
  },
  mounted() {
  },
  methods: {
    close() {
      this.dialogTableVisible = false
    },
    tablePrintSet() {
      this.dialogTableVisible = true
      console.log('打开了')
    },
    printSet() {
      this.LODOP = getLodop()
      this.LODOP.PRINT_INIT('表格预览')
      // console.log('当前设置的高度是：', this.employTemplateData.templatecontent.printHeadHeight)
      var printHeadHeight = +this.employTemplateData.templatecontent.printHeadHeight
      var strStyle = '<style> table,td,th {border-width: 1px;border-style: solid;border-collapse: collapse;}</style>'
      this.LODOP.ADD_PRINT_TABLE(`${printHeadHeight + 10}mm`, '5%', '95%', `90%`, strStyle + document.getElementById('div2').innerHTML)
      this.LODOP.SET_PRINT_STYLEA(0, 'Vorient', 3)
      this.LODOP.SET_PRINT_STYLEA(0, 'Offset2Top', `${-printHeadHeight}mm`) // 表示从次页开始的上边距偏移量
      this.LODOP.ADD_PRINT_HTM('1%', '2%', '95%', `${printHeadHeight}mm`, document.getElementById('div1').innerHTML)
      // this.LODOP.SET_PRINT_STYLEA(0, 'ItemType', 1) // 此行代码的作用是使得div1中的内容随着分页反复出现，相当于是页眉。
      this.LODOP.ADD_PRINT_HTM('2%', '0%', '95%', '10%', document.getElementById('div3').innerHTML)
      this.LODOP.SET_PRINT_STYLEA(0, 'LinkedItem', 1) // 内容项与别人关联后，会紧跟被关联者之后打印，位置和区域大小随被关联项而定，此时其Top和left不再是上边距和左边距，而是与关联项的间隔空隙及左边距偏移。0表示自己，1表示第一个，-1表示自己的前一个。
    }
  }
}

</script>
<style rel='stylesheet/scss' lang='scss'>
.print-set {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background: #fff;
  z-index: 4;
  &.hidden {
    display: none;
  }

  .hidden {
    visibility: hidden;
  }
  .none {
    display: none;
  }

  .tool-bar {
    width: 140px;
    font-size: 20px;
    position: absolute;
    top: 2%;
    left: 87%;
    .el-button + .el-button {
      margin: 0;
    }
    .inner-text {
      display: flex;
    }
  }
  .ueditor{
    width: 900px;
  }
  // .print-view-wrap {
  //   width: 80%;
  //   margin: 50px 40px;

  //   // margin-left:50px;
  //   // margin-right:200px;
  //   .print-positon {
  //     padding-left: 15%;
  //     // text-align: center;
  //     .print-distance {
  //       width: 50px;
  //       border: 1px solid #000;
  //       margin-left: 15px;
  //       margin-right: 15px;
  //     }
  //   }
  //   .print-head-wrap {
  //     border: 1px dashed rgba(0, 0, 0, 0.3);
  //     padding: 10px;
  //     display: flex;
  //     flex-flow: row nowrap;
  //     justify-content: space-between;
  //     #div1 {
  //       flex: 0 0 60%;
  //       border: 1px dashed #555;
  //     }
  //     .print-head-control {
  //       margin-right: 10px;
  //       flex: none;
  //     }
  //   }
  //   .print-table-wrap {
  //     border: 1px dashed rgba(0, 0, 0, 0.3);
  //     padding: 10px;
  //     display: flex;
  //     flex-flow: row nowrap;
  //     justify-content: space-between;
  //     #div2 {
  //       flex: 0 0 60%;
  //       padding-top: 10px;
  //       .print-table {
  //       }
  //     }
  //     .print-table-control {
  //       margin-right: 10px;
  //       flex: none;
  //     }
  //     .width {
  //       // margin-top:5px;
  //       // border: 1px solid #000;
  //       width: 50px;
  //       height: 28px;
  //       .el-input__inner {
  //         padding: 0;
  //       }
  //     }
  //   }
  //   .print-foot-wrap {
  //     border: 1px dashed rgba(0, 0, 0, 0.3);
  //     padding: 10px;
  //     display: flex;
  //     flex-flow: row nowrap;
  //     justify-content: space-between;
  //     #div3 {
  //       flex: 0 0 60%;
  //     }
  //     .print-foot-control {
  //       margin-right: 10px;
  //       flex: none;
  //     }
  //   }
  // }
}
</style>
