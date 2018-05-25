import lazyLoading from './lazyLoading'


export default {
  name: 'Projects',
  children: [
    {
      path: 'projects/:project',
      component: Overview,
      meta: {
        auth: true
      }
    }
  ]
},
