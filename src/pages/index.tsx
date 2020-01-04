import React, { useEffect } from 'react'

import Router from 'next/router'

import { Flex, Spinner } from '@chakra-ui/core'

import { User } from 'firebase'
import { useAuth } from '../core/services/useAuth'

import { getUser } from '../core/services/getUser'

const IndexPage: React.FC = props => {
  const user = useAuth()

  const userHandler = async (user: User) => {
    // Step 1: Get user snapshot
    const userData = await getUser(user)

    // Step 2: Check is user choosen track
    if (!userData.exists) {
      return await Router.push('/track')
    }
  }

  useEffect(() => {
    if (user !== null) {
      userHandler(user)
    }
  }, [user])

  return (
    <Flex justifyContent='center'>
      <Spinner size='xl' />
    </Flex>
  )
}

export default IndexPage
