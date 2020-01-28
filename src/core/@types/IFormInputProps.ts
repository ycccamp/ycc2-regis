import { ReactNode } from 'react'

export interface IFormInputProps {
  name: string
  title: ReactNode
  placeholder?: string
  isRequired?: boolean
  formik: any
  maxLength?: number
  extra?: any
}
