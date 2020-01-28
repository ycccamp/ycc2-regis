export interface IFormBuilderProps {
  form: (
    | {
        type: 'text' | 'textarea' | 'date' | 'email' | 'upload'
        name: string
        title: string
        placeholder?: string
        isRequired: boolean
        props?: any
        maxLength?: number
      }
    | {
        type: 'select'
        name: string
        title: string
        placeholder?: string
        isRequired: boolean
        props?: any
        options: {
          [key: string]: string
        }
      }
  )[][][]
  formik: any
}
