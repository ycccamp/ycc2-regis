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

        body {
          background: linear-gradient(
            45deg,
            rgba(69, 20, 90, 1) 0%,
            rgba(255, 83, 0, 1) 100%
          );
        }
      `}
    />
  )
}

export default GlobalComponent
