<template>
  <div>
    <div class="informations__row">
      <div class="row__title">
        <span class="name__data">AIRLY</span>&nbsp
        <span class="current-date__day-name">{{ dayNameOfWeek }}</span
        >&nbsp
        <span class="current-date__day-date">{{ dayDate }}</span>
      </div>
    </div>
    <div class="separator"></div>
    <div class="informations__row informations__row--rate">
      <div class="row__rate-number">{{ this.rateValue }}</div>
      <div class="row__rate">{{ this.rate }}</div>
    </div>
    <div class="separator"></div>
    <div class="informations__row informations__row--current">
      <div class="row_name">Pomiary na żywo</div>
      <div class="row__current row__current--half">
        <div class="current current_pm10">
          PM10: <span class="current__value">{{ this.pm10 }}</span>
          <span class="current__unit">µg/m³</span>
        </div>
        <div class="current current_pm25">
          PM2.5: <span class="current__value">{{ this.pm25 }}</span>
          <span class="current__unit">µg/m³</span>
        </div>
        <div class="current current_pm1">
          PM1: <span class="current__value">{{ this.pm1 }}</span>
          <span class="current__unit">µg/m³</span>
        </div>
      </div>
      <div class="row__current row__current--half">
        <div class="current current_tem">
          TEMPERATURA:
          <span class="current__value">{{ this.temperature }}</span>
          <span class="current__unit">°C</span>
        </div>
        <div class="current current_pres">
          CIŚNIENIE: <span class="current__value">{{ this.pressure }}</span>
          <span class="current__unit">hPa</span>
        </div>
        <div class="current current_hum">
          WILGOTNOŚĆ: <span class="current__value">{{ this.humidity }}</span>
          <span class="current__unit">%</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "CurrentData",
  props: [
    "dayNameOfWeek",
    "dayDate",
    "rate",
    "rateValue",
    "pm10",
    "pm25",
    "pm1",
    "temperature",
    "pressure",
    "humidity"
  ]
};
</script>

<style scoped></style>
