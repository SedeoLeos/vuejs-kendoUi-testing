<template>
  <Scheduler :data-items="dataItems" :model-fields="customModelFields" :default-date="displayDate" :view="view"
    :views="views" :editable="true" :resources="resources" :timezone="timezone" @datachange="handleDataChange"
    :item="'itemRender'" :header="'headerRender'">
    <template v-slot:headerRender="{ props }">
      <SchedulerHeader style="background-color: #fff;">
        <div class="contenaire grid">
          <SchedulerViewSelectorF :view="view" :views="views" @view-changed="handleViewChanged" />
          <div class="schedulerOption">
            <div class="conenaire-show"> <span>Vues</span></div>
            <div class="conenaire-filter"> <span>Filters (0)</span></div>
            <div class="conenaire-tache"> <span>Nouvelle Tache </span></div>
          </div>
          <div class="date navigation">
            <span> {{ "<" }} </span>
                Lundi 31 Mai - Dimanche 6 Juin 2023
                <span> >{{ ">" }}</span>
          </div>
        </div>
      </SchedulerHeader>SchedulerViewSelector
    </template>

    <template v-slot:itemRender="{ props }">
      <SchedulerItem v-bind="props">
        <div class="k-event-template" v-if="!props.isAllDay">
          {{ props.title }}
          <div :style="{ 'padding-top': '5px', display: 'flex' }">
            <img :src="props.dataItem.image" :style="{ width: '120px' }" :alt="'Event Image'" />
            <span :style="{ 'padding-left': '5px' }">{{
              props.description
            }}</span>
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
  background-color: bisque;
  display: flex;
  width: 300px;
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
import '@progress/kendo-date-math/tz/Etc/UTC';
import '@progress/kendo-date-math/tz/Europe/Sofia';
import '@progress/kendo-date-math/tz/Europe/Madrid';
import '@progress/kendo-date-math/tz/Asia/Dubai';
import '@progress/kendo-date-math/tz/Asia/Tokyo';
import '@progress/kendo-date-math/tz/America/New_York';
import '@progress/kendo-date-math/tz/America/Los_Angeles';
import { timezoneNames } from '@progress/kendo-date-math';
import { ToolbarSpacer } from '@progress/kendo-vue-buttons';
import {
  sampleDataWithCustomSchema,
  displayDate,
  customModelFields,
} from './events-utc';
import SchedulerViewSelectorF from "./components/fragment/ViewSelectorSchedulerF.vue";


export default {
  components: {
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
      timezone: 'Etc/UTC',
      timezones: timezoneNames(),
      dataItems: sampleDataWithCustomSchema,
      customModelFields: customModelFields,
      view: 'workweek',
      views: [
        { name: 'workweek', title: 'Semaines' },
        { name: 'month', title: 'Mois' },
        { name: 'agenda', title: 'Agenda' },
      ],
      displayDate,
      resources: [
        {
          name: 'Rooms',
          data: [
            { text: 'Meeting Room 101', value: 1 },
            { text: 'Meeting Room 201', value: 2, color: '#5392E4' },
          ],
          field: 'RoomID',
          valueField: 'value',
          textField: 'text',
          colorField: 'color',
        },
        {
          name: 'Persons',
          data: [
            { text: 'Peter', value: 1, color: '#5392E4' },
            { text: 'Alex', value: 2, color: '#54677B' },
          ],
          field: 'PersonIDs',
          valueField: 'value',
          textField: 'text',
          colorField: 'color',
        },
      ],
      group: {
        resources: ['Rooms'],
        orientation: 'horizontal',
      },
    };
  },
  methods: {
    handleDataChange(event: { created: any, updated: any, deleted: any }) {
      const newData = [...this.dataItems] // Filter the deleted items
        .filter(
          (item) =>
            event.deleted.find((current: { TaskID: number; }) => current.TaskID === item.TaskID) ===
            undefined
        ) // Find and replace the updated items
        .map(
          (item) =>
            event.updated.find((current: { TaskID: number; }) => current.TaskID === item.TaskID) || item
        ) // Add the newly created items and assign an `id`.
        .concat(
          event.created.map((item: any) =>
            Object.assign({}, item, {
              TaskID: guid(),
            })
          )
        );

      this.dataItems = newData;
    },
    handleTimezoneChange(event: { value: string; }) {
      this.timezone = event.value;
    },
    handleViewChanged(newView: any) {
      this.view = newView.name;
    }
  },
};
</script>