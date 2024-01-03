'use client';

import { useEffect, useState } from 'react';

import { AlertError } from '@/components/Alert/AlertError';
import { Button } from '@/components/form/Button';
import { GoogleIcon } from '@/components/icons';
import Image from 'next/image';
import { InputField } from '@/components/form/InputField';
import Link from 'next/link';
import { Button as MyButton } from '@/components/actions/button';
import { PageLoading } from '@/components/loading/PageLoading';
import { ROUTE_NAMES } from '@/configs/route-name';
import { loginService } from '@/services/authService';
import { LoginSchema as schema } from '@/configs/yup-form';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/stores/auth';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { yupResolver } from '@hookform/resolvers/yup';

export default function SignIn() {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();
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
      const data = await loginService(watch());
      const { user } = data?.data;
      setDataAuth({ user, isAuthentication: true });
      toast.success('Login success!');
      setErrorMessage('');
    } catch (err: any) {
      setErrorMessage(err?.response?.data?.message);
    } finally {
      setLoading(false);
      // reset();
    }
  };

  useEffect(() => {
    if (isAuthentication) {
      if (!userData?.avatar && !userData?.name && !userData?.language) {
        router.push(ROUTE_NAMES.CREATE_ACCOUNT);
      } else {
        router.push(ROUTE_NAMES.ROOT);
      }
    }
  }, [isAuthentication, router, userData]);

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
            <Link href="/api/auth/google">
              <MyButton.Icon color="default">
                <GoogleIcon />
              </MyButton.Icon>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
