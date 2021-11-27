---
layout: post
title: Scroll to Input on Formik Failed Submission
date: 2021-11-29
---

[Formik](https://formik.org/) is a well known React library that allows to create forms, manage, and validate their state. It comes with built-in support for [Yup](https://github.com/jquense/yup), a schema builder for value parsing and validation.

The [FieldArrray](https://formik.org/docs/api/fieldarray) helper is one of my favorite Formik features. It enables the manipulation of lists with ease. One caveat, is that these type of forms usually become long, to the point where all its inputs are not necessarily visible in the window.

And what if the user made a mistake on a field? Which field was it? Is that field currently visible to the user? The goal of this blog post is to showcase a solution which automatically scrolls an input into the visible area of the window, so that users know which input in the form is invalid.

## Formik Errors

When combined with Yup, Formik will automatically transform validation errors into an object whose properties match its values. For instance, given a form has the following initial values and validation schema:

```jsx
const initialValues = {
  friends: [{ name: "", email: "" }],
}

const schema = Yup.object().shape({
  friends: Yup.array(
    Yup.object().shape({
      name: Yup.string().required("Required"),
      email: Yup.string().email("Invalid email").required("Required"),
    })
  )
    .min(1)
    .required(),
})
```

An invalid form submission, where the first "friend" input doesn't have a name, and the second one has an invalid email, will look as follows:

```jsx
const errors = {
  friends: [{ name: "Required" }, { email: "Invalid email" }],
}
```

We can take advantage of this error formatting, in combination with Formik's fields' name usage of object dot-notation (e.g., `` <Field name={`friends[${index}].name`} />  ``) to reference nested values, and find an invalid input in the DOM.

## Scroll To Field Error

The first step is to transform a Formik error object to dot-notation, so that we can later on search for inputs by their unique name.

The `getFieldErrorNames()` function takes a Formik error as an argument, and returns an array of error field names using object dot-notation for array fields. For instance, given the error object from above, it'll return `['friends.0.name', 'friends.1.email']`, meaning that these attributes at that index have a validation error.

```jsx
export const getFieldErrorNames = formikErrors => {
  const transformObjectToDotNotation = (obj, prefix = "", result = []) => {
    Object.keys(obj).forEach(key => {
      const value = obj[key]
      if (!value) return

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
```

Next up, `getFieldErrorNames()` needs to be executed when a user submits the form with invalid data. Unfortunately, Formik doesn't (yet) provide a sort of callback for a client-side failed submission, thus what we'll be doing instead, is listening to `submitCount` changes, and executing our custom logic to scroll to an invalid input there.

The `<ScrollToFieldError/>` component listens to `submitCount` changes, and calls `getFieldErrorNames()` when the form is invalid. If `getFieldErrorNames()` returns any field error names, it'll query the first element by name, and scroll it into visible area of the window.

```jsx
export const ScrollToFieldError = () => {
  const { submitCount, isValid, errors } = useFormikContext()

  useEffect(() => {
    if (isValid) return

    const fieldErrorNames = getFieldErrorNames(errors)
    if (fieldErrorNames.length <= 0) return

    const element = document.querySelector(
      `input[name='${fieldErrorNames[0]}']`
    )
    if (!element) return

    // Scroll to first known error into view
    element.scrollIntoView({ behavior: "smooth", block: "center" })
  }, [submitCount]) // eslint-disable-line react-hooks/exhaustive-deps

  return null
}
```

And that's it! The `<ScrollToFieldError/>` component can be used within a Formik form (so that it has access to Formik's context), and whenever an invalid form submission occurs, it'll automatically scroll the first invalid input into the visible area of the window.

A live demo is available in this [CodeSandbox](https://codesandbox.io/s/scroll-to-input-formik-failed-submission-gnehr?file=/src/App.js), and all the code required for it in [GitHub](https://github.com/diegocasmo/scroll-to-input-formik-failed-submission).
