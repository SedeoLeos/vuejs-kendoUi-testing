<template>
    <div class="viewSelectorScheduler">
        <button v-for="item in views" :key="view" :class="item.name === view ? 'active' : ''" :selected="item.name === view"
            @click="changeView(item)"> {{ item.title }}</button>
    </div>
</template>
<style>
div.viewSelectorScheduler {
    justify-self: center;
    width: 300px;
    height: 30px;
    display: flex;
    background-color: rgb(215, 215, 215);
    border-radius: 20px;
    align-items: center;
    justify-content: space-between;
    margin: 0;
    padding: 0;
}

div.viewSelectorScheduler button {
    border: none;
    background-color: transparent;
    font-weight: 400;
    padding-left: 20px;
    padding-right: 20px;
    height: 100%;
}

div.viewSelectorScheduler button.active {
    color: #fff;
    background-color: blueviolet;
    border-radius: 20px;
}
</style>
<script lang="ts">
export default {
    props: {
        view: {
            type: String,
            required: true
        },
        views: { type: Array<{ name: String, title: String }>, required: true },
    },
    methods: {
        changeView(view: { name: String, title: String }) {
            this.$emit("view-changed", view);
        }
    }

}
</script>