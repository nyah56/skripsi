import { getAuth, onAuthStateChanged } from 'firebase/auth';
const useStateChange = (user: any) => {
  const auth = getAuth();
  onAuthStateChanged(auth, (currentUser) => {
    if (currentUser) {
      user = currentUser;
      const stringifiedAuth = JSON.stringify(auth.currentUser.uid);
      localStorage.setItem('uid', stringifiedAuth);

      // Retrieve the stored auth object

      //   console.log(storedAuthString);
      return;
    }

    // jadikan composable after break
  });
};
export default useStateChange;
