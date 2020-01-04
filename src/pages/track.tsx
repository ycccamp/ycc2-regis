import React from 'react'

import { Box, Button, Flex, Heading, Stack, Text } from '@chakra-ui/core'

const TrackPage: React.FC = props => {
  return (
    <Stack spacing={4} isInline>
      <Box width={1 / 2} p={4}>
        <Heading size='md'>P</Heading>
        <Button>สมัครเป็น Programmer</Button>
      </Box>
      <Box width={1 / 2} p={4}>
        <Heading size='md'>D</Heading>
        <Button>สมัครเป็น Designer</Button>
      </Box>
    </Stack>
  )
}

export default TrackPage
