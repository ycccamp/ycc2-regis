import React from 'react'

import withFBQ from 'next-fbq'

import App from 'next/app'
import Head from 'next/head'
import Router from 'next/router'

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
        </Head>
        <AppShell fullstory={fullstory}>
          <Component {...pageProps} />
        </AppShell>
      </React.Fragment>
    )
  }
}

export default withFBQ('970434653357485', Router)(NextApp)
