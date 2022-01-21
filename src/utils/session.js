async function checkSession(context, accessToken) {
    let matrixClient = context.$store.getters.matrixClient;
    // no valid session token
    if (accessToken === null && context.$router.currentRoute.name !== "Login") {
        matrixClient.stopClient();
        context.$store.commit("resetMatrixClient");
        if (context.$cookie.get("matrix-user-token") !== null) {
            context.$cookie.delete("matrix-user-token");
        }
        if (context.$router.currentRoute.name !== "Login") {
            context.$router.push({ name: "Login" });
        }
    }
    // valid session token after reload
    if (!matrixClient.isLoggedIn() && accessToken !== null) {
        await matrixClient
            .loginWithToken(accessToken)
            .catch((error) => {
                throw error;
            });

        // start matrix client
        await matrixClient.startClient({ initialSyncLimit: 100 });
        matrixClient.once("sync", function (state, prevState, res) {
            if (state === "PREPARED") {
                console.log("Matrix client prepared");
            }
            if (state !== "PREPARED") {
                console.log(state, prevState, res);
                process.exit(1);
            }
        });
    }
}

export { checkSession };
