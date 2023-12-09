import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from 'firebase/auth';
export const signInUser = async (email: any, password: any) => {
  const auth = getAuth();
  const credentials = await signInWithEmailAndPassword(
    auth,
    email,
    password
  ).catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.error(errorMessage);
  });
  return credentials;
};
export const initUser = async () => {
  const auth = getAuth();

  //   firebaseUser.value = auth.currentUser;

  const userCookie = useCookie('userCookie');

  const router = useRouter();

  onAuthStateChanged(auth, (user) => {
    if (user) {
      router.push('/dashboard');
    } else {
      //if signed out

      router.push('/');
    }

    // @ts-ignore
    //   userCookie.value = user; //ignore error because nuxt will serialize to json
  });
};
