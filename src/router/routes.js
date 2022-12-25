import store from '@state/store'
import authLayout from '@router/layouts/auth.vue';
import defaultLayout from '@router/layouts/side-nav-outer-toolbar.vue';

// lazy load
const importPage = view => () => import(/* webpackChunkName: "p-[request]" */ `@views/${view}.vue`)

const routeList = [
  {
    path: '/',
    name: 'index',
    components: {
      layout: defaultLayout
    },
    meta: {
      authRequired: true,
    },
    redirect:{ name: 'home' },
    children: [
      {
        path: "/",
        name: "home",
        meta: {
          title: 'Home',
        },
        component: importPage('Home')
      },
    ]
  },
  {
    path: '/auth',
    name: 'auth',
    components: {
      layout: authLayout
    },
    redirect: { name: 'login' },
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => lazyLoadView(import('@views/auth/login.vue')),
        meta: {
          beforeResolve(routeTo, routeFrom, next) {
            // If the user is already logged in
            if (store.getters['auth/loggedIn']) {
              // Redirect to the home page instead
              next({ name: 'home' })
            } else {
              // Continue to the login page
              next()
            }
          },
        },
      },
      {
        path: 'register',
        name: 'register',
        component: () => lazyLoadView(import('@views/auth/register.vue')),
        meta: {
          beforeResolve(routeTo, routeFrom, next) {
            // If the user is already logged in
            if (store.getters['auth/loggedIn']) {
              // Redirect to the home page instead
              next({ name: 'home' })
            } else {
              // Continue to the login page
              next()
            }
          },
        },
      },
      {
        path: 're-password',
        name: 're-password',
        component: () => lazyLoadView(import('@views/auth/re-password.vue')),
        meta: {
          beforeResolve(routeTo, routeFrom, next) {
            // If the user is already logged in
            if (store.getters['auth/loggedIn']) {
              // Redirect to the home page instead
              next({ name: 'home' })
            } else {
              // Continue to the login page
              next()
            }
          },
        },
      },
      {
        path: '/logout',
        name: 'logout',
        meta: {
          authRequired: true,
          beforeResolve(routeTo, routeFrom, next) {
            store.dispatch('auth/logOut')
            const authRequiredOnPreviousRoute = routeFrom.matched.some(
              (route) => route.meta.authRequired
            )
            // Navigate back to previous page, or home as a fallback
            next(authRequiredOnPreviousRoute ? { name: 'login' } : { ...routeFrom })
          },
        },
      },
    ]
  },
  {
    path: '/404',
    name: '404',
    component: require('@views/_404.vue').default,
    // Allows props to be passed to the 404 page through route
    // params, such as `resource` to define what wasn't found.
    props: true,
  },
  // Redirect any unmatched routes to the 404 page. This may
  // require some server configuration to work in production:
  // https://router.vuejs.org/en/essentials/history-mode.html#example-server-configurations
  {
    path: '*',
    redirect: '404',
  },
]

// Lazy-loads view components, but with better UX. A loading view
// will be used if the component takes a while to load, falling
// back to a timeout view in case the page fails to load. You can
// use this component to lazy-load a route with:
//
// component: () => lazyLoadView(import('@views/my-view'))
//
// NOTE: Components loaded with this strategy DO NOT have access
// to in-component guards, such as beforeRouteEnter,
// beforeRouteUpdate, and beforeRouteLeave. You must either use
// route-level guards instead or lazy-load the component directly:
//
// component: () => import('@views/my-view')
//
const lazyLoadView = AsyncView => {
  const AsyncHandler = () => ({
    component: AsyncView,
    // A component to use while the component is loading.
    loading: require('@views/_loading.vue').default,
    // Delay before showing the loading component.
    // Default: 200 (milliseconds).
    delay: 400,
    // A fallback component in case the timeout is exceeded
    // when loading the component.
    error: require('@views/_timeout.vue').default,
    // Time before giving up trying to load the component.
    // Default: Infinity (milliseconds).
    timeout: 10000,
  })

  return Promise.resolve({
    functional: true,
    render(h, { data, children }) {
      // Transparently pass any props or children
      // to the view component.
      return h(AsyncHandler, data, children)
    },
  })
}

export default routeList
