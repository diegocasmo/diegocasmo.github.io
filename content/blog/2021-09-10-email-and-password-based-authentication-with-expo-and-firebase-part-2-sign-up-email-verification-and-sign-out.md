---
layout: post
title: Email and Password Based Authentication with Expo and Firebase Part 2 - Sign up, Email Verification, and Sign Out
date: 2021-09-10
---

- This is part 2/3 of a series of blog posts that showcase email and password based authentication using Expo and Firebase.
    - [Part 1: Project Setup](https://diegocasmo.github.io/2021-08-29-email-and-password-based-authentication-with-expo-and-firebase-part-1-project-setup/)
    - Part 2: Sign Up, Email Verification, and Sign Out (you are here)
    - [Part 3: Sign In, Forgot Password, and Update Password](https://dev.to/diegocasmo/email-and-password-based-authentication-with-expo-and-firebase-part-3-sign-in-forgot-password-and-update-password-2agj)

The [previous part](https://dev.to/diegocasmo/email-and-password-based-authentication-with-expo-and-firebase-part-1-project-setup-3nno) of this series, covered how to setup Expo and Firebase, with the aim of creating an authentication flow. That being done, it's time to start implementing the authentication features. In this blog post, I'll cover how to create the sign up, email verification, and sign out features.

## Navigation

The app navigation will be configured based on the current user authentication status. This means there's going to be a guest, unverified, and verified navigator. Let's start with the guest navigator, which will render when a user hasn't been authenticated.

First, create the `App.js` file by running `touch src/App.js` and update `src/Root.js` so that it renders it.

``` jsx
const Root = () => (
  <NativeBaseProvider>
    <App /> {/* Render the <App/> component */}
    <StatusBar style="auto" />
  </NativeBaseProvider>
)
```

Before creating the guest navigator, there are a few `react-navigation` dependencies that need to be installed. Run the following commands to set these up, and make sure `Root.js` is wrapped by the `<NavigationContainer/>` component.

``` bash
npm install @react-navigation/stack
expo install react-native-gesture-handler
```

Next, add the guest navigator by first creating a new directory `mkdir src/navigation` , and the guest navigator component  `touch src/navigation/GuestAppNavigator.js`. The guest navigator is a stack navigator, and for now, it will only render the guest welcome screen.

``` jsx
export const GuestAppNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="GuestWelcome"
      component={GuestWelcomeScreen}
      options={{ title: 'Welcome' }}
    />
  </Stack.Navigator>
)
```

Finally, create the guest welcome screen component by running `mkdir -p src/features/guest-welcome/screens` and `touch src/features/guest-welcome/screens/GuestWelcomeScreen.js`. The guest welcome screen will render a button to sign in, and another one to sign up. These buttons will navigate users to the appropriate stack screen.

``` jsx
export const GuestWelcomeScreen = ({ navigation }) => {
  const handlePressOnSignIn = () => {
    navigation.navigate('SignIn')
  }

  const handlePressOnSignUp = () => {
    navigation.navigate('SignUp')
  }

  return (
    <Center flex={1}>
      <VStack space={4} alignItems="center">
        <Center>
          <Button onPress={handlePressOnSignIn}>Sign in</Button>
        </Center>
        <Center>
          <Button onPress={handlePressOnSignUp}>Create account</Button>
        </Center>
      </VStack>
    </Center>
  )
}
```

## Sign Up

The sign up feature allows a user to create an account by entering an email and a password. To do so, let's first start by creating a form which will ask the user for their email, password, and a password confirmation. The password confirmation is optional, since the same form will be used later on to create the "Sign In" flow, in which case it isn't needed.

To being with, create the `/components` directory by running `mkdir -p src/components` and the email and password form `touch src/components/EmailAndPasswordForm.js`. The full code for the `<EmailAndPasswordForm/>` component can be found in the [Github repository](https://github.com/diegocasmo/expo-firebase-authentication/blob/main/src/components/EmailAndPasswordForm.js), but I'll highlight some of the important bits here.

The email and password form component uses [Formik](https://formik.org/) and [Yup](https://github.com/jquense/yup). The component validates the presence of a valid email and a password input. The password must be at least 6 characters, and if the option for password confirmation is enabled, then both the `password` and `passwordConfirmation` inputs must match.

``` jsx
const buildValidationSchema = (withPasswordConfirmation) =>
  Yup.object({
    email: Yup.string().email().required(),
    password: Yup.string().required().min(6),
    // Optionally require password confirmation
    ...(withPasswordConfirmation && {
      passwordConfirmation: Yup.string()
        .oneOf([Yup.ref('password'), null])
        .required(),
    }),
  })
```

Next, let's create the sign up screen, which will render the form. Create a new directory for the sign up feature `mkdir -p src/features/sign-up/screens` and the screen component `touch src/features/sign-up/screens/SignUpScreen.js`. Momentarily, use placeholders for the `onSubmit` and `isLoading` form props.

``` jsx
export const SignUpScreen = () => {
  return (
    <Center flex={1}>
      <VStack space={4} alignItems="center" w="90%">
        <EmailAndPasswordForm
          onSubmit={() => {}}
          isLoading={false}
          withPasswordConfirmation={true}
        />
      </VStack>
    </Center>
  )
}
```

Now that the sign up screen has been defined, it can be added to the guest navigator stack.

``` jsx
export const GuestAppNavigator = () => (
  <Stack.Navigator>
    {/* Guest welcome screen omitted for brevity */}
    <Stack.Screen
      name="SignUp"
      component={SignUpScreen}
      options={{ title: 'Create Account' }}
    />
  </Stack.Navigator>
)
```

It's now time to interact with Firebase and start defining the authentication API. First, create a user API file by running `touch src/api/user.js`, and define the `signUp` method. This file will encapsulate all the required user authentication methods, so that components don't directly interact with Firebase.

``` jsx
export const signUp = async ({ email = '', password = '' }) => {
  return firebase.auth().createUserWithEmailAndPassword(email, password)
}
```

Next, let's create a hook within the sign up feature that exposes the sign up functionality. Create a `/hooks` directory within the sign up feature `mkdir src/features/sign-up/hooks` and the `useSignUp()` hook  `touch src/features/sign-up/hooks/use-sign-up.js`. This hook encapsulates access to the user API, and exposes the `isLoading` and `error` states.

``` jsx
export const useSignUp = () => {
  const [state, setState] = useState({
    isLoading: false,
    error: null,
  })

  const handleSignUp = async (values) => {
    setState({ isLoading: true, error: null })

    try {
      await signUp(values)
      setState({ isLoading: false, error: null })
    } catch (error) {
      setState({ isLoading: false, error })
    }
  }

  return [handleSignUp, { ...state }]
}
```

Finally, use the `useSignUp()` hook in the sign up screen by passing the `signUp` method to the form `onSubmit` prop, as well as `isLoading`.

``` jsx
export const SignUpScreen = () => {
  const [signUp, { isLoading, error }] = useSignUp()

  return (
    <Center flex={1}>
      <VStack space={4} alignItems="center" w="90%">
        {error && (
          <Alert status="error">
            <Alert.Icon />
            <Alert.Title>{error.message}</Alert.Title>
          </Alert>
        )}
        <EmailAndPasswordForm
          onSubmit={signUp}
          isLoading={isLoading}
          withPasswordConfirmation={true}
        />
      </VStack>
    </Center>
  )
}
```

By now, you should be able to access the application, navigate to the sign up screen, create a valid account, and verify in Firebase the account was created. To verify the user account was created, navigate to the Firebase console, click on the "Authentication" menu item, and confirm the user account is shown in the table.

## Email Verification

Once a user account has been created, users will be shown another screen where they will be asked to verify their email. To keep track of the current user authentication status, let's create a user context. To do so, we'll use Firebase's [onAuthStateChanged()](https://firebase.google.com/docs/reference/js/v8/firebase.auth.Auth#onauthstatechanged) method.

In the user API, define the `onAuthStateChanged()` method:

``` jsx
export const onAuthStateChanged = (args) =>
  firebase.auth().onAuthStateChanged(args)
```

Next, create a context directory by running `mkdir src/context` and the user context file `touch src/context/UserContext.js`. The user's context will use the `onAuthStateChanged()` listener to update its internal state, and set/unset the Firebase user accordingly. Additionally, it will define a helper method which allows to "reload" the current user.

``` jsx
export const UserContextProvider = ({
  children,
  initialState = { user: null, isLoading: true, error: null },
}) => {
  const [state, setState] = useState(initialState)

  // Listen to Firebase authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged((user) => {
      setState({ user, isLoading: false, error: null })
    })

    return () => {
      unsubscribe()
    }
  }, [])

  const handleReload = async () => {
    try {
      await reload()
      const user = getUser()
      setState({ user, isLoading: false, error: null })
    } catch (error) {
      setState({ user: null, isLoading: false, error })
    }
  }

  const value = {
    ...state,
    reload: handleReload,
  }

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}
```

Finally, make sure the `<Root/>` component is wrapped by `<UserContextProvider/>`, and use the context in the `<App/>` component, where the guest or unverified navigators can be conditionally rendered depending on the authentication status.

``` jsx
export const App = () => {
  const { user, isLoading } = useUserContext()

  if (isLoading)
    return (
      <Center flex={1} accessibilityLabel="Loading user profile...">
        <Spinner />
      </Center>
    )

  if (user) return <UnverifiedAppNavigator />

  return <GuestAppNavigator />
}
```

The unverified navigator is shown to users who are authenticated, but haven't verified their email yet. To create it, run `touch src/navigation/UnverifiedAppNavigator.js` and define a new screen called "verify email" screen.

``` jsx
export const UnverifiedAppNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="VerifyEmail"
      component={VerifyEmailScreen}
      options={{ title: 'Verify Email' }}
    />
  </Stack.Navigator>
)
```

The "verify email" screen will allow users to perform three actions:

1. Done: reload the current user (this is needed to update the current user and confirm if their email has been verified or not).
2. Resend: send the verification email again.
3. Cancel: sign out the current user.

Each of these actions requires a new method to be defined in the user API:

``` jsx
export const reload = () => firebase.auth().currentUser.reload()

export const sendVerification = () =>
  firebase.auth().currentUser.sendEmailVerification()

export const signOut = () => firebase.auth().signOut()
```

Once the API methods have been defined, create a folder for the feature by running `mkdir -p src/features/email-verification/screens` and the "verify email" screen `verification/screens/VerifyEmailScreen.js`.

Except for the "Done" action in the "verify email" screen, all will follow a similar pattern: a hook will be created for it, the hook will call a method in the user API, and expose the state and result to consumers. For brevity, I'll only explain how the "Resend" action works. The remaining actions (i.e., "Done" — [useUserContext()](https://github.com/diegocasmo/expo-firebase-authentication/blob/main/src/context/UserContext.js), and "Cancel" — [useSignOut()](https://github.com/diegocasmo/expo-firebase-authentication/blob/main/src/hooks/use-sign-out.js)) are available in the Github repository.

Start by creating a `/hooks` directory `mkdir -p src/features/email-verification/hooks` and the `useSendVerification()` hook `touch src/features/email-verification/hooks/use-send-verification.js`. The `useSendVerification()` hook sends the verification email again using the corresponding user API method.

``` jsx
export const useSendVerification = () => {
  const [state, setState] = useState({
    isLoading: false,
    error: null,
  })

  const handleSendVerification = async () => {
    setState({ isLoading: true, error: null })

    try {
      await sendVerification()
      setState({ isLoading: false, error: null })
    } catch (error) {
      setState({ isLoading: false, error })
    }
  }

  return [handleSendVerification, { ...state }]
}
```

Next, use the hook in the "verify email" screen, so that the email is sent again when the "Resend" button is pressed.

``` jsx
export const VerifyEmailScreen = () => {
  const [sendVerification, { isLoading }] = useReloadUser()

  return (
    <Center flex={1}>
      <VStack space={4} alignItems="center" w="90%">
        <Heading>Check your email</Heading>
        <Text>
          We sent you an email with instructions on how to verify your email
          address. Click on the link in the email to get started.
        </Text>
        {/* Other buttons omitted for brevity */}
        <Button onPress={sendVerification} isLoading={isLoading}>
          Resend
        </Button>
      </VStack>
    </Center>
  )
}
```

And that's it! When a user verifies their email, they can click on "Done", which will update their authentication state. Alternatively, the user can click on "Resend" to send the verification email again, or "Cancel" to sign out.

## Sign Out

Now that users can create an account and verify their email, it's time to create the verified navigator.

Start by updating the `<App/>` component so that it renders the verified navigator when a user is authenticated and verified.

``` jsx
export const App = () => {
  const { user, isLoading } = useUserContext()

  if (isLoading)
    return (
      <Center flex={1} accessibilityLabel="Loading user profile...">
        <Spinner />
      </Center>
    )

  // User is authenticated and verified
  if (user && user.emailVerified) return <VerifiedAppNavigator />

  // User is authenticated, but their email hasn't been verified
  if (user) return <UnverifiedAppNavigator />

  return <GuestAppNavigator />
}
```

Next, create the verified navigator by running `touch src/navigation/VerifiedAppNavigator.js`, and add the home screen to it.

``` jsx
export const VerifiedAppNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="Home"
      component={HomeScreen}
      options={{ title: 'Home' }}
    />
  </Stack.Navigator>
)
```

Finally, create the home screen by running `mkdir -p src/features/home/screens` and `touch src/features/home/screens/HomeScreen.js`. For simplicity, the home screen only renders a welcome message, and allows users to sign out. Notice the sign out functionality uses the [useSignOut()](https://github.com/diegocasmo/expo-firebase-authentication/blob/main/src/hooks/use-sign-out.js) hook, just like the "verify email" screen does.

``` jsx
export const HomeScreen = () => {
  const { user } = useUserContext()
  const [signOut, { isLoading }] = useSignOut()

  return (
    <Center flex={1}>
      <VStack space={4} alignItems="center" w="90%">
        <Heading>Hello, {user.email}.</Heading>
        <Button onPress={signOut} isLoading={isLoading}>
          Sign out
        </Button>
      </VStack>
    </Center>
  )
}
```

## Conclusion

It's a wrap, folks! We've covered quite some ground, and by now the app allows users to sign up, verify their email, and sign out. As always, remember to checkout the [Github repository](https://github.com/diegocasmo/expo-firebase-authentication), where all the code is available. In the next and last part of the series, we'll finish up by implementing sign in, forgot password, and the update password features.
