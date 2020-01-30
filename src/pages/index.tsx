import React, { useEffect, useState } from 'react'

import { NextPage } from 'next'
import Router from 'next/router'

import { Flex, Spinner, Text } from '@chakra-ui/core'

import 'firebase/analytics'
import { User } from 'firebase/app'
import 'firebase/firestore'
import 'firebase/performance'
import { firebase } from '../core/services/firebase'
import { useAuth } from '../core/services/useAuth'

const IndexPage: NextPage = props => {
  const user = useAuth()

  const [loadMsg, setLoadMsg] = useState<string>('กำลังดึงข้อมูลล่าสุดที่มี')

  const userHandler = async (user: User) => {
    const instance = firebase()

    const trace = instance.performance().trace('init-checkLastStage')
    trace.start()

    setLoadMsg('ดูแปปว่าสมัครถึงไหนแล้ว')

    // Step 1: Get user snapshot
    const userDoc = await instance
      .firestore()
      .collection('registration')
      .doc(user.uid)
      .get()

    setLoadMsg('กำลังดึงข้อมูลล่าสุดที่มี...')

    // Step 2: Check is user choosen track
    if (!userDoc.exists) {
      setLoadMsg('พึ่งเข้ามาครั้งแรกแน่ๆ เลย...เตรียมตัวแปป')

      await instance
        .firestore()
        .collection('registration')
        .doc(user.uid)
        .set({
          step: 0,
        })

      trace.incrementMetric('step', 0)
      trace.stop()

      setLoadMsg('ได้ล่ะ เตรียมคีย์บอร์ดให้พร้อมเลย')

      return Router.push('/track/')
    }

    // Step 3: Check is user is locked form and step
    const userData = userDoc.data()

    if (userData) {
      if (userData.isLocked) {
        setLoadMsg('ดูเหมือนว่ายืนยันการสมัครแล้วหนิ...แปปนะ')

        trace.incrementMetric('step', -1)
        trace.stop()

        return Router.push('/thanks/')
      }

      // Check if user at verify step
      if (userData.step === 5) {
        setLoadMsg('กรอกข้อมูลครบแล้วหนิ แต่ยังไม่ได้ยืนยันสมัครเลย...')

        trace.incrementMetric('step', 5)
        trace.stop()

        return Router.push('/verify/')
      }

      // Check if user not choose track
      if (userData.step === 0) {
        setLoadMsg('ฮั่นแน่! ยังไม่ได้เลือกสาขาใช่มั้ยเรา...')

        trace.incrementMetric('step', 0)
        trace.stop()

        return Router.push('/track/')
      }
      // Check if user at some step
      else {
        setLoadMsg('ดูเหมือนยังสมัครไม่เสร็จ พาไปหน้าที่ค้างไว้ให้...')

        trace.incrementMetric('step', userData.step)
        trace.stop()

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
    instance.performance()
  }, [])

  return (
    <Flex justifyContent='center' flexWrap='wrap'>
      <Spinner size='lg' />
      <Text width='100%' textAlign='center' pt={4}>
        {loadMsg}
      </Text>
    </Flex>
  )
}

export default IndexPage
