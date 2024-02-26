'use client';

import { redirect } from 'next/navigation';

export default function SignOut() {
  console.log('sign out');
  redirect('/');
}
