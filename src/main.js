import Vue from 'vue'
import App from './App.vue'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import * as VueGoogleMaps from "vue2-google-maps";
// import * as Vue2Leaflet from 'vue2-leaflet;
//import "leaflet.icon.glyph";
require('moment/locale/pl')
 
Vue.config.productionTip = false

Vue.use(VueGoogleMaps, {
  load: {
    key: "AIzaSyCwtMriYqL-cdBmdAmb6vpdsXzzuZkoOGQ",
    libraries: "places" // necessary for places input
  }
});

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
   iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
   iconUrl: require('leaflet/dist/images/marker-icon.png'),
   shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});


new Vue({
  render: h => h(App),
}).$mount('#app')
