<template>
    <div>
        <CurrentData :dayNameOfWeek="this.dayNameOfWeek" :dayDate="this.dayDate" :rate="this.rate"
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
                <BarChart  :options="this.airlyChartDataHistory.options"  :chart-data="this.airlyChartDataHistory.data"/>
            </div>
            <div v-else-if="chartTypeHistory == 1">
                <LineChart  :options="this.airlyChartDataHistory.options"  :chart-data="this.airlyChartDataHistory.data"/>
            </div>
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
                <BarChart  :options="this.airlyChartDataForecast.options"  :chart-data="this.airlyChartDataForecast.data"/>
            </div>
            <div v-else-if="chartTypePrediction == 4">
                <LineChart  :options="this.airlyChartDataForecast.options"  :chart-data="this.airlyChartDataForecast.data"/>
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
    name: 'InformationsAirly',
    components: {
        CurrentData,
        LineChart,
        BarChart
    },
    data: function() {
        return {
            dataFromAirlyCurrent: null,
            dataFromAirlyHistory: null,
            dataFromAirlyForecast: null,
            pm10ValuesFromAirlyHistory: [],
            pm25ValuesFromAirlyHistory: [],
            caqiFromAirlyHistory: [],
            temperatureFromAirlyHistory: [],
            datasFromAirlyHistory: [],
            pm10ValuesFromAirlyForecast: [],
            pm25ValuesFromAirlyForecast: [],
            caqiFromAirlyForecast: [],
            datasFromAirlyForecast: [],
            airlyChartDataHistory: {
                isLoaded: false
            },
            airlyChartDataForecast: {
             isLoaded: false
            },
            airlyChartDataHistoryChanged: false,
            airlyChartDataForecastChanged: false,
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
    props: {
        //url,
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
            this.dataFromAirlyCurrent = res.current;
            this.dataFromAirlyHistory = res.history;
            this.dataFromAirlyForecast = res.forecast;
            {
                this.dataFromAirlyHistory.map(
                    (object, i) =>
                    (this.pm10ValuesFromAirlyHistory[i] = object.values[2].value)
                );
            }
            {
                this.dataFromAirlyHistory.map(
                    (object, i) =>
                    (this.pm25ValuesFromAirlyHistory[i] = object.values[1].value)
                );
            }
            {
                this.dataFromAirlyHistory.map(
                    (object, i) => (this.caqiFromAirlyHistory[i] = object.indexes[0].value)
                );
            }
            {
                this.dataFromAirlyHistory.map(
                    (object, i) =>
                    (this.temperatureFromAirlyHistory[i] = object.values[5].value)
                );
            }
            {
                this.dataFromAirlyHistory.map(
                    (object, i) =>
                    (this.datasFromAirlyHistory[i] = moment(
                        this.dataFromAirlyHistory[i].fromDateTime
                    ).format("DD/MM HH:mm"))
                );
            }
            {
                this.dataFromAirlyForecast.map(
                    (object, i) =>
                    (this.pm10ValuesFromAirlyForecast[i] = object.values[0].value)
                );
            }
            {
                this.dataFromAirlyForecast.map(
                    (object, i) =>
                    (this.pm25ValuesFromAirlyForecast[i] = object.values[1].value)
                );
            }
            {
                this.dataFromAirlyForecast.map(
                    (object, i) => (this.caqiFromAirlyForecast[i] = object.indexes[0].value)
                );
            }
            {
                this.dataFromAirlyForecast.map(
                    (object, i) =>
                    (this.datasFromAirlyForecast[i] = moment(
                        this.dataFromAirlyForecast[i].fromDateTime
                    ).format("DD/MM HH:mm"))
                );
            }
            
            this.createChartSelected(
                this.datasFromAirlyHistory,
                this.caqiFromAirlyHistory,
                false,
                false,
                "airlyChartDataHistory"
            );
            this.createChartSelected(
                this.datasFromAirlyForecast,
                this.caqiFromAirlyForecast,
                false,
                false,
                "airlyChartDataForecast"
            );
            this.setCurrentDataAirly();
        },
        setCurrentDataAirly(){
            var day = moment(this.dataFromAirlyCurrent.fromDateTime, "YYYY-MM-DD HH:mm:ss");
            var dayNameOfWeek = day.format('dddd').charAt(0).toUpperCase() + day.format('dddd').slice(1);
            var dayDate = day.format('DD-MM-YYYY');
            var rate = this.dataFromAirlyCurrent.indexes[0].description;
            var rateValue = this.dataFromAirlyCurrent.indexes[0].value;
            var pm10 = this.dataFromAirlyCurrent.values[2].value;
            var pm25 = this.dataFromAirlyCurrent.values[1].value;
            var pm1 = this.dataFromAirlyCurrent.values[0].value;
            var temperature = this.dataFromAirlyCurrent.values[5].value;
            var pressure = this.dataFromAirlyCurrent.values[3].value;
            var humidity = this.dataFromAirlyCurrent.values[4].value;
            
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
                this.airlyChartDataForecast= {
                    isLoaded: false
                }
            } else {
                this.airlyChartDataHistory= {
                    isLoaded: false
                }
            }
            console.log(tabNumber + "    " + tabTitle);
            this.airlyChartDataHistoryChanged= false;
            this.airlyChartDataForecastChanged= false;
            switch (tabNumber) {
                case "0":
                    this.createChartSelected(
                        this.datasFromAirlyHistory,
                        this.caqiFromAirlyHistory,
                        false,
                        false,
                        "airlyChartDataHistory"
                    );
                    this.chartTypeHistory = 0;
                    console.log(this.airlyChartDataHistory);
                    break;
                case "1":
                    this.createChartSelected(
                        this.datasFromAirlyHistory,
                        this.pm25ValuesFromAirlyHistory,
                        this.pm10ValuesFromAirlyHistory,
                        true,
                        "airlyChartDataHistory"
                    );
                    this.chartTypeHistory = 1;
                    console.log(this.airlyChartDataHistory.data);
                    break;
                case "2":
                    this.createChartSelected(
                        this.datasFromAirlyHistory,
                        this.temperatureFromAirlyHistory,
                        false,
                        false,
                        "airlyChartDataHistory"
                    );
                    this.chartTypeHistory = 2;
                    break;
                case "3":
                    this.createChartSelected(
                    this.datasFromAirlyForecast,
                    this.caqiFromAirlyForecast,
                    false,
                    false,
                    "airlyChartDataForecast"
                    );
                    this.chartTypePrediction = 3;
                    break;
                case "4":
                    this.createChartSelected(
                    this.datasFromAirlyForecast,
                    this.pm25ValuesFromAirlyForecast,
                    this.pm10ValuesFromAirlyForecast,
                    true,
                    "airlyChartDataForecast"
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
            console.log("this.airlyChartDataForecast");
            console.log(this.airlyChartDataForecast);
           /* if (chartType == "airlyChartDataHistory") {
            this.setState({ airlyChartDataHistoryChanged: true });
            } else if (chartType == "airlyChartDataForecast") {
            this.setState({ airlyChartDataForecastChanged: true });
            }*/
        },
        updateChart(){
            //return (<BarChart :options='this.airlyChartDataHistory.options'  :chart-data="this.airlyChartDataHistory.data"/> );
        }
    },
    mounted: function(){
        let url = //this.props.url;
            "https://airapi.airly.eu/v2/measurements/nearest?indexType=AIRLY_CAQI&lat=54.37108&lng=18.61796&maxDistanceKM=1&apikey=91IYoXFWJTxEuGLBOVr60JyFMvSSGN1y";
         axios.get(url)
            .then(response => {
                this.buildList(response.data);
            })
            .catch(err => console.log(err))
    },
    
}
</script>

<style scoped>

</style>