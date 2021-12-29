import Vue from 'vue';
import Vuex from 'vuex';
import * as matrix from "matrix-js-sdk";

Vue.use(Vuex);

const client = matrix.createClient("https://127.0.0.1:8008");

const store = new Vuex.Store({
    state: {
        matrixClient: client,
        isLoggedIn: false,
    },
    mutations: {
        setLoggedIn(state, loggedIn) {
            state.isLoggedIn = loggedIn;
        },
    },
    getters: {
        matrixClient: state => state.matrixClient,
        isLoggedIn: state => state.isLoggedIn,
    },
});

export default store;
