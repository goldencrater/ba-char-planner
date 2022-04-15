import { createApp } from 'vue'
import { createPinia } from 'pinia'

/* fontawesome */
import { library } from '@fortawesome/fontawesome-svg-core';
import { faGear } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
library.add(faGear);

/* localisation */
import localisations from './plugins/localisations.js'

import App from './App.vue';
import router from './router';

const app = createApp(App);

app.component('font-awesome-icon', FontAwesomeIcon);
app.use(createPinia());
app.use(router);
app.use(localisations);

app.mount('#app');
