import React from 'react'

import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
} from '@chakra-ui/core'

import { IFormInputProps } from '../../@types/IFormInputProps'

const FormInput: React.FC<IFormInputProps> = props => {
  const { name, formik, placeholder, title, isRequired } = props

  return (
    <FormControl
      isInvalid={
        formik.errors[name] !== undefined && formik.touched[name] !== undefined
      }
      isRequired={isRequired}>
      <FormLabel htmlFor={name}>{title}</FormLabel>
      <Input
        id={name}
        onChange={formik.handleChange}
        value={formik.values[name]}
        placeholder={placeholder ? placeholder : title}
        type='email'
      />
      <FormErrorMessage>{formik.errors[name]}</FormErrorMessage>
    </FormControl>
  )
}

export default FormInput
