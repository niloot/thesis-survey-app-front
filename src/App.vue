<template>
  <el-header class="header">
    <el-button type="text" @click="aboutSurveyDrawer = true">
      درباره‌ پژوهش</el-button
    >
    <el-button type="text" @click="hintDrawer = true">راهنما</el-button>
    <el-button type="text" @click="aboutMeDrawer = true"
      >ارتباط با پژوهشگر</el-button
    >

    <el-drawer
      v-model="aboutSurveyDrawer"
      title="I am the title1"
      :direction="direction"
      :close-on-click-modal="true"
    >
      <span>Hi, there!</span>
    </el-drawer>
    <el-drawer
      v-model="hintDrawer"
      title="I am the title2"
      :direction="direction"
      :close-on-click-modal="true"
    >
      <span>Hi, there!</span>
    </el-drawer>
    <el-drawer
      v-model="aboutMeDrawer"
      title="I am the title3"
      :direction="direction"
      :close-on-click-modal="true"
    >
      <span>Hi, there!</span>
    </el-drawer>
  </el-header>
  <el-divider style="margin-top: 0"></el-divider>
  <div class="common-layout add-bg">
    <el-container class="body-container">
      <!-- <el-header class="header" style="margin:10px 0; height: unset">
        <span>{{ surveyTitle }}</span>
      </el-header> -->
      <!-- <el-divider class="m-0"></el-divider> -->
      <el-main>
        <el-row class="jc-center">
          <el-col :xs="24" :lg="18" :xl="18">
            <router-view />
          </el-col>
        </el-row>
      </el-main>
      <el-divider></el-divider>
      <el-footer class="footer"> </el-footer>
    </el-container>
  </div>
</template>

<script>
import { defineComponent, ref } from "vue";
import { mapGetters } from "vuex";

export default defineComponent({
  name: "App",
  computed: {
    ...mapGetters(["surveyTitle"]),
  },
  methods: {
    mapToEnter: function(elementId) {
      document.addEventListener("keydown", function(e) {
        if (e.which == 13) {
          document.getElementById(elementId).click();
        }
      });
    },
  },

  setup() {
    const aboutSurveyDrawer = ref(false);
    const hintDrawer = ref(false);
    const aboutMeDrawer = ref(false);
    const direction = ref("btt");
    const handleClose = () => {};

    return {
      hintDrawer,
      aboutMeDrawer,
      aboutSurveyDrawer,
      direction,
      handleClose,
    };
  },
});
</script>

<style>
@font-face {
  font-family: "IRANSansX";
  src: url(./fonts/woff/IRANSansX-Regular.woff),
    url(./fonts/woff2/IRANSansX-Regular.woff2);
}
body {
  font-family: "IRANSansX";
  box-sizing: border-box;
  margin: 0;
  direction: rtl;
  font-size: 16px;
  line-height: 24px;
  background: #384a5d;
  color: #f5f5f5;
  position: relative;
}
body::before {
  content: "";
  display: block;
  width: 100%;
  height: 420px;
  position: absolute;
  top: 0;
  left: 50%;
  background: url(./assets/images/colorfull-bg.svg) no-repeat 50%;
  transform: translateX(-50%);
  z-index: -1;
  opacity: 0.7;
}
@media screen and (max-width: 768px) {
  body::before {
    left: 60%;
    background: url(./assets/images/colorfull-bg.svg) no-repeat 60%;
    transform: translateX(-60%);
  }
}
a,
a:hover,
a:focus {
  text-decoration: none !important;
}
.el-input__inner,
.el-button,
.el-step__icon-inner {
  font-family: "IRANSansX" !important;
}
.el-menu {
  background-color: transparent !important;
}

@media screen and (min-width: 768px) {
  .body-container {
    width: 80%;
    margin: 0 auto;
  }
}
.el-menu--horizontal > .el-menu-item {
  float: right !important;
}
.el-main {
  min-height: 70vh;
}
.header {
  font-size: 1rem;
  display: flex;
  align-items: center;
}
.header button {
  color: rgb(218, 218, 218);
  margin-left: 1.5rem !important;
}
@media screen and (max-width: 320px) {
  .header a {
    color: rgb(218, 218, 218);
    margin-left: 0.82rem;
  }
}
/*  */
.jc-center {
  justify-content: center;
}
.jc-between {
  justify-content: space-between;
}
.d-flex {
  display: flex;
}
.m-0 {
  margin: 0 !important;
}
.pb-1rem {
  padding-bottom: 1rem;
}
.mb-halfrem {
  margin-bottom: 0.5rem !important;
}
.mx-halfrem {
  margin-right: 0.5rem !important;
  margin-left: 0.5rem !important;
}
.mr-halfrem {
  margin-right: 0.5rem !important;
}
.mt-1rem {
  margin-top: 1rem !important;
}

.my-1rem {
  margin-top: 1rem !important;
  margin-bottom: 1rem !important;
}
/*  */

.el-button.is-round {
  border-radius: 46px;
  padding: 19px 40px;
}
.responsive-img {
  height: 500px;
  width: 100%;
}
.el-input__inner {
  background-color: #384a5d !important;
  color: #f5f5f5 !important;
}
.el-link.el-link--info {
  color: #e2e2e2 !important;
}

.el-card {
  background-color: #384a5d !important;
  color: #f5f5f5 !important;
}
.card-header h4 {
  color: #f5f5f5 !important;
}
</style>
