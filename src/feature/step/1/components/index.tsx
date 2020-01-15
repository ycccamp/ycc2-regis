import React, { useEffect, useState } from 'react'

import Router from 'next/router'

import {
  Avatar,
  Box,
  Button,
  Flex,
  Heading,
  Spinner,
  useToast,
} from '@chakra-ui/core'

import { useFormik } from 'formik'

import 'firebase/firestore'
import 'firebase/storage'
import { firebase } from '../../../../core/services/firebase'
import { useAuth } from '../../../../core/services/useAuth'

import FormBuilder from '../../../../core/components/formbuilder'

import {
  bloodGroups,
  genders,
  grades,
  religions,
  shirtSizes,
} from '../../../../core/constants'

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

  const [form, setForm] = useState({
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
            .collection('registration')
            .doc(user.uid)
            .collection('forms')
            .doc('personal')
            .set({
              ...values,
            })

          Router.push('/step/2/')
        }
      } catch {
        toast({
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
        .doc('personal')
        .get()
        .then(doc => {
          if (doc.exists) {
            const data = doc.data()
            setForm(prev => ({ ...prev, ...data }))
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
              <Avatar size='xl' src={avatarUrl} />
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
                <Button as='span' size='sm' isDisabled={isAvatarUploading}>
                  {isAvatarUploading
                    ? `${Math.floor(uploadProgress)} %`
                    : `อัพโหลดรูปประจำตัว`}
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
                      placeholder: 'ชื่อ',
                      isRequired: true,
                    },
                    {
                      type: 'text',
                      name: 'lastname',
                      placeholder: 'นามสกุล',
                      isRequired: true,
                    },
                  ],
                  [
                    {
                      type: 'text',
                      name: 'nickname',
                      placeholder: 'ชื่อเล่น',
                      isRequired: true,
                    },
                    {
                      type: 'date',
                      name: 'birthdate',
                      placeholder: 'วันเกิด',
                      isRequired: true,
                    },
                    {
                      type: 'select',
                      name: 'gender',
                      placeholder: 'เพศ',
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
                      placeholder: 'ระดับชั้น',
                      options: grades,
                      isRequired: true,
                    },
                    {
                      type: 'text',
                      name: 'school',
                      placeholder: 'โรงเรียน',
                      isRequired: true,
                    },
                  ],
                  [
                    {
                      type: 'select',
                      name: 'religion',
                      placeholder: 'ศาสนา',
                      options: religions,
                      isRequired: true,
                    },
                    {
                      type: 'text',
                      name: 'phone',
                      placeholder: 'เบอร์โทรศัพท์',
                      isRequired: true,
                    },
                  ],
                  [
                    {
                      type: 'text',
                      name: 'email',
                      placeholder: 'อีเมล',
                      isRequired: true,
                    },
                    {
                      type: 'text',
                      name: 'socialMedia',
                      placeholder: 'Social Media',
                      isRequired: true,
                    },
                  ],
                ],
                [
                  [
                    {
                      type: 'select',
                      name: 'shirtSize',
                      placeholder: 'ไซส์เสื้อ',
                      options: shirtSizes,
                      isRequired: true,
                    },
                    {
                      type: 'select',
                      name: 'bloodGroup',
                      placeholder: 'กรุ๊ปเลือด',
                      options: bloodGroups,
                      isRequired: true,
                    },
                  ],
                  [
                    {
                      type: 'textarea',
                      name: 'address',
                      placeholder: 'ที่อยู่',
                      isRequired: true,
                    },
                  ],
                ],
                [
                  [
                    {
                      type: 'text',
                      name: 'disease',
                      placeholder: 'โรคประจำตัว',
                      isRequired: false,
                    },
                  ],
                  [
                    {
                      type: 'text',
                      name: 'foodAllergy',
                      placeholder: 'อาหารที่แพ้',
                      isRequired: false,
                    },
                  ],
                  [
                    {
                      type: 'text',
                      name: 'drugAllergy',
                      placeholder: 'ยาที่แพ้',
                      isRequired: false,
                    },
                  ],
                ],
                [
                  [
                    {
                      type: 'textarea',
                      name: 'activity',
                      placeholder: 'กิจกรรมหรือผลงานที่น้องๆ เคยทำหรือเข้าร่วม',
                      isRequired: true,
                    },
                    {
                      type: 'textarea',
                      name: 'expectation',
                      placeholder: 'คาดหวังอะไรจากค่ายนี้บ้าง',
                      isRequired: true,
                    },
                  ],
                ],
              ]}
            />
            <Flex justifyContent='center' flexWrap='wrap'>
              <Box px={2}>
                <Button mt={4} isDisabled={true} leftIcon='chevron-left'>
                  ขั้นตอนก่อนหน้า
                </Button>
              </Box>
              <Box px={2}>
                <Button
                  mt={4}
                  variantColor='blue'
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
