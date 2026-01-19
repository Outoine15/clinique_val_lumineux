import { createRouter, createWebHistory } from 'vue-router'

import HomeView from './HomeVue.vue'
import AboutView from './AboutVue.vue'

const router = createRouter({
	history: createWebHistory(window.__BASE_PATH__ || "/"),
	routes: [{
            path: '/',
            name: 'home',
            component: HomeView
        },
        {
            path: '/about',
            name: 'about',
            component: AboutView
        }
    ]
})

export default router