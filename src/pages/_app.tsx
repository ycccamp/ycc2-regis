import React from 'react'

import App from 'next/app'
import Head from 'next/head'

import AppShell from '../app/components'

interface IAppProps {
  fullstory: string
}

class NextApp extends App<IAppProps> {
  public render() {
    const { Component, pageProps } = this.props

    const fullstory = process.env.FULLSTORY ? process.env.FULLSTORY : ''

    return (
      <React.Fragment>
        <Head>
          <title>Young Creator's Camp</title>
          {`<script>
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '970434653357485');
            fbq('track', 'PageView');
          </script>
          <noscript><img height='1' width='1' style='display:none'
            src='https://www.facebook.com/tr?id=970434653357485&ev=PageView&noscript=1'
          /></noscript>`}
        </Head>
        <AppShell fullstory={fullstory}>
          <Component {...pageProps} />
        </AppShell>
      </React.Fragment>
    )
  }
}

export default NextApp
