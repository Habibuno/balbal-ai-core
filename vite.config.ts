import process from 'node:process';

import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		react(),
		visualizer({
			filename: 'dist/stats.html',
			open: true,
			gzipSize: true,
			brotliSize: true,
		}),
	],
	server: {
		headers: {
			'X-Content-Type-Options': 'nosniff',
			'X-Frame-Options': 'DENY',
			'X-XSS-Protection': '1; mode=block',
			'Referrer-Policy': 'strict-origin-when-cross-origin',
			'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
			'Content-Security-Policy':
				'default-src \'self\'; ' +
				'script-src \'self\' \'unsafe-inline\' \'unsafe-eval\' https://cdn.tailwindcss.com https://unpkg.com; ' +
				'style-src \'self\' \'unsafe-inline\' https://fonts.googleapis.com; ' +
				'font-src \'self\' data: https://fonts.gstatic.com; ' +
				'img-src \'self\' data: https:; ' +
				'connect-src \'self\' https:;',
		},
	},
	build: {
		sourcemap: true,
		rollupOptions: {
			output: {
				manualChunks: {
					vendor: ['react', 'react-dom', 'react-router-dom'],
					ui: ['@headlessui/react', 'lucide-react'],
					i18n: ['i18next', 'react-i18next'],
				},
			},
		},
	},
	optimizeDeps: {
		include: ['react', 'react-dom', 'react-router-dom'],
	},
	define: {
		'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
	},
});
