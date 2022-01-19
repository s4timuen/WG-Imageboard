import Vue from 'vue';
import Vuex from 'vuex';
import * as matrix from "matrix-js-sdk";

Vue.use(Vuex);

let options = {
    baseUrl: "http://192.168.0.233:8008",
    timelineSupport: true
};

const client = matrix.createClient(options);

const store = new Vuex.Store({
    state: {
        matrixClient: client,
    },
    mutations: {
    },
    getters: {
        matrixClient: state => state.matrixClient,
    },
});

export default store;
