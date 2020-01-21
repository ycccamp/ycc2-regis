import React, { useEffect, useRef } from 'react'

import { Box, Flex } from '@chakra-ui/core'

import Date from './form/date'
import Input from './form/input'
import Select from './form/select'
import Textarea from './form/textarea'

import { IFormBuilderProps } from '../@types/IFormBuilderProps'

const FormBuilder: React.FC<IFormBuilderProps> = props => {
  const { form, formik } = props
  const concurrentForm = useRef(props.formik.values)

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    // Debounce
    concurrentForm.current = props.formik.values

    const debounce = setTimeout(
      () =>
        JSON.stringify(concurrentForm.current) ===
        JSON.stringify(props.formik.values)
          ? localStorage.setItem(
              'temporaryData',
              JSON.stringify(props.formik.values)
            )
          : null,
      300
    )

    return () => clearInterval(debounce)
  }, [props])

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
                    <Date
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
