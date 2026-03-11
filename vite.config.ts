import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import path from 'path';

export default defineConfig({
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: 'node_modules/cesium/Build/Cesium/*',
          dest: 'cesium/'
        }
      ]
    })
  ],
  resolve: {
    alias: {
      'cesium': path.resolve(__dirname, 'node_modules/cesium')
    }
  }
});
