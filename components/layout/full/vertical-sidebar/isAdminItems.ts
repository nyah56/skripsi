import {
  BroadcastIcon,
  LayoutDashboardIcon,
  LoginIcon,
} from 'vue-tabler-icons';
import { onAuthStateChanged, getAuth } from 'firebase/auth';
// import { auth as AuthHelper } from '@/helper';
const auth = getAuth();
export const isAdminNav = (data: any) => {
  onAuthStateChanged(auth, (user) => {
    if (user?.uid === 'UDGC1mLrdQN9tZT4TUSZLBJazK32') {
      //iterasi dari collection for role
      //collection role ada rolenya
      data.push(
        { header: 'Admin' },
        {
          title: 'BTS',
          icon: BroadcastIcon,
          to: '/bts/',
        },
        {
          title: 'User',
          icon: BroadcastIcon,
          to: '/user/',
        }
        // Add other admin items as needed
      );
    } else {
      const adminSectionIndex = data.findIndex(
        (item: any) => item.header === 'Admin'
      );
      if (adminSectionIndex !== -1) {
        data.splice(adminSectionIndex, 3); // Assuming 2 items (header and BTS) for simplicity
      }
    }
  });
};
