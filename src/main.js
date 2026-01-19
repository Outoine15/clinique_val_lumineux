/*import { createApp } from 'vue'
import App from './App.vue'
import Test from './Test.vue'

var app = createApp(App);

//app.component("Test", Test)

app.mount('#app')
*/

import { createApp } from 'vue'
import App from './App.vue'
import router from './route'

createApp(App).use(router).mount('#app');
