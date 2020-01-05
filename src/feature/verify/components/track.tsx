import React from 'react'

import { Box, Flex, Heading, Text } from '@chakra-ui/core'

import { tracks } from '../../../core/constants'

import { ITrackFieldProps } from '../@types/ITrackFieldProps'

const TrackField: React.FC<ITrackFieldProps> = props => {
  const { data, track } = props

  return (
    <Box py={4}>
      <Heading size='md'>คำถามกลาง</Heading>
      <Box py={4}>
        {Object.keys(data).map((key, i) => (
          <Flex flexWrap='wrap' key={`general-field-${key}`}>
            <Text p={2}>
              <b>
                {i + 1}. {tracks[track].questions[key]}
              </b>
              <br />
              {data[key]}
            </Text>
          </Flex>
        ))}
      </Box>
    </Box>
  )
}

export default TrackField
