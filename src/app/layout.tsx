'use client'
import Head from 'next/head';
import '../app/globals.css'
import '@fortawesome/fontawesome-svg-core/styles.css';
import { config } from '@fortawesome/fontawesome-svg-core';
import { Poppins } from 'next/font/google'
import '../lib/fontawesome'
// import { SessionProvider } from "next-auth/react";
import AuthProvider from './components/AuthProvider';
config.autoAddCss = false;

const poppins = Poppins({
  weight: ['400', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
});



export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <Head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark');
                  }
                } catch (_) {}
              })();
            `,
          }}
        />
      </Head>
      <body
        className={`${poppins.className} bg-gray-50 dark:bg-gray-900 transition-colors duration-300`}
      >
        <AuthProvider>
          {children}
        </AuthProvider>
        {/* <SessionProvider>{children}</SessionProvider> */}
      </body>
    </html>
  );
}

