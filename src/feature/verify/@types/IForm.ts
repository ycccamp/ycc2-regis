import { User } from 'firebase'

export interface IForm {
  user: User
  avatar?: {
    [key: string]: any
  }
  basic?: {
    [key: string]: any
  }
  personal?: {
    [key: string]: string
  }
  parent?: {
    [key: string]: string
  }
  general?: {
    [key: string]: string
  }
  track?: {
    [key: string]: string
  }
}
