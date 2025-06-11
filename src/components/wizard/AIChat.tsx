import { clsx } from 'clsx';
import { Bot, Maximize2, Minimize2, Send } from 'lucide-react';
import type React from 'react';
import { useEffect, useRef, useState } from 'react';

import { Button } from '../ui/Button';

type Message = {
	id: string;
	text: string;
	sender: 'user' | 'ai';
	timestamp: Date;
	loading?: boolean;
};

export const AIChat: React.FC = () => {
	const [messages, setMessages] = useState<Message[]>([
		{
			id: '1',
			text: 'Je suis votre assistant IA spécialisé dans la création d\'applications mobiles. Je peux vous guider à chaque étape du processus. Comment puis-je vous aider aujourd\'hui ?',
			sender: 'ai',
			timestamp: new Date(),
		},
	]);
	const [input, setInput] = useState('');
	const [isExpanded, setIsExpanded] = useState(false);
	const [isMinimized, setIsMinimized] = useState(false);
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const [isTyping, setIsTyping] = useState(false);

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		scrollToBottom();
	}, [messages]);

	const simulateTyping = async (text: string) => {
		setIsTyping(true);
		const tempId = Date.now().toString();

		setMessages((prev) => [
			...prev,
			{
				id: tempId,
				text: '',
				sender: 'ai',
				timestamp: new Date(),
				loading: true,
			},
		]);

		let dots = '';
		const typingInterval = setInterval(() => {
			dots = dots.length < 3 ? `${dots}.` : '';
			setMessages((prev) =>
				prev.map((msg) => (msg.id === tempId ? { ...msg, text: `En train d'écrire${dots}` } : msg))
			);
		}, 500);

		await new Promise((resolve) => setTimeout(resolve, 2000));

		clearInterval(typingInterval);

		setMessages((prev) =>
			prev.map((msg) =>
				msg.id === tempId
					? {
							id: tempId,
							text,
							sender: 'ai',
							timestamp: new Date(),
						}
					: msg
			)
		);

		setIsTyping(false);
	};

	const handleSend = async () => {
		if (!input.trim() || isTyping) return;

		const userMessage: Message = {
			id: Date.now().toString(),
			text: input,
			sender: 'user',
			timestamp: new Date(),
		};

		setMessages((prev) => [...prev, userMessage]);
		setInput('');

		const response = `Je comprends votre besoin concernant ${input.toLowerCase()}. Je vais vous aider à créer une application qui correspond parfaitement à vos attentes. Pouvez-vous me donner plus de détails sur les fonctionnalités spécifiques que vous souhaitez ?`;
		await simulateTyping(response);
	};

	const toggleExpand = () => {
		setIsExpanded(!isExpanded);
		setIsMinimized(false);
	};

	const toggleMinimize = () => {
		setIsMinimized(!isMinimized);
		if (isExpanded) setIsExpanded(false);
	};

	return (
		<div
			className={clsx(
				'fixed shadow-2xl transition-all duration-300',
				isMinimized
					? 'bottom-4 right-4 h-12 w-48'
					: isExpanded
						? 'inset-4'
						: 'bottom-4 right-4 h-[300px] w-[350px]',
				'overflow-hidden rounded-lg border-2 border-cyan-400/20 bg-gradient-to-b from-gray-900 to-black'
			)}
		>
			{/* Header */}
			<div className="flex items-center justify-between border-b border-cyan-400/20 bg-black/50 p-2 backdrop-blur-sm">
				<div className="flex items-center gap-2">
					<Bot className="h-4 w-4 text-cyan-400" />
					<span className="text-sm font-bold text-cyan-400">Assistant IA</span>
				</div>
				<div className="flex items-center gap-1">
					<Button
						onClick={toggleMinimize}
						className="rounded-md p-1 transition-colors hover:bg-cyan-400/20"
					>
						{isMinimized ? (
							<Maximize2 className="h-3 w-3 text-cyan-400" />
						) : (
							<Minimize2 className="h-3 w-3 text-cyan-400" />
						)}
					</Button>
					{!isMinimized && (
						<Button
							onClick={toggleExpand}
							className="rounded-md p-1 transition-colors hover:bg-cyan-400/20"
						>
							{isExpanded ? (
								<Minimize2 className="h-3 w-3 text-cyan-400" />
							) : (
								<Maximize2 className="h-3 w-3 text-cyan-400" />
							)}
						</Button>
					)}
				</div>
			</div>

			{/* Messages */}
			{!isMinimized && (
				<>
					<div
						className="flex-1 space-y-3 overflow-y-auto p-3"
						style={{ height: 'calc(100% - 96px)' }}
					>
						{messages.map((message) => (
							<div
								key={message.id}
								className={clsx(
									'flex',
									message.sender === 'user' ? 'justify-end' : 'justify-start'
								)}
							>
								<div
									className={clsx(
										'max-w-[80%] rounded-lg p-2 text-sm backdrop-blur-sm',
										message.sender === 'user'
											? 'bg-cyan-400/20 text-white'
											: 'bg-gray-800/50 text-gray-200',
										message.loading && 'animate-pulse'
									)}
								>
									{message.text}
								</div>
							</div>
						))}
						<div ref={messagesEndRef} />
					</div>

					{/* Input */}
					<div className="absolute bottom-0 left-0 right-0 border-t border-cyan-400/20 bg-black/50 p-2 backdrop-blur-sm">
						<div className="flex gap-2">
							<input
								type="text"
								value={input}
								onChange={(e) => setInput(e.target.value)}
								onKeyPress={(e) => e.key === 'Enter' && handleSend()}
								placeholder="Posez votre question..."
								disabled={isTyping}
								className={clsx(
									'flex-1 rounded-md border-2 border-cyan-400/20 bg-gray-800/50 px-3 py-1 text-sm',
									'text-white placeholder-gray-400',
									'transition-colors focus:border-cyan-400 focus:outline-none',
									'backdrop-blur-sm'
								)}
							/>
							<Button
								onClick={handleSend}
								disabled={!input.trim() || isTyping}
								icon={<Send className="h-3 w-3" />}
								size="sm"
								className="px-2 py-1"
							>
								Envoyer
							</Button>
						</div>
					</div>
				</>
			)}
		</div>
	);
};
