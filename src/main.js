import Vue from 'vue'
import App from './App.vue'
import MuseUI from 'muse-ui'
import 'muse-ui/dist/muse-ui.css'
import 'muse-ui/dist/theme-carbon.css'
import 'font-awesome/css/font-awesome.min.css'
import './assets/MaterialIcons.css'
Vue.use(MuseUI)

new Vue({
    el: '#app',
    render: h => h(App)
})
