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
      `}
    />
  )
}

export default GlobalComponent
