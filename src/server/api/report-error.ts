import process from 'node:process';

import nodemailer from 'nodemailer';
import type { ViteDevServer } from 'vite';

type ErrorReport = {
	error: {
		name: string;
		message: string;
		stack?: string;
	};
	context?: {
		component?: string;
		action?: string;
		userInfo?: Record<string, unknown>;
		additionalData?: Record<string, unknown>;
	};
};

export default function setupReportingAPI(server: ViteDevServer) {
	console.log('🔄 Initializing error reporting API...');

	const transporter = nodemailer.createTransport({
		host: process.env.VITE_SMTP_HOST || 'smtp.gmail.com',
		port: Number.parseInt(process.env.VITE_SMTP_PORT || '587', 10),
		secure: false,
		auth: {
			user: process.env.VITE_SMTP_USER,
			pass: process.env.VITE_SMTP_PASS,
		},
	});

	console.log('✅ Email transporter initialized');

	server.middlewares.use('/api/report-error', async (req, res, next) => {
		console.log('📥 Error report request received:', req.method, req.url);

		// Only handle POST requests
		if (req.method !== 'POST') {
			console.log('❌ Invalid method:', req.method);
			res.statusCode = 405;
			res.setHeader('Content-Type', 'application/json');
			res.end(JSON.stringify({
				success: false,
				error: 'Method Not Allowed',
			}));
			return;
		}

		// Ensure we're handling the exact path
		if (req.url !== '/api/report-error') {
			console.log('❌ Path mismatch:', req.url);
			next();
			return;
		}

		try {
			console.log('🔄 Parsing request body...');
			const report = await new Promise<ErrorReport>((resolve, reject) => {
				let body = '';
				req.on('data', chunk => {
					body += chunk.toString();
				});
				req.on('end', () => {
					try {
						console.log('Received body:', body);
						const parsed = JSON.parse(body);
						if (!parsed.error || !parsed.error.name || !parsed.error.message) {
							console.log('Invalid error report format:', parsed);
							reject(new Error('Invalid error report format'));
							return;
						}
						resolve(parsed);
					} catch (error) {
						console.log('Failed to parse JSON:', error);
						reject(new Error('Invalid JSON payload'));
					}
				});
				req.on('error', (error) => {
					console.log('Request error:', error);
					reject(error);
				});
			});

			console.log('Processing error report:', report);

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

Environment: ${process.env.VITE_APP_ENV || 'development'}

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

			const recipient = process.env.VITE_REPORT_RECIPIENT;
			if (!recipient) {
				console.log('No recipient email configured');
				throw new Error('No recipient email configured');
			}

			console.log('Sending email to:', recipient);
			await transporter.sendMail({
				from: process.env.VITE_SMTP_USER,
				to: recipient,
				subject: `[BalBal.io] Error Report - ${error.name}`,
				text: reportContent,
				html: reportContent.replace(/\n/g, '<br>'),
			});

			console.log('Email sent successfully');

			res.statusCode = 200;
			res.setHeader('Content-Type', 'application/json');
			res.end(JSON.stringify({ success: true, message: 'Error report sent successfully' }));
		} catch (error) {
			console.error('Failed to process error report:', error);
			res.statusCode = 500;
			res.setHeader('Content-Type', 'application/json');
			res.end(JSON.stringify({
				success: false,
				error: error instanceof Error ? error.message : 'Internal Server Error',
			}));
		}
	});

	console.log('Error reporting API setup complete');
}