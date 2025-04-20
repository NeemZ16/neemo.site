import { defineConfig } from 'vite'
import { viteStaticCopy } from 'vite-plugin-static-copy'

export default defineConfig({
    optimizeDeps: {
        esbuildOptions: {
            target: 'esnext'
        }
    },
    plugins: [
        viteStaticCopy({
            targets: [{
                src: 'node_modules/web-tree-sitter/tree-sitter.wasm',
                dest: ''
            },
            {
                src: 'node_modules/curlconverter/dist/tree-sitter-bash.wasm',
                dest: ''
            }]
        })
    ],
    server: {
        port: 8080
    }
})