import React from 'react'

import { Box, Flex, Heading, Text } from '@chakra-ui/core'

import { tracks } from '../../../core/constants'

import { ITrackFieldProps } from '../@types/ITrackFieldProps'

const TrackField: React.FC<ITrackFieldProps> = props => {
  const { data, track } = props

  return (
    <Box py={4}>
      <Heading size='md'>คำถามสาขา</Heading>
      <Box py={4}>
        {Object.entries(tracks[track].questions).map(([key, value], i) => (
          <Flex flexWrap='wrap' key={`general-field-${key}`}>
            <Text p={2}>
              <b>
                {i + 1}. <div dangerouslySetInnerHTML={{ __html: value }} />
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
