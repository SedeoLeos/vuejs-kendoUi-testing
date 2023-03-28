
<style>
div.contenaire.grid {
  width: 100%;
  height: 100px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(2, 1fr);
  align-items: center;
  justify-content: center;
}

div.schedulerOption {
  grid-row: 1/2;
  grid-column: 3/-1;
  justify-self: center;
  display: flex;
  justify-content: space-around;
}

div.date.navigation {
  grid-row: 2/3;
  grid-column: 1/-1;
  justify-self: center;
}
</style>
<script lang="ts">
import { guid } from '@progress/kendo-vue-common';
import { Scheduler, SchedulerItem, SchedulerHeader, NavigationDatePicker } from '@progress/kendo-vue-scheduler';
import { DropDownList } from '@progress/kendo-vue-dropdowns';
import { timezoneNames } from '@progress/kendo-date-math';
import { ToolbarSpacer } from '@progress/kendo-vue-buttons';
import {
  sampleDataWithCustomSchema,
  displayDate,
  customModelFields,
  customModelField,
  sampleDataWithResources,
} from './events-utc';
import SchedulerViewSelectorF from "./components/fragment/ViewSelectorSchedulerF.vue";
import {
  load,
  IntlProvider,
  loadMessages,
} from "@progress/kendo-vue-intl";
import frNumbers from "cldr-numbers-full/main/fr/numbers.json";
import frCaGregorian from "cldr-dates-full/main/fr/ca-gregorian.json";
import frDateFields from "cldr-dates-full/main/fr/dateFields.json";
import frTimeZoneNames from "cldr-dates-full/main/fr/timeZoneNames.json";
import frCurrencies from "cldr-numbers-full/main/fr/currencies.json";

import axios from 'axios'

load(
  frNumbers,
  frCaGregorian,
  frDateFields,
  frTimeZoneNames,
  frCurrencies
);
export default {
  components: {
    intl: IntlProvider,
    Scheduler,
    DropDownList,
    SchedulerItem,
    SchedulerHeader,
    NavigationDatePicker,
    ToolbarSpacer,
    SchedulerViewSelectorF,
  },

  data() {
    return {
      topRightNavElements: [{ id: 1, name: 'Vues', icon: 'mdi-eye', option: 'Week', showWeekend: null, startHour: '07:00', endHour: '15:00' }, { id: 2, name: 'Filtres(0)', icon: 'mdi-filter', option: 'Month', showWeekend: false, startHour: '07:00', endHour: '15:00' }, { id: 3, name: 'Nouvelle tache', icon: 'mdi-calendar-check', option: 'Week', showWeekend: null, startHour: '07:00', endHour: '15:00' }],
      timezone: 'Etc/UTC',
      timezones: timezoneNames(),
      dataItems: [],
      customModelFields: customModelFields,
      view: 'workweek',
      views: [
        { name: 'workweek', title: 'Semaines' },
        { name: 'month', title: 'Mois' },
        { name: 'agenda', title: 'Agenda' },
      ],
      displayDate,

    };
  },
  async beforeCreate() {
    const rep = await axios
      .get('http://127.0.0.1:3000/api/v1/daxium/test/submissions')

    let counter = 0;
    const datas = rep.data.datas.map((data: { titre: string, dateFin: number, dateDebut: number }) => {
      const currentYear = new Date().getFullYear();
      counter += 1;
      return {
        id: counter,
        titre: data.titre,
        dateFin: new Date(data.dateFin),
        dateDebut: new Date(data.dateDebut)
      }
    })
    this.dataItems = datas
    alert('berfor create')
    //console.table(this.dataItems)
    // console.log(datas)


  },

  methods: {
    
    handleTimezoneChange(event: { value: string; }) {
      this.timezone = event.value;
    },
    handleViewChanged(newView: any) {
      this.view = newView.name;
    }

  },
};
</script>
<template>
  <Scheduler :date="new Date()" :data-items="dataItems" :model-fields="customModelFields" :default-date="displayDate"
    :view="view" :views="views" :editable="true" :timezone="timezone" :item="'itemRender'"
    :header="'headerRender'">
    <template v-slot:headerRender="{ props }">
      <SchedulerHeader style="background-color: #fff;">
        <div class="contenaire grid">
          <SchedulerViewSelectorF :view="view" :views="views" @view-changed="handleViewChanged" />
          <div class="schedulerOption">
            <v-item-group selected-class="bg-purple">
              <v-item v-for="element in topRightNavElements" :key="element.id"
                v-slot="{ isSelected, selectedClass, toggle }">
                <v-btn variant="text" :prepend-icon="element.icon" :class="selectedClass" @click="toggle"> {{
                  element.name
                }}
                </v-btn>
              </v-item> 
            </v-item-group>
          </div>

          <div class="date navigation">
            <v-btn icon variant="text" class="btn-circle" @click="props.onPrevclick">
              <v-icon>mdi-chevron-left</v-icon>
            </v-btn>
            <NavigationDatePicker />
            <v-btn icon variant="text" class="btn-circle" @click="props.onNextclick">
              <v-icon>mdi-chevron-right</v-icon>
            </v-btn>
          </div>
        </div>
      </SchedulerHeader>SchedulerViewSelector
    </template>

    <template v-slot:itemRender="{ props }">
      <SchedulerItem v-bind="props">
        <div class="k-event-template" v-if="!props.isAllDay">
          <div>
            {{ props.title }}
          </div>
          <div :style="{ 'padding-top': '5px', display: 'flex' }">
            <span :style="{ 'padding-left': '5px' }">{{ props.id }}</span>
          </div>
        </div>
        <div class="k-event-template" v-else>
          <img
            :src="'https://static4.depositphotos.com/1004274/315/v/450/depositphotos_3152530-stock-illustration-eco-icon.jpg'"
            :style="{ width: '18px', 'padding-bottom': '5px' }" :alt="'Eco Icon'" />
          {{ props.title }}
        </div>
      </SchedulerItem>
    </template>
  </Scheduler>
</template>