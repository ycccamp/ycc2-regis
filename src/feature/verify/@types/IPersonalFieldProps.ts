import { User } from 'firebase'

export interface IPersonalFieldProps {
  user: User
  data: {
    [key: string]: string
  }
  avatar: string
}
