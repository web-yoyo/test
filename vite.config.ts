import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import styleImport, { VantResolve } from 'vite-plugin-style-import'
// Vite自身已经集成PostCSS，无需再次安装。另外也无需单独创建PostCSS配置文件，已集成到vite.config.js的css选项中
import postCssPxToRem from 'postcss-pxtorem'
import { resolve } from 'path'

function pathResolve(dir: string) {
  return resolve(process.cwd(), '.', dir)
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    styleImport({
      resolves: [VantResolve()],
    }),
  ],
  resolve: {
    // alias: {
    //   '@': path.resolve(__dirname, './src'), //设置别名
    // },
    alias: [
      {
        find: /@\//,
        replacement: pathResolve('src') + '/',
      },
    ],
  },
  server: {
    port: 3000,
    open: false,
    proxy: {
      '/api': {
        target: 'https://api.uomg.com/',
        changeOrigin: true,
        secure: false,
        // rewrite: (path) => path.replace(/^\/api/, ''),
      },
      '/vvhan': {
        target: 'https://api.vvhan.com/api/',
        secure: false,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/vvhan/, ''),
      },
    },
  },
  css: {
    postcss: {
      plugins: [
        postCssPxToRem({
          rootValue: 37.5,
          propList: ['*'],
        }),
      ],
    },
    preprocessorOptions: {
      scss: {
        /**如果引入多个文件，可以使用
         * '@import "@/assets/scss/globalVariable1.scss";
         * @import"@/assets/scss/globalVariable2.scss";'
         **/
        additionalData: '@import "@/assets/style/globalVar.scss";',
      },
    },
  },
})
