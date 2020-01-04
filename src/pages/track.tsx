import React from 'react'

import { Button, Flex, Heading } from '@chakra-ui/core'

const TrackPage: React.FC = props => {
  const trackHandler = (track: string) => {
    // TODO: Choose track
  }

  return (
    <Flex flexWrap='wrap'>
      <Flex width={1 / 2} p={4} flexWrap='wrap' justifyContent='center'>
        <Heading size='md' width='100%' textAlign='center' pb={4}>
          Image for Dev
        </Heading>
        <Button onClick={() => trackHandler('developer')}>
          สมัครเป็น Developer
        </Button>
      </Flex>
      <Flex width={1 / 2} p={4} flexWrap='wrap' justifyContent='center'>
        <Heading size='md' width='100%' textAlign='center' pb={4}>
          Image for Designer
        </Heading>
        <Button onClick={() => trackHandler('designer')}>
          สมัครเป็น Designer
        </Button>
      </Flex>
      <Flex width={1 / 2} p={4} flexWrap='wrap' justifyContent='center'>
        <Heading size='md' width='100%' textAlign='center' pb={4}>
          Image for Content Creator
        </Heading>
        <Button onClick={() => trackHandler('content')}>
          สมัครเป็น Content Creator
        </Button>
      </Flex>
    </Flex>
  )
}

export default TrackPage
