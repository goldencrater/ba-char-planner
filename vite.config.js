import { fileURLToPath, URL } from 'url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

const childProcess = require('child_process');
let lastCommitHash = '';
try
{
    lastCommitHash = childProcess.execSync('git rev-parse --short HEAD').toString().trim();
}
catch (e)
{
    console.error(e);
}

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue()],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
        }
    },
    define: {
        __COMMITHASH__: JSON.stringify(lastCommitHash)
    },
    server: {
        host: true
    }
})
