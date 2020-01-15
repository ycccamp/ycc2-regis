import React, { useEffect } from 'react'

import { NextPage } from 'next'
import Router from 'next/router'

import { Flex, Spinner, Text } from '@chakra-ui/core'

import 'firebase/analytics'
import { User } from 'firebase/app'
import 'firebase/firestore'
import { firebase } from '../core/services/firebase'
import { useAuth } from '../core/services/useAuth'

const IndexPage: NextPage = props => {
  const user = useAuth()

  const userHandler = async (user: User) => {
    const instance = firebase()

    // Step 1: Get user snapshot
    const userDoc = await instance
      .firestore()
      .collection('registration')
      .doc(user.uid)
      .get()

    // Step 2: Check is user choosen track
    if (!userDoc.exists) {
      return Router.push('/track/')
    }

    // Step 3: Check is user is locked form
    const userData = userDoc.data()

    if (userData) {
      if (userData.isLocked) {
        return Router.push('/thanks/')
      }
    }

    // Step 3: Check is form step 1 is submitted
    const personalForm = await instance
      .firestore()
      .collection('registration')
      .doc(user.uid)
      .collection('forms')
      .doc('personal')
      .get()

    if (!personalForm.exists) {
      return Router.push('/step/1/')
    }

    // Step 4: Check is form step 2 is submitted
    const parentForm = await instance
      .firestore()
      .collection('registration')
      .doc(user.uid)
      .collection('forms')
      .doc('parent')
      .get()

    if (!parentForm.exists) {
      return Router.push('/step/2/')
    }

    // Step 5: Check is form step 3 is submitted
    const generalForm = await instance
      .firestore()
      .collection('registration')
      .doc(user.uid)
      .collection('forms')
      .doc('general')
      .get()

    if (!generalForm.exists) {
      return Router.push('/step/3/')
    }

    // Step 6: Check is form step 4 is submitted
    const trackForm = await instance
      .firestore()
      .collection('registration')
      .doc(user.uid)
      .collection('forms')
      .doc('track')
      .get()

    if (!trackForm.exists) {
      return Router.push('/step/4/')
    } else {
      return Router.push('/verify/')
    }
  }

  useEffect(() => {
    const instance = firebase()

    if (user !== null) {
      instance.analytics().logEvent('auth')
      userHandler(user)
    }
  }, [user])

  useEffect(() => {
    const instance = firebase()

    instance.analytics().logEvent('init')
  })

  return (
    <Flex justifyContent='center' flexWrap='wrap'>
      <Spinner size='lg' />
      <Text width='100%' textAlign='center' pt={4}>
        กำลังโหลดข้อมูลล่าสุดที่มี
      </Text>
    </Flex>
  )
}

export default IndexPage
