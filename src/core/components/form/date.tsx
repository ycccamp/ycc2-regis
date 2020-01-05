import React from 'react'

import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
} from '@chakra-ui/core'

import { IFormDateProps } from '../../@types/IFormDateProps'

const FormDate: React.FC<IFormDateProps> = props => {
  const { name, formik, placeholder, isRequired } = props

  return (
    <FormControl
      isInvalid={
        formik.errors[name] !== undefined && formik.touched[name] !== undefined
      }
      isRequired={isRequired}>
      <FormLabel htmlFor={name}>{placeholder}</FormLabel>
      <Input
        id={name}
        type='date'
        color='gray.400'
        onChange={formik.handleChange}
        value={formik.values[name]}
      />
      <FormErrorMessage>{formik.errors[name]}</FormErrorMessage>
    </FormControl>
  )
}

export default FormDate
