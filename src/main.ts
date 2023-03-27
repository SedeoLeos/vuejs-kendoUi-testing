import { createApp } from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'
import '@progress/kendo-theme-default'
 loadFonts()
 
createApp(App)
  .use(vuetify)
  .mount('#app')
