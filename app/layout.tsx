import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import '@fontsource-variable/manrope';
import 'lenis/dist/lenis.css';
import './globals.css';
import './edition.css';

const title = 'Clínica Revela | Harmonização facial em Cachoeirinha';
const description = 'Conheça a Clínica Revela, da Dra. Renata Martins. Harmonização facial, Botox e harmonização do olhar em Cachoeirinha, RS.';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3012'),
  title,
  description,
  icons: { icon: '/media/revela-simbolo.svg' },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    siteName: 'Clínica Revela',
    title,
    description,
    images: [{ url: '/media/compartilhar.jpg', width: 1200, height: 630, alt: 'Clínica Revela by Dra. Renata Martins' }],
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('revela-motion')" }} /></head>
      <body>{children}</body>
    </html>
  );
}
