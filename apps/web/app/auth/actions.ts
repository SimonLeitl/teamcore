'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

/**
 * Server action to handle user login with email and password
 * 
 * @param formData - Form data containing email and password
 * @returns Error message if login fails, otherwise redirects
 */
export async function login(formData: FormData) {
  const supabase = await createClient();

  // Type-check form data
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    return { error: error.message };
  }

  const redirectTo = formData.get('redirectTo') as string;
  revalidatePath('/', 'layout');
  redirect(redirectTo || '/dashboard');
}

/**
 * Server action to handle user signup with email and password
 * 
 * @param formData - Form data containing email and password
 * @returns Error message if signup fails, otherwise redirects
 */
export async function signup(formData: FormData) {
  const supabase = await createClient();

  // Type-check form data
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  };

  const { error } = await supabase.auth.signUp(data);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/', 'layout');
  redirect('/dashboard');
}

/**
 * Server action to handle user logout
 * 
 * Clears the user's session and redirects to the login page
 */
export async function logout() {
  const supabase = await createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/', 'layout');
  redirect('/auth/login');
}
