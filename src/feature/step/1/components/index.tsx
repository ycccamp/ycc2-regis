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

import FormBuilder from '../../../../core/components/formbuilder'

import {
  bloodGroups,
  genders,
  grades,
  provinces,
  religions,
  shirtSizes,
} from '../../../../core/constants'

interface IForm {
  firstname: string
  lastname: string
  gender: string
  nickname: string
  birthdate: string
  class: string
  school: string
  religion: string
  phone: string
  email: string
  socialMedia: string
  shirtSize: string
  bloodGroup: string
  address: string
  disease: string
  foodAllergy: string
  drugAllergy: string
  activity: string
  expectation: string
}

const Step1Feature: React.FC = props => {
  const user = useAuth()
  const toast = useToast()

  const [isFormLoad, setIsFormLoad] = useState<boolean>(true)

  const [avatarUrl, setAvatarUrl] = useState<string>('')
  const [isAvatarUploading, setIsAvatarUploading] = useState<boolean>(false)
  const [uploadProgress, setUploadProgress] = useState<number>(0)

  const uploadHandler = (fileList: FileList) => {
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

    const trace = instance.performance().trace('step1-avatarUploadHandler')
    trace.start()

    if (user !== null) {
      const task = instance
        .storage()
        .ref()
        .child(`/registation/profile/${user.uid}/${file.name}`)
        .put(file)

      task.on(
        'state_changed',
        snapshot => {
          const { bytesTransferred, totalBytes } = snapshot
          setUploadProgress((bytesTransferred / totalBytes) * 100)
        },
        () => {
          trace.incrementMetric('success', 0)
          trace.stop()

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
          await instance
            .firestore()
            .collection('registration')
            .doc(user.uid)
            .collection('forms')
            .doc('avatar')
            .set({
              fileName: file.name,
            })

          trace.incrementMetric('success', 1)
          trace.stop()

          task.snapshot.ref.getDownloadURL().then(url => {
            setAvatarUrl(url)

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

  const localFetchedData = localStorage.getItem('temporaryData__step1')
  const localSavedData: IForm =
    typeof localFetchedData === 'string'
      ? JSON.parse(localFetchedData)
      : localFetchedData

  const [form, setForm] = useState(
    localSavedData !== null
      ? localSavedData
      : {
          firstname: '',
          lastname: '',
          gender: '',
          nickname: '',
          birthdate: '',
          class: '',
          school: '',
          religion: '',
          phone: '',
          email: '',
          socialMedia: '',
          shirtSize: '',
          bloodGroup: '',
          address: '',
          disease: '',
          foodAllergy: '',
          drugAllergy: '',
          activity: '',
          expectation: '',
        }
  )

  const formik = useFormik({
    initialValues: form,
    enableReinitialize: true,
    onSubmit: async (values, actions) => {
      if (avatarUrl !== '') {
        const instance = firebase()

        const trace = instance.performance().trace('step1-onSubmit')
        trace.start()

        try {
          if (user !== null) {
            await instance
              .firestore()
              .collection('registration')
              .doc(user.uid)
              .collection('forms')
              .doc('personal')
              .set({
                ...values,
              })

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
                  step: userData.step > 2 ? userData.step : 2,
                  timestamp: new Date().getTime(),
                })

              trace.incrementMetric('success', 1)
              trace.stop()

              Router.push('/step/2/')
            }
          }
        } catch {
          trace.incrementMetric('success', 0)
          trace.stop()

          toast({
            title: 'เกิดข้อผิดพลาด',
            description: 'ไม่สามารถบันทึกข้อมูลได้สำเร็จ กรุณาลองใหม่อีกครั้ง',
            status: 'error',
            duration: 4000,
            isClosable: true,
          })
        }
      } else {
        toast({
          title: 'ขั้นตอนนี้ยังไม่สำเร็จ',
          description: 'คุณยังไม่ได้อัพโหลดรูปภาพประจำตัว',
          status: 'error',
          duration: 4000,
          isClosable: true,
        })
        setIsFormLoad(false)
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
        .doc('personal')
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

            if (timestamp > +localTimestamp) {
              setForm((prev: any) => ({ ...prev, ...data }))
            }
          }

          instance
            .firestore()
            .collection('registration')
            .doc(user.uid)
            .collection('forms')
            .doc('avatar')
            .get()
            .then(doc => {
              if (doc.exists) {
                const data = doc.data()

                if (data) {
                  instance
                    .storage()
                    .ref()
                    .child(`/registation/profile/${user.uid}/${data.fileName}`)
                    .getDownloadURL()
                    .then(url => {
                      setAvatarUrl(url)
                    })
                    .finally(() => {
                      setIsFormLoad(false)
                    })
                }
              } else {
                setIsFormLoad(false)
              }
            })
            .catch(() => {
              setIsFormLoad(false)
            })
        })
        .catch(() => {
          setIsFormLoad(false)
        })
    }
  }, [user])

  return (
    <React.Fragment>
      <Heading size='md'>STEP 1: ข้อมูลส่วนตัว</Heading>
      {isFormLoad ? (
        <Flex py={10} justifyContent='center'>
          <Spinner />
        </Flex>
      ) : (
        <React.Fragment>
          <Box py={4}>
            <Flex justifyContent='center'>
              <Avatar size='2xl' src={avatarUrl} />
            </Flex>
            <Flex justifyContent='center' pt={2}>
              <input
                accept='image/*'
                style={{ display: 'none' }}
                id='avatarUpload'
                name='avatarUpload'
                type='file'
                onChange={e =>
                  e.target.files !== null ? uploadHandler(e.target.files) : null
                }
              />
              <label htmlFor='avatarUpload'>
                <Button
                  as='span'
                  size='sm'
                  isDisabled={isAvatarUploading}
                  marginTop='10px'>
                  {isAvatarUploading ? (
                    `${Math.floor(uploadProgress)} %`
                  ) : (
                    <Flex>
                      อัพโหลดรูปประจำตัว{' '}
                      <Text pl={1} color='red.500'>
                        *
                      </Text>
                    </Flex>
                  )}
                </Button>
              </label>
            </Flex>
          </Box>
          <Box as='form' onSubmit={formik.handleSubmit}>
            <FormBuilder
              formik={formik}
              form={[
                [
                  [
                    {
                      type: 'text',
                      name: 'firstname',
                      title: 'ชื่อ',
                      placeholder: 'กันติชา',
                      isRequired: true,
                    },
                    {
                      type: 'text',
                      name: 'lastname',
                      title: 'นามสกุล',
                      placeholder: 'นาดี',
                      isRequired: true,
                    },
                    {
                      type: 'text',
                      name: 'nickname',
                      title: 'ชื่อเล่น',
                      placeholder: 'ชา',
                      isRequired: true,
                    },
                  ],
                  [
                    {
                      type: 'text',
                      name: 'firstnameEn',
                      title: 'ชื่อ (ภาษาอังกฤษ)',
                      placeholder: 'Kanticha',
                      isRequired: true,
                    },
                    {
                      type: 'text',
                      name: 'lastnameEn',
                      title: 'นามสกุล (ภาษาอังกฤษ)',
                      placeholder: 'Nadee',
                      isRequired: true,
                    },
                    {
                      type: 'text',
                      name: 'nicknameEn',
                      title: 'ชื่อเล่น (ภาษาอังกฤษ)',
                      placeholder: 'Cha',
                      isRequired: true,
                    },
                  ],
                  [
                    {
                      type: 'date',
                      name: 'birthdate',
                      title: 'วันเกิด',
                      isRequired: true,
                    },
                    {
                      type: 'select',
                      name: 'gender',
                      title: 'เพศ',
                      options: genders,
                      isRequired: true,
                    },
                  ],
                ],
                [
                  [
                    {
                      type: 'select',
                      name: 'class',
                      title: 'ระดับชั้น',
                      options: grades,
                      isRequired: true,
                    },
                    {
                      type: 'text',
                      name: 'school',
                      title: 'สถานศึกษา',
                      placeholder: 'สารวิทยา',
                      isRequired: true,
                    },
                  ],
                  [
                    {
                      type: 'select',
                      name: 'religion',
                      title: 'ศาสนา',
                      options: religions,
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
                  [
                    {
                      type: 'email',
                      name: 'email',
                      title: 'อีเมล',
                      placeholder: 'xxxxxxxx@xxx.xxx',
                      isRequired: true,
                    },
                    {
                      type: 'text',
                      name: 'facebook',
                      title: 'ชื่อ Facebook',
                      isRequired: true,
                    },
                  ],
                ],
                [
                  [
                    {
                      type: 'select',
                      name: 'shirtSize',
                      title: 'ไซส์เสื้อ',
                      options: shirtSizes,
                      isRequired: true,
                    },
                    {
                      type: 'select',
                      name: 'bloodGroup',
                      title: 'กรุ๊ปเลือด',
                      options: bloodGroups,
                      isRequired: true,
                    },
                  ],
                  [
                    {
                      type: 'text',
                      name: 'address',
                      title: 'ที่อยู่',
                      isRequired: true,
                    },
                    {
                      type: 'text',
                      name: 'subdistrict',
                      title: 'แขวง/ตำบล',
                      isRequired: true,
                    },
                  ],
                  [
                    {
                      type: 'text',
                      name: 'district',
                      title: 'เขต/อำเภอ',
                      isRequired: true,
                    },
                    {
                      type: 'select',
                      name: 'province',
                      title: 'จังหวัด',
                      options: provinces,
                      isRequired: true,
                    },
                    {
                      type: 'text',
                      name: 'postcode',
                      title: 'รหัสไปรษณีย์',
                      isRequired: true,
                      props: {
                        maxLength: 5,
                        pattern: '[0-9]{5}',
                        title: 'กรอกรหัสไปรษณีย์ 5 หลักให้ถูกต้อง',
                      },
                    },
                  ],
                ],
                [
                  [
                    {
                      type: 'text',
                      name: 'disease',
                      title: 'โรคประจำตัว',
                      placeholder: 'หอบหืด, ภูมิแพ้',
                      isRequired: false,
                    },
                    {
                      type: 'text',
                      name: 'foodAllergy',
                      title: 'อาหารที่แพ้',
                      placeholder: 'กุ้ง , นมวัว',
                      isRequired: false,
                    },
                    {
                      type: 'text',
                      name: 'drugAllergy',
                      title: 'ยาที่แพ้',
                      placeholder: 'Aspirin',
                      isRequired: false,
                    },
                  ],
                ],
                [
                  [
                    {
                      type: 'textarea',
                      name: 'activity',
                      title: 'กิจกรรมหรือผลงานที่น้องๆ เคยทำหรือเข้าร่วม',
                      isRequired: true,
                    },
                  ],
                  [
                    {
                      type: 'textarea',
                      name: 'expectation',
                      title: 'คาดหวังอะไรจากค่ายนี้บ้าง',
                      isRequired: true,
                    },
                  ],
                ],
              ]}
            />
            <Flex justifyContent='center' flexWrap='wrap'>
              <Box px={2}>
                <Link href='/track'>
                  <Button mt={4} leftIcon='chevron-left'>
                    ขั้นตอนก่อนหน้า
                  </Button>
                </Link>
              </Box>
              <Box px={2}>
                <Button
                  mt={4}
                  className='primary'
                  isLoading={formik.isSubmitting}
                  type='submit'
                  rightIcon='chevron-right'>
                  ขั้นตอนถัดไป
                </Button>
              </Box>
            </Flex>
          </Box>
        </React.Fragment>
      )}
    </React.Fragment>
  )
}

export default Step1Feature
