'use client';

import { useEffect, useState } from 'react';

import { AlertError } from '@/components/alert/alert-error';
import { Button } from '@/components/form/button';
import { GoogleIcon } from '@/components/icons';
import Image from 'next/image';
import { InputField } from '@/components/form/Input-field';
import Link from 'next/link';
import { Button as MyButton } from '@/components/actions/button';
import { PageLoading } from '@/components/loading/page-loading';
import { ROUTE_NAMES } from '@/configs/route-name';
import { getCookieService, loginService, saveCookieService } from '@/services/auth.service';
import { LoginSchema as schema } from '@/configs/yup-form';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/stores/auth.store';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { yupResolver } from '@hookform/resolvers/yup';
import { useElectron } from '@/hooks/use-electron';
import { ELECTRON_EVENTS } from '@/configs/electron-events';
import trim from 'lodash/trim';
interface DataResponseToken {
  token: string;
  refresh_token: string;
}
interface SignInProps {
  searchParams: {
    type?: string;
    token?: string;
    refresh_token?: string;
  };
}

export default function SignIn(props: SignInProps) {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();
  const {isElectron, ipcRenderer} = useElectron();
  const { type, token, refresh_token } = props.searchParams;
  const {
    register,
    watch,
    reset,
    trigger,
    formState: { errors, isValid },
  } = useForm({
    mode: 'onBlur',
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: yupResolver(schema),
  });

  const {
    isAuthentication,
    setData: setDataAuth,
    user: userData,
  } = useAuthStore();

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    trigger();

    if (!isValid) return;
    try {
      setLoading(true);
      const formData = {
        email: trim(watch('email').toLocaleLowerCase()),
        password: watch('password'),
      }
      const data = await loginService(formData);
      const { user } = data?.data;
      setDataAuth({ user, isAuthentication: true });
      toast.success('Login success!');
      setErrorMessage('');
    } catch (err: any) {
      setErrorMessage('Invalid email or password')
    } finally {
      setLoading(false);
      // reset();
    }
  };

  const handleLoginGoogle = async () => {
    ipcRenderer.send(ELECTRON_EVENTS.GOOGLE_LOGIN);
  }

  useEffect(()=>{
    if(type == "desktop" && !isAuthentication) {
      localStorage.setItem('type', type);
      router.push('/api/auth/google');
    } else {
      localStorage.removeItem('type');
    }
  }, [isAuthentication, router, type])

  useEffect(() => {
    if(token && refresh_token) {
      window.location.href = `middo://token?token=${token}&refresh_token=${refresh_token}`
    }
  }, [token, refresh_token]);

  useEffect(() => {
    if (isElectron && ipcRenderer) {
      ipcRenderer.on(ELECTRON_EVENTS.GOOGLE_LOGIN_SUCCESS, (data: DataResponseToken)=>{
        const { token, refresh_token } = data
        saveCookieService({token, refresh_token})
        .then(_=> {
          window.location.reload();
        })
        .catch(err=>console.log(err))
      })
    }
  }, [ipcRenderer, isElectron]);

  useEffect(() => {
    if (isAuthentication) {
      if (!userData?.avatar && !userData?.name && !userData?.language) {
        router.push(ROUTE_NAMES.CREATE_ACCOUNT);
      } else if(isElectron){
        router.push(ROUTE_NAMES.ROOT);
      } else {
        getCookieService()
        .then(res=> {
          const {data} = res;
          const { accessToken , refreshToken} = data;
          if(accessToken && refreshToken) {
            window.location.href = `middo://token?token=${accessToken}&refresh_token=${refreshToken}`
          }
        })
        .catch(err=>console.log(err))
      }
    }
  }, [isAuthentication, isElectron, refresh_token, router, token, userData?.avatar, userData?.language, userData?.name]);

  if (isAuthentication && userData) return null;

  return (
    <div>
      {loading && <PageLoading />}
      <div className="flex flex-col items-center bg-background bg-cover bg-center bg-no-repeat md:!bg-[url('/bg_auth.png')]">
        <div className="w-full bg-background px-[5vw] py-8 md:mt-10 md:w-[500px] md:rounded-3xl md:px-6 md:shadow-2">
          <h4 className="text-center text-[26px] font-bold text-primary">
            Sign in
          </h4>

          <form
            className="flex w-full flex-col items-center"
            onSubmit={handleSubmitForm}
          >
            <InputField
              className="mt-8"
              placeholder="Enter your email"
              register={{ ...register('email') }}
              errors={errors.email}
              type="text"
            />
            <InputField
              className="mt-4"
              placeholder="Enter your password"
              register={{ ...register('password') }}
              errors={errors.password}
              type="password"
            />
            <Link
              className="color-[#333] ml-auto mt-3 inline-block italic hover:underline"
              href={ROUTE_NAMES.FORGOT_PASSWORD}
            >
              Forgot password?
            </Link>
            <AlertError errorMessage={errorMessage}></AlertError>
            <Button type="submit">Sign in</Button>
          </form>
          <div className="mx-auto my-10 h-[1px] w-[120px] bg-[#ccc]"></div>
          <p className="mb-5 text-center text-[#333]">Not have account yet?</p>
          <div className="mb-10 flex justify-center">
            <Link
              className="hover:after:opacity-1 relative font-medium text-primary after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1px] after:bg-primary after:opacity-0 after:content-['']"
              href={ROUTE_NAMES.SIGN_UP}
            >
              Sign up here
            </Link>
          </div>
          <div className="flex items-center justify-center gap-5">
            <p>Or log in with</p>
            {isElectron ? (
              <MyButton.Icon color="default" onClick={handleLoginGoogle}>
                <GoogleIcon />
              </MyButton.Icon>
            ) : (
              <Link href="/api/auth/google">
              <MyButton.Icon color="default">
                <GoogleIcon />
              </MyButton.Icon>
            </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}