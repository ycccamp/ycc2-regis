import React, { useEffect, useState } from 'react'

import Link from 'next/link'
import Router from 'next/router'

import {
  Box,
  Button,
  Flex,
  Heading,
  Spinner,
  Stack,
  useToast,
} from '@chakra-ui/core'

import { useFormik } from 'formik'
import { object, string } from 'yup'

import { firebase } from '../../core/services/firebase'
import { useAuth } from '../../core/services/useAuth'

import Input from '../../core/components/form/input'

const formSchema = object().shape({
  parentFirstName: string().required('Required'),
  parentLastName: string().required('Required'),
  parentRelation: string().required('Required'),
  parentPhone: string().matches(/^[0][1-9]\d{8}$/, 'Invalid format'),
})

const Step1Page: React.FC = props => {
  const user = useAuth()

  const [isFormLoad, setIsFormLoad] = useState(true)

  const [form, setForm] = useState({
    parentFirstName: '',
    parentLastName: '',
    parentRelation: '',
    parentPhone: '',
  })

  const formik = useFormik({
    initialValues: form,
    enableReinitialize: true,
    onSubmit: async (values, actions) => {
      const instance = firebase()

      try {
        if (user !== null) {
          await instance
            .firestore()
            .collection('users')
            .doc(user.uid)
            .collection('forms')
            .doc('parent')
            .set(values)

          Router.push('/step/3')
        }
      } catch {
        useToast()({
          title: 'เกิดข้อผิดพลาด',
          description: 'ไม่สามารถบันทึกข้อมูลได้สำเร็จ กรุณาลองใหม่อีกครั้ง',
          status: 'error',
          duration: 4000,
          isClosable: true,
        })
      }
    },
    validationSchema: formSchema,
  })

  useEffect(() => {
    if (user !== null) {
      const instance = firebase()

      instance
        .firestore()
        .collection('users')
        .doc(user.uid)
        .collection('forms')
        .doc('parent')
        .get()
        .then(doc => {
          if (doc.exists) {
            const data = doc.data()
            setForm(prev => ({ ...prev, ...data }))
          }
        })
        .finally(() => {
          setIsFormLoad(false)
        })
    }
  }, [user])

  return (
    <React.Fragment>
      <Heading size='md'>STEP 2: ข้อมูลผู้ปกครอง</Heading>
      {isFormLoad ? (
        <Flex py={10} justifyContent='center'>
          <Spinner />
        </Flex>
      ) : (
        <Box as='form' onSubmit={formik.handleSubmit}>
          <Box py={4}>
            <Flex>
              <Box width={1 / 2} p={2}>
                <Input
                  name='parentFirstName'
                  placeholder='ชื่อผู้ปกครอง'
                  formik={formik}
                  isRequired
                />
              </Box>
              <Box width={1 / 2} p={2}>
                <Input
                  name='parentLastName'
                  placeholder='นามสกุล'
                  formik={formik}
                  isRequired
                />
              </Box>
            </Flex>
          </Box>
          <Box py={4}>
            <Flex>
              <Box width={1 / 2} p={2}>
                <Input
                  name='parentRelation'
                  placeholder='ความเกี่ยวข้อง'
                  formik={formik}
                  isRequired
                />
              </Box>
              <Box width={1 / 2} p={2}>
                <Input
                  name='parentPhone'
                  placeholder='เบอร์โทรศัพท์'
                  formik={formik}
                  isRequired
                />
              </Box>
            </Flex>
          </Box>
          <Stack spacing={4} isInline justifyContent='center'>
            <Box>
              <Link href='/step/1'>
                <Button mt={4} leftIcon='chevron-left'>
                  ขั้นตอนก่อนหน้า
                </Button>
              </Link>
            </Box>
            <Button
              mt={4}
              variantColor='blue'
              isLoading={formik.isSubmitting}
              type='submit'
              rightIcon='chevron-right'>
              ขั้นตอนถัดไป
            </Button>
          </Stack>
        </Box>
      )}
    </React.Fragment>
  )
}

export default Step1Page
