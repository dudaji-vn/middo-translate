import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';
import './globals.css';
import { AppProvider } from '@/providers/app';
import { PUBLIC_APP_DESCRIPTION, PUBLIC_APP_NAME } from '@/configs/env';
const montserrat = Montserrat({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: PUBLIC_APP_NAME,
	description: PUBLIC_APP_DESCRIPTION,
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body className={montserrat.className}>
				<AppProvider>{children}</AppProvider>
			</body>
		</html>
	);
}
