
import { Audiowide, Saira, Russo_One } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import Providers from '@/components/providers'
import Footer from '@/components/footer'
import StickyNavMenu from '@/components/sticky-nav-menu'
import type { Metadata } from 'next'

const audiowide = Audiowide({ 
  weight: '400',
  subsets: ['latin'],
  variable: '--font-audiowide' 
})

const saira = Saira({ 
  subsets: ['latin'],
  variable: '--font-saira'
})

const russoOne = Russo_One({ 
  weight: '400',
  subsets: ['latin'],
  variable: '--font-russo-one'
})

export const metadata: Metadata = {
  metadataBase: new URL("https://thebasketballfactoryinc.com"),
  title: 'The Basketball Factory - Summer Basketball Skill Training Sparta, NJ 07871 | Ages 7-18',
  description: 'Premier youth basketball training in Sparta, NJ for kids ages 7-18. Expert trainers develop shooting, ball handling, footwork & game IQ. Serving Sussex County families. Parents trust us for real skill development. Enroll your child today!',
  keywords: 'youth basketball training Sparta NJ, basketball skills training Sussex County, kids basketball lessons Sparta, basketball training ages 7-18, youth basketball trainers Sparta NJ 07871',
  icons: {
    icon: '/basketball-factory-main-logo.png',
  },
  openGraph: {
    title: 'The Basketball Factory - Youth Basketball Training Sparta, NJ',
    description: 'Expert basketball skill training for kids ages 7-18 in Sparta, NJ. Parents choose us for quality training and real results.',
    type: 'website',
    locale: 'en_US',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${audiowide.variable} ${saira.variable} ${russoOne.variable}`}>
      <head>
        {/* Google Analytics */}
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-ZDKW9Y7K89"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-ZDKW9Y7K89');
            `,
          }}
        />
        {/* Umami Analytics */}
        <Script
          defer
          src="/script.js"
          data-website-id="733a8665-962c-452d-8a94-bbc17b5babb9"
          strategy="afterInteractive"
        />
      </head>
      <body className={saira.className}>
        <Providers>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Footer />
            <StickyNavMenu />
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  )
}
