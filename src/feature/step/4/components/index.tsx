import React, { useEffect, useState } from 'react'

import Link from 'next/link'
import Router from 'next/router'

import { Box, Button, Flex, Heading, Spinner, useToast } from '@chakra-ui/core'

import { useFormik } from 'formik'

import 'firebase/firestore'
import { firebase } from '../../../../core/services/firebase'
import { useAuth } from '../../../../core/services/useAuth'

import FormBuilder from '../../../../core/components/formbuilder'

import { tracks } from '../../../../core/constants'

const Step4Feature: React.FC = props => {
  const user = useAuth()

  const [isFormLoad, setIsFormLoad] = useState(true)
  const [isBackButtonLoad, setIsBackButtonLoad] = useState(false)

  const [questions, setQuestion] = useState<{ [key: string]: string }>({})

  const localFetchedData = localStorage.getItem('temporaryData__step4')
  const localSavedData =
    typeof localFetchedData === 'string'
      ? JSON.parse(localFetchedData)
      : localFetchedData

  const [form, setForm] = useState(
    localSavedData !== null ? localSavedData : {}
  )

  const constructedQuestion = Object.entries(questions).map((question, i) => {
    return [
      {
        type: 'textarea',
        name: question[0],
        placeholder: `${i + 1}. ${question[1]}`,
        isRequired: true,
      },
    ]
  }) as any // TypeScript bug

  useEffect(() => {
    if (questions !== null && localSavedData === null) {
      Object.keys(questions).reduce(
        (o, key) => Object.assign(o, { [key]: '' }),
        {}
      )
    }
  }, [questions])

  const formik = useFormik({
    initialValues: form,
    enableReinitialize: true,
    onSubmit: async (values, actions) => {
      const instance = firebase()

      try {
        if (user !== null) {
          await instance
            .firestore()
            .collection('registration')
            .doc(user.uid)
            .collection('forms')
            .doc('track')
            .set({ ...values })

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
                step: userData.step > 5 ? userData.step : 5,
              })

            Router.push('/verify/')
          }
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
  })

  useEffect(() => {
    const instance = firebase()

    if (user !== null) {
      // Get user track
      instance
        .firestore()
        .collection('registration')
        .doc(user.uid)
        .get()
        .then(doc => {
          const data = doc.data()

          if (data) {
            const track = data.track

            // Load track question
            setQuestion(tracks[track].questions)

            // Load saved answers
            instance
              .firestore()
              .collection('registration')
              .doc(user.uid)
              .collection('forms')
              .doc('track')
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
                } else {
                  setForm(
                    localSavedData !== null
                      ? localSavedData
                      : Object.keys(tracks[track].questions).reduce(
                          (o, key) => Object.assign(o, { [key]: '' }),
                          {}
                        )
                  )
                }
              })
              .finally(() => {
                setIsFormLoad(false)
              })
          }
        })
    }
  }, [user])

  useEffect(() => {
    if (user !== null) {
      const instance = firebase()

      instance
        .firestore()
        .collection('registration')
        .doc(user.uid)
        .collection('forms')
        .doc('track')
        .get()
        .then(doc => {
          if (doc.exists) {
            const data = doc.data()
            setForm((prev: any) => ({ ...prev, ...data }))
          }
        })
        .finally(() => {
          setIsFormLoad(false)
        })
    }
  }, [user])

  return (
    <React.Fragment>
      <Heading size='md'>STEP 4: คำถามสาขา</Heading>
      {isFormLoad ? (
        <Flex py={10} justifyContent='center'>
          <Spinner />
        </Flex>
      ) : (
        <Box as='form' onSubmit={formik.handleSubmit}>
          <FormBuilder formik={formik} form={[constructedQuestion]} />
          <Flex justifyContent='center' flexWrap='wrap'>
            <Box px={2}>
              <Link href='/step/3'>
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

export default Step4Feature
