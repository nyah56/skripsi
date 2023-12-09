import { BroadcastIcon, LayoutDashboardIcon } from 'vue-tabler-icons';
import { isAdminNav } from './isAdminItems';
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
isAdminNav(sidebarItem);

export default sidebarItem;
