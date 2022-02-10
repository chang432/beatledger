import { createRouter, createWebHistory } from 'vue-router'

import About from '../views/About'
import Main from '../views/Main'

const routes = [
    {
        path: '/',
        name: 'Main',
        component: Main
    },
    {
        path: '/about',
        name: 'About',
        component: About
    }
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
})

export default router 