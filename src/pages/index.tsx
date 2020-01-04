import React from 'react'

import { Flex, Text } from '@chakra-ui/core'

const IndexPage: React.FC = props => {
  return (
    <Flex flexWrap='wrap' justifyContent='center' py={10}>
      <Text width='100%' textAlign='center' pb={4}>
        OK
      </Text>
    </Flex>
  )
}

export default IndexPage
