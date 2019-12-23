<template>
  <div>
    <div class="back-image" />
    <div class="main">
      <div class="title">
        <div class="container">
          <div class="row">
            <div class="col-12">
              <a class="title__top">Zanieczyszczenie powietrza </a>
              <br />
              <a class="title__bottom"
                >Wskaźnik jakości powietrza w czasie rzeczywistym
              </a>
            </div>
          </div>
        </div>
      </div>
      <div class="menu">
        <div class="container">
          <div class="row">
            <div class="col-7 col-7--no-padding">
              <div
                v-for="tab in tabs"
                :key="tab"
                @click="changeMenu(tab)"
                 :class="[
                  'manu__item',
                  { 'manu__item--selected': selected === tab },
                ]"
              >
                {{ tab }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="content">
        <div class="container">
          <div class="row">
            <div class="col-7 col--no-padding">
              <div
                v-show="showViewFirstCity"
                class="informations informations__first"
              >
                <div class="informations__row">
                  <div class="choose-city">
                    <div class="choose-city__title"><p>Wybierz miasto</p></div>
                    <div class="choose-city__select">
                      <select
                        class="form-control"
                        id="selectFirstCity"
                        @change="changeCity($event, 'firstCity')"
                      >
                        <option value="0">Gdańsk</option>
                        <option value="1">Gdynia</option>
                        <option value="2">Warszawa</option>
                        <option value="3">Kraków</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div class="separator"></div>
                <InformationsCity :url="this.firstCityUrl" :cityName="this.firstCityName"/>
              </div>
              <div v-show="showViewSecondCity" class="informations informations__pg">
                <div class="informations__row">
                  <div class="choose-city-second">
                    <div class="choose-city__title"><p>Wybierz miasto</p></div>
                    <div class="choose-city__select">
                      <select
                        class="form-control"
                        id="selectSecondCity"
                        @change="changeCity($event, 'secondCity')"
                      >
                        <option value="0">Gdańsk</option>
                        <option value="1">Gdynia</option>
                        <option value="2">Warszawa</option>
                        <option value="3">Kraków</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div class="separator"></div>
                <InformationsCity :url="this.secondCityUrl" :cityName="this.secondCityName" />
              </div>
              <div
                v-show="showViewComparison"
                class="informations informations__comparison"
              >
                <Comparison
                  :firstCityUrl="this.firstCityUrl"
                  :secondCityUrl="this.secondCityUrl"
                  :firstCity="this.firstCityName"
                  :secondCity="this.secondCityName"
                />
              </div>
            </div>
            <div class="col-5 col--no-padding">
              <div class="map">
                <MapContainer
                  :firstCityLat="this.firstCityLat"
                  :firstCityLng="this.firstCityLng"
                  :firstCityName="this.firstCityName"
                  :secondCityLat="this.secondCityLat"
                  :secondCityLng="this.secondCityLng"
                  :secondCityName="this.secondCityName"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import MapContainer from "./components/MapContainer";
import InformationsCity from "./components/InformationsCity";
import Comparison from "./components/Comparison";

export default {
  name: "app",
  components: {
    MapContainer,
    InformationsCity,
    Comparison
  },
  data: function() {
    return {
      selected: "GDAŃSK",
      showViewFirstCity: true,
      showViewSecondCity: false,
      showViewComparison: false,
      firstCityUrl:
        "https://airapi.airly.eu/v2/measurements/nearest?indexType=AIRLY_CAQI&lat=54.37108&lng=18.61796&maxDistanceKM=1&apikey=91IYoXFWJTxEuGLBOVr60JyFMvSSGN1y",
      secondCityUrl:
        "https://airapi.airly.eu/v2/measurements/nearest?indexType=AIRLY_CAQI&lat=54.5196057&lng=18.53524&maxDistanceKM=1&apikey=91IYoXFWJTxEuGLBOVr60JyFMvSSGN1y",
      firstCityName: "GDAŃSK",
      firstCityLat: 54.37108,
      firstCityLng: 18.61796,
      secondCityName: "GDYNIA",
      secondCityLat: 54.5196057,
      secondCityLng: 18.53524,
      tabs: ["GDAŃSK", "GDYNIA", "PORÓWNANIE"]
    };
  },
  mounted() {
    document.getElementById("selectSecondCity").value = 1;
    document.getElementsByClassName("manu__item")[0].classList.add("manu__item--selected");
  },
  methods: {
    changeMenu(name) {
      this.selected = name;
      this.showViewFirstCity = false;
      this.showViewSecondCity = false;
      this.showViewComparison = false;

      if (name == this.firstCityName) {
        this.showViewFirstCity = true;
      } else if (name == this.secondCityName) {
        this.showViewSecondCity = true;
      } else if (name == "PORÓWNANIE") {
        this.showViewComparison = true;
      }
      this.tabs = [this.firstCityName, this.secondCityName, "PORÓWNANIE"];
    },
    changeCity(e, cityType) {
      console.log("bbbb")
      var chosenCity = e.target.value;
      var url = "";
      var cityInformations = [];

      if (cityType == "firstCity") {
        cityInformations = this.getCityInformations(chosenCity);
        this.firstCityLat = cityInformations[0];
        this.firstCityLng = cityInformations[1];
        this.firstCityName = cityInformations[2];
      } else {
        cityInformations = this.getCityInformations(chosenCity);
        this.secondCityLat = cityInformations[0];
        this.secondCityLng = cityInformations[1];
        this.secondCityName = cityInformations[2];
      }
      this.tabs = [this.firstCityName, this.secondCityName, "PORÓWNANIE"];
      switch (chosenCity) {
        case "0":
          url =
            "https://airapi.airly.eu/v2/measurements/nearest?indexType=AIRLY_CAQI&lat=54.37108&lng=18.61796&maxDistanceKM=1&apikey=91IYoXFWJTxEuGLBOVr60JyFMvSSGN1y";
          break;
        case "1":
          url =
            "https://airapi.airly.eu/v2/measurements/nearest?indexType=AIRLY_CAQI&lat=54.5196057&lng=18.53524&maxDistanceKM=1&apikey=91IYoXFWJTxEuGLBOVr60JyFMvSSGN1y";
          break;
        case "2":
          url =
            "https://airapi.airly.eu/v2/measurements/nearest?indexType=AIRLY_CAQI&lat=52.22966&lng=20.97295&maxDistanceKM=1&apikey=91IYoXFWJTxEuGLBOVr60JyFMvSSGN1y";
          break;
        case "3":
          url =
            "https://airapi.airly.eu/v2/measurements/nearest?indexType=AIRLY_CAQI&lat=50.0664&lng=19.9651&maxDistanceKM=1&apikey=91IYoXFWJTxEuGLBOVr60JyFMvSSGN1y";
          break;
        default:
          break;
      }
      if (e.target.id == "selectFirstCity") {
        this.firstCityUrl = url;
        this.selected = this.firstCityName;
      } else {
        this.secondCityUrl = url;
        this.selected = this.secondCityName;
      }
    },
    getCityInformations(cityType) {
      var informations = [];
      switch (cityType) {
        case "0":
          informations[0] = 54.37108;
          informations[1] = 18.61796;
          informations[2] = "GDAŃSK";
          break;
        case "1":
          informations[0] = 54.5196057;
          informations[1] = 18.53524;
          informations[2] = "GDYNIA";
          break;
        case "2":
          informations[0] = 52.22966;
          informations[1] = 20.97295;
          informations[2] = "WARSZAWA";
          break;
        case "3":
          informations[0] = 50.05456;
          informations[1] = 19.942218;
          informations[2] = "KRAKÓW";
          break;
        default:
          break;
      }
      return informations;
    }
  }
};
</script>

<style lang="scss">
@import "../node_modules/leaflet/dist/leaflet.css";

$black: #000 !default;

ul.tabs-nav {
  list-style: none;
  margin: 0px 0px 80px 0px;
}

ul.tabs-nav li {
  display: inline-block;
  margin: 0 40px 0 0;
  border: 1px solid rgb(207, 178, 178);
}

ul.tabs-nav li a {
  padding: 20px 40px;
  display: inline-block;
  text-decoration: none;
  color: $black;
}

ul.tabs-nav li a:hover {
  background: #f1f1f1;
  text-decoration: none;
}

ul.tabs-nav li.active a {
  background: #f1f1f1;
  text-decoration: none;
}

.tabs-content {
}

.tabs-content div.tab-panel {
  display: none;
  visibility: hidden;
}

.tabs-content div.tab-panel.active {
  display: block;
  visibility: visible;
}

//App

body {
  margin: 0px !important;
  padding: 0px;
  height: 100%;
  width: 100%;
  font-family: Lato, sans-serif !important;
  line-height: 1.5 !important;
}

.container {
  height: 100%;
}

.back-image {
  position: absolute;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
  background-image: url("./images/back2.jpg");
  background-size: cover;
  opacity: 0.7;
}

.main {
  position: absolute;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
}

.col {
  &--no-padding {
    padding-right: 0px !important;
    padding-left: 0px !important;
  }
}

.title {
  height: 100px;
  text-align: center;
  padding-top: 20px;
  position: absolute;
  top: 0px;
  right: 0px;
  left: 0px;

  .title__top {
    font-size: 24px;
    font-weight: bold;
  }

  .title__bottom {
    font-size: 17px;
    color: #635e5e;
  }
}

.menu {
  height: 69px;
  padding-top: 20px;
  position: absolute;
  top: 130px;
  left: 0px;
  right: 0px;

  .manu__item {
    float: left;
    padding: 15px 20px;
    background-color: #18e02a;
    margin-left: 1%;
    width: 32%;
    text-align: center;
    font-weight: bold;
    border-top-left-radius: 15px;
    border-top-right-radius: 15px;
    font-size: 13px;

    &--selected {
      border-top: 2px #18e02a solid;
      border-left: 2px #18e02a solid;
      border-right: 2px #18e02a solid;
      background-color: #f9f2f3;
    }

    &--notification {
      position: static;
      float: right;
      position: static;
      float: right;
      background-color: #f9f2f3;
      width: 170px;
      padding-top: 7px;
    }
  }
}

.content {
  position: absolute;
  left: 0px;
  right: 0px;
  top: 200px;
  bottom: 0px;

  .informations {
    height: 421px;
    background-color: #f9f2f3;
    margin-right: 5px;
    overflow-y: scroll;
    position: relative;

    &__second-city {
      display: none;
    }
  }

  .map {
    height: 420px;
    background-color: #e0e0e0;
    width: 100%;
  }
}

#map {
  height: 100%; 
  width: 100%;
}

