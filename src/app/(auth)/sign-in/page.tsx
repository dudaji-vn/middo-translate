interface LoginProps {}
export default async function SignUp(props: LoginProps) {
  return (
    <main className="relative mt-10 flex h-full w-full flex-col justify-center">
      Sign sin
      <input type="" placeholder="Full name" />
      <input type="email" placeholder="Email" />
      <input type="password" placeholder="Password" />
      <input type="password" placeholder="Confirm password" />
      <button className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700">
        Sign up
      </button>
    </main>
  );
}
