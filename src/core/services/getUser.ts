import { User } from 'firebase'
import { firebase } from './firebase'

export const getUser = async (user: User) => {
  const instance = firebase()

  const userData = await instance
    .firestore()
    .collection('users')
    .doc(user.uid)
    .get()

  return userData
}
