import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang='en'>
    <Head>
      <link rel="apple-touch-icon" sizes="512x512" href="/favicon512.png" />
      <link rel="icon" type="image/png" sizes="512x512" href="/favicon512.png" />
      <link rel='manifest' href='/manifest.json'/>
      <meta name='theme-color' content='##a855f7'/>
    </Head>
    <body>
      <Main />
      <NextScript />
    </body>
  </Html>
  )
}
