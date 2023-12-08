import {
  BroadcastIcon,
  LayoutDashboardIcon,
  LoginIcon,
} from 'vue-tabler-icons';
import { onAuthStateChanged } from 'firebase/auth';
export interface menu {
  header?: string;
  title?: string;
  icon?: any;
  to?: string;
  chip?: string;
  chipColor?: string;
  chipVariant?: string;
  chipIcon?: string;
  children?: menu[];
  disabled?: boolean;
  type?: string;
  subCaption?: string;
}

const sidebarItem: menu[] = [
  { header: 'Home' },
  {
    title: 'Dashboard',
    icon: LayoutDashboardIcon,
    to: '/dashboard',
  },
  {
    title: 'BTS Terdekat',
    icon: BroadcastIcon,
    to: '/maps',
  },
];
const auth = useNuxtApp().$auth;
onAuthStateChanged(auth, (user) => {
  if (user?.uid == 'UDGC1mLrdQN9tZT4TUSZLBJazK32') {
    //iterasi dari collection for role
    //collection role ada rolenya
    sidebarItem.push(
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
  }
});

export default sidebarItem;
