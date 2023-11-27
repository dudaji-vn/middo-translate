'use client';

import { forwardRef } from 'react';

export interface SignUpFormProps
  extends React.FormHTMLAttributes<HTMLFormElement> {}

export const SignUpForm = forwardRef<HTMLFormElement, SignUpFormProps>(
  (props, ref) => {
    return (
      <form ref={ref} {...props} className="mx-auto flex w-1/3 flex-col">
        <input type="text" required placeholder="Full name" name="fullName" />
        <input type="email" required placeholder="Email" name="email" />
        <input
          type="password"
          required
          placeholder="Password"
          name="password"
        />
        <input
          type="password"
          required
          placeholder="Confirm password"
          name="passwordConfirmation"
        />
        <button className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700">
          Sign up
        </button>
      </form>
    );
  },
);
SignUpForm.displayName = 'SignUpForm';
