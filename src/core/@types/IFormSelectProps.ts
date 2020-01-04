export interface IFormSelectProps {
  name: string
  placeholder: string
  isRequired?: boolean
  formik: any
  options: {
    [key: string]: string
  }
}
