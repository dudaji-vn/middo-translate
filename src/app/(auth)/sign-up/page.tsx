import { NEXT_PUBLIC_URL } from '@/configs/env.public';
import { SignUpForm } from '@/components/sign-up-form';

interface SignUpPageProps {}

export default async function SignUpPage(props: SignUpPageProps) {
  async function handleSubmit(formData: FormData) {
    'use server';
    try {
      const info = {
        fullName: formData.get('fullName'),
        email: formData.get('email'),
        password: formData.get('password'),
      };
      const response = await fetch(`${NEXT_PUBLIC_URL}/api/auth/sign-up`, {
        method: 'POST',
        body: JSON.stringify(info),
        cache: 'no-cache',
      });
      const data = await response.json();
      console.log(data);
      return data;
    } catch (error) {
      console.error(error);
    }
  }
  return (
    <main className="relative flex h-full w-full flex-col justify-center">
      <h2> Sign up</h2>
      <SignUpForm action={handleSubmit} />
    </main>
  );
}
