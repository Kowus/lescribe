import lazyLoading from './lazyLoading';

export default {
  name: 'Name',
  path: '/new',
  component: lazyLoading('dashboard/New'),
  meta: {
    title: 'new.title',
    iconClass: 'vuestic-icon vuestic-icon-plus',
    auth: true
  }
};
