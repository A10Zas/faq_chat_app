'use client';

import React, { useEffect, useRef, useState } from 'react';
import Fuse from 'fuse.js';
import { faqData } from '@/lib/faqData';

const ChatBot = () => {
	const [input, setInput] = useState('');
	const [messages, setMessages] = useState<{ sender: string; text: string }[]>(
		[]
	);

	const chatContainerRef = useRef<HTMLDivElement>(null);

	const fuse = new Fuse(faqData, {
		keys: ['question', 'aliases'],
		includeScore: true,
		threshold: 0.3,
	});

	const getAnswer = (input: string) => {
		const result = fuse.search(input);
		if (result.length > 0) {
			return result[0].item.answer;
		} else {
			return "Sorry, I don't understand. Please try asking something else.";
		}
	};

	const sendMessage = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!input.trim()) {
			alert('Please enter a question');
			return;
		}

		const user = { sender: 'user', text: input };
		const chatBotResponse = { sender: 'chatBot', text: getAnswer(input) };

		setMessages((prevMessages) => [...prevMessages, user, chatBotResponse]);
		setInput('');
	};

	// ✅ Scroll to the bottom whenever messages update
	useEffect(() => {
		if (chatContainerRef.current) {
			chatContainerRef.current.scrollTop =
				chatContainerRef.current.scrollHeight;
		}
	}, [messages]); // Runs every time `messages` state changes

	return (
		<div className="flex flex-col items-center border h-80 w-full">
			{/* Message Container */}
			<div
				className="flex-1 w-full p-3 overflow-y-auto"
				ref={chatContainerRef} // Ref applied to the scrollable container
				style={{ maxHeight: '300px' }} // Ensure a max height for scrolling
			>
				{messages.map((message, index) => (
					<div
						key={index}
						className={`flex items-center gap-2 ${
							message.sender === 'user' ? 'justify-start' : 'justify-end'
						}`}
					>
						<h1 className="text-sm font-bold">
							{message.sender === 'user' ? 'You :' : 'ChatBot :'}
						</h1>
						<div
							className={`p-2 rounded-lg text-black ${
								message.sender === 'user' ? 'bg-blue-500' : 'bg-gray-200'
							}`}
						>
							{message.text}
						</div>
					</div>
				))}
			</div>

			{/* Input Form */}
			<form className="w-full border flex pl-2" onSubmit={sendMessage}>
				<input
					type="text"
					placeholder="Type here"
					value={input}
					className="w-full border-0 hover:outline-none bg-transparent"
					onChange={(e) => setInput(e.target.value)}
					required
				/>
				<button
					type="submit"
					className="p-3 bg-blue-300 text-black font-semibold cursor-pointer"
				>
					Send
				</button>
			</form>
		</div>
	);
};

export default ChatBot;
