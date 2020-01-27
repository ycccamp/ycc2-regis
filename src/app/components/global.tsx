import React from 'react'

import { css, Global as EmotionGlobal } from '@emotion/core'

const GlobalComponent: React.FC = props => {
  return (
    <EmotionGlobal
      styles={css`
        html,
        body,
        #__next {
          height: 100%;
        }

        html {
          background-image: radial-gradient(rgba(64, 147, 164, 0.5) 10px, transparent 10px), radial-gradient(rgba(232, 100, 119, 0.5) 10px, transparent 10px);
          background-size: 300px 300px;
          background-position: 0px 0px, 150px 150px;
        }
      `}
    />
  )
}

export default GlobalComponent
