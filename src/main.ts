import { createApp } from "vue";
import "./assets/index.scss";
import router from "@/router";
import App from "./App.vue";

/* import the fontawesome core */
import { library } from "@fortawesome/fontawesome-svg-core";
/* import font awesome icon component */
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

/* import icons and add them to the Library */
import { faChartLine, faTableList } from "@fortawesome/free-solid-svg-icons";
import { faHouse } from "@fortawesome/free-regular-svg-icons";
import {} from "@fortawesome/free-brands-svg-icons";

library.add(faHouse, faChartLine, faTableList);

const app = createApp(App);

app.use(router);
app.component("font-awesome-icon", FontAwesomeIcon);
app.mount("#app");
