import React, { useEffect, useRef, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import GoogleLogin, {
  GoogleLoginResponse,
  GoogleLoginResponseOffline,
} from 'react-google-login';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';

// styled-components
import {
  SignInContainer,
  SidebarSection,
  SignInSection,
  SidebarContainer,
  SignInFormContainer,
  SocialLoginContainer,
  GoogleLoginButton,
  DividerContainer,
  FacebookLoginButton,
} from '../styles/authStyles/signInPage-styles';

// lottie
import Lottie from 'react-lottie';
import animationData from '../lotties/PRODUCT/Animation 07/drawkit-grape-animation-7-LOOP.json';
import ValidationNotifier from '../components/authPage/ValidationNotifier';
import { useDispatch, useSelector } from 'react-redux';
import {
  facebookLogin,
  FacebookLoginResponse,
  getSignInState,
  googleLogin,
  signInThunk,
} from '../features/auth/authSlice';

// redux
import { connectSocket } from '../socket/socket';
import { SignInState } from '../features/auth/authTypes';

const SignInPage = (): JSX.Element => {
  const dispatch = useDispatch();
  const history = useHistory();
  const currentSignInState = useSelector(getSignInState);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [emailValidation, setEmailValidation] = useState<boolean>(true);
  const [passwordValidation, setPasswordValidation] = useState<boolean>(true);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };
  const validateForm = (email: string, password: string) => {
    const emailRegex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
    const isValidEmail = emailRegex.test(email);
    const isValidPassword = password.trim().length >= 6;
    setEmailValidation(isValidEmail);
    setPasswordValidation(isValidPassword);
    return isValidEmail && isValidPassword;
  };
  const requestSignIn = () => {
    const isValid = validateForm(email, password);
    if (isValid) {
      dispatch(signInThunk({ email, password }));
    }
  };
  const handleEnterKeyPress = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === 'Enter') {
      requestSignIn();
    }
  };
  useEffect(() => {
    const changePage = async () => {
      if (currentSignInState.state === SignInState.SUCCESS) {
        await connectSocket(email);
        history.push('/chat');
      }
    };
    changePage();
  }, [currentSignInState.state]);
  const onGoogleLoginSuccess = (
    result: GoogleLoginResponse | GoogleLoginResponseOffline
  ) => {
    console.log(result);
    if ('profileObj' in result) {
      setEmail(result.profileObj.email);
      dispatch(googleLogin(result as GoogleLoginResponse));
    }
  };

  const onFacebookLogin = (result: FacebookLoginResponse) => {
    console.log(result);
    if ('email' in result && 'name' in result) {
      setEmail(result.email);
      dispatch(
        facebookLogin({
          email: result.email,
          name: result.name,
        })
      );
    }
  };
  return (
    <SignInContainer onKeyPress={handleEnterKeyPress}>
      <SidebarSection>
        <SidebarContainer>
          <div className="sidebar__home">
            <Link to="/">TALKI</Link>
          </div>
          <div className="sidebar__title">
            <h1>
              Start a variety of conversations through chat apps, from simple
              tasks to meetings for collaboration.
            </h1>
          </div>
          <Lottie
            options={defaultOptions}
            height="60%"
            isClickToPauseDisabled={true}
          />
        </SidebarContainer>
      </SidebarSection>

      <SignInSection>
        <nav className="signin__nav">
          not a member?{' '}
          <Link to="/sign-up">
            <span>Sign up now</span>
          </Link>
        </nav>
        <SignInFormContainer>
          <div className="signin__form">
            <h1>Sign in to Chat App</h1>
            <SocialLoginContainer>
              <GoogleLogin
                clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID || ''}
                render={props => {
                  // eslint-disable-next-line react/prop-types
                  const { onClick } = props;
                  return (
                    <GoogleLoginButton onClick={onClick}>
                      <i className="fab fa-google"></i>
                    </GoogleLoginButton>
                  );
                }}
                onSuccess={onGoogleLoginSuccess}
                onFailure={message => console.error(message)}
                cookiePolicy={'single_host_origin'}
              />
              <FacebookLogin
                appId={process.env.REACT_APP_FACEBOOK_APP_ID}
                autoLoad={false}
                fields="name,email,picture"
                callback={onFacebookLogin}
                render={(props: { onClick: () => void }) => (
                  // eslint-disable-next-line react/prop-types
                  <FacebookLoginButton onClick={props.onClick}>
                    <i className="fab fa-facebook-f"></i>
                  </FacebookLoginButton>
                )}
              />
            </SocialLoginContainer>
            <DividerContainer>
              <div className="divider" />
              <div className="orBox">
                <h3>Or</h3>
              </div>
            </DividerContainer>
            <label htmlFor="email">Email</label>
            <input
              type="text"
              id="email"
              ref={emailRef}
              onChange={e => setEmail(e.target.value)}
            ></input>
            {currentSignInState.state === SignInState.EMAIL_INVALID ? (
              <ValidationNotifier
                message={currentSignInState.message}
                isShown={true}
              />
            ) : (
              <ValidationNotifier
                message="please enter valid e-mail address."
                isShown={!emailValidation}
              />
            )}
            <label htmlFor="password">Password</label>
            <input
              type="password"
              ref={passwordRef}
              onChange={e => setPassword(e.target.value)}
            ></input>
            {currentSignInState.state === SignInState.PASSWORD_INVALID ? (
              <ValidationNotifier
                message={currentSignInState.message}
                isShown={true}
              />
            ) : (
              <ValidationNotifier
                message="Password must be at least 6 characters."
                isShown={!passwordValidation}
              />
            )}
            <button type="button" id="submit" onClick={requestSignIn}>
              Sign In
            </button>
          </div>
        </SignInFormContainer>
      </SignInSection>
    </SignInContainer>
  );
};

export default SignInPage;
