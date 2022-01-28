import Vue from 'vue';
import Vuex from 'vuex';
import * as matrix from "matrix-js-sdk";
import { baseUrlMatrix, matrixPort } from "@/utils/config.js";

Vue.use(Vuex);

let options = {
    baseUrl: baseUrlMatrix + matrixPort,
    timelineSupport: true
};

const client = matrix.createClient(options);

const store = new Vuex.Store({
    state: {
        matrixClient: client,
    },
    mutations: {
        resetMatrixClient(state) {
            state.matrixClient = matrix.createClient(options);
        },
    },
    getters: {
        matrixClient: state => state.matrixClient,
    },
});

export default store;
