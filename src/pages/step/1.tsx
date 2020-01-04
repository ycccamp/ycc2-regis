import React, { useState } from 'react'

import { Box, Button, Flex } from '@chakra-ui/core'

import { useFormik } from 'formik'
import { object, string } from 'yup'

import Input from '../../core/components/form/input'
import Select from '../../core/components/form/select'

const formSchema = object().shape({
  firstname: string()
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required'),
  lastname: string()
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required'),
  nickname: string()
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required'),
  gender: string().required('Required'),
  grade: string().required('Required'),
  school: string().required('Required'),
})

const religions = {
  atheist: 'ไม่นับถือศาสนา',
  buddhist: 'ศาสนาพุทธ',
  christianity: 'ศาสนาคริสต์',
  islam: 'ศาสนาอิสลาม',
  other: 'ศาสนาอื่นๆ',
}

const grades = {
  m3: 'มัธยมศึกษาปีที่ 3',
  m4: 'มัธยมศึกษาปีที่ 4',
  m5: 'มัธยมศึกษาปีที่ 5',
  m6: 'มัธยมศึกษาปีที่ 6',
  p1: 'ปวช.',
  other: 'อื่นๆ',
}

const genders = {
  male: 'ชาย',
  female: 'หญิง',
  other: 'เพศอื่นๆ',
  none: 'ไม่ระบุ',
}

const shirtSizes = {
  XS: 'XS (รอบอก 31 นิ้ว ความยาว 25 นิ้ว)',
  S: 'S (รอบอก 36 นิ้ว ความยาว 28 นิ้ว)',
  M: 'M (รอบอก 38 นิ้ว ความยาว 28.5 นิ้ว)',
  L: 'L (รอบอก 42 นิ้ว ความยาว 30 นิ้ว)',
  XL: 'XL (รอบอก 44 นิ้ว ความยาว 30.5 นิ้ว)',
  XXL: 'XXL (รอบอก 48 นิ้ว ความยาว 32 นิ้ว)',
}

const Step1Page: React.FC = props => {
  const formik = useFormik({
    initialValues: {
      firstname: '',
      lastname: '',
      gender: '',
      nickname: '',
      grade: '',
      school: '',
    },
    onSubmit: (values, actions) => {
      setTimeout(() => {
        alert(JSON.stringify(values, null, 2))
        actions.setSubmitting(false)
      }, 1000)
    },
    validationSchema: formSchema,
  })

  return (
    <form onSubmit={formik.handleSubmit}>
      <Flex>
        <Box width={1 / 2} p={2}>
          <Input
            name='firstname'
            placeholder='ชื่อ'
            isInvalid={
              formik.errors.firstname !== undefined &&
              formik.touched.firstname !== undefined
            }
            value={formik.values.firstname}
            errorMessage={formik.errors.firstname}
            onChange={formik.handleChange}
            isRequired
          />
        </Box>
        <Box width={1 / 2} p={2}>
          <Input
            name='lastname'
            placeholder='นามสกุล'
            isInvalid={
              formik.errors.lastname !== undefined &&
              formik.touched.lastname !== undefined
            }
            value={formik.values.lastname}
            errorMessage={formik.errors.lastname}
            onChange={formik.handleChange}
            isRequired
          />
        </Box>
      </Flex>
      <Flex>
        <Box width={1 / 3} p={2}>
          <Input
            name='nickname'
            placeholder='ชื่อเล่น'
            isInvalid={
              formik.errors.nickname !== undefined &&
              formik.touched.nickname !== undefined
            }
            value={formik.values.nickname}
            errorMessage={formik.errors.nickname}
            onChange={formik.handleChange}
            isRequired
          />
        </Box>
        <Box width={1 / 3} p={2}>
          <Select
            name='gender'
            placeholder='เพศ'
            isInvalid={
              formik.errors.gender !== undefined &&
              formik.touched.gender !== undefined
            }
            options={genders}
            value={formik.values.gender}
            errorMessage={formik.errors.gender}
            onChange={formik.handleChange}
            isRequired
          />
        </Box>
      </Flex>
      <Flex>
        <Box width={1 / 2} p={2}>
          <Select
            name='grade'
            placeholder='ระดับชั้น'
            isInvalid={
              formik.errors.grade !== undefined &&
              formik.touched.grade !== undefined
            }
            options={grades}
            value={formik.values.grade}
            errorMessage={formik.errors.grade}
            onChange={formik.handleChange}
            isRequired
          />
        </Box>
        <Box width={1 / 2} p={2}>
          <Input
            name='school'
            placeholder='โรงเรียน'
            isInvalid={
              formik.errors.school !== undefined &&
              formik.touched.school !== undefined
            }
            value={formik.values.school}
            errorMessage={formik.errors.school}
            onChange={formik.handleChange}
            isRequired
          />
        </Box>
      </Flex>
      <Button
        mt={4}
        variantColor='teal'
        isLoading={formik.isSubmitting}
        type='submit'>
        Submit
      </Button>
    </form>
  )
}

export default Step1Page
