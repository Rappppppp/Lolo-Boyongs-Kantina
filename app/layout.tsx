import './globals.css';
import type { ReactNode } from 'react';
import RootLayoutClient from './RootLayoutClient';
// import { Toaster } from '@/components/ui/toaster';

import { Toaster } from 'sonner';

export const metadata = {
  title: "Lolo Boyong's Kantina",
  description: "Lolo Boyong's Kantina was founded in 2019...",
  icons: { icon: "/app-logo.jpg" },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Toaster richColors />
        <RootLayoutClient>{children}</RootLayoutClient>
      </body>
    </html>
  );
}
