<template>
    <div>
        <CurrentData :cityName="this.cityName" :dayNameOfWeek="this.dayNameOfWeek" :dayDate="this.dayDate" :rate="this.rate"
                     :rateValue="this.rateValue" :pm10="this.pm10" :pm25="this.pm25" :pm1="this.pm1"
                     :temperature="this.temperature" :pressure="this.pressure" :humidity="this.humidity"/>
        <div class="informations__row">
          <div class="row_name">Dane historyczne</div>
            <div>
                <div class="row__menu-historic">
                    <div
                        v-for="tab in tabs"
                        :key="tab"
                        @click="changeMenu(tab)"
                        :class="['menu-historic__item', { 'menu-historic__item--selected': selected === tab }]">
                        {{ tab }}
                    </div>
                </div>
            </div>
            <div v-if="chartTypeHistory == 0 || chartTypeHistory == 2">
                <BarChart :height="200" :options="this.chartDataHistory.options"  :chart-data="this.chartDataHistory.data"/>
            </div>
            <div v-else-if="chartTypeHistory == 1">
                <LineChart :height="200" :options="this.chartDataHistory.options"  :chart-data="this.chartDataHistory.data"/>
            </div>
        </div>
        <div class="informations__row">
            <div class="row_name">Ekstrema ogólnej jakości powietrza (CAQI)</div>
            <LineChart :height="200" :options="this.chartDataMinMax.options"  :chart-data="this.chartDataMinMax.data"/>
        </div>
        <div class="informations__row">
          <div class="row_name">Prognoza na następne dni</div>
            <div>
                <div class="row__menu-historic">
                    <div
                        v-for="tab in tabsPrediction"
                        :key="tab"
                        @click="changeMenu(tab + 'Prediction')"
                        :class="['menu-prediction__item', { 'menu-prediction__item--selected': selectedPrediction === tab + 'Prediction' }]">
                        {{ tab }}
                    </div>
                </div>
            </div>
            <div v-if="chartTypePrediction == 3">
                <BarChart :height="200" :options="this.chartDataForecast.options"  :chart-data="this.chartDataForecast.data"/>
            </div>
            <div v-else-if="chartTypePrediction == 4">
                <LineChart :height="200" :options="this.chartDataForecast.options"  :chart-data="this.chartDataForecast.data"/>
            </div>
        </div>
    </div>
</template>

<script>
import CurrentData from "./CurrentData"
import LineChart from "./LineChart"
import BarChart from "./BarChart"
import axios from 'axios'
import moment from 'moment'

