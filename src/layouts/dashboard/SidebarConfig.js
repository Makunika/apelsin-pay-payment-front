// component
import Iconify from '../../components/Iconify';
import {isModerator} from "../../utils/userUtils";

// ----------------------------------------------------------------------

const getIcon = (name) => <Iconify icon={name} width={22} height={22} />;

const sidebarConfig = [
  {
    title: 'Профиль',
    path: '/dashboard/profile',
    icon: getIcon('eva:person-fill'),

  },
  {
    title: 'Счета',
    path: '/dashboard/deposits',
    icon: getIcon('eva:credit-card-fill')
  },
  {
    title: 'Компании',
    path: '/dashboard/companies',
    icon: getIcon('eva:pie-chart-2-fill')
  },
  {
    title: 'Модерация',
    authorities: [isModerator],
    icon: getIcon('eva:briefcase-fill'),
    children: [
      {
        title: 'Пользователи',
        path: '/dashboard/moderate/user'
      },
      {
        title: 'Компании',
        path: '/dashboard/moderate/company'
      },
      {
        title: 'Типы счетов',
        path: '/dashboard/moderate/type'
      },
    ]
  },
];

export default sidebarConfig;