.separator {
  width: 100%;
  border-bottom: 1px solid gray;
}

.informations__row {
  padding: 15px;

  &--rate {
    height: 60px;
    padding-top: 15px;
  }

  &--current {
    height: 167px;
    padding-top: 15px;
  }

  &--currentgdy {
    height: 80px;
    padding-top: 15px;
  }
}

.row__title {
  text-align: center;
}

.name__data {
  font-size: 24px;
  font-weight: bold;
}

.row {
  height: 100%;

  &__rate-number {
    float: left;
    min-width: 30px;
    padding: 3px;
    text-align: center;
    border: 2px #18e02a solid;
    border-radius: 5px;
    color: #18e02a;
  }

  &__rate {
    padding-left: 10px;
    padding-top: 3px;
    float: left;
  }

  &__current {
    &--half {
      float: left;
      width: 50%;
    }
  }

  &_name {
    font-size: 18px;
    font-weight: 800;
    padding-bottom: 7px;
  }

  &__menu-prediction {
    width: 100%;
    height: 24px;
    background-color: #e4dddd;
  }
}

.current {
  color: #585353;
}

.current__value {
  font-weight: bold;
  font-size: 20px;
  color: black;
}

.current__unit {
  font-size: 12px;
}

.historic__graph {
  width: 100%;
  height: 230px;
}

