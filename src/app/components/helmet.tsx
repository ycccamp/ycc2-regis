import React from 'react'

import { Helmet as ReactHelmet } from 'react-helmet'

const Helmet: React.FC = props => {
  return (
    <ReactHelmet
      htmlAttributes={{ lang: 'en' }}
      defaultTitle={`Young Creator's Camp`}
      titleTemplate={`%s · Young Creator's Camp`}
      link={[
        {
          href: `/static/favicon-2020.ico`,
          rel: 'shortcut icon',
        },
        {
          href: `/static/favicon-2020.ico`,
          rel: 'apple-touch-icon',
        },
        {
          href: `https://fonts.googleapis.com/css?family=Prompt:500|Sarabun:300|Nunito:400&display=swap`,
          rel: 'stylesheet',
        },
      ]}
    />
  )
}

export default Helmet
