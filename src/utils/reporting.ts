import nodemailer from 'nodemailer';

import { env } from '../config/env';

type ErrorReport = {
	error: Error;
	context?: {
		component?: string;
		action?: string;
		userInfo?: Record<string, unknown>;
		additionalData?: Record<string, unknown>;
	};
};

class ReportingService {
	private transporter: nodemailer.Transporter | null = null;

	constructor() {
		this.initializeTransporter();
	}

	private initializeTransporter() {
		try {
			this.transporter = nodemailer.createTransport({
				host: env.smtp.host,
				port: env.smtp.port,
				secure: false,
				auth: {
					user: env.smtp.user,
					pass: env.smtp.pass,
				},
			});
		} catch (error) {
			console.error('Failed to initialize email transporter:', error);
		}
	}

	private formatErrorReport(report: ErrorReport): string {
		const { error, context } = report;
		const timestamp = new Date().toISOString();

		let reportContent = `
Error Report - ${timestamp}
========================================

Error Details:
-------------
Name: ${error.name}
Message: ${error.message}
Stack: ${error.stack}

Environment: ${env.environment}

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

		return reportContent;
	}

	async sendErrorReport(report: ErrorReport): Promise<void> {
		if (!this.transporter) {
			console.error('Email transporter not initialized');
			return;
		}

		try {
			const reportContent = this.formatErrorReport(report);
			const recipient = env.reporting.recipient;

			if (!recipient) {
				console.error('No recipient email configured');
				return;
			}

			await this.transporter.sendMail({
				from: env.smtp.user,
				to: recipient,
				subject: `[BalBal.io] Error Report - ${report.error.name}`,
				text: reportContent,
				html: reportContent.replace(/\n/g, '<br>'),
			});

			console.log('Error report sent successfully');
		} catch (error) {
			console.error('Failed to send error report:', error);
		}
	}
}

// Create a singleton instance
export const reportingService = new ReportingService();

// Helper function to report errors
export async function reportError(error: Error, context?: ErrorReport['context']): Promise<void> {
	await reportingService.sendErrorReport({ error, context });
}