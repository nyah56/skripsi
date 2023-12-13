import { BroadcastIcon, UserIcon, ClipboardIcon } from 'vue-tabler-icons';
import { onAuthStateChanged, getAuth } from 'firebase/auth';
// import { auth as AuthHelper } from '@/helper';
const auth = getAuth();
export const isAdminNav = (data: any) => {
  const allowedUid = [
    'UDGC1mLrdQN9tZT4TUSZLBJazK32',
    'nqnQJ7knB8f3Nfta2Vf1Ohg8AMD2',
  ];
  onAuthStateChanged(auth, (user) => {
    if (allowedUid.includes(user?.uid)) {
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
          icon: UserIcon,
          to: '/user/',
        },
        {
          title: 'Semua Kegiatan',
          icon: ClipboardIcon,
          to: '/kegiatan/admin',
        }
        // Add other admin items as needed
      );
    } else {
      const adminSectionIndex = data.findIndex(
        (item: any) => item.header === 'Admin'
      );
      if (adminSectionIndex !== -1) {
        data.splice(adminSectionIndex, 4); // Assuming 2 items (header and BTS) for simplicity
      }
    }
  });
};
