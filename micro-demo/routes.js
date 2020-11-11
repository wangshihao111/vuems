export default [
  {
    path: '/page1',
    name: 'page1',
    component: () => import('./pages/Page1.vue')
  },
  {
    path: '/page2',
    name: "page2",
    component: () => import('./pages/Page2.vue')
  },
]