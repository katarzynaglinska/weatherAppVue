<template>
  <div>
    <div class="informations__row">
      <div class="row__title">
        <span class="name__data name__data-first">{{ this.firstCity }}</span>
        <span class="name__data"> - </span>
        <span class="name__data name__data-second">{{ this.secondCity }}</span>
      </div>
    </div>
    <div class="informations__row">
      <div class="row_name">Dane historyczne</div>
      <div>
        <div class="row__menu-historic">
          <div
            v-for="(tab, index) in tabs"
            :key="tab"
            @click="changeMenu(index, tab)"
            :class="[
              'menu-historic-comp__item menu-historic__item--25',
              { 'menu-historic__item--selected': selected === tab }
            ]"
          >
            {{ tab }}
          </div>
        </div>
      </div>
      <div v-if="chartTypeHistory == 0 || chartTypeHistory == 3">
        <BarChart
          :height="200"
          :options="this.chartDataHistory.options"
          :chart-data="this.chartDataHistory.data"
        />
      </div>
      <div v-else-if="chartTypeHistory == 1 || chartTypeHistory == 2">
        <LineChart
          :height="200"
          :options="this.chartDataHistory.options"
          :chart-data="this.chartDataHistory.data"
        />
      </div>
    </div>
    <div class="informations__row">
      <div class="row_name">Ekstrema ogólnej jakości powietrza (CAQI)</div>
      <LineChart
        :height="200"
        :options="this.chartDataMinMax.options"
        :chart-data="this.chartDataMinMax.data"
      />
    </div>
    <div class="informations__row">
      <div class="row_name">Prognoza na następne dni</div>
      <div>
        <div class="row__menu-historic">
          <div
            v-for="(tab, index) in tabsForecast"
            :key="tab"
            @click="changeMenu(index, tab + 'Forecast')"
            :class="[
              'menu-prediction-comp__item',
              {
                'menu-prediction__item--selected':
                  selectedForecast === tab + 'Forecast'
              }
            ]"
          >
            {{ tab }}
          </div>
        </div>
      </div>
      <div v-if="chartTypeForecast == 4">
        <BarChart
          :height="200"
          :options="this.chartDataForecast.options"
          :chart-data="this.chartDataForecast.data"
        />
      </div>
      <div v-else-if="chartTypeForecast == 5 || chartTypeForecast == 6">
        <LineChart
          :height="200"
          :options="this.chartDataForecast.options"
          :chart-data="this.chartDataForecast.data"
        />
      </div>
    </div>
  </div>
</template>

<script>
import LineChart from "./LineChart";
import BarChart from "./BarChart";
import axios from "axios";
import moment from "moment";

