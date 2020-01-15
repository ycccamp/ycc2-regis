import React, { useEffect, useState } from 'react'

import { NextPage } from 'next'

import 'firebase/analytics'
import { firebase } from '../core/services/firebase'

import { Box, Button, Flex, Heading, Link, Text } from '@chakra-ui/core'

interface IErrorProps {
  statusCode: number | undefined
}

const ErrorPage: NextPage<IErrorProps> = props => {
  const [isLoad, setIsLoad] = useState<boolean>(false)

  useEffect(() => {
    const instance = firebase()
    instance.analytics().logEvent('crash', {
      statusCode: props.statusCode,
    })
  }, [])

  return (
    <Flex justifyContent='center' alignItems='center' height='100%'>
      <Box
        bg='white'
        width={[22 / 24, 16 / 24, 10 / 24, 6 / 24]}
        boxShadow='0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
        p={6}
        borderRadius={10}>
        <Heading size='lg'>Crashed</Heading>
        <Text py={5}>App has crashed painfully...</Text>
        <Link href='/' _hover={{ textDecoration: 'none' }}>
          <Button
            width='100%'
            isLoading={isLoad}
            onClick={() => setIsLoad(true)}>
            Restart
          </Button>
        </Link>
      </Box>
    </Flex>
  )
}

ErrorPage.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404

  return { statusCode }
}

export default ErrorPage
