import type { IncomingMessage, ServerResponse } from 'node:http';
import process from 'node:process';

import react from '@vitejs/plugin-react';
import nodemailer from 'nodemailer';
import { visualizer } from 'rollup-plugin-visualizer';
import type { UserConfig, ViteDevServer } from 'vite';
import { defineConfig, loadEnv } from 'vite';

function apiPlugin() {
	return {
		name: 'api-plugin',
		configureServer(server: ViteDevServer) {
			const env = loadEnv(process.env.NODE_ENV || 'development', process.cwd(), '');
			const transporter = nodemailer.createTransport({
				service: 'gmail',
				port: 465,
				secure: true,
				auth: {
					user: env.VITE_SMTP_USER,
					pass: env.VITE_SMTP_PASS,
				},
				tls: {
					rejectUnauthorized: false,
				},
			});

			server.middlewares.use((req: IncomingMessage, res: ServerResponse, next: () => void) => {
				res.setHeader('Access-Control-Allow-Origin', '*');
				res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
				res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

				if (req.method === 'OPTIONS') {
					res.statusCode = 204;
					res.end();
					return;
				}

				next();
			});

			server.middlewares.use('/api/health', (res: ServerResponse) => {
				res.statusCode = 200;
				res.end('OK');
			});

			server.middlewares.use('/api/report-error', async (req: IncomingMessage, res: ServerResponse) => {
				if (req.method !== 'POST') {
					res.statusCode = 405;
					res.setHeader('Content-Type', 'application/json');
					res.end(JSON.stringify({
						success: false,
						error: 'Method Not Allowed',
					}));
					return;
				}

				try {
					let body = '';
					req.on('data', chunk => {
						body += chunk.toString();
					});

					req.on('end', async () => {
						try {
							const report = JSON.parse(body);
							const { error, context } = report;
							const timestamp = new Date().toISOString();

							let reportContent = `
Error Report - ${timestamp}
========================================

Error Details:
-------------
Name: ${error.name}
Message: ${error.message}
Stack: ${error.stack || 'No stack trace available'}

Environment: ${env.VITE_APP_ENV || 'development'}

`;

							if (context) {
								reportContent += `
Context:
--------
Component: ${context.component || 'N/A'}
Action: ${context.action || 'N/A'}
User Info: ${JSON.stringify(context.userInfo || {}, null, 2)}
Additional Data: ${JSON.stringify(context.additionalData || {}, null, 2)}
`;
							}

							const recipient = env.VITE_REPORT_RECIPIENT;
							if (!recipient) {
								throw new Error('No recipient email configured');
							}

							await transporter.sendMail({
								from: env.VITE_SMTP_USER,
								to: recipient,
								subject: `[BalBal.io] Error Report - ${error.name}`,
								text: reportContent,
								html: reportContent.replace(/\n/g, '<br>'),
							});

							res.statusCode = 200;
							res.setHeader('Content-Type', 'application/json');
							res.end(JSON.stringify({
								success: true,
								message: 'Error report sent successfully',
							}));
						} catch (error) {
							res.statusCode = 500;
							res.setHeader('Content-Type', 'application/json');
							res.end(JSON.stringify({
								success: false,
								error: error instanceof Error ? error.message : 'Internal Server Error',
							}));
						}
					});
				} catch (error) {
					res.statusCode = 500;
					res.setHeader('Content-Type', 'application/json');
					res.end(JSON.stringify({
						success: false,
						error: 'Internal Server Error',
					}));
				}
			});

			server.middlewares.use('/api', (req: IncomingMessage, res: ServerResponse) => {
				res.statusCode = 404;
				res.setHeader('Content-Type', 'application/json');
				res.end(JSON.stringify({
					success: false,
					error: 'API endpoint not found',
				}));
			});
		},
	};
}

export default defineConfig({
	plugins: [
		react(),
		visualizer({
			filename: 'dist/stats.html',
			open: true,
			gzipSize: true,
			brotliSize: true,
		}),
		apiPlugin(),
	],
	server: {
		headers: {
			'X-Content-Type-Options': 'nosniff',
			'X-Frame-Options': 'DENY',
			'X-XSS-Protection': '1; mode=block',
			'Referrer-Policy': 'strict-origin-when-cross-origin',
			'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
		},
	},

	define: {
		'process.env.NODE_ENV': JSON.stringify(process.env.VITE_APP_ENV),
	},
} as UserConfig);
