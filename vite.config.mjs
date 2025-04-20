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
    build: {
        target: 'esnext', // ensure ESNext target so top-level await works
    },
    server: {
        port: 8080
    }
})