import Vue from 'vue';
import Router from 'vue-router';
import menuModule from 'vuex-store/modules/menu';
import lazyLoading from '../store/modules/menu/lazyLoading';

Vue.use(Router);

const demoRoutes = [];
if (process.env.NODE_ENV === 'development') {
  const VueComponentTree = require('vue-component-tree').default;

  demoRoutes.push(
    VueComponentTree(require.context('./..', true, /.demo.vue$/), '/demo')
  );
}

export default new Router({
  routes: [
    {
      name: 'auth',
      meta: {
        title: 'menu.auth',
        iconClass: 'vuestic-icon vuestic-icon-auth'
      },
      component: lazyLoading('layout/AuthLayout'),
      path: '/auth',
      redirect: '/auth/login',
      children: [
        {
          name: 'Login',
          path: 'login',
          component: lazyLoading('auth/login/Login'),
          meta: {
            default: true,
            title: 'menu.login',
            newWindow: true,
            guest: true
          }
        },
        {
          name: 'Signup',
          path: '/auth/signup',
          component: lazyLoading('auth/signup/Signup'),
          meta: {
            default: false,
            title: 'menu.signUp',
            newWindow: true,
            guest: true
          }
        }
      ]
    },
    {
      name: 'Name',
      path: '/new',
      component: lazyLoading('dashboard/New'),
      meta: {
        title: 'new.title',
        iconClass: 'vuestic-icon vuestic-icon-plus',
        auth: true
      }
    },
    {
      name: 'Project',
      path: '/projects/:project',
      component: lazyLoading('dashboard/Overview'),
      meta: {
        title: 'Project',
        auth: true
      }
    },
    ...demoRoutes,
    ...generateRoutesFromMenu(menuModule.state.items),
    {
      path: '*',
      redirect: { name: getDefaultRoute(menuModule.state.items).name }
    }
  ]
});

function generateRoutesFromMenu(menu = [], routes = []) {
  for (let i = 0, l = menu.length; i < l; i++) {
    let item = menu[i];
    if (item.path) {
      routes.push(item);
    }
    if (item.children) {
      generateRoutesFromMenu(item.children, routes);
    }
  }
  return routes;
}

function getDefaultRoute(menu = []) {
  let defaultRoute;

  menu.forEach(item => {
    if (item.meta.default) {
      defaultRoute = item;
    } else if (item.children) {
      let defaultChild = item.children.find(i => i.meta.default);
      defaultRoute = defaultChild || defaultRoute;
    }
  });

  return defaultRoute;
}
