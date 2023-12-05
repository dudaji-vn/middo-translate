"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { ROUTE_NAMES } from '@/configs/route-name';
import { resendEmailService } from '@/services/authService';
import { toast } from '@/components/toast';
import { PageLoading } from '@/components/feedback';
import { Button } from '@/components/form/Button';

export default function SignUpSuccess() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isResend, setIsResend] = useState(false);
  const [loading, setLoading] = useState(false);

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
      setLoading(true);
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
    } finally {
      setLoading(false);
    }
  }


  return (  
    <div>
      { loading && <PageLoading /> }
      <div className='px-5 w-full md:max-w-[500px] mx-auto py-8'>
        <div className='mx-auto'>
          <img className='mx-auto' src="/sended_email.svg" alt="Verify your email address" />
        </div>
        <p className='text-primary text-center mt-8 text-[22px] font-medium'>Verify your email address</p>
        <p className='text-center mt-5'>An link has been sent to <strong>{email}</strong> since you used it as your sign in method. <br /><br /> Please verify this email address to complete your Middo account registration.</p>
        <Button onClick={resendEmail} disabled={isResend}>Re-send</Button>
        <div className="mt-8 flex justify-center">
            <Link href={ROUTE_NAMES.SIGN_IN} className="active:text-primary md:hover:font-medium mx-auto inline-block w-fit-content">Cancel</Link>
          </div>
      </div>
    </div>
  );
}
