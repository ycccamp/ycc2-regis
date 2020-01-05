import React, { useEffect, useState } from 'react'

import Link from 'next/link'

import {
  Box,
  Button,
  Flex,
  Heading,
  Spinner,
  Stack,
  Text,
} from '@chakra-ui/core'

import { User } from 'firebase/app'
import { firebase } from '../../../core/services/firebase'
import { useAuth } from '../../../core/services/useAuth'

import GeneralField from './general'
import ParentField from './parent'
import PersonalField from './personal'
import TrackField from './track'

import { IForm } from '../@types/IForm'

const VerifyFeature: React.FC = props => {
  const user = useAuth()

  const [form, setForm] = useState<null | IForm>(null)

  const [isBackButtonLoad, setIsBackButtonLoad] = useState(false)

  const initHandler = async (user: User) => {
    const instance = firebase()
    // TODO: Get forms data
    const userRef = instance
      .firestore()
      .collection('users')
      .doc(user.uid)

    const basicData = await userRef.get()
    const personalData = await userRef
      .collection('forms')
      .doc('personal')
      .get()
    const parentData = await userRef
      .collection('forms')
      .doc('parent')
      .get()
    const generalData = await userRef
      .collection('forms')
      .doc('general')
      .get()
    const trackData = await userRef
      .collection('forms')
      .doc('track')
      .get()

    setForm({
      basic: basicData.data(),
      personal: personalData.data(),
      parent: parentData.data(),
      general: generalData.data(),
      track: trackData.data(),
    })
  }

  useEffect(() => {
    if (user !== null) {
      initHandler(user)
    }
  }, [user])

  return (
    <React.Fragment>
      <Heading size='lg' pb={2} textAlign='center'>
        ตรวจสอบข้อมูล และยืนยันการสมัคร
      </Heading>
      {form === null ? (
        <Flex py={10} justifyContent='center'>
          <Spinner />
        </Flex>
      ) : (
        <Box>
          {form.personal ? <PersonalField data={form.personal} /> : null}
          {form.parent ? <ParentField data={form.parent} /> : null}
          {form.general ? <GeneralField data={form.general} /> : null}
          {form.track && form.basic ? (
            <TrackField track={form.basic.track} data={form.track} />
          ) : null}
        </Box>
      )}
      <Stack spacing={4} isInline justifyContent='center'>
        <Box>
          <Link href='/step/4/'>
            <Button
              mt={4}
              leftIcon='chevron-left'
              onClick={() => setIsBackButtonLoad(true)}
              isLoading={isBackButtonLoad}>
              ย้อนกลับ
            </Button>
          </Link>
        </Box>
        <Button
          mt={4}
          variantColor='green'
          type='submit'
          isDisabled={isBackButtonLoad}>
          ยืนยันการลงทะเบียน
        </Button>
      </Stack>
    </React.Fragment>
  )
}

export default VerifyFeature
