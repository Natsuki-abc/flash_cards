import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        laravel({
            input: [
                'resources/css/app.css',
                'resources/js/app.jsx', // 拡張子をjsxに変更
            ],
            refresh: true,
        }),
        react(), // Reactプラグインを
    ],
});
