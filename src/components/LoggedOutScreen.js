import React from 'react'
import BackgroundGrid from './BackgroundGrid'
import styles from '../styles/app.module.scss'
import { InputGroup, FormControl, Button, Form, Spinner} from 'react-bootstrap'

export default class LoggedOutScreen extends React.PureComponent<{}, {}> {
    state = {
        loginError: undefined,
        isLoading: false,
    }  
    render = () => {
        let { isLoading, loginError } = this.state
        return (
            <>
                <BackgroundGrid />
                <div className={styles.loggedOutContainer}>
                    <Form onSubmit={this.onSignIn} className={styles.loggedOutWrapper}>
                        <img className={styles.logo} src='/findHerLogo.png' alt='Find Her' />
                        <InputGroup className='mb-3'>
                            <InputGroup.Prepend>
                                <InputGroup.Text id='basic-addon1'></InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl
                                id='emailInput'
                                type='text'
                                placeholder='Email'
                                aria-label='Email'
                                aria-describedby='basic-addon1' />
                        </InputGroup>
                        <InputGroup className='mb-3'>
                            <InputGroup.Prepend>
                                <InputGroup.Text id='basic-addon1'></InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl
                                id='passInput'
                                type='password'
                                placeholder='Password'
                                aria-label='Password'
                                aria-describedby='basic-addon1'
                            />
                        </InputGroup>
                        <Button
                            variant='primary'
                            style={{ backgroundColor: 'red', borderColor: 'red', marginTop: 0 }}
                            disabled={isLoading}
                            type='submit'>
                            {isLoading ? <Spinner animation='grow' size='sm' /> : 'SIGN IN'}
                        </Button>
                        {loginError ? <p className={styles.loginError}>Something went wrong...</p> : <p className={styles.loginError} />}
                    </Form>
                </div>
            </>
        )
    }
}