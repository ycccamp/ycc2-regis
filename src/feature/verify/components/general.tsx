import React from 'react'

import { Box, Flex, Heading, Text } from '@chakra-ui/core'

import { generalQuestion } from '../../../core/constants'

import { IGeneralFieldProps } from '../@types/IGeneralFieldProps'

const GeneralField: React.FC<IGeneralFieldProps> = props => {
  const { data } = props

  return (
    <Box py={4}>
      <Heading size='md'>คำถามกลาง</Heading>
      <Box py={4}>
        {Object.entries(generalQuestion).map(([key, value], i) => (
          <Flex flexWrap='wrap' key={`general-field-${key}`}>
            <Text p={2}>
              <b>
                {i + 1}. {value}
              </b>
              <br />
              <p style={{ whiteSpace: 'pre-wrap' }}>{data[key]}</p>
            </Text>
          </Flex>
        ))}
      </Box>
    </Box>
  )
}

export default GeneralField
