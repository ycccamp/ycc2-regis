import React, { useEffect } from 'react'

import {
  Box,
  Button,
  CSSReset,
  Divider,
  Flex,
  Heading,
  ThemeProvider,
} from '@chakra-ui/core'
import FullStory, { identify } from 'react-fullstory'
import { theme } from '../theme'

import 'firebase/auth'
import { firebase } from '../../core/services/firebase'
import { useAuth } from '../../core/services/useAuth'

import Auth from './auth'
import Global from './global'
import Helmet from './helmet'

import '../main.scss'

import { IProps } from '../@types/IProps'

const AppComponent: React.FC<IProps> = props => {
  const { children, fullstory } = props

  const auth = useAuth()

  useEffect(() => {
    if (auth !== null) {
      identify(auth.uid)
    }
  }, [auth])

  return (
    <ThemeProvider theme={theme}>
      <CSSReset />
      <FullStory org={fullstory} />
      <Global />
      <Helmet />
      <Box as='main' height='100%' overflow='auto'>
        <Flex
          justifyContent='center'
          py={10}
          alignItems='center'
          minHeight='100vh'>
          <Box
            className='form-wrapper'
            width={[22 / 24, 20 / 24, 8 / 10, 6 / 10]}
            borderRadius={4}
            p={10}
            bg='white'>
            <Flex pb={5} wrap='wrap' align='center'>
              <Heading size='lg' width={['100%', 'auto']}>
                สมัครเข้าค่าย Young Creator's Camp
              </Heading>
              {auth !== null ? (
                <React.Fragment>
                  <Box mx='auto' />
                  <Box pt={[4, 0]}>
                    <Button
                      onClick={() =>
                        firebase()
                          .auth()
                          .signOut()
                      }>
                      ออกจากระบบ
                    </Button>
                  </Box>
                </React.Fragment>
              ) : null}
            </Flex>
            <Divider />
            <Box pt={5} />
            {auth === null ? (
              <Auth user={auth} />
            ) : (
              <React.Fragment>{children}</React.Fragment>
            )}
          </Box>
        </Flex>
      </Box>
    </ThemeProvider>
  )
}

export default AppComponent
