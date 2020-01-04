import React, { useState } from 'react'

import { Box, CSSReset, Flex, Heading, ThemeProvider } from '@chakra-ui/core'

import { User } from 'firebase'

import Auth from '../../core/components/auth'
import Global from './global'
import Helmet from './helmet'

const AppComponent: React.FC = props => {
  const { children } = props

  const [auth, setAuth] = useState<User | undefined>()

  return (
    <ThemeProvider>
      <CSSReset />
      <Global />
      <Helmet />
      <Box as='main' height='100%' overflow='auto'>
        <Box
          background='linear-gradient(45deg, rgba(69,20,90,1) 0%, rgba(255,83,0,1) 100%)'
          height='100%'>
          <Flex justifyContent='center' alignItems='center' height='100%'>
            <Box width={6 / 10} borderRadius={4} p={12} bg='white'>
              <Heading size='lg'>
                ลงทะเบียนเข้าค่าย Young Creator's Camp
              </Heading>
              {auth === undefined ? (
                <Auth onSuccess={user => setAuth(user)} />
              ) : (
                <React.Fragment>{children}</React.Fragment>
              )}
            </Box>
          </Flex>
        </Box>
      </Box>
    </ThemeProvider>
  )
}

export default AppComponent
