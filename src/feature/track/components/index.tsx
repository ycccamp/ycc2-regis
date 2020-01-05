import React, { useState } from 'react'

import Router from 'next/router'

import { Button, Flex, Heading, useToast } from '@chakra-ui/core'

import 'firebase/firestore'
import { firebase } from '../../../core/services/firebase'
import { useAuth } from '../../../core/services/useAuth'

import { tracks } from '../../../core/constants'

const TrackFeature: React.FC = props => {
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
          isLocked: false,
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
      {Object.entries(tracks).map(track => (
        <Flex
          width={1 / 2}
          p={4}
          flexWrap='wrap'
          justifyContent='center'
          key={`track-${track[0]}`}>
          <Heading size='md' width='100%' textAlign='center' pb={4}>
            Image for {track[1].title}
          </Heading>
          <Button
            onClick={() => trackHandler(track[0])}
            isLoading={activeClick === 'developer'}
            isDisabled={activeClick !== ''}>
            สมัครเป็น {track[1].title}
          </Button>
        </Flex>
      ))}
    </Flex>
  )
}

export default TrackFeature
