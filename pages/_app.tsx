import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import NextNProgress from 'nextjs-progressbar'
import Head from 'next/head'
import { useState, useEffect } from "react";
import PageTransition from '@/components/tools/PageTransition';
import Header from '@/components/layout/Header';
import { FunctionProvider } from '@/context/FunctionContext';

export default function App({ Component, pageProps }: AppProps) {

  const [darkMode, setDarkMode] = useState<boolean>(false)
  interface ITheme { name: string, val: string }
  const [theme, setTheme] = useState<ITheme>()

  useEffect(() => {

    if (localStorage.getItem('theme') === null) {
      const mode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      document.body.style.backgroundColor = mode ? '#000011' : '#ffffff'
      setDarkMode(mode)
      localStorage.setItem('theme', JSON.stringify({ name: 'pink', val: '#ec4899', KitMode: 'System' }))
      setTheme({ name: 'pink', val: '#ec4899' })
      const style = document.createElement('style');
      style.setAttribute('id', 'selection')
      style.textContent = `::selection { background-color: #ec4899; color: black;}`
      if (!document.getElementById('selection')) {
        document.head.appendChild(style)
      }
    } else {
      const storage = localStorage.getItem('theme')
      if (typeof storage === 'string') {
        const temp = JSON.parse(storage)
        const { name, val, KitMode } = temp
        setTheme({ name, val })
        if (KitMode === 'System') {
          const mode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
          document.body.style.backgroundColor = mode ? '#000011' : '#ffffff'
          setDarkMode(mode)
        }
        if (KitMode === 'Dark') {
          setDarkMode(true)
          document.body.style.backgroundColor = '#000011'
        }
        if (KitMode === 'Lite') {
          setDarkMode(false)
          document.body.style.backgroundColor = '#ffffff'
        }
        const style = document.createElement('style');
        style.setAttribute('id', 'selection')
        style.textContent = `::selection { background-color: ${temp.val}; color: black;}`
        if (!document.getElementById('selection')) {
          document.head.appendChild(style)
        }
      }
    }

  }, [])

  return (
    <>
      <Head>
        <title>Portfolio - Login</title>
        <meta charSet="UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="next-head-count" content="5" />
        <meta name='author' content="Moinak Majumdar" />
        <meta name='description' content='Hi, I am Moinak Majumdar, I design and build modern fullstack web site.' />
        <meta name='keywords' content='Next js, express js, nodejs, firebase, react js, mongo, portfolio, github' />
        <meta name="color-scheme" content="dark light" />
      </Head>
      {theme && <NextNProgress color={theme.val} height={3} showOnShallow={true} />}
      <PageTransition>
        {theme && <Header theme={theme} darkMode={darkMode} setTheme={setTheme} setDarkMode={setDarkMode} />}
        <FunctionProvider>
          <Component {...pageProps} darkMode={darkMode} theme={theme} />
        </FunctionProvider>
      </PageTransition>
    </>
  )
}
