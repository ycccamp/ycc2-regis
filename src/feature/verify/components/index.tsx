import React, { useEffect, useRef, useState } from 'react'

import Link from 'next/link'
import Router from 'next/router'

import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  Flex,
  Heading,
  Spinner,
  useDisclosure,
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

  const { isOpen, onOpen, onClose } = useDisclosure()
  const btnRef = useRef(null)
  const cancelRef = useRef(null)

  const [form, setForm] = useState<null | IForm>(null)

  const [isBackButtonLoad, setIsBackButtonLoad] = useState<boolean>(false)
  const [isConfirmButtonLoad, setIsConfirmButtonLoad] = useState<boolean>(false)

  const initHandler = async (user: User) => {
    const instance = firebase()
    // TODO: Get forms data
    const userRef = instance
      .firestore()
      .collection('registration')
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

  const lockHandler = async () => {
    setIsConfirmButtonLoad(true)

    if (user !== null) {
      const instance = firebase()

      try {
        await instance
          .firestore()
          .collection('registration')
          .doc(user.uid)
          .update({
            isLocked: true,
          })

        Router.push('/thanks')
      } catch {
        setIsConfirmButtonLoad(false)
        onClose()
      }
    }
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
      <Flex justifyContent='center' flexWrap='wrap'>
        <Box px={2}>
          <Link href='/step/4/'>
            <Button
              mt={4}
              leftIcon='chevron-left'
              onClick={() => setIsBackButtonLoad(true)}
              isDisabled={isConfirmButtonLoad}
              isLoading={isBackButtonLoad}>
              ย้อนกลับ
            </Button>
          </Link>
        </Box>
        <Box px={2}>
          <Button
            mt={4}
            variantColor='green'
            type='submit'
            ref={btnRef}
            onClick={onOpen}
            isDisabled={isBackButtonLoad || isConfirmButtonLoad}>
            ยืนยันการลงทะเบียน
          </Button>
        </Box>
      </Flex>
      <AlertDialog
        leastDestructiveRef={cancelRef}
        finalFocusRef={btnRef}
        onClose={onClose}
        isOpen={isOpen}>
        <AlertDialogOverlay />
        <AlertDialogContent>
          <AlertDialogHeader>ยืนยันการลงทะเบียน</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>
            ยืนยันการสมัครเข้าค่าย Young Creator's Camp หรือไม่?
            หลังจากขั้นตอนนี้สำเร็จแล้วจะไม่สามารถแก้ไขข้อมูลได้อีก
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button
              ref={cancelRef}
              onClick={onClose}
              isDisabled={isConfirmButtonLoad}>
              ยกเลิก
            </Button>
            <Button
              isLoading={isConfirmButtonLoad}
              onClick={lockHandler}
              variantColor='blue'
              ml={3}>
              ยืนยัน
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </React.Fragment>
  )
}

export default VerifyFeature
