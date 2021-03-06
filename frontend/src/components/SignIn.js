import React, { useState } from 'react'
import useInput from '../lib/useInput'
import Button from './elements/Button'
import { Form, Fieldset, Label, Input } from './elements/Form'
import { useUser } from './User'
import { SignUpForm } from './SignUp'
import Layout from './Layout'
import ErrorHandler from './ErrorHandler'

function SignInForm(props) {
  const { signIn } = useUser()
  const [email, onChangeEmail] = useInput('')
  const [password, onChangePassword] = useInput('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)

  return (
    <Form
      onSubmit={async event => {
        event.preventDefault()
        setBusy(true)
        setError(null)
        try {
          await signIn({ email, password })
        } catch (error) {
          setError(error)
        } finally {
          setBusy(false)
        }
      }}
    >
      <ErrorHandler error={error} />
      <Fieldset disabled={busy}>
        <Label htmlFor="signInEmail">
          Email
          <Input
            value={email}
            onChange={onChangeEmail}
            id="signInEmail"
            name="signInEmail"
            type="email"
            required
          />
        </Label>
        <Label htmlFor="signInPassword">
          Password
          <Input
            value={password}
            onChange={onChangePassword}
            id="signInPassword"
            name="signInPassword"
            type="password"
            required
          />
        </Label>
        <Button>Sign{busy && 'ing'} in</Button>
      </Fieldset>
    </Form>
  )
}

function SignIn() {
  return (
    <Layout>
      <section>
        <div>
          <h2>Sign in</h2>
          <SignInForm />
        </div>

        <div>
          <h2>Sign Up</h2>
          <SignUpForm />
        </div>
      </section>
    </Layout>
  )
}

export default SignIn
