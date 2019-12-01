<template>
    <div>
       <div class="informations__row">
            <div class="row__title"><span class="name__data name__data-first">{{this.firstCity}}</span> <span class="name__data"> - </span> <span class="name__data name__data-second">{{this.secondCity}}</span></div>
        </div>
        <div class="informations__row">
          <div class="row_name">Dane historyczne</div>
            <div>
                <div class="row__menu-historic">
                    <div
                        v-for="tab in tabs"
                        :key="tab"
                        @click="changeMenu(tab)"
                        :class="['menu-historic-comp__item menu-historic__item--25', { 'menu-historic__item--selected': selected === tab }]">
                        {{ tab }}
                    </div>
                </div>
            </div>
            <div v-if="chartTypeHistory == 0 || chartTypeHistory == 3">
                <BarChart :height="200"  :options="this.airlyChartDataHistory.options"  :chart-data="this.airlyChartDataHistory.data"/>
            </div>
            <div v-else-if="chartTypeHistory == 1 || chartTypeHistory == 2">
                <LineChart :height="200"    :options="this.airlyChartDataHistory.options"  :chart-data="this.airlyChartDataHistory.data"/>
            </div>
        </div>
        <div class="informations__row">
            <div class="row_name">Ekstrema ogólnej jakości powietrza (CAQUI)</div>
            <LineChart  :height="200" :options="this.airlyChartDataMinMax.options"  :chart-data="this.airlyChartDataMinMax.data"/>
        </div>
        <div class="informations__row">
          <div class="row_name">Prognoza na następne dni</div>
            <div>
                <div class="row__menu-historic">
                    <div
                        v-for="tab in tabsPrediction"
                        :key="tab"
                        @click="changeMenu(tab + 'Prediction')"
                        :class="['menu-prediction-comp__item', { 'menu-prediction__item--selected': selectedPrediction === tab + 'Prediction' }]">
                        {{ tab }}
                    </div>
                </div>
            </div>
            <div v-if="chartTypePrediction == 4">
                <BarChart  :height="200" :options="this.airlyChartDataForecast.options"  :chart-data="this.airlyChartDataForecast.data"/>
            </div>
            <div v-else-if="chartTypePrediction == 5 || chartTypePrediction == 6">
                <LineChart  :height="200" :options="this.airlyChartDataForecast.options"  :chart-data="this.airlyChartDataForecast.data"/>
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
            
            tabs: ["CAQI", "PM 2.5", "PM 10", "TEMPERATURA"],
            tabsPrediction: ["CAQI", "PM 2.5", "PM 10"],
            selected: "CAQI",
            selectedPrediction: "CAQIPrediction",
            chartTypeHistory: 0,
            chartTypePrediction: 4,





            //First city
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
            
            //Second city
            dataFromAirlyCurrent2: null,
            dataFromAirlyHistory2: null,
            dataFromAirlyForecast2: null,
            pm10ValuesFromAirlyHistory2: [],
            pm25ValuesFromAirlyHistory2: [],
            caqiFromAirlyHistory2: [],
            temperatureFromAirlyHistory2: [],
            datasFromAirlyHistory2: [],
            pm10ValuesFromAirlyForecast2: [],
            pm25ValuesFromAirlyForecast2: [],
            caqiFromAirlyForecast2: [],
            datasFromAirlyForecast2: [],
            airlyChartDataHistory: {
                isLoaded: false
            },
            airlyChartDataForecast: {
             isLoaded: false
            },
            airlyChartDataMinMax: {
                isLoaded: false
            },
            airlyChartDataHistoryChanged: false,
            airlyChartDataForecastChanged: false,
            airlyChartDataMinMaxChanged: false,
        };
    },
    props: ['url', 'url1', 'url2', 'firstCity', 'secondCity'],
    watch: { 
        url1: function(newVal, oldVal) { 
            let url1 = newVal;
            axios.get(url1)
                .then(response => {
                    this.buildList1(response.data);
                })
                .catch(err => console.log(err))
        },
        url2: function(newVal, oldVal) { 
            let url2 = newVal;
            axios.get(url2)
                .then(response => {
                    this.buildList2(response.data);
                })
                .catch(err => console.log(err))
        },
    },
    methods: {
        changeMenu(name){
            if(name == "CAQI"){
                this.changeChartData("0", "categoryMenuHistoryComparison");
                this.selected = name;
            }
            else if(name == "PM 2.5"){
                this.changeChartData("1", "categoryMenuHistoryComparison");
                this.selected = name;
            }
            else if(name == "PM 10"){
                this.changeChartData("2", "categoryMenuHistoryComparison");
                this.selected = name;
            }
            else if(name == "TEMPERATURA"){
                this.changeChartData("3", "categoryMenuHistoryComparison");
                this.selected = name;
            }
            else if(name == "CAQIPrediction"){
                this.changeChartData("4", "categoryMenuPredictionComparison");
                this.selectedPrediction = name;
            }
            else if(name == "PM 2.5Prediction"){
                this.changeChartData("5", "categoryMenuPredictionComparison");
                this.selectedPrediction = name;
            }
            else if(name == "PM 10Prediction"){
                this.changeChartData("6", "categoryMenuPredictionComparison");
                this.selectedPrediction = name;
            }
        },
        /*buildList: function(res){
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
            this.createGraphHistoricMinMax("gda");
        },*/
        buildList1: function(res){
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
                    (this.datasFromAirlyHistory[i] = moment.utc(
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
                    (this.datasFromAirlyForecast[i] = moment.utc(
                        this.dataFromAirlyForecast[i].fromDateTime
                    ).format("DD/MM HH:mm"))
                );
            }
            
            /*this.createChartSelected(
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
            this.createGraphHistoricMinMax("gda");*/

            this.changeChartDataOnload();
        },
        buildList2: function(res){
            this.dataFromAirlyCurrent2 = res.current;
            this.dataFromAirlyHistory2 = res.history;
            this.dataFromAirlyForecast2 = res.forecast;
            
            {
                this.dataFromAirlyHistory2.map(
                    (object, i) =>
                    (this.pm10ValuesFromAirlyHistory2[i] = object.values[2].value)
                );
            }
            {
                this.dataFromAirlyHistory2.map(
                    (object, i) =>
                    (this.pm25ValuesFromAirlyHistory2[i] = object.values[1].value)
                );
            }
            {
                this.dataFromAirlyHistory2.map(
                    (object, i) => (this.caqiFromAirlyHistory2[i] = object.indexes[0].value)
                );
            }
            {
                this.dataFromAirlyHistory2.map(
                    (object, i) =>
                    (this.temperatureFromAirlyHistory2[i] = object.values[5].value)
                );
            }
            {
                this.dataFromAirlyHistory2.map(
                    (object, i) =>
                    (this.datasFromAirlyHistory2[i] = moment.utc(
                        this.dataFromAirlyHistory2[i].fromDateTime
                    ).format("DD/MM HH:mm"))
                );
            }
            {
                this.dataFromAirlyForecast2.map(
                    (object, i) =>
                    (this.pm10ValuesFromAirlyForecast2[i] = object.values[0].value)
                );
            }
            {
                this.dataFromAirlyForecast2.map(
                    (object, i) =>
                    (this.pm25ValuesFromAirlyForecast2[i] = object.values[1].value)
                );
            }
            {
                this.dataFromAirlyForecast2.map(
                    (object, i) => (this.caqiFromAirlyForecast2[i] = object.indexes[0].value)
                );
            }
            {
                this.dataFromAirlyForecast2.map(
                    (object, i) =>
                    (this.datasFromAirlyForecast2[i] = moment.utc(
                        this.dataFromAirlyForecast2[i].fromDateTime
                    ).format("DD/MM HH:mm"))
                );
            }

            /*this.createChartSelected(
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
            this.createGraphHistoricMinMax("gda");*/

            this.changeChartDataOnload();
        },
        changeChartDataOnload: function(){
            
            this.airlyChartDataForecast = {
                isLoaded: false
            },
            this.airlyChartDataHistory = {
                isLoaded: false
            },
            this.airlyChartDataMinMax = {
                isLoaded: false
            },

            this.airlyChartDataHistoryChanged = false,
            this.airlyChartDataForecastChanged = false,
            this.airlyChartDataMinMaxChanged = false

            this.createChartSelected(
                this.datasFromAirlyHistory,
                this.caqiFromAirlyHistory,
                this.caqiFromAirlyHistory2,
                true,
                'bar',
                this.firstCity, 
                this.secondCity,
                "airlyChartDataHistory"
            );
            this.createChartSelected(
                this.datasFromAirlyForecast,
                this.caqiFromAirlyForecast,
                this.caqiFromAirlyForecast2,
                true,
                'bar',
                this.firstCity, 
                this.secondCity,
                "airlyChartDataForecast"
            );
            
            this.createGraphHistoricMinMax(this.firstCity, this.secondCity);
        },
        createGraphHistoricMinMax(firstCity, secondCity){
            const arrMin = arr => Math.min(...arr);
            const arrMax = arr => Math.max(...arr);
            const arrAvg = arr => arr.reduce((a,b) => a + b, 0) / arr.length
            var minCaquiHistory, minCaquiHistoryIndex, maxCaquiHistory, 
                maxCaquiHistoryIndex, avgCaquiHistory, minArray, maxArray, 
                avgArray, minArrayFirst, maxArrayFirst, avgArrayFirst,
                minArraySecond, maxArraySecond, avgArraySecond;
            
            //first city
            minCaquiHistory = arrMin(this.caqiFromAirlyHistory);
            minCaquiHistoryIndex = this.caqiFromAirlyHistory.indexOf(minCaquiHistory);
            maxCaquiHistory = arrMax(this.caqiFromAirlyHistory);
            maxCaquiHistoryIndex = this.caqiFromAirlyHistory.indexOf(maxCaquiHistory);
            avgCaquiHistory = arrAvg(this.caqiFromAirlyHistory).toFixed(2);;
            minArray = Array(this.caqiFromAirlyHistory.length).fill(null);    
            maxArray = Array(this.caqiFromAirlyHistory.length).fill(null); 
            avgArray = Array(this.caqiFromAirlyHistory.length).fill(avgCaquiHistory); 
            minArrayFirst= Array(this.caqiFromAirlyHistory.length).fill(null); 
            minArrayFirst[minCaquiHistoryIndex] = minCaquiHistory;
            maxArrayFirst= Array(this.caqiFromAirlyHistory.length).fill(null); 
            maxArrayFirst[maxCaquiHistoryIndex] = maxCaquiHistory;
            avgArrayFirst = avgArray;

            //second city
            minCaquiHistory = arrMin(this.caqiFromAirlyHistory2);
            minCaquiHistoryIndex = this.caqiFromAirlyHistory2.indexOf(minCaquiHistory);
            maxCaquiHistory = arrMax(this.caqiFromAirlyHistory2);
            maxCaquiHistoryIndex = this.caqiFromAirlyHistory2.indexOf(maxCaquiHistory);
            avgCaquiHistory = arrAvg(this.caqiFromAirlyHistory2).toFixed(2);;
            minArray = Array(this.caqiFromAirlyHistory2.length).fill(null);    
            maxArray = Array(this.caqiFromAirlyHistory2.length).fill(null); 
            avgArray = Array(this.caqiFromAirlyHistory2.length).fill(avgCaquiHistory);
            minArraySecond= Array(this.caqiFromAirlyHistory2.length).fill(null);
            minArraySecond[minCaquiHistoryIndex] = minCaquiHistory;
            maxArraySecond= Array(this.caqiFromAirlyHistory.length).fill(null); 
            maxArraySecond[maxCaquiHistoryIndex] = maxCaquiHistory;
            avgArraySecond = avgArray;

            this.airlyChartDataMinMax= {
                type: 'line',
                data: {
                    datasets: [
                        {
                        label: 'Wartość średnia ' + firstCity,
                        data: avgArrayFirst,
                        fill: false,
                        type: 'line'
                    },
                    {
                        label: 'Wartość średnia ' + secondCity,
                        data: avgArraySecond,
                        fill: false,
                        type: 'line',
                        backgroundColor: "#a7a7b1",
                        borderColor: "#a7a7b1",
                    },
                    {
                        label: 'Maximum ' + firstCity,
                        backgroundColor: "rgb(48, 134, 204)",
                        pointBackgroundColor: "rgb(48, 134, 204)",
                        pointBorderColor: "#55bae7",
                        data: maxArrayFirst
                    },
                    {
                        label: 'Maximum ' + secondCity,
                        backgroundColor: "#00495f",
                        pointBackgroundColor: "#00495f",
                        pointBorderColor: "#00495f",
                        data: maxArraySecond
                    },
                    {
                        label: 'Minimum ' + firstCity,
                        backgroundColor: "#18e02a",
                        pointBackgroundColor: "#18e02a",
                        pointBorderColor: "#18e02a",
                        data: minArrayFirst
                    },
                    {
                        label: 'Minimum ' + secondCity,
                        backgroundColor: "#00a20f",
                        pointBackgroundColor: "#00a20f",
                        pointBorderColor: "#00a20f",
                        data: minArraySecond
                    },
                    ],
                    labels: this.datasFromAirlyHistory
                },
                options: {
                    legend: {
                        display: true
                    }
                },
                isLoaded: true
            }
            this.airlyChartDataMinMaxChanged= true ;
        },
        changeChartData(tabNumber, tabTitle){
            if (tabTitle == "categoryMenuPredictionComparison") {
                this.airlyChartDataForecast= {
                    isLoaded: false
                }
            } else {
                this.airlyChartDataHistory= {
                    isLoaded: false
                }
            }
            this.airlyChartDataHistoryChanged= false;
            this.airlyChartDataForecastChanged= false;
            switch (tabNumber) {
                case "0":
                    this.createChartSelected(
                        this.datasFromAirlyHistory,
                        this.caqiFromAirlyHistory,
                        this.caqiFromAirlyHistory2,
                        true,
                        'bar',
                        this.firstCity, 
                        this.secondCity,
                        "airlyChartDataHistory"
                    );
                    this.chartTypeHistory = 0;
                    break;
                case "1":
                    this.createChartSelected(
                        this.datasFromAirlyHistory,
                        this.pm25ValuesFromAirlyHistory,
                        this.pm25ValuesFromAirlyHistory2,
                        true, 
                        'line', 
                        this.firstCity, 
                        this.secondCity,
                        "airlyChartDataHistory"
                    );
                    this.chartTypeHistory = 1;
                    break;
                case "2":
                    this.createChartSelected(
                        this.datasFromAirlyHistory,
                        this.pm10ValuesFromAirlyHistory,
                        this.pm10ValuesFromAirlyHistory2,
                        true,
                        'line', 
                        this.firstCity, 
                        this.secondCity,
                        "airlyChartDataHistory"
                    );
                    this.chartTypeHistory = 2;
                    break;
                case "3":
                    this.createChartSelected(
                        this.datasFromAirlyForecast,
                        this.temperatureFromAirlyHistory,
                        this.temperatureFromAirlyHistory2,
                        true,
                        'bar',
                        this.firstCity, 
                        this.secondCity,
                        "airlyChartDataHistory"
                    );
                    this.chartTypeHistory = 3;
                    break;
                case "4":
                    this.createChartSelected(
                        this.datasFromAirlyForecast,
                        this.caqiFromAirlyForecast,
                        this.caqiFromAirlyForecast2,
                        true,
                        'bar',
                        this.firstCity, 
                        this.secondCity,
                        "airlyChartDataForecast"
                    );
                    this.chartTypePrediction = 4;
                    break;
                case "5":
                    this.createChartSelected(
                        this.datasFromAirlyForecast,
                        this.pm25ValuesFromAirlyForecast,
                        this.pm25ValuesFromAirlyForecast2,
                        true,
                        'line',
                        this.firstCity, 
                        this.secondCity,
                        "airlyChartDataForecast"
                    );
                    this.chartTypePrediction = 5;
                    break;
                case "6":
                    this.createChartSelected(
                        this.datasFromAirlyForecast,
                        this.pm10ValuesFromAirlyForecast,
                        this.pm10ValuesFromAirlyForecast2,
                        true,
                        'line',
                        this.firstCity, 
                        this.secondCity,
                        "airlyChartDataForecast"
                    );
                    this.chartTypePrediction = 6;
                    break;
                default: break;
            }
        },
        createChartSelected(labels, data, data2, display, type, label1, label2, chartType) {
           
            var chart = chartType;
            if (data2 == false) {
                this[chart]= {
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
                }
            }else {
                this[chart]= {
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
                }
            }
            if (chartType == "airlyChartDataHistory") {
                this.airlyChartDataHistoryChanged= true;
            } else if (chartType == "airlyChartDataForecast") {
                this.airlyChartDataForecastChanged= true;
            }
        },
        /*updateChart: function(airlyChartDataChangedType){
            if (airlyChartDataChangedType == "airlyChartDataHistoryChanged") {
            if (this.airlyChartDataHistoryChanged) {
                if (this.airlyChartDataHistory.isLoaded) {
                    if (this.state.airlyChartDataHistory.type == "line") {
                        return (
                            <Line
                            ref="chart"
                            data={this.state.airlyChartDataHistory.data}
                            options={this.state.airlyChartDataHistory.options}
                            redraw
                            />
                        );
                    } else {
                        return (
                            <Bar
                            ref="chart"
                            data={this.state.airlyChartDataHistory.data}
                            options={this.state.airlyChartDataHistory.options}
                            redraw
                            />
                        );
                    }
                } else {
                    return <div>Loading...</div>;
                }
            } else {
                if (this.state.airlyChartDataHistory.type == "line") {
                    return (
                    <Line
                        ref="chart"
                        data={this.state.airlyChartDataHistory.data}
                        options={this.state.airlyChartDataHistory.options}
                    />
                    );
                } else {
                    return (
                    <Bar
                        ref="chart"
                        data={this.state.airlyChartDataHistory.data}
                        options={this.state.airlyChartDataHistory.options}
                    />
                    );
                }
            }
        } else if(airlyChartDataChangedType == "airlyChartDataMinMaxChanged"){
            if (this.state.airlyChartDataMinMax.isLoaded) {
                return (
                    <Line
                    ref="chart"
                    data={this.state.airlyChartDataMinMax.data}
                    options={this.state.airlyChartDataMinMax.options}
                    redraw
                    />
                );
            }
        } else {
            if (this.state.airlyChartDataForecastChanged) {
                if (this.state.airlyChartDataForecast.isLoaded) {
                    if (this.state.airlyChartDataForecast.type == "line") {
                    return (
                        <Line
                        ref="chart"
                        data={this.state.airlyChartDataForecast.data}
                        options={this.state.airlyChartDataForecast.options}
                        redraw
                        />
                    );
                    } else {
                    return (
                        <Bar
                        ref="chart"
                        data={this.state.airlyChartDataForecast.data}
                        options={this.state.airlyChartDataForecast.options}
                        redraw
                        />
                    );
                    }
                } else {
                    return <div>Loading...</div>;
                }
            } else {
                if (this.state.airlyChartDataForecast.type == "line") {
                    return (
                    <Line
                        ref="chart"
                        data={this.state.airlyChartDataForecast.data}
                        options={this.state.airlyChartDataForecast.options}
                    />
                    );
                } else {
                    return (
                    <Bar
                        ref="chart"
                        data={this.state.airlyChartDataForecast.data}
                        options={this.state.airlyChartDataForecast.options}
                    />
                    );
                }
            }
        }
        }*/
    },
    mounted: function(){
       /* let url = this.url;
            //"https://airapi.airly.eu/v2/measurements/nearest?indexType=AIRLY_CAQI&lat=54.37108&lng=18.61796&maxDistanceKM=1&apikey=91IYoXFWJTxEuGLBOVr60JyFMvSSGN1y";
         axios.get(url)
            .then(response => {
                this.buildList(response.data);
            })
            .catch(err => console.log(err))*/

        let url1 = this.url1;
        let url2 = this.url2;

        Promise.all([fetch(url1), fetch(url2)])
        .then(([res1, res2]) => Promise.all([res1.json(), res2.json()]))
        .then(([res1, res2]) => {
            this.buildList1(res1);
            this.buildList2(res2);
            
        });
    },
    
}
</script>

<style scoped>

</style>