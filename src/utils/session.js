async function checkSession(context, accessToken) {
    let matrixClient = context.$store.getters.matrixClient;

    // no valid session token
    if (accessToken === null) { // TODO: and route noz /login -> then usable in /login too
        matrixClient.stopClient();
        context.$router.push({ name: "Login" });
    }
    // valid session token after reload
    if (!matrixClient.isLoggedIn() && accessToken !== null) {
        console.log(accessToken); // is user token 
        await matrixClient
            .login("m.login.token", {
                // TODO: fix: invalid token, what/which token is required?
                token: accessToken,
            })
            .catch((error) => {
                throw error;
            });

        // start matrix client
        await matrixClient.startClient({ initialSyncLimit: 10 });
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
