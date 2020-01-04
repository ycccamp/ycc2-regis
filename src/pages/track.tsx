import React, { useState } from 'react'

import Router from 'next/router'

import { Button, Flex, Heading, useToast } from '@chakra-ui/core'

import { firebase } from '../core/services/firebase'
import { useAuth } from '../core/services/useAuth'

const TrackPage: React.FC = props => {
  const user = useAuth()

  const [activeClick, setActiveClick] = useState<string>('')

  const trackHandler = (track: string) => {
    setActiveClick(track)

    if (user !== null) {
      const instance = firebase()

      instance
        .firestore()
        .collection('users')
        .doc(user.uid)
        .set({
          track,
        })
        .then(async () => {
          await Router.push('/step/1/')
        })
        .catch(() => {
          useToast()({
            title: 'เกิดข้อผิดพลาด',
            description: 'ไม่สามารถเลือกสาขาให้ได้สำเร็จ กรุณาลองใหม่อีกครั้ง',
            status: 'error',
            duration: 4000,
            isClosable: true,
          })
          setActiveClick('')
        })
    }
  }

  return (
    <Flex flexWrap='wrap'>
      <Flex width={1 / 2} p={4} flexWrap='wrap' justifyContent='center'>
        <Heading size='md' width='100%' textAlign='center' pb={4}>
          Image for Dev
        </Heading>
        <Button
          onClick={() => trackHandler('developer')}
          isLoading={activeClick === 'developer'}
          isDisabled={activeClick !== ''}>
          สมัครเป็น Developer
        </Button>
      </Flex>
      <Flex width={1 / 2} p={4} flexWrap='wrap' justifyContent='center'>
        <Heading size='md' width='100%' textAlign='center' pb={4}>
          Image for Designer
        </Heading>
        <Button
          onClick={() => trackHandler('designer')}
          isLoading={activeClick === 'designer'}
          isDisabled={activeClick !== ''}>
          สมัครเป็น Designer
        </Button>
      </Flex>
      <Flex width={1 / 2} p={4} flexWrap='wrap' justifyContent='center'>
        <Heading size='md' width='100%' textAlign='center' pb={4}>
          Image for Content Creator
        </Heading>
        <Button
          onClick={() => trackHandler('content')}
          isLoading={activeClick === 'content'}
          isDisabled={activeClick !== ''}>
          สมัครเป็น Content Creator
        </Button>
      </Flex>
    </Flex>
  )
}

export default TrackPage
