import type { Handler } from '@netlify/functions';
import nodemailer from 'nodemailer';

const handler: Handler = async (event) => {
	const headers = {
		'Access-Control-Allow-Origin': '*',
		'Access-Control-Allow-Methods': 'POST, OPTIONS',
		'Access-Control-Allow-Headers': 'Content-Type',
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
			}),
		};
	}

	try {
		const report = JSON.parse(event.body || '{}');
		const { error, context } = report;
		const timestamp = new Date().toISOString();

		const transporter = nodemailer.createTransport({
			host: process.env.VITE_SMTP_HOST || 'smtp.gmail.com',
			port: Number.parseInt(process.env.VITE_SMTP_PORT || '587', 10),
			secure: false,
			auth: {
				user: process.env.VITE_SMTP_USER,
				pass: process.env.VITE_SMTP_PASS,
			},
		});

		let reportContent = `
Error Report - ${timestamp}
========================================

Error Details:
-------------
Name: ${error.name}
Message: ${error.message}
Stack: ${error.stack || 'No stack trace available'}

Environment: ${process.env.VITE_APP_ENV || 'production'}

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
			throw new Error('No recipient email configured');
		}

		await transporter.sendMail({
			from: process.env.VITE_SMTP_USER,
			to: recipient,
			subject: `[BalBal.io] Error Report - ${error.name}`,
			text: reportContent,
			html: reportContent.replace(/\n/g, '<br>'),
		});

		return {
			statusCode: 200,
			headers,
			body: JSON.stringify({
				success: true,
				message: 'Error report sent successfully',
			}),
		};
	} catch (error) {
		return {
			statusCode: 500,
			headers,
			body: JSON.stringify({
				success: false,
				error: error instanceof Error ? error.message : 'Internal Server Error',
			}),
		};
	}
};

export { handler };