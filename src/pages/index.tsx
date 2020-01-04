import React, { useEffect } from 'react'

import Router from 'next/router'

import { Flex, Spinner } from '@chakra-ui/core'

import { User } from 'firebase'
import { firebase } from '../core/services/firebase'
import { useAuth } from '../core/services/useAuth'

const IndexPage: React.FC = props => {
  const user = useAuth()

  const userHandler = async (user: User) => {
    const instance = firebase()

    // Step 1: Get user snapshot
    const userData = await instance
      .firestore()
      .collection('users')
      .doc(user.uid)
      .get()

    // Step 2: Check is user choosen track
    if (!userData.exists) {
      return await Router.push('/track')
    }

    // Step 3: Check is form step 1 is submitted
    const personalForm = await instance
      .firestore()
      .collection('users')
      .doc(user.uid)
      .collection('forms')
      .doc('personal')
      .get()

    if (!personalForm.exists) {
      return await Router.push('/step/1')
    }

    // Step 4: Check is form step 2 is submitted
    const parentForm = await instance
      .firestore()
      .collection('users')
      .doc(user.uid)
      .collection('forms')
      .doc('parent')
      .get()

    if (!parentForm.exists) {
      return await Router.push('/step/2')
    }

    // Step 5: Check is form step 3 is submitted
    const generalForm = await instance
      .firestore()
      .collection('users')
      .doc(user.uid)
      .collection('forms')
      .doc('general')
      .get()

    if (!generalForm.exists) {
      return await Router.push('/step/3')
    }

    // Step 6: Check is form step 4 is submitted
    const trackForm = await instance
      .firestore()
      .collection('users')
      .doc(user.uid)
      .collection('forms')
      .doc('track')
      .get()

    if (!trackForm.exists) {
      return await Router.push('/step/4')
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
