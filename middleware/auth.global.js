import { onAuthStateChanged } from 'firebase/auth';

export default defineNuxtRouteMiddleware((to, from) => {
  const auth = useNuxtApp().$auth;

  // console.log(auth);
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      return navigateTo('/');
    }
    // console.log(user);
    return navigateTo('/dashboard');
  });
});
