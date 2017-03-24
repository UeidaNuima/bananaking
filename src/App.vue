<template>
<div id="app">
    <!-- <mu-drawer :docked="false" :open="drawerOpened" @close="drawerOpened = false">
        <mu-list>
        </mu-list>
    </mu-drawer> -->
    <mu-appbar title="香蕉王">
        <mu-icon-button icon="menu" slot="left" @click="/*drawerOpened = true*/" />
    </mu-appbar>
    <config-panel :initChooseNum="chooseNum" :initRepeatEnabled="repeatEnabled" :initWeightEnabled="weightEnabled" :initOptionSum="options.length" />
    <data-container :initRepeatEnabled="repeatEnabled" :initWeightEnabled="weightEnabled" :initOptions="options" :initResults="results"/>
</div>
</template>

<script>
import configPanel from './components/config-panel.vue'
import dataContainer from './components/data-container.vue'
import Bus from './bus.js'
export default {
    name: 'app',
    components: {
        configPanel,
        dataContainer
    },
    data() {
        return {
            chooseNum: localStorage.chooseNum ? JSON.parse(localStorage.chooseNum) : 0,
            repeatEnabled: localStorage.repeatEnabled ? JSON.parse(localStorage.repeatEnabled) : false,
            weightEnabled: localStorage.weightEnabled ? JSON.parse(localStorage.weightEnabled) : false,
            options: localStorage.options ? JSON.parse(localStorage.options) : [],
            results: localStorage.results ? JSON.parse(localStorage.results) : []
        }
    },
    methods: {
    },
    created: function() {
    }
}
</script>

<style>

</style>
