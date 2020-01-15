import React from 'react'

import App from 'next/app'

import AppShell from '../app/components'

interface IAppProps {
  fullstory: string
}

class NextApp extends App<IAppProps> {
  public getInitialProps(context: any) {
    const fullstory = process.env.FULLSTORY ? process.env.FULLSTORY : ''

    return { fullstory }
  }

  public render() {
    const { Component, pageProps, fullstory } = this.props

    return (
      <AppShell fullstory={fullstory}>
        <Component {...pageProps} />
      </AppShell>
    )
  }
}

export default NextApp