export default {
    name: 'InformationsCity',
    components: {
        CurrentData,
        LineChart,
        BarChart
    },
    data: function() {
        return {
            dataCityCurrent: null,
            dataCityHistory: null,
            dataCityForecast: null,
            pm10History: [],
            pm25History: [],
            caqiHistory: [],
            temperatureHistory: [],
            datasHistory: [],
            pm10Forecast: [],
            pm25Forecast: [],
            caqiForecast: [],
            datasForecast: [],
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
            chartDataMinMaxChanged: false,
            dayNameOfWeek: "",
            dayDate: "",
            rateValue: "",
            pm10: "",
            pm25: "",
            pm1: "",
            temperature: "",
            pressure: "",
            humidity: "",
            tabs: ["CAQI", "PM", "TEMPERATURA"],
            tabsPrediction: ["CAQI", "PM"],
            selected: "CAQI",
            selectedPrediction: "CAQIPrediction",
            chartTypeHistory: 0,
            chartTypePrediction: 3,
        };
    },
    props: ['url', 'cityName'],
    watch: { 
        url: function(newVal, oldVal) { 
            let url = newVal;
            axios.get(url)
                .then(response => {
                    this.buildList(response.data);
                })
                .catch(err => console.log(err))
        }
    },
    methods: {
        changeMenu(name){
            if(name == "CAQI"){
                this.changeChartData("0", "categoryMenuHistory");
                this.selected = name;
            }
            else if(name == "PM"){
                this.changeChartData("1", "categoryMenuHistory");
                this.selected = name;
            }
            else if(name == "TEMPERATURA"){
                this.changeChartData("2", "categoryMenuHistory");
                this.selected = name;
            }
            else if(name == "CAQIPrediction"){
                this.changeChartData("3", "categoryMenuPrediction");
                this.selectedPrediction = name;
            }
            else if(name == "PMPrediction"){
                this.changeChartData("4", "categoryMenuPrediction");
                this.selectedPrediction = name;
            }
        },
        buildList: function(res){
            this.dataCityCurrent = res.current;
            this.dataCityHistory = res.history;
            this.dataCityForecast = res.forecast;
            {
                this.dataCityHistory.map(
                    (object, i) =>
                    (this.pm10History[i] = object.values[2].value)
                );
            }
            {
                this.dataCityHistory.map(
                    (object, i) =>
                    (this.pm25History[i] = object.values[1].value)
                );
            }
            {
                this.dataCityHistory.map(
                    (object, i) => (this.caqiHistory[i] = object.indexes[0].value)
                );
            }
            {
                this.dataCityHistory.map(
                    (object, i) =>
                    (this.temperatureHistory[i] = object.values[5].value)
                );
            }
            {
                this.dataCityHistory.map(
                    (object, i) =>
                    (this.datasHistory[i] = moment.utc(
                        this.dataCityHistory[i].fromDateTime
                    ).format("DD/MM HH:mm"))
                );
            }
            {
                this.dataCityForecast.map(
                    (object, i) =>
                    (this.pm10Forecast[i] = object.values[0].value)
                );
            }
            {
                this.dataCityForecast.map(
                    (object, i) =>
                    (this.pm25Forecast[i] = object.values[1].value)
                );
            }
            {
                this.dataCityForecast.map(
                    (object, i) => (this.caqiForecast[i] = object.indexes[0].value)
                );
            }
            {
                this.dataCityForecast.map(
                    (object, i) =>
                    (this.datasForecast[i] = moment.utc(
                        this.dataCityForecast[i].fromDateTime
                    ).format("DD/MM HH:mm"))
                );
            }
            
            this.createChartSelected(
                this.datasHistory,
                this.caqiHistory,
                false,
                false,
                "chartDataHistory"
            );
            this.createChartSelected(
                this.datasForecast,
                this.caqiForecast,
                false,
                false,
                "chartDataForecast"
            );
            this.setCurrentData();
            this.createGraphHistoricMinMax("first");
        },
        createGraphHistoricMinMax(type){
            const arrMin = arr => Math.min(...arr);
            const arrMax = arr => Math.max(...arr);
            const arrAvg = arr => arr.reduce((a,b) => a + b, 0) / arr.length
            var minCaquiHistory, minCaquiHistoryIndex, maxCaquiHistory, maxCaquiHistoryIndex, avgCaquiHistory, minArray, maxArray, avgArray;
            if(type == "first" ){
                minCaquiHistory = arrMin(this.caqiHistory);
                minCaquiHistoryIndex = this.caqiHistory.indexOf(minCaquiHistory);
                maxCaquiHistory = arrMax(this.caqiHistory);
                maxCaquiHistoryIndex = this.caqiHistory.indexOf(maxCaquiHistory);
                avgCaquiHistory = arrAvg(this.caqiHistory).toFixed(2);;
                minArray = Array(this.caqiHistory.length).fill(null);    
                maxArray = Array(this.caqiHistory.length).fill(null); 
                avgArray = Array(this.caqiHistory.length).fill(avgCaquiHistory); 
                this.minArrayFirst= Array(this.caqiHistory.length).fill(null); 
                this.minArrayFirst[minCaquiHistoryIndex] = minCaquiHistory;
                this.maxArrayFirst= Array(this.caqiHistory.length).fill(null); 
                this.maxArrayFirst[maxCaquiHistoryIndex] = maxCaquiHistory;
                this.avgArrayFirst = avgArray;
            }
            else if(type == "second" ){
                minCaquiHistory = arrMin(this.caqiHistory);
                minCaquiHistoryIndex = this.caqiHistory.indexOf(minCaquiHistory);
                maxCaquiHistory = arrMax(this.caqiHistory);
                maxCaquiHistoryIndex = this.caqiHistory.indexOf(maxCaquiHistory);
                avgCaquiHistory = arrAvg(this.caqiHistory).toFixed(2);;
                minArray = Array(this.caqiHistory.length).fill(null);    
                maxArray = Array(this.caqiHistory.length).fill(null); 
                avgArray = Array(this.caqiHistory.length).fill(avgCaquiHistory);
                this.minArraySecond= Array(this.caqiHistory.length).fill(null);
                this.minArraySecond[minCaquiHistoryIndex] = minCaquiHistory;
                this.maxArraySecond= Array(this.caqiHistory.length).fill(null); 
                this.maxArraySecond[maxCaquiHistoryIndex] = maxCaquiHistory;
                this.avgArraySecond = avgArray;
            }

            minArray[minCaquiHistoryIndex] = minCaquiHistory;
            maxArray[maxCaquiHistoryIndex] = maxCaquiHistory;

            this.chartDataMinMax= {
                type: 'line',
                data: {
                    datasets: [
                        {
                        label: 'Wartość średnia',
                        data: avgArray,
                        fill: false,
                        type: 'line'
                    },
                    {
                        label: 'Maximum',
                        backgroundColor: "rgb(48, 134, 204)",
                        pointBackgroundColor: "rgb(48, 134, 204)",
                        pointBorderColor: "#55bae7",
                        data: maxArray
                    },
                    {
                        label: 'Minimum',
                        backgroundColor: "#18e02a",
                        pointBackgroundColor: "#18e02a",
                        pointBorderColor: "#18e02a",
                        data: minArray
                    },],
                    labels: this.datasHistory
                },
                options: {
                    legend: {
                        display: true
                    }
                },
                isLoaded: true
            }
            //this.setState({ chartDataMinMaxChanged: true });
        },
        setCurrentData(){
            var day = moment.utc(this.dataCityCurrent.fromDateTime, "YYYY-MM-DD HH:mm:ss");
            var dayNameOfWeek = day.format('dddd').charAt(0).toUpperCase() + day.format('dddd').slice(1);
            var dayDate = day.format('DD-MM-YYYY');
            var rate = this.dataCityCurrent.indexes[0].description;
            var rateValue = this.dataCityCurrent.indexes[0].value;
            var pm10 = this.dataCityCurrent.values[2].value;
            var pm25 = this.dataCityCurrent.values[1].value;
            var pm1 = this.dataCityCurrent.values[0].value;
            var temperature = this.dataCityCurrent.values[5].value;
            var pressure = this.dataCityCurrent.values[3].value;
            var humidity = this.dataCityCurrent.values[4].value;
            
            this.dayNameOfWeek = dayNameOfWeek;
            this.dayDate = dayDate;
            this.rate = rate;
            this.rateValue = rateValue;
            this.pm10 = pm10;
            this.pm25 = pm25;
            this.pm1 = pm1;
            this.temperature = temperature;
            this.pressure = pressure;
            this.humidity = humidity;
        },
        changeChartData(tabNumber, tabTitle){
            if (tabTitle == "categoryMenuPrediction") {
                this.chartDataForecast= {
                    isLoaded: false
                }
            } else {
                this.chartDataHistory= {
                    isLoaded: false
                }
            }
            this.chartDataHistoryChanged= false;
            this.chartDataForecastChanged= false;
            switch (tabNumber) {
                case "0":
                    this.createChartSelected(
                        this.datasHistory,
                        this.caqiHistory,
                        false,
                        false,
                        "chartDataHistory"
                    );
                    this.chartTypeHistory = 0;
                    break;
                case "1":
                    this.createChartSelected(
                        this.datasHistory,
                        this.pm25History,
                        this.pm10History,
                        true,
                        "chartDataHistory"
                    );
                    this.chartTypeHistory = 1;
                    break;
                case "2":
                    this.createChartSelected(
                        this.datasHistory,
                        this.temperatureHistory,
                        false,
                        false,
                        "chartDataHistory"
                    );
                    this.chartTypeHistory = 2;
                    break;
                case "3":
                    this.createChartSelected(
                    this.datasForecast,
                    this.caqiForecast,
                    false,
                    false,
                    "chartDataForecast"
                    );
                    this.chartTypePrediction = 3;
                    break;
                case "4":
                    this.createChartSelected(
                    this.datasForecast,
                    this.pm25Forecast,
                    this.pm10Forecast,
                    true,
                    "chartDataForecast"
                    );
                    this.chartTypePrediction = 4;
                    break;
                default: break;
            }
        },
        createChartSelected(labels, data, data2, display, chartType) {
            var chart = chartType;
            if (data2 == false) {
                this[chart]= {
                type: "bar",
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
                }
            }else {
                this[chart]= {
                type: "line",
                data: {
                    labels: labels,
                    datasets: [
                    {
                        label: "PM2.5",
                        borderColor: "#7b7f8e",
                        backgroundColor: "#7b7f8ea6",
                        fill: true,
                        data: data
                    },
                    {
                        label: "PM10",
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
                }
            }
        },
        updateChart(){  }
    },
    mounted: function(){
        let url = this.url; axios.get(url)
            .then(response => {
                this.buildList(response.data);
            })
            .catch(err => console.log(err))
    },
    
}
</script>

<style scoped>

</style>