export default {
  name: "Comparison",
  components: {
    LineChart,
    BarChart
  },
  data: function() {
    return {
      tabs: ["CAQI", "PM 2.5", "PM 10", "TEMPERATURA"],
      tabsForecast: ["CAQI", "PM 2.5", "PM 10"],
      selected: "CAQI",
      selectedForecast: "CAQIForecast",
      chartTypeHistory: 0,
      chartTypeForecast: 4,

      //First city
      dataFirstCityCurrent: null,
      dataFirstCityHistory: null,
      dataFirstCityForecast: null,
      pm10FirstCityHistory: [],
      pm25FirstCityHistory: [],
      caqiFirstCityHistory: [],
      temperatureFirstCityHistory: [],
      datasFirstCityHistory: [],
      pm10FirstCityForecast: [],
      pm25FirstCityForecast: [],
      caqiFirstCityForecast: [],
      datasFirstCityForecast: [],

      //Second city
      dataSecondCityCurrent: null,
      dataSecondCityHistory: null,
      dataSecondCityForecast: null,
      pm10SecondCityHistory: [],
      pm25SecondCityHistory: [],
      caqiSecondCityHistory: [],
      temperatureSecondCityHistory: [],
      datasSecondCityHistory: [],
      pm10SecondCityForecast: [],
      pm25SecondCityForecast: [],
      caqiSecondCityForecast: [],
      datasSecondCityForecast: [],

      chartDataHistory: {
        isLoaded: false
      },
      chartDataForecast: {
        isLoaded: false
      },
      chartDataMinMax: {
        isLoaded: false
      },
      chartDataHistoryChanged: false,
      chartDataForecastChanged: false,
      chartDataMinMaxChanged: false
    };
  },
  props: ["firstCityUrl", "secondCityUrl", "firstCity", "secondCity"],
  watch: {
    firstCityUrl: function(newVal, oldVal) {
      let firstCityUrl = newVal;
      axios
        .get(firstCityUrl)
        .then(response => {
          this.buildFirstCityData(response.data, "firstCity");
        })
        .catch(err => console.log(err));
    },
    secondCityUrl: function(newVal, oldVal) {
      let secondCityUrl = newVal;
      axios
        .get(secondCityUrl)
        .then(response => {
          this.buildSecondCityData(response.data, "secondCity");
        })
        .catch(err => console.log(err));
    }
  },
  methods: {
    buildFirstCityData: function(res) {
      this.dataFirstCityCurrent = res.current;
      this.dataFirstCityHistory = res.history;
      this.dataFirstCityForecast = res.forecast;
      var dataHistory, dataForecast;
      for (var j = 0; j < this.dataFirstCityHistory.length; j++) {
        dataHistory = this.dataFirstCityHistory[j];
        this.pm10FirstCityHistory[j] = dataHistory.values[2].value;
        this.pm25FirstCityHistory[j] = dataHistory.values[1].value;
        this.caqiFirstCityHistory[j] = dataHistory.indexes[0].value;
        this.temperatureFirstCityHistory[j] = dataHistory.values[5].value;
        this.datasFirstCityHistory[j] = moment
          .utc(dataHistory.fromDateTime)
          .format("DD/MM HH:mm");
      }
      for (var z = 0; z < this.dataFirstCityForecast.length; z++) {
        dataForecast = this.dataFirstCityForecast[z];
        this.pm10FirstCityForecast[z] = dataForecast.values[0].value;
        this.pm25FirstCityForecast[z] = dataForecast.values[1].value;
        this.caqiFirstCityForecast[z] = dataForecast.indexes[0].value;
        this.datasFirstCityForecast[z] = moment
          .utc(dataForecast.fromDateTime)
          .format("DD/MM HH:mm");
      }
      this.changeChartDataOnload();
    },
    buildSecondCityData: function(res, type) {
      this.dataSecondCityCurrent = res.current;
      this.dataSecondCityHistory = res.history;
      this.dataSecondCityForecast = res.forecast;
      var dataHistory, dataForecast;
      for (var j = 0; j < this.dataSecondCityHistory.length; j++) {
        dataHistory = this.dataSecondCityHistory[j];
        this.pm10SecondCityHistory[j] = dataHistory.values[2].value;
        this.pm25SecondCityHistory[j] = dataHistory.values[1].value;
        this.caqiSecondCityHistory[j] = dataHistory.indexes[0].value;
        this.temperatureSecondCityHistory[j] = dataHistory.values[5].value;
        this.datasSecondCityHistory[j] = moment
          .utc(dataHistory.fromDateTime)
          .format("DD/MM HH:mm");
      }
      for (var z = 0; z < this.dataSecondCityForecast.length; z++) {
        dataForecast = this.dataSecondCityForecast[z];
        this.pm10SecondCityForecast[z] = dataForecast.values[0].value;
        this.pm25SecondCityForecast[z] = dataForecast.values[1].value;
        this.caqiSecondCityForecast[z] = dataForecast.indexes[0].value;
        this.datasSecondCityForecast[z] = moment
          .utc(dataForecast.fromDateTime)
          .format("DD/MM HH:mm");
      }
      this.changeChartDataOnload();
    },
    changeChartDataOnload: function() {
      (this.chartDataForecast = {
        isLoaded: false
      }),
        (this.chartDataHistory = {
          isLoaded: false
        }),
        (this.chartDataMinMax = {
          isLoaded: false
        }),
        (this.chartDataHistoryChanged = false),
        (this.chartDataForecastChanged = false),
        (this.chartDataMinMaxChanged = false);

      this.createChartSelected(
        this.datasFirstCityHistory,
        this.caqiFirstCityHistory,
        this.caqiSecondCityHistory,
        true,
        "bar",
        this.firstCity,
        this.secondCity,
        "chartDataHistory"
      );
      this.createChartSelected(
        this.datasFirstCityForecast,
        this.caqiFirstCityForecast,
        this.caqiSecondCityForecast,
        true,
        "bar",
        this.firstCity,
        this.secondCity,
        "chartDataForecast"
      );

      this.createGraphHistoricMinMax(this.firstCity, this.secondCity);
    },
    createGraphHistoricMinMax(firstCity, secondCity) {
      const arrMin = arr => Math.min(...arr);
      const arrMax = arr => Math.max(...arr);
      const arrAvg = arr => arr.reduce((a, b) => a + b, 0) / arr.length;
      var minCaquiHistory,
        minCaquiHistoryIndex,
        maxCaquiHistory,
        maxCaquiHistoryIndex,
        avgCaquiHistory,
        minArray,
        maxArray,
        avgArray,
        minArrayFirst,
        maxArrayFirst,
        avgArrayFirst,
        minArraySecond,
        maxArraySecond,
        avgArraySecond;

      //first city
      minCaquiHistory = arrMin(this.caqiFirstCityHistory);
      minCaquiHistoryIndex = this.caqiFirstCityHistory.indexOf(minCaquiHistory);
      maxCaquiHistory = arrMax(this.caqiFirstCityHistory);
      maxCaquiHistoryIndex = this.caqiFirstCityHistory.indexOf(maxCaquiHistory);
      avgCaquiHistory = arrAvg(this.caqiFirstCityHistory).toFixed(2);
      minArray = Array(this.caqiFirstCityHistory.length).fill(null);
      maxArray = Array(this.caqiFirstCityHistory.length).fill(null);
      avgArray = Array(this.caqiFirstCityHistory.length).fill(avgCaquiHistory);
      minArrayFirst = Array(this.caqiFirstCityHistory.length).fill(null);
      minArrayFirst[minCaquiHistoryIndex] = minCaquiHistory;
      maxArrayFirst = Array(this.caqiFirstCityHistory.length).fill(null);
      maxArrayFirst[maxCaquiHistoryIndex] = maxCaquiHistory;
      avgArrayFirst = avgArray;

      //second city
      minCaquiHistory = arrMin(this.caqiSecondCityHistory);
      minCaquiHistoryIndex = this.caqiSecondCityHistory.indexOf(
        minCaquiHistory
      );
      maxCaquiHistory = arrMax(this.caqiSecondCityHistory);
      maxCaquiHistoryIndex = this.caqiSecondCityHistory.indexOf(
        maxCaquiHistory
      );
      avgCaquiHistory = arrAvg(this.caqiSecondCityHistory).toFixed(2);
      minArray = Array(this.caqiSecondCityHistory.length).fill(null);
      maxArray = Array(this.caqiSecondCityHistory.length).fill(null);
      avgArray = Array(this.caqiSecondCityHistory.length).fill(avgCaquiHistory);
      minArraySecond = Array(this.caqiSecondCityHistory.length).fill(null);
      minArraySecond[minCaquiHistoryIndex] = minCaquiHistory;
      maxArraySecond = Array(this.caqiSecondCityHistory.length).fill(null);
      maxArraySecond[maxCaquiHistoryIndex] = maxCaquiHistory;
      avgArraySecond = avgArray;

      this.chartDataMinMax = {
        type: "line",
        data: {
          datasets: [
            {
              label: "Wartość średnia " + firstCity,
              data: avgArrayFirst,
              fill: false,
              type: "line"
            },
            {
              label: "Wartość średnia " + secondCity,
              data: avgArraySecond,
              fill: false,
              type: "line",
              backgroundColor: "#a7a7b1",
              borderColor: "#a7a7b1"
            },
            {
              label: "Maximum " + firstCity,
              backgroundColor: "rgb(48, 134, 204)",
              pointBackgroundColor: "rgb(48, 134, 204)",
              pointBorderColor: "#55bae7",
              data: maxArrayFirst
            },
            {
              label: "Maximum " + secondCity,
              backgroundColor: "#00495f",
              pointBackgroundColor: "#00495f",
              pointBorderColor: "#00495f",
              data: maxArraySecond
            },
            {
              label: "Minimum " + firstCity,
              backgroundColor: "#18e02a",
              pointBackgroundColor: "#18e02a",
              pointBorderColor: "#18e02a",
              data: minArrayFirst
            },
            {
              label: "Minimum " + secondCity,
              backgroundColor: "#00a20f",
              pointBackgroundColor: "#00a20f",
              pointBorderColor: "#00a20f",
              data: minArraySecond
            }
          ],
          labels: this.datasFirstCityHistory
        },
        options: {
          legend: {
            display: true
          }
        },
        isLoaded: true
      };
      this.chartDataMinMaxChanged = true;
    },
    changeMenu(tabNumber, tabTitle) {
      if (
        tabTitle == "CAQI" ||
        tabTitle == "PM 2.5" ||
        tabTitle == "PM 10" ||
        tabTitle == "TEMPERATURA"
      ) {
        this.changeChartData(
          String(tabNumber),
          "categoryMenuHistoryComparison"
        );
        this.selected = tabTitle;
      } else {
        this.changeChartData(
          String(tabNumber + 4),
          "categoryMenuHistoryComparison"
        );
        this.selectedForecast = tabTitle;
      }
    },
    changeChartData(tabNumber, tabTitle) {
      if (tabTitle == "categoryMenuForecastComparison") {
        this.chartDataForecast = {
          isLoaded: false
        };
      } else {
        this.chartDataHistory = {
          isLoaded: false
        };
      }
      this.chartDataHistoryChanged = false;
      this.chartDataForecastChanged = false;
      switch (tabNumber) {
        case "0":
          this.createChartSelected(
            this.datasFirstCityHistory,
            this.caqiFirstCityHistory,
            this.caqiSecondCityHistory,
            true,
            "bar",
            this.firstCity,
            this.secondCity,
            "chartDataHistory"
          );
          this.chartTypeHistory = 0;
          break;
        case "1":
          this.createChartSelected(
            this.datasFirstCityHistory,
            this.pm25FirstCityHistory,
            this.pm25SecondCityHistory,
            true,
            "line",
            this.firstCity,
            this.secondCity,
            "chartDataHistory"
          );
          this.chartTypeHistory = 1;
          break;
        case "2":
          this.createChartSelected(
            this.datasFirstCityHistory,
            this.pm10FirstCityHistory,
            this.pm10SecondCityHistory,
            true,
            "line",
            this.firstCity,
            this.secondCity,
            "chartDataHistory"
          );
          this.chartTypeHistory = 2;
          break;
        case "3":
          this.createChartSelected(
            this.datasFirstCityForecast,
            this.temperatureFirstCityHistory,
            this.temperatureSecondCityHistory,
            true,
            "bar",
            this.firstCity,
            this.secondCity,
            "chartDataHistory"
          );
          this.chartTypeHistory = 3;
          break;
        case "4":
          this.createChartSelected(
            this.datasFirstCityForecast,
            this.caqiFirstCityForecast,
            this.caqiSecondCityForecast,
            true,
            "bar",
            this.firstCity,
            this.secondCity,
            "chartDataForecast"
          );
          this.chartTypeForecast = 4;
          break;
        case "5":
          this.createChartSelected(
            this.datasFirstCityForecast,
            this.pm25FirstCityForecast,
            this.pm25SecondCityForecast,
            true,
            "line",
            this.firstCity,
            this.secondCity,
            "chartDataForecast"
          );
          this.chartTypeForecast = 5;
          break;
        case "6":
          this.createChartSelected(
            this.datasFirstCityForecast,
            this.pm10FirstCityForecast,
            this.pm10SecondCityForecast,
            true,
            "line",
            this.firstCity,
            this.secondCity,
            "chartDataForecast"
          );
          this.chartTypeForecast = 6;
          break;
        default:
          break;
      }
    },
    createChartSelected(
      labels,
      data,
      data2,
      display,
      type,
      label1,
      label2,
      chartType
    ) {
      var chart = chartType;
      if (data2 == false) {
        this[chart] = {
          type: type,
          data: {
            labels: labels,
            datasets: [
              {
                label: false,
                borderColor: "#7b7f8e",
                backgroundColor: "#7b7f8ea6",
                fill: true,
                data: data
              }
            ]
          },
          options: {
            legend: {
              display: display
            }
          },
          isLoaded: true
        };
      } else {
        this[chart] = {
          type: type,
          data: {
            labels: labels,
            datasets: [
              {
                label: label1,
                borderColor: "#7b7f8e",
                backgroundColor: "#7b7f8ea6",
                fill: true,
                data: data
              },
              {
                label: label2,
                borderColor: "#999eb1",
                backgroundColor: "#999eb19c",
                fill: true,
                data: data2
              }
            ]
          },
          options: {
            legend: {
              display: display
            }
          },
          isLoaded: true
        };
      }
      if (chartType == "chartDataHistory") {
        this.chartDataHistoryChanged = true;
      } else if (chartType == "chartDataForecast") {
        this.chartDataForecastChanged = true;
      }
    }
  },
  mounted: function() {
    let firstCityUrl = this.firstCityUrl;
    let secondCityUrl = this.secondCityUrl;

    Promise.all([fetch(firstCityUrl), fetch(secondCityUrl)])
      .then(([res1, res2]) => Promise.all([res1.json(), res2.json()]))
      .then(([res1, res2]) => {
        this.buildFirstCityData(res1, "firstCity");
        this.buildSecondCityData(res2, "secondCity");
      });
  }
};
</script>

<style scoped></style>
