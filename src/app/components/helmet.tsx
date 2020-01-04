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
          href: `/static/icon.png`,
          rel: 'shortcut icon',
        },
        {
          href: `/static/icon.png`,
          rel: 'apple-touch-icon',
        },
      ]}
    />
  )
}

export default Helmet
