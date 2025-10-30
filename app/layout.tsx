import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'LLM Vibes Radar - Track AI Model Opinions',
  description:
    'Track and visualize how different AI models rank opinions on everything. Compare Claude, GPT-4, and Gemini responses over time.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
