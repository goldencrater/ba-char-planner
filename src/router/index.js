import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomeView,
        },
        {
            path: '/char',
            name: 'charlist',
            component: () => import('../views/CharacterListView.vue'),
        },
        {
            path: '/char/:charid',
            name: 'charview',
            component: () => import('../views/CharacterView.vue'),
        },
        {
            path: '/team',
            name: 'teambuilder',
            component: () => import('../views/TeamBuilder.vue'),
        },
        {
            path: '/team/share',
            name: 'teambuilder-share',
            component: () => import('../views/TeamBuilder.vue'),
        },
        {
            path: '/settings',
            name: 'settings',
            component: () => import('../views/Settings.vue'),
        },
    ],
    linkActiveClass: 'active',
})

export default router
