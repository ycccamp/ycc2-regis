import React, { useEffect, useState } from 'react'

import { Avatar, Box } from '@chakra-ui/core'

import 'firebase/storage'
import { firebase } from '../../../core/services/firebase'

import { IAvatarFieldProps } from '../@types/IAvatarFieldProps'

const AvatarField: React.FC<IAvatarFieldProps> = props => {
  const { fileName, user } = props

  const [avatarUrl, setAvatarUrl] = useState<string>('')

  useEffect(() => {
    const instance = firebase()

    instance
      .storage()
      .ref()
      .child(`/registation/profile/${user.uid}/${fileName}`)
      .getDownloadURL()
      .then(url => {
        setAvatarUrl(url)
      })
  }, [])

  return (
    <Box pt={4}>
      <Avatar size='xl' src={avatarUrl} />
    </Box>
  )
}

export default AvatarField
