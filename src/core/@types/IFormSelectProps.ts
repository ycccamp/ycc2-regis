export interface IFormSelectProps {
  name: string
  title: string
  placeholder?: string
  isRequired?: boolean
  formik: any
  options: {
    [key: string]: string
  }
}
