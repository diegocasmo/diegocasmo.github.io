---
layout: post
title: Scroll to Input on Formik Failed Submission
date: 2021-11-29
---

- [ ] Create demo app (repo in GitRub) (e.g., a list of to-dos)
- [ ] Motivation
- [ ] Solution
  - [ ] <ScrollToFieldError/>
  - [ ] getFieldErrorNames
- [ ] Conclusion

## Motivation

## Solution

```jsx
import { useFormikContext } from "formik"
import isEmpty from "lodash/isEmpty"
import { useEffect } from "react"

/**
 * Returns an array of error field names using object dot notation for
 * array fields (if any)
 * Example:
 * Input: { name: 'is invalid', items: [{ description: 'is invalid' }] }
 * Output: ['name', 'items.0.description']
 * @param {Object} errors A Formik form errors
 * @returns {Array}
 */
export const getFieldErrorNames = formikErrors => {
  const transformObjectToDotNotation = (obj, prefix = "", result = []) => {
    Object.keys(obj).forEach(key => {
      const value = obj[key]
      if (isEmpty(value)) return

      const nextKey = prefix ? `${prefix}.${key}` : key
      if (typeof value === "object") {
        transformObjectToDotNotation(value, nextKey, result)
      } else {
        result.push(nextKey)
      }
    })

    return result
  }

  return transformObjectToDotNotation(formikErrors)
}

/**
 * @deprecated use <ErrorSummary/> instead
 * Scroll to first Formik field error on failed schema validation
 * form submission
 */
export const ScrollToFieldError = () => {
  const { submitCount, isValid, errors } = useFormikContext()

  useEffect(() => {
    if (isValid) return

    const fieldErrorNames = getFieldErrorNames(errors)
    if (isEmpty(fieldErrorNames)) return

    const elements = document.getElementsByName(fieldErrorNames[0])
    if (isEmpty(elements)) return

    // Scroll first known error into view
    elements[0].scrollIntoView({ behavior: "smooth", block: "center" })

    // Unfortunately, Formik doesn't yet provide a sort of callback for a
    // failed submission, thus why this is implemented through a hook that
    // listens to changes on the submit count. We explicitly don't want
    // to add `isValid` or `errors` as hooks dependencies, as that might
    // cause the effect to run while the user is typing on an input and
    // result in a non-pleasant UX.
  }, [submitCount]) // eslint-disable-line react-hooks/exhaustive-deps

  return null
}
```

## Conclusion
