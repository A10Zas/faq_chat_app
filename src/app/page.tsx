import ChatBot from '@/components/ChatBot';

export default function Home() {
	return (
		<div className="w-full min-h-screen mx-auto p-6">
			<h1 className="text-3xl text-center">Faq Chat Bot</h1>
			<ChatBot />
		</div>
	);
}
