import React, { useEffect, useState } from 'react'

import Link from 'next/link'
import Router from 'next/router'

import { Box, Button, Flex, Heading, Spinner, useToast } from '@chakra-ui/core'

import { useFormik } from 'formik'

import 'firebase/firestore'
import 'firebase/performance'
import { firebase } from '../../../../core/services/firebase'
import { useAuth } from '../../../../core/services/useAuth'

import FormBuilder from '../../../../core/components/formbuilder'

interface IForm {
  parentFirstName: string
  parentLastName: string
  parentRelation: string
  parentPhone: string
}

const Step2Feature: React.FC = props => {
  const user = useAuth()

  const [isFormLoad, setIsFormLoad] = useState(true)
  const [isBackButtonLoad, setIsBackButtonLoad] = useState(false)

  const localFetchedData = localStorage.getItem('temporaryData__step2')
  const localSavedData: IForm =
    typeof localFetchedData === 'string'
      ? JSON.parse(localFetchedData)
      : localFetchedData

  const [form, setForm] = useState(
    localSavedData !== null
      ? localSavedData
      : {
          parentFirstName: '',
          parentLastName: '',
          parentRelation: '',
          parentPhone: '',
        }
  )

  const formik = useFormik({
    initialValues: form,
    enableReinitialize: true,
    onSubmit: async (values, actions) => {
      const instance = firebase()

      const trace = instance.performance().trace('step2-onSubmit')
      trace.start()

      try {
        if (user !== null) {
          await instance
            .firestore()
            .collection('registration')
            .doc(user.uid)
            .collection('forms')
            .doc('parent')
            .set(values)

          const userInstance = await instance
            .firestore()
            .collection('registration')
            .doc(user.uid)
            .get()

          const userData = userInstance.data()

          if (userData) {
            await instance
              .firestore()
              .collection('registration')
              .doc(user.uid)
              .update({
                step: userData.step > 3 ? userData.step : 3,
                timestamp: new Date().getTime(),
              })

            trace.incrementMetric('success', 1)
            trace.stop()

            Router.push('/step/3/')
          }
        }
      } catch {
        trace.incrementMetric('success', 0)
        trace.stop()

        useToast()({
          title: 'เกิดข้อผิดพลาด',
          description: 'ไม่สามารถบันทึกข้อมูลได้สำเร็จ กรุณาลองใหม่อีกครั้ง',
          status: 'error',
          duration: 4000,
          isClosable: true,
        })
      }
    },
  })

  useEffect(() => {
    if (user !== null) {
      const instance = firebase()

      instance
        .firestore()
        .collection('registration')
        .doc(user.uid)
        .collection('forms')
        .doc('parent')
        .get()
        .then(async doc => {
          if (doc.exists) {
            const data = doc.data()
            const general = await instance
              .firestore()
              .collection('registration')
              .doc(user.uid)
              .get()

            const { timestamp }: any = general.data()
            const localTimestamp: any = localStorage.getItem(
              'temporaryData__timestamp'
            )

            if (timestamp < +localTimestamp) {
              setForm((prev: any) => ({ ...prev, ...data }))
            }
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
          <FormBuilder
            formik={formik}
            form={[
              [
                [
                  {
                    type: 'text',
                    name: 'parentFirstName',
                    title: 'ชื่อผู้ปกครอง',
                    placeholder: 'ภวัต',
                    isRequired: true,
                  },
                  {
                    type: 'text',
                    name: 'parentLastName',
                    title: 'นามสกุล',
                    placeholder: 'นาดี',
                    isRequired: true,
                  },
                ],
                [
                  {
                    type: 'text',
                    name: 'parentRelation',
                    title: 'ความเกี่ยวข้อง',
                    placeholder: 'ลุง , บิดา',
                    isRequired: true,
                  },
                  {
                    type: 'text',
                    name: 'phone',
                    title: 'เบอร์โทรศัพท์',
                    placeholder: '08XXXXXXXX (10 ตัว)',
                    isRequired: true,
                    props: {
                      maxLength: 10,
                      pattern: '[0-9]{10}',
                      title:
                        'เบอร์โทรศัพท์ต้องกรอกให้ครบทั้งหมด 10 หลักโดยไม่มีขีด',
                    },
                  },
                ],
              ],
            ]}
          />
          <Flex justifyContent='center' flexWrap='wrap'>
            <Box px={2}>
              <Link href='/step/1'>
                <Button
                  mt={4}
                  leftIcon='chevron-left'
                  isDisabled={formik.isSubmitting}
                  onClick={() => setIsBackButtonLoad(true)}
                  isLoading={isBackButtonLoad}>
                  ขั้นตอนก่อนหน้า
                </Button>
              </Link>
            </Box>
            <Box px={2}>
              <Button
                mt={4}
                className='primary'
                isLoading={formik.isSubmitting}
                isDisabled={isBackButtonLoad}
                type='submit'
                rightIcon='chevron-right'>
                ขั้นตอนถัดไป
              </Button>
            </Box>
          </Flex>
        </Box>
      )}
    </React.Fragment>
  )
}

export default Step2Feature
