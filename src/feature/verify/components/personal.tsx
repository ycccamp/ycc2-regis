import React from 'react'

import { Box, Flex, Heading, Text } from '@chakra-ui/core'

import {
  bloodGroups,
  genders,
  grades,
  provinces,
  religions,
  shirtSizes,
} from '../../../core/constants'

import AvatarField from './avatar'

import { IPersonalFieldProps } from '../@types/IPersonalFieldProps'

const PersonalField: React.FC<IPersonalFieldProps> = props => {
  const { data, avatar, user } = props

  return (
    <Box py={4}>
      <Heading size='md'>ข้อมูลส่วนตัว</Heading>
      <AvatarField fileName={avatar} user={user} />
      <Box py={4}>
        <Flex flexWrap='wrap'>
          <Text p={2}>
            <b>ชื่อ</b> {data.firstname} ({data.firstnameEn})
          </Text>
          <Text p={2}>
            <b>นามสกุล</b> {data.lastname} ({data.lastnameEn})
          </Text>
        </Flex>
        <Flex flexWrap='wrap'>
          <Text p={2}>
            <b>ชื่อเล่น</b> {data.nickname} ({data.nicknameEn})
          </Text>
          <Text p={2}>
            <b>วันเกิด</b> {data.birthdate}
          </Text>
          <Text p={2}>
            <b>เพศ</b>{' '}
            {
              Object.entries(genders).filter(
                o => data && o[0] === data.gender
              )[0][1]
            }
          </Text>
        </Flex>
      </Box>
      <Box py={4}>
        <Flex flexWrap='wrap'>
          <Text p={2}>
            <b>ระดับชั้น</b>{' '}
            {
              Object.entries(grades).filter(
                o => data && o[0] === data.class
              )[0][1]
            }
          </Text>
          <Text p={2}>
            <b>โรงเรียน</b> {data.school}
          </Text>
        </Flex>
        <Flex flexWrap='wrap'>
          <Text p={2}>
            <b>ศาสนา</b>{' '}
            {
              Object.entries(religions).filter(
                o => data && o[0] === data.religion
              )[0][1]
            }
          </Text>
          <Text p={2}>
            <b>เบอร์โทรศัพท์</b> {data.phone}
          </Text>
        </Flex>
        <Flex flexWrap='wrap'>
          <Text p={2}>
            <b>อีเมล</b> {data.email}
          </Text>
          <Text p={2}>
            <b>Social Media</b> {data.socialMedia}
          </Text>
        </Flex>
      </Box>
      <Box py={4}>
        <Flex flexWrap='wrap'>
          <Text p={2}>
            <b>ไซส์เสื้อ</b>{' '}
            {
              Object.entries(shirtSizes).filter(
                o => data && o[0] === data.shirtSize
              )[0][1]
            }
          </Text>
          <Text p={2}>
            <b>กรุ๊ปเลือด</b>{' '}
            {
              Object.entries(bloodGroups).filter(
                o => data && o[0] === data.bloodGroup
              )[0][1]
            }
          </Text>
        </Flex>
        <Flex flexWrap='wrap'>
          <Text p={2}>
            <b>ที่อยู่</b>
            <br />
            {data.address} {data.subdistrict} {data.district}{' '}
            {
              Object.entries(provinces).filter(
                o => data && o[0] === data.province
              )[0][1]
            }{' '}
            {data.postcode}
          </Text>
        </Flex>
      </Box>
      <Box py={4}>
        <Flex flexWrap='wrap'>
          <Text p={2}>
            <b>โรคประจำตัว</b> {data.disease === '' ? '-' : data.disease}
          </Text>
        </Flex>
        <Flex flexWrap='wrap'>
          <Text p={2}>
            <b>อาหารที่แพ้</b>{' '}
            {data.foodAllergy === '' ? '-' : data.foodAllergy}
          </Text>
        </Flex>
        <Flex flexWrap='wrap'>
          <Text p={2}>
            <b>ยาที่แพ้</b> {data.drugAllergy === '' ? '-' : data.drugAllergy}
          </Text>
        </Flex>
      </Box>
      <Box py={4}>
        <Flex flexWrap='wrap'>
          <Text p={2}>
            <b>กิจกรรมหรือผลงานที่น้องๆ เคยทำหรือเข้าร่วม</b>
            <br />
            {data.activity}
          </Text>
        </Flex>
        <Flex flexWrap='wrap'>
          <Text p={2}>
            <b>คาดหวังอะไรจากค่ายนี้บ้าง</b>
            <br />
            {data.expectation}
          </Text>
        </Flex>
      </Box>
    </Box>
  )
}

export default PersonalField
