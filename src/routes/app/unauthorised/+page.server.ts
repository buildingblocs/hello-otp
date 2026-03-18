import { error, redirect } from '@sveltejs/kit';
import checkAuth from '$lib/checkAuth.js';

export async function load({ platform, request, locals }) {
  const isAuth = await checkAuth(platform, request)
  if (!isAuth) error(400, "Not authorised")
  if (isAuth.authorised) {
    redirect(307, "/app")
  }
  return {
    email: locals.session.user.email
  };
}
