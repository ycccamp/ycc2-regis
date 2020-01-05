import React from 'react'

import { Box, Flex, Heading, Text } from '@chakra-ui/core'

import { IParentFieldProps } from '../@types/IParentFieldProps'

const ParentField: React.FC<IParentFieldProps> = props => {
  const { data } = props

  return (
    <Box py={4}>
      <Heading size='md'>ข้อมูลผู้ปกครอง</Heading>
      <Box py={4}>
        <Flex flexWrap='wrap'>
          <Text p={2}>
            <b>ชื่อผู้ปกครอง</b> {data.parentFirstName}
          </Text>
          <Text p={2}>
            <b>นามสกุล</b> {data.parentLastName}
          </Text>
        </Flex>
        <Flex flexWrap='wrap'>
          <Text p={2}>
            <b>ความเกี่ยวข้อง</b> {data.parentRelation}
          </Text>
          <Text p={2}>
            <b>เบอร์โทรศัพท์</b> {data.parentPhone}
          </Text>
        </Flex>
      </Box>
    </Box>
  )
}

export default ParentField
