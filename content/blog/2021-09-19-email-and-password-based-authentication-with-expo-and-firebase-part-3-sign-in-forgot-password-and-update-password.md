---
layout: post
title: Email and Password Based Authentication with Expo and Firebase Part 3 - Sign In, Forgot Password, and Update Password
date: 2021-09-19
---

- This is part 3/3 of a series of blog posts that showcase email and password based authentication using Expo and Firebase.
    - [Part 1: Project Setup](https://diegocasmo.github.io/2021-08-29-email-and-password-based-authentication-with-expo-and-firebase-part-1-project-setup/)
    - [Part 2: Sign Up, Email Verification, and Sign Out](https://diegocasmo.github.io/2021-09-10-email-and-password-based-authentication-with-expo-and-firebase-part-2-sign-up-email-verification-and-sign-out/)
    - Part 3: Sign In, Forgot Password, and Update Password (you are here)

This is the last part of a series of blog posts covering how to setup email and password based authentication with Expo and Firebase. In this blog post, we'll finish off by implementing the sign in, forgot password, and update password features. Let's get started!

## Sign In

You should now be quite familiar with how each feature is implemented. Let's start by first adding the `signIn()` method in the user API, which uses the Firebase's `signInWithEmailAndPassword()` method.

``` jsx
export const signIn = ({ email = '', password = '' }) =>
  firebase.auth().signInWithEmailAndPassword(email, password)
```

Next, create the "sign in" feature folder and a `/hooks` directory on it `mkdir -p src/features/sign-in/hooks`. Create the `useSignIn()` hook `touch src/features/sign-in/hooks/use-sign-in.js` and add its implementation. The `useSignIn()` hook works just like the others; it allows access to Firebase's "sign in" API and exposes an `isLoading` and `error` state.

``` jsx
export const useSignIn = () => {
  const [state, setState] = useState({
    isLoading: false,
    error: null,
  })

  const handleSignIn = async (values) => {
    setState({ isLoading: true, error: null })

    try {
      await signIn(values)
      setState({ isLoading: false, error: null })
    } catch (error) {
      setState({ isLoading: false, error })
    }
  }

  return [handleSignIn, { ...state }]
}
```

Following that, create the `/screens` directory `mkdir src/features/sign-in/screens` and the "sign in" screen `touch src/features/sign-in/screens/SignInScreen.js`. The "sign in" screen re-uses the `<EmailAndPasswordForm/>`, extending it to optionally support a custom submit button text. Note that if any error occurs, it'll be rendered using the `<ErrorMessage/>` component ([full source code](https://github.com/diegocasmo/expo-firebase-authentication/blob/main/src/components/ErrorMessage.js)), which simply uses the `<Alert/>` component from [native-base](https://docs.nativebase.io/alert).

``` jsx
export const SignInScreen = () => {
  const [signIn, { isLoading, error }] = useSignIn()

  return (
    <Center flex={1}>
      <VStack space={4} alignItems="center" w="90%">
        <ErrorMessage error={error} />
        <EmailAndPasswordForm
          onSubmit={signIn}
          isLoading={isLoading}
          buttonText="Sign in"
        />
      </VStack>
    </Center>
  )
}
```

Finally, define the "sign in" screen in the guest navigator.

``` jsx
export const GuestAppNavigator = () => (
  <Stack.Navigator>
    {/* guest welcome and sign up screens omitted for brevity */}
    <Stack.Screen
      name="SignIn"
      component={SignInScreen}
      options={{ title: 'Sign In' }}
    />
  </Stack.Navigator>
)
```

Start the application and verify you are able to sign in with an existing user account. If the user's email is unverified, they should be shown the "verify email" screen, otherwise, the home screen should be shown.

## Forgot Password

The forgot password feature will help users recover their account if they forget their password. To do so, users will specify their email so that Firebase can send a "reset password" link.

Let's start by creating the API for sending a password reset email. Create the `sendPasswordReset()` method in the user API file.

``` jsx
export const sendPasswordReset = ({ email = '' }) =>
  firebase.auth().sendPasswordResetEmail(email)
```

Next, create the forgot password feature directory `mkdir -p src/features/forgot-password/hooks` and the `usePasswordReset()` hook file `touch src/features/forgot-password/hooks/use-password-reset.js`. Similar to all others hooks created in the series, the `usePasswordReset()` hook calls the user API method and keeps track of its `isLoading`/`error` states.

``` jsx
export const usePasswordReset = () => {
  const [state, setState] = useState({
    isLoading: false,
    error: null,
  })

  const handlePasswordReset = async (values) => {
    setState({ isLoading: true, error: null })

    try {
      await sendPasswordReset(values)
      setState({ isLoading: false, error: null })
    } catch (error) {
      setState({ isLoading: false, error })
      throw error
    }
  }

  return [handlePasswordReset, { ...state }]
}
```

Following that, extend the sign in screen with a button which will redirect users to the yet to be created forgot password screen.

``` jsx
export const SignInScreen = ({ navigation }) => {
  const handlePressOnForgotPassword = () => {
    navigation.navigate('ForgotPassword')
  }

  return (
    <Center flex={1}>
      <VStack space={4} alignItems="center" w="90%">
        {/* Existing code omitted for brevity */}
        <Button onPress={handlePressOnForgotPassword}>Forgot password</Button>
      </VStack>
    </Center>
  )
}
```

Make sure the forgot password screen is defined in the guest navigator stack.

``` jsx
export const GuestAppNavigator = () => (
  <Stack.Navigator>
    {/* Existing screens omitted for brevity */}
    <Stack.Screen
      name="ForgotPassword"
      component={ForgotPasswordScreen}
      options={{ title: 'Forgot Password' }}
    />
  </Stack.Navigator>
)
```

The forgot password screen uses an `<EmailForm/>` component ([full source code here](https://github.com/diegocasmo/expo-firebase-authentication/blob/main/src/features/forgot-password/components/EmailForm.js)) which defines an email input and a submit button that needs to be connected with the `usePasswordReset()` hook.  Create the forgot password screen directory `mkdir src/features/forgot-password/screens` and a file for it `touch src/features/forgot-password/screens/ForgotPasswordScreen.js` and fill it in.

``` jsx
export const ForgotPasswordScreen = ({ navigation }) => {
  const [sendPasswordReset, { isLoading, error }] = usePasswordReset()

  const handlePasswordReset = async (values) => {
    try {
      await sendPasswordReset(values)
      navigation.navigate('SignIn')
    } catch (err) {
      console.error(err.message)
    }
  }

  return (
    <Center flex={1}>
      <VStack space={4} alignItems="center" w="90%">
        <Text>
          Please, enter your email address. You will receive link to create a new
          password via email.
        </Text>
        <ErrorMessage error={error} />
        <EmailForm onSubmit={handlePasswordReset} isLoading={isLoading} />
      </VStack>
    </Center>
  )
}
```

Users should now be able to reset their password by entering their email in the form, and using the reset password link sent to them via email.

## Update Password

The update password feature allows users to change their password. To do so, users will first need to re-authenticate so that the currently signed in user can verify they are indeed the ones who want to perform the change, and only then, they will be allowed to update their password.

Start by adding a button in the home screen which redirects to the yet to be defined re-authenticate screen.

``` jsx
export const HomeScreen = ({ navigation }) => {
  const handlePressOnUpdatePassword = () => {
    navigation.navigate('Reauthenticate')
  }

  return (
    <Center flex={1}>
      <VStack space={4} alignItems="center" w="90%">
        <Button onPress={handlePressOnUpdatePassword}>Update password</Button>
        {/* Existing code omitted for brevitiy */}
      </VStack>
    </Center>
  )
}
```

Next, add the re-authenticate screen to the verified app navigator.

``` jsx
export const VerifiedAppNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="Reauthenticate"
      component={ReauthenticateScreen}
      options={{ title: 'Sign in' }}
    />
    {/* Existing code omitted for brevitiy */}
  </Stack.Navigator>
)
```

Following that, create the update password feature directory by running `mkdir -p src/features/update-password/screens` and the re-authenticate screen with `touch src/features/update-password/screens/ReauthenticateScreen.js`. In order to re-authenticate a user, create the `reauthenticate` method in the user API file, which uses Firebase's `reauthenticateWithCredential` method.

``` jsx
export const reauthenticate = ({ email = '', password = '' }) =>
  getUser().reauthenticateWithCredential(
    firebase.auth.EmailAuthProvider.credential(email, password)
  )
```

Once the API method has been defined, proceed to create the `useReauthenticate()` hook to easily access it by running `mkdir -p src/features/update-password/hooks` and `touch src/features/update-password/hooks/use-reauthenticate.js`. Notice how it re-throws the error if an exception is raised while performing the operation.

``` jsx
export const useReauthenticate = () => {
  const [state, setState] = useState({
    isLoading: false,
    error: null,
  })

  const handleReauthenticate = async (values) => {
    setState({ isLoading: true, error: null })

    try {
      await reauthenticate(values)
      setState({ isLoading: false, error: null })
    } catch (error) {
      setState({ isLoading: false, error })
      throw error
    }
  }

  return [handleReauthenticate, { ...state }]
}
```

Finally, use the `useReauthenticate()` hook in the re-authenticate screen, which works quite similar to the sign in screen, but instead re-authenticates a user. If a user is successfully re-authenticated, they are redirected to the update password screen.

``` jsx
export const ReauthenticateScreen = ({ navigation }) => {
  const [reauthenticate, { isLoading, error }] = useReauthenticate()

  const handleReauthenticate = async (values) => {
    try {
      await reauthenticate(values)
      navigation.navigate('UpdatePassword')
    } catch (err) {
      console.error(err.message)
    }
  }

  return (
    <Center flex={1}>
      <VStack space={4} alignItems="center" w="90%">
        <ErrorMessage error={error} />
        <EmailAndPasswordForm
          onSubmit={handleReauthenticate}
          isLoading={isLoading}
          buttonText="Re-authenticate"
        />
      </VStack>
    </Center>
  )
}
```

So far, users should be able to click on "Update password" in the home screen, re-authenticate their account in the re-authenticate screen, and if successful, be redirected to the update password screen.

In order to allow a user to update their password once successfully re-authenticated, let's define the API method that will be used to do so. In the user API file, define the `updatePassword()` method.

``` jsx
export const updatePassword = ({ password = '' }) =>
  getUser().updatePassword(password)
```

Next, create a hook for it `touch src/features/update-password/hooks/use-update-password.js`

``` jsx
export const useUpdatePassword = () => {
  const [state, setState] = useState({
    isLoading: false,
    error: null,
  })

  const handleUpdatePassword = async (values) => {
    setState({ isLoading: true, error: null })

    try {
      await updatePassword(values)
      setState({ isLoading: false, error: null })
    } catch (error) {
      setState({ isLoading: false, error })
      throw error
    }
  }

  return [handleUpdatePassword, { ...state }]
}
```

Following that, create the update password screen within the update password feature directory `touch src/features/update-password/screens/UpdatePasswordScreen.js`. The update password screen will render the `<UpdatePasswordForm/>` ([full source code](https://github.com/diegocasmo/expo-firebase-authentication/blob/main/src/features/reset-password/components/UpdatePasswordForm.js)) and use the `useUpdatePassword()` hook to set the new user password, and if successful, redirect to the top of the navigation stack (home screen).

``` jsx
export const UpdatePasswordScreen = ({ navigation }) => {
  const [updatePassword, { isLoading, error }] = useUpdatePassword()

  const handleUpdatePassword = async (values) => {
    try {
      await updatePassword(values)
      navigation.popToTop()
    } catch (err) {
      console.error(err.message)
    }
  }

  return (
    <Center flex={1}>
      <VStack space={4} alignItems="center" w="90%">
        <ErrorMessage error={error} />
        <UpdatePasswordForm
          onSubmit={handleUpdatePassword}
          isLoading={isLoading}
        />
      </VStack>
    </Center>
  )
}
```

Finally, add the update password screen to the verified app navigator.

``` jsx
export const VerifiedAppNavigator = () => (
  <Stack.Navigator>
    {/* Existing code omitted for brevitiy */}
    <Stack.Screen
      name="UpdatePassword"
      component={UpdatePasswordScreen}
      options={{ title: 'Update Password' }}
    />
  </Stack.Navigator>
)
```

And that's it! Once re-authenticated, users of the application can now update their password.

## Conclusion

This was the last part of a series of blog posts covering how to setup email and password based authentication with Expo and Firebase. The developed app supports sign up, sign in, sign out, email verification, forgot password, and update password. If you have any questions, feel free to post a question or comment down below, or simply open up an issue in the project's [GitHub repository](https://github.com/diegocasmo/expo-firebase-authentication); I'll be happy to help with any concerns 🙂.
