import React from 'react'

import App from 'next/app'

import AppShell from '../app/components'

interface IAppProps {
  fullstory: string
}

class NextApp extends App<IAppProps> {
  public render() {
    const { Component, pageProps } = this.props

    const fullstory = process.env.FULLSTORY ? process.env.FULLSTORY : ''

    return (
      <AppShell fullstory={fullstory}>
        <Component {...pageProps} />
      </AppShell>
    )
  }
}

export default NextApp
