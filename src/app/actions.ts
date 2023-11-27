'use server';
export async function signUpUser(formData: FormData) {
  const response = await fetch('/api/auth/sign-up', {
    method: 'POST',
    body: formData,
  });
  const data = await response.json();
  console.log(data);
  return data;
}
