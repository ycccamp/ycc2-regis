import React, { useState } from 'react'

import Router from 'next/router'

import {
  AspectRatioBox,
  Box,
  Button,
  Flex,
  Image,
  useToast,
} from '@chakra-ui/core'

import 'firebase/analytics'
import 'firebase/firestore'
import { firebase } from '../../../core/services/firebase'
import { useAuth } from '../../../core/services/useAuth'

import { tracks } from '../../../core/constants'

const TrackFeature: React.FC = props => {
  const user = useAuth()

  const [activeClick, setActiveClick] = useState<string>('')

  const trackHandler = async (track: string) => {
    setActiveClick(track)

    if (user !== null) {
      const instance = firebase()

      const userInstance = await instance
        .firestore()
        .collection('registration')
        .doc(user.uid)
        .get()

      const userData = userInstance.data()
      if (userData) {
        instance
          .firestore()
          .collection('registration')
          .doc(user.uid)
          .set({
            track,
            step: userData.step > 1 ? userData.step : 1,
            isLocked: false,
          })
          .then(async () => {
            instance.analytics().logEvent('selectTrack', {
              track,
            })
            instance.analytics().setUserProperties({ track })

            await Router.push('/step/1/')
          })
          .catch(() => {
            useToast()({
              title: 'เกิดข้อผิดพลาด',
              description:
                'ไม่สามารถเลือกสาขาให้ได้สำเร็จ กรุณาลองใหม่อีกครั้ง',
              status: 'error',
              duration: 4000,
              isClosable: true,
            })
            setActiveClick('')
          })
      }
    }
  }

  return (
    <Flex flexWrap='wrap'>
      {Object.entries(tracks).map(([key, value]) => (
        <Flex
          width={['100%', '100%', 1 / 2, 1 / 3]}
          p={4}
          flexWrap='wrap'
          justifyContent='center'
          key={`track-${key}`}>
          <Box width='100%' pb={4}>
            <AspectRatioBox ratio={3 / 4} borderRadius={20} overflow='hidden'>
              <Image
                src={`/static/track-${key}.png`}
                alt={value.title}
                objectFit='cover'
              />
            </AspectRatioBox>
          </Box>
          <Button
            className='primary'
            onClick={() => trackHandler(key)}
            isLoading={activeClick === key}
            isDisabled={activeClick !== ''}>
            สมัครสาขา {value.title}
          </Button>
        </Flex>
      ))}
    </Flex>
  )
}

export default TrackFeature
