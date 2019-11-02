<template>
    <div>
        <div class="informations__row">
            <div class="row__title">
                <span class="name__data">PG</span>&nbsp
                <span class="current-date__day-name">{{this.dayNameOfWeek}}</span>&nbsp
                <span class="current-date__day-date">{{this.dayDate}}</span>
            </div>
            <div class="informations__row informations__row--currentpg">
                <div class="row_name">Pomiary na żywo</div>
            <div class="row__current row__current--half">
                <div class="current current_pm10">PM10: <span class="current__value">{{this.pm10}}</span> <span class="current__unit">µg/m³</span></div>
            </div>
            <div class="row__current row__current--half">
                <div class="current current_tem">PM2.5: <span class="current__value">{{this.pm25}}</span> <span class="current__unit">µg/m³</span></div>
            </div>
        </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import moment from 'moment'

export default {
    name: 'InformationsPg',
    data:function(){
        return{
            dataFromPgCurrent: null,
            mydate: "",
            day: "",
            dayNameOfWeek: "",
            dayDate: "",
            pm10: "",
            pm25: "",
        }
    },
    methods:{
        setCurrentDatePg: function(res){
            this.dataFromPgCurrent = res;

            console.log("res");
            console.log(res);
            var mydate = this.convertDate(this.dataFromPgCurrent["Stacja Testowa"].date);
            var day = moment(new Date(mydate), "YYYY-MM-DD HH:mm:ss");   
            var dayNameOfWeek = day.format('dddd').charAt(0).toUpperCase() + day.format('dddd').slice(1);
            var dayDate = day.format('DD-MM-YYYY');
            var pm10 = this.dataFromPgCurrent["Stacja Testowa"].pm10;
            var pm25 = this.dataFromPgCurrent["Stacja Testowa"].pm25;
            this.mydate = mydate;
            this.dayNameOfWeek = dayNameOfWeek;
            this.dayNameOfWeek = dayNameOfWeek;
            this.dayDate = dayDate;
            this.pm10 = pm10;
            this.pm25 = pm25;

            console.log("this.pm25 " + this.pm25);
        },
        convertDate: function( date ){
            var day = date.substring(0, date.indexOf(' '));
            var month = date.substring(date.indexOf(' ') + 1, date.indexOf(' ') + 4);
            var montfCount = "stylutmarkwimajczelipsiewrzpazlisgru".indexOf(month) / 3 + 1;
            if(montfCount<10){
                montfCount="0"+montfCount;
            }
            var year = date.substring(date.indexOf(' ') + 5, date.indexOf(' ') + 9);
            return year+"-"+montfCount+"-"+day;
        }
    },
    mounted: function(){
        console.log("mounted");
        let url =
            "https://smogpg.firebaseio.com/stations.json";
         axios.get(url)
            .then(response => {
                this.setCurrentDatePg(response.data);
            })
            .catch(err => console.log(err))
    },

}
</script>

<style scoped>

</style>