.row__menu-historic {
  width: 100%;
  height: 24px;
  background-color: #e4dddd;
}

.row__menu-prediction {
  width: 100%;
  height: 24px;
  background-color: #e4dddd;
}

.menu-historic__item,
.menu-historic-gdy__item {
  width: 33%;
  float: left;
  text-align: center;
  border-top: 2px #ccc2c2 solid;

  &--selected {
    border-top: 2px #878d90 solid;
    background-color: #f9f2f3;
  }
}

.menu-historic__item,
.menu-historic-gdy__item,
.menu-historic-comp__item {
  width: 33%;
  float: left;
  text-align: center;
  border-top: 2px #ccc2c2 solid;

  &--selected {
    border-top: 2px #878d90 solid;
    background-color: #f9f2f3;
  }

  &--25 {
    width: 25%;
  }
}

.menu-prediction__item,
.menu-prediction-gdy__item {
  width: 50%;
  float: left;
  text-align: center;
  border-top: 2px #ccc2c2 solid;

  &--selected {
    border-top: 2px #878d90 solid;
    background-color: #f9f2f3;
  }
}

.menu-prediction-comp__item {
  width: 33.3%;
  float: left;
  text-align: center;
  border-top: 2px #ccc2c2 solid;

  &--selected {
    border-top: 2px #878d90 solid;
    background-color: #f9f2f3;
  }
}
#mapid {
  width: 100%;
  height: 100%;
}

.choose-city {
  height: 35px;
  &__title {
    width: 130px;
    float: left;
    margin-top: 7px;

    &--second {
      width: 110px;
    }
  }
  &__select {
    width: 150px;
    float: left;
  }
}

.choose-city-second {
  height: 35px;
}

.col-7--no-padding {
  padding: 0px !important;
}
</style>



