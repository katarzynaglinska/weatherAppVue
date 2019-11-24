<template>
  <div id="map">
    <l-map
      v-if="showMap"
      :zoom="zoom"
      :center="center"
      :options="mapOptions"
      @update:center="centerUpdate"
      @update:zoom="zoomUpdate"
    >
      <l-tile-layer :url="url" :attribution="attribution" />
      <l-marker :lat-lng="withPopup">
        <l-popup>
          <div>
            {{this.firstCityName}}
          </div>
        </l-popup>
      </l-marker>
      <l-marker :lat-lng="withPopupSecond">
        <l-popup>
          <div>
            {{this.secondCityName}}
          </div>
        </l-popup>
      </l-marker>
    </l-map>
  </div>
</template>

<script>
import { latLng } from "leaflet";
import { LMap, LTileLayer, LMarker, LPopup, LTooltip } from "vue2-leaflet";

var lat = 54.37108;
export default {
  name: "Example",
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LPopup,
    LTooltip
  },
  props: ['firstCityLat', 'firstCityLng', 'firstCityName', 'secondCityLat', 'secondCityLng', 'secondCityName' ],
  data() {
    return {
      zoom: 5,
      center: latLng(52.22966, 18.97295),
      url: "http://{s}.tile.osm.org/{z}/{x}/{y}.png",
      attribution:
        '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      withPopup: latLng(this.firstCityLat, this.firstCityLng),   //latLng(54.37108, 18.61796),
      withPopupSecond: latLng(54.5196057, 18.53524),
      withTooltip: latLng(54.37108, 18.61796),
      currentZoom: 11.5,
      currentCenter: latLng(52.22966, 18.97295),
      showParagraph: false,
      mapOptions: {
        zoomSnap: 0.5
      },
      showMap: true
    };
  },
  methods: {
    zoomUpdate(zoom) {
      this.currentZoom = zoom;
    },
    centerUpdate(center) {
      this.currentCenter = center;
    },
  },
  watch: { 
    firstCityLat: function(newVal, oldVal) { 
      console.log("firstCityLat " + newVal);
      this.withPopup = latLng(newVal, this.firstCityLng);
    },
    secondCityLat: function(newVal, oldVal) { 
      console.log("secondCityLat " + newVal);
      this.withPopupSecond = latLng(newVal, this.secondCityLng);
    }
  },
  mounted(){
    console.log("mounted");
    console.log(this.firstCityLat +  "  " + this.firstCityLng);
    console.log(this.secondCityLat +  "  " + this.secondCityLng);
  }
};
</script>

<style scoped>
  .vue2leaflet-map{
    position: relative;
    width: 100%;
    height: 100%;
  }
</style>