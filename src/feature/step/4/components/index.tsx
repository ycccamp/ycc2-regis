import React, { useEffect, useState } from 'react'

import Link from 'next/link'
import Router from 'next/router'

import {
  Avatar,
  Box,
  Button,
  Flex,
  Heading,
  Spinner,
  Text,
  useToast,
} from '@chakra-ui/core'

import { useFormik } from 'formik'

import 'firebase/firestore'
import 'firebase/performance'
import 'firebase/storage'
import { firebase } from '../../../../core/services/firebase'
import { useAuth } from '../../../../core/services/useAuth'

import Input from '../../../../core/components/form/input'
import Textarea from '../../../../core/components/form/textarea'

import { tracks } from '../../../../core/constants'

const Step4Feature: React.FC = props => {
  const user = useAuth()
  const toast = useToast()

  const [isFormLoad, setIsFormLoad] = useState(true)
  const [isBackButtonLoad, setIsBackButtonLoad] = useState(false)

  const [uploadUrl, setUploadUrl] = useState<string>('')
  const [isAvatarUploading, setIsAvatarUploading] = useState<boolean>(false)
  const [uploadProgress, setUploadProgress] = useState<number>(0)

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
        title: `${i + 1}. ${question[1]}`,
        placeholder: 'พิมพ์คำตอบลงในช่องนี้',
        isRequired: true,
      },
    ]
  }) as any

  const uploadHandler = (fileList: FileList, fieldName: string) => {
    if (fileList.length === 0) {
      return
    }

    toast({
      title: 'กำลังอัพโหลด',
      description: 'กำลังอัพโหลดรูปภาพ',
      status: 'info',
      duration: 4000,
      isClosable: true,
    })
    setUploadProgress(0)
    setIsAvatarUploading(true)

    const file = fileList[0]
    const instance = firebase()

    if (user !== null) {
      const task = instance
        .storage()
        .ref()
        .child(`/registation/design/${user.uid}/${fieldName}/${file.name}`)
        .put(file)

      instance
        .firestore()
        .collection('registration')
        .doc(user.uid)
        .collection('forms')
        .doc('track')
        .set({
          file: `/registation/design/${user.uid}/${fieldName}/${file.name}`,
        })

      task.on(
        'state_changed',
        snapshot => {
          const { bytesTransferred, totalBytes } = snapshot
          setUploadProgress((bytesTransferred / totalBytes) * 100)
        },
        () => {
          toast({
            title: 'เกิดข้อผิดพลาด',
            description: 'ไม่สามารถอัพโหลดรูปภาพได้สำเร็จ',
            status: 'error',
            duration: 4000,
            isClosable: true,
          })
          setIsAvatarUploading(false)
        },
        async () => {
          task.snapshot.ref.getDownloadURL().then(url => {
            setUploadUrl(url)

            toast({
              title: 'อัพโหลดเสร็จสิ้น',
              description: 'อัพโหลดรูปภาพเสร็จสมบูรณ์',
              status: 'success',
              duration: 4000,
              isClosable: true,
            })

            setIsAvatarUploading(false)
          })
        }
      )
    }
  }

  if (user !== null) {
    const instance = firebase()

    const trackData = instance
      .firestore()
      .collection('registration')
      .doc(user.uid)
      .collection('forms')
      .doc('track')
      .get()
      .then((docs: any) => {
        const docData = docs.data()

        if (typeof docData !== 'undefined' && docData.file) {
          instance
            .storage()
            .ref()
            .child(docData.file)
            .getDownloadURL()
            .then((url: any) => {
              setUploadUrl(url)
            })
        }
      })
  }

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

      const trace = instance.performance().trace('step4-onSubmit')
      trace.start()

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
                timestamp: new Date().getTime(),
              })

            trace.incrementMetric('success', 1)
            trace.stop()

            Router.push('/verify/')
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
          {constructedQuestion.map((question: any, iteration: number) => {
            if (question[0].name.includes('Upload')) {
              return (
                <Box px={2} marginY={8}>
                  <Input
                    name={question[0].name}
                    title={
                      <div
                        dangerouslySetInnerHTML={{ __html: question[0].title }}
                      />
                    }
                    placeholder='พิมพ์คำตอบลงในช่องนี้'
                    formik={formik}
                    isRequired
                  />
                  <Flex justifyContent='center' pt={2}>
                    <Box>
                      {uploadUrl ? (
                        <Flex justifyContent='center'>
                          <Avatar size='2xl' src={uploadUrl} />
                        </Flex>
                      ) : null}
                      <input
                        accept='image/*'
                        style={{ display: 'none' }}
                        id='avatarUpload'
                        name='avatarUpload'
                        type='file'
                        onChange={e =>
                          e.target.files !== null
                            ? uploadHandler(e.target.files, 'image')
                            : null
                        }
                      />
                      <Flex justifyContent='center' pt={2}>
                        <label htmlFor='avatarUpload'>
                          <Button
                            as='span'
                            size='sm'
                            isDisabled={isAvatarUploading}>
                            {isAvatarUploading ? (
                              `${Math.floor(uploadProgress)} %`
                            ) : (
                              <Flex>
                                แนบรูป{' '}
                                <Text pl={1} color='red.500'>
                                  *
                                </Text>
                              </Flex>
                            )}
                          </Button>
                        </label>
                      </Flex>
                    </Box>
                  </Flex>
                </Box>
              )
            } else {
              return (
                <Box px={2} marginY={8}>
                  <Textarea
                    name={question[0].name}
                    title={question[0].title}
                    placeholder={question[0].placeholder}
                    formik={formik}
                    isRequired
                  />
                </Box>
              )
            }
          })}
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
