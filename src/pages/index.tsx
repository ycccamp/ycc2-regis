import React, { useEffect } from 'react'

import { NextPage } from 'next'
import Router from 'next/router'

import { Flex, Spinner, Text, useTheme } from '@chakra-ui/core'

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
      await instance
        .firestore()
        .collection('registration')
        .doc(user.uid)
        .set({
          step: 0,
        })

      return Router.push('/track/')
    }

    // Step 3: Check is user is locked form and step
    const userData = userDoc.data()

    if (userData) {
      if (userData.isLocked) {
        return Router.push('/thanks/')
      }

      // Check if user at verify step
      if (userData.step === 5) {
        return Router.push('/verify/')
      }

      // Check if user not choose track
      if (userData.step === 0) {
        return Router.push('/track/')
      }
      // Check if user at some step
      else {
        return Router.push(`/step/${userData.step}/`)
      }
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
