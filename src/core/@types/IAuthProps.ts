import { User } from 'firebase'

export interface IAuthProps {
  onSuccess?(user: User): void
}
