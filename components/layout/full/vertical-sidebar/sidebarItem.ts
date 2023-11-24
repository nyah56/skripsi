import {
  BroadcastIcon,
  LayoutDashboardIcon,
  LoginIcon,
} from 'vue-tabler-icons';

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
    to: '/',
  },
  {
    title: 'BTS Terdekat',
    icon: BroadcastIcon,
    to: '/maps',
  },
  { header: 'utilities' },
  {
    title: 'BTS',
    icon: BroadcastIcon,
    to: '/bts/',
  },
  // {
  //   title: 'Tambah Data BTS',
  //   icon: BroadcastIcon,
  //   to: '/bts/add',
  // },
  // {
  //   title: 'Shadow',
  //   icon: CopyIcon,
  //   to: '/ui/shadow',
  // },
  { header: 'auth' },
  {
    title: 'Login',
    icon: LoginIcon,
    to: '/auth/login',
  },
  {
    title: 'Register',
    icon: LoginIcon,
    to: '/auth/register',
  },
  // { header: 'Extra' },
  // {
  //   title: 'Icons',
  //   icon: MoodHappyIcon,
  //   to: '/icons',
  // },
];

export default sidebarItem;
