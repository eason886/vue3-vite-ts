import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
// import styleImport from 'vite-plugin-style-import' 按需导入style
import importToCDN, { autoComplete } from 'vite-plugin-cdn-import' // 生产环境采用cdn模块
// 路径处理模块
import { resolve } from 'path'
console.log(resolve(__dirname, 'src'), __dirname)
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    // styleImport({
    //   libs: [
    //     {
    //       libraryName: 'VANT',
    //       esModule: true,
    //       resolveStyle: (name) => {
    //         return ``
    //       }
    //     }
    //   ]
    // }),
    importToCDN({
      modules: [
        autoComplete('vue'),
        // autoComplete('axios'),
        // autoComplete('lodash'),
        {
          name: 'vue',
          var: 'Vue',
          path: 'https://cdn.jsdelivr.net/npm/vue@next'
        },
        // 项目中没有下载 vuex vue-router
        {
          name: 'vuex',
          var: 'Vuex',
          path: 'https://cdn.jsdelivr.net/npm/vuex@4.0.2/dist/vuex.global.prod.js'
        },
        {
          name: 'vue-router',
          var: 'VueRouter',
          path: 'https://cdn.jsdelivr.net/npm/vue-router@4.0.10/dist/vue-router.global.prod.js'
        }
      ]
    })
  ],
  resolve: {
    // 定义wenjian别名
    alias: {
      '@': resolve(__dirname, 'src'),
      '@components': resolve(__dirname, 'src/assets')
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        charset: false,
        additionalData: `@import "@/assets/scss/_theme.scss";`
      },
      less: {
        javascriptEnabled: true
      }
    }
  },
  build: {
    target: 'modules',
    outDir: 'dist', // 指定输出路径
    assetsDir: 'static', // 指定生成静态资源的存放路径
    minify: 'terser', // 混淆器,terser构建后文件体积更小
    sourcemap: false,
    terserOptions: {
      compress: {
        drop_console: true, // 生产环境移除console
        drop_debugger: true // 生产环境移除debugger
      }
    },
    rollupOptions: {
      treeshake: false,
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return id.toString().split('node_modules/')[1].split('/')[0].toString()
          }
        }
      }
    }
  },
  server: {
    open: true, // 是否在浏览器打开
    port: 8080, // 端口号
    host: '127.0.0.1' //
  },
  // 引入第三方配置
  optimizeDeps: {
    include: []
  }
})
