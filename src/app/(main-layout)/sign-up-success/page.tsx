"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/auth';
import { ROUTE_NAMES } from '@/configs/route-name';
import { useRouter } from 'next/navigation';
import { resendEmailService } from '@/services/authService';
import { toast } from '@/components/toast';

interface SignUpSuccessProps {
}

export default function SignUpSuccess(props: SignUpSuccessProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isResend, setIsResend] = useState(false);

  useEffect(() => {
    let emailLocalstorage = localStorage.getItem("email_register") || '';
    if (!emailLocalstorage) {
      router.push(ROUTE_NAMES.SIGN_UP);
    }
    setEmail(emailLocalstorage);
    localStorage.removeItem("email_register");
  }, []);

  const resendEmail = async () => {
    try {
      setIsResend(true);
      const data = await resendEmailService(email);
      toast({
        title: 'Infomation',
        description: data.data.message,
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Something went wrong! Please try again later.',
      })
    }
  }


  return (  
    <div>
      <div className='px-5 w-full md:max-w-[500px] mx-auto py-8'>
        <div className='mx-auto'>
          <img className='mx-auto' src="/sended_email.svg" alt="Verify your email address" />
        </div>
        <p className='text-primary text-center mt-8 text-[22px] font-medium'>Verify your email address</p>
        <p className='text-center mt-5'>An link has been sent to <strong>{email}</strong> since you used it as your sign in method. <br /><br /> Please verify this email address to complete your Middo account registration.</p>

        <button
          onClick={resendEmail}
          className={`mx-auto mt-10 flex w-full items-center justify-center rounded-full border border-transparent bg-primary px-8 py-4 font-semibold text-background active:!border-transparent active:!bg-shading active:!text-background md:max-w-[320px] md:hover:border md:hover:border-primary md:hover:bg-background md:hover:text-primary ${isResend && '!bg-slate-400 pointer-events-none'}`}
          disabled={isResend}
        >
          Re-send
        </button>
        <div className="mt-8 flex justify-center">
            <Link
              href={ROUTE_NAMES.SIGN_IN}
              className="active:text-primary md:hover:font-medium mx-auto inline-block w-fit-content"
            >Cancel</Link>
          </div>
      </div>
    </div>
  );
}
