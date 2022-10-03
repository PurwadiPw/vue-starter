<script>
import { authComputed } from '@state/helpers'
import NavBarRoutes from './nav-bar-routes.vue'

export default {
  components: { NavBarRoutes },
  data() {
    return {
      persistentNavRoutes: [
        {
          name: 'home',
          title: 'Home',
        },
      ],
      loggedInNavRoutes: [
        {
          name: 'profile',
          title: () => 'Logged in as ' + this.currentUser.name,
        },
        {
          name: 'logout',
          title: 'Log out',
        },
      ],
      loggedOutNavRoutes: [
        {
          name: 'login',
          title: 'Log in',
        },
      ],
    }
  },
  computed: {
    ...authComputed,
  },
}
</script>

<template>
  <nav id="topnav" class="defaultscroll is-sticky bg-white">
    <div class="container">
      <!-- Logo container-->
      <RouterLink to="/" class="logo">
        <img src="@assets/images/logo.png" class="h-12 inline-block dark:hidden" alt="" />
        <img src="@assets/images/logo.png" class="h-12 hidden dark:inline-block" alt="" />
      </RouterLink>

      <!-- End Logo container-->
      <div class="menu-extras">
        <div class="menu-item">
          <!-- Mobile menu toggle-->
          <a class="navbar-toggle" id="isToggle" onclick="toggleMenu()">
            <div class="lines">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </a>
          <!-- End mobile menu toggle-->
        </div>
      </div>

      <div id="navigation">
        <!-- Navigation Menu-->
        <ul class="navigation-menu justify-end">
          <NavBarRoutes :routes="persistentNavRoutes" />
          <NavBarRoutes v-if="loggedIn" :routes="loggedInNavRoutes" />
          <NavBarRoutes v-else :routes="loggedOutNavRoutes" />
        </ul>
        <!--end navigation menu-->
      </div>
      <!--end navigation-->
    </div>
    <!--end container-->
  </nav>
</template>
