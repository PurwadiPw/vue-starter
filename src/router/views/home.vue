<script>
import appConfig from "@src/app.config";
import Layout from "@layouts/main.vue";

export default {
  page: {
    title: "Home",
    meta: [{ name: "description", content: appConfig.description }],
  },
  components: { Layout },
};
</script>

<template>
  <Layout>
    <!-- Start Hero -->
    <section class="relative table w-full py-32 lg:py-36 bg-[url('~@assets/images/company/aboutus.jpg')] bg-center bg-no-repeat">
      <div class="absolute inset-0 bg-black opacity-80"></div>
      <div class="container">
        <div class="grid grid-cols-1 pb-8 text-center place-items-center mt-10">
          <h3 class="md:text-4xl text-3xl md:leading-normal leading-normal font-medium text-white">Home Page</h3>
          <img src="@assets/images/logo.png" alt="Logo" />
        </div>
        <!--end grid-->
      </div>
      <!--end container-->
    </section>
    <!--end section-->
    <div class="relative">
      <div class="shape overflow-hidden z-1 text-white dark:text-slate-900">
        <svg viewBox="0 0 2880 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 48H1437.5H2880V0H2160C1442.5 52 720 0 720 0H0V48Z" fill="currentColor"></path>
        </svg>
      </div>
    </div>
    <!-- End Hero -->
  </Layout>
</template>
