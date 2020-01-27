import React, { useEffect, useRef } from 'react'

import { useRouter } from 'next/router'

import { Box, Flex } from '@chakra-ui/core'

import DateComponent from './form/date'
import Input from './form/input'
import Select from './form/select'
import Textarea from './form/textarea'

import { IFormBuilderProps } from '../@types/IFormBuilderProps'

const FormBuilder: React.FC<IFormBuilderProps> = props => {
  const { form, formik } = props
  const concurrentForm = useRef(props.formik.values)
  const { asPath } = useRouter()

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    // Debounce
    concurrentForm.current = props.formik.values

    let localSave = setInterval(() => null, 300)

    switch (asPath) {
      case '/step/1/':
        localSave = debounce(props.formik.values, 1)

      case '/step/2/':
        localSave = debounce(props.formik.values, 2)

      case '/step/3/':
        localSave = debounce(props.formik.values, 3)

      case '/step/4/':
        localSave = debounce(props.formik.values, 4)
    }

    return () => clearInterval(localSave)
  }, [props])

  const debounce = (values: typeof props.formik.values, step: number) =>
    setTimeout(() => {
      if (
        JSON.stringify(concurrentForm.current) !==
        JSON.stringify(props.formik.values)
      ) {
        return
      }

      localStorage.setItem(`temporaryData__step${step}`, JSON.stringify(values))
      localStorage.setItem(
        'temporaryData__timestamp',
        `${new Date().getTime()}`
      )
    }, 300)

  return (
    <React.Fragment>
      {form.map((section, i) => (
        <Box key={`from-section${i}`} py={4}>
          {section.map((row, j) => (
            <Flex key={`form-section${i}-row${j}`} flexWrap='wrap'>
              {row.map((item, k) => (
                <Box
                  key={`form-section${i}-row${j}-column${k}`}
                  width={[
                    '100%',
                    '100%',
                    row.length === 1 ? '100%' : 1 / row.length,
                    row.length === 1 ? '100%' : 1 / row.length,
                  ]}
                  p={2}>
                  {item.type === 'text' ? (
                    <Input
                      name={item.name}
                      placeholder={item.placeholder}
                      formik={formik}
                      isRequired={item.isRequired}
                      {...item.props}
                    />
                  ) : item.type === 'textarea' ? (
                    <Textarea
                      name={item.name}
                      placeholder={item.placeholder}
                      formik={formik}
                      isRequired={item.isRequired}
                      {...item.props}
                    />
                  ) : item.type === 'select' ? (
                    <Select
                      name={item.name}
                      placeholder={item.placeholder}
                      options={item.options}
                      formik={formik}
                      isRequired={item.isRequired}
                      {...item.props}
                    />
                  ) : item.type === 'date' ? (
                    <DateComponent
                      name={item.name}
                      placeholder={item.placeholder}
                      formik={formik}
                      isRequired={item.isRequired}
                      {...item.props}
                    />
                  ) : null}
                </Box>
              ))}
            </Flex>
          ))}
        </Box>
      ))}
    </React.Fragment>
  )
}

export default FormBuilder
