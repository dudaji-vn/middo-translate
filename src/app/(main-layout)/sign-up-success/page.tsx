"use client";

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { ROUTE_NAMES } from '@/configs/route-name';
import { resendEmailService } from '@/services/authService';
import { PageLoading } from '@/components/feedback';
import { Button } from '@/components/form/Button';
import Image from 'next/image';
import { toast } from '@/components/toast';

export default function SignUpSuccess() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isResend, setIsResend] = useState(false);
  const [loading, setLoading] = useState(false);
  const [time, setTime] = useState(30);
  const timerRef = useRef<any>();
  
  useEffect(() => {
    if (time > 0) {
      timerRef.current = setInterval(() => {
        setTime((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      clearInterval(timerRef.current);
    };
  }, [isResend, time]);

  useEffect(() => {
    let emailLocalstorage = localStorage.getItem("email_register") || '';
    if (!emailLocalstorage) {
      router.push(ROUTE_NAMES.SIGN_UP);
    }
    setEmail(emailLocalstorage);
    localStorage.removeItem("email_register");
  }, [router]);

  const resendEmail = async () => {
    try {
      setLoading(true);
      setIsResend(true);
      const data = await resendEmailService(email);
      toast({ title: "Email sended!", description: "Please re-check your email!" });
    } catch (err: any) {
      toast({ title: "Re-send email fail!", description: err?.response?.data?.message });
    } finally {
      setLoading(false);
    }
  }

  return (  
    <div className="flex h-screen flex-col items-center bg-background bg-cover bg-center bg-no-repeat md:!bg-[url('/bg_auth.png')]">
      { loading && <PageLoading /> }
      <div className='bg-background px-[5vw] py-8 md:mt-10 md:w-[500px] md:rounded-3xl md:px-6 md:shadow-2 w-full'>
        <div className='mx-auto w-[223px]'>
          <Image
            src="/sended_email.svg"
            alt="Verify your email address"
            width={500}
            height={500}
          ></Image>
        </div>
        <p className='text-primary text-center mt-8 text-[22px] font-medium'>Verify your email address</p>
        <p className='text-center mt-5'>An link has been sent to <strong>{email}</strong> since you used it as your sign in method. <br /><br /> Please verify this email address to complete your Middo account registration.</p>
        <Button onClick={resendEmail} disabled={isResend || time > 0}>
        Re-send {time > 0 ? `in ${time}s` : ''}
        </Button>
        <div className="mt-8 flex justify-center">
            <Link href={ROUTE_NAMES.SIGN_IN} className="active:text-primary md:hover:font-medium mx-auto inline-block w-fit-content">Cancel</Link>
          </div>
      </div>
    </div>
  );
}
