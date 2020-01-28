import React from 'react'

import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
} from '@chakra-ui/core'

import { IFormTextareaProps } from '../../@types/IFormTextareaProps'

const FormTextarea: React.FC<IFormTextareaProps> = props => {
  const { name, formik, title, placeholder, isRequired } = props

  return (
    <FormControl
      isInvalid={
        formik.errors[name] !== undefined && formik.touched[name] !== undefined
      }
      isRequired={isRequired}>
      <FormLabel htmlFor={name}>{title}</FormLabel>
      <Input
        id={name}
        as='textarea'
        height={100}
        placeholder={placeholder}
        onChange={formik.handleChange}
        value={formik.values[name]}
      />
      <FormErrorMessage>{formik.errors[name]}</FormErrorMessage>
    </FormControl>
  )
}

export default FormTextarea
