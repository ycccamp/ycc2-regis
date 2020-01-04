import React from 'react'

import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Textarea,
} from '@chakra-ui/core'

import { IFormTextareaProps } from '../../@types/IFormTextareaProps'

const FormTextarea: React.FC<IFormTextareaProps> = props => {
  const { name, formik, placeholder, isRequired } = props

  return (
    <FormControl
      isInvalid={
        formik.errors[name] !== undefined && formik.touched[name] !== undefined
      }
      isRequired={isRequired}>
      <FormLabel htmlFor={name}>{placeholder}</FormLabel>
      <Textarea
        id={name}
        onChange={formik.handleChange}
        value={formik.values[name]}
      />
      <FormErrorMessage>{formik.errors[name]}</FormErrorMessage>
    </FormControl>
  )
}

export default FormTextarea
