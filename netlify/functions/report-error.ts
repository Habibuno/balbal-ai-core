import process from 'node:process';

import type { Handler } from '@netlify/functions';
import nodemailer from 'nodemailer';

const handler: Handler = async (event) => {
	const requestId = event.headers['x-request-id'] || `func_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

	// CORS headers
	const headers = {
		'Access-Control-Allow-Origin': '*',
		'Access-Control-Allow-Methods': 'POST, OPTIONS',
		'Access-Control-Allow-Headers': '*',
		'Access-Control-Max-Age': '86400',
		'X-Function-Source': 'netlify-function-report-error',
		'X-Request-ID': requestId,
	};

	// Handle preflight requests
	if (event.httpMethod === 'OPTIONS') {
		return {
			statusCode: 204,
			headers,
			body: '',
		};
	}

	// Only allow POST requests
	if (event.httpMethod !== 'POST') {
		return {
			statusCode: 405,
			headers,
			body: JSON.stringify({
				success: false,
				error: 'Method Not Allowed',
				source: 'netlify-function',
				functionId: 'report-error-v1',
				requestId,
				timestamp: new Date().toISOString(),
			}),
		};
	}

	try {
		const report = JSON.parse(event.body || '{}');
		const { error, context, requestId: reportRequestId } = report;
		const timestamp = new Date().toISOString();

		const transporter = nodemailer.createTransport({
			service: 'gmail',
			port: 465,
			secure: true,
			auth: {
				user: process.env.VITE_SMTP_USER,
				pass: process.env.VITE_SMTP_PASS,
			},
		});

		let reportContent = `
Error Report - ${timestamp}
========================================

Request ID: ${reportRequestId || requestId}
Environment: ${process.env.VITE_APP_ENV || 'production'}

Error Details:
-------------
Name: ${error.name}
Message: ${error.message}
Stack: ${error.stack || 'No stack trace available'}

`;

		if (context) {
			reportContent += `
Context:
--------
Component: ${context.component || 'N/A'}
Action: ${context.action || 'N/A'}
User Info: ${JSON.stringify(context.userInfo || {}, null, 2)}
Additional Data: ${JSON.stringify(context.additionalData || {}, null, 2)}

Generated Code:
-------------
${context.additionalData?.generatedCode || 'No code available'}
`;
		}

		const recipient = process.env.VITE_REPORT_RECIPIENT;
		if (!recipient) {
			throw new Error('No recipient email configured');
		}

		await transporter.sendMail({
			from: process.env.VITE_SMTP_USER,
			to: recipient,
			subject: `[BalBal.io] Error Report - ${error.name} (${reportRequestId || requestId})`,
			text: reportContent,
			html: reportContent.replace(/\n/g, '<br>'),
		});

		return {
			statusCode: 200,
			headers,
			body: JSON.stringify({
				success: true,
				message: 'Error report sent successfully',
				source: 'netlify-function',
				functionId: 'report-error-v1',
				requestId: reportRequestId || requestId,
				timestamp,
				environment: process.env.VITE_APP_ENV || 'production',
			}),
		};
	} catch (error) {
		return {
			statusCode: 500,
			headers,
			body: JSON.stringify({
				success: false,
				error: error instanceof Error ? error.message : 'Internal Server Error',
				source: 'netlify-function',
				functionId: 'report-error-v1',
				requestId,
				timestamp: new Date().toISOString(),
				environment: process.env.VITE_APP_ENV || 'production',
			}),
		};
	}
};

export { handler };