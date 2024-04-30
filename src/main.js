import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";

import axios from "axios";
axios.interceptors.request.use(function (config) {
    config.headers.Authorization = sessionStorage.getItem("jwtToken");
    return config;
});

Vue.config.productionTip = false;
Vue.use(ElementUI);

new Vue({
    router,
    render: (h) => h(App),
}).$mount("#app");
