import firebaseApp from 'firebase/app'

interface IConfig {
  apiKey: string
  appId: string
  authDomain: string
  databaseURL: string
  measurementId: string
  messagingSenderId: string
  projectId: string
  storageBucket: string
}

export const firebase = () => {
  if (!firebaseApp.apps.length) {
    const config: IConfig = {
      apiKey: 'AIzaSyBufAwRC9-ud1CIZQyvC3HwrKUUxTlbWcg',
      authDomain: 'ycc-regis.firebaseapp.com',
      databaseURL: 'https://ycc-regis.firebaseio.com',
      projectId: 'ycc-regis',
      storageBucket: 'ycc-regis.appspot.com',
      messagingSenderId: '85944610989',
      appId: '1:85944610989:web:772a02b274fc205768d624',
      measurementId: 'G-8S4V1REH7S',
    }

    return firebaseApp.initializeApp(config)
  } else {
    return firebaseApp.app()
  }
}
