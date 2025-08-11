import { defineStore } from "pinia";
import { ref } from "vue";
import { defaultAxios } from "@/services/api";


export const useAuthStore = defineStore("authStore", () => {
    const authData = ref({
        user: {},
        accessToken: null,
        isUserLoaded: false,
    });

    const haveInitialized = ref(false);
    const appLoading = ref(true);

    function setAccessToken(token) {
        authData.value.accessToken = token;
        // setAccessTokenForApiCalls(token);
    }

    async function login2(loginResponse) {
        localStorage.setItem("token", loginResponse.access_token);
        setAccessToken(loginResponse.access_token);
        setLoginState(true);
    }

    async function login(data) {
        try {
            const response = await defaultAxios.post('/auth/login', data)
            if (response.data.success) {
                authData.value.user = response.data.data.user;
                console.log(authData.user);
                return response;
            }
        } catch (error) {
            console.error(error)
        } finally {
            this.isLoading = false;
        }
    }


    async function forgotPassword(email) {
        try {
            const response = await defaultAxios.post('/auth/forgot-password', {email : email})
            if (response.data.success) {
                return response;
            }
        } catch (error) {
            console.error(error)
        } finally {
            this.isLoading = false;
        }
    }

    async function resetPassword(data) {
        try {
            const response = await defaultAxios.post('/auth/reset-password', data)
            if (response.data.success) {
                return response;
            }
        } catch (error) {
            console.error(error)
        } finally {
            this.isLoading = false;
        }
    }

    async function changePassword(data) {
        try {
            const response = await defaultAxios.post('/auth/change-password', data)
            if (response.data.success) {
                authData.value.user = response.data;
                return response;
            }
        } catch (error) {
            console.error(error)
        } finally {
            this.isLoading = false;
        }
    }

    async function getCurrentUser() {
        if (this.isUserLoaded) return this.user
        const token = localStorage.getItem('token')

        if (!token) {
            this.user = null
            this.authError = 'No token'
            this.isUserLoaded = true
            return null
        }
        try {
            const response = await defaultAxios.get("/auth/me");
            setUser(response.data.data);
            console.log(authData.value.user)
        }
        catch (err) {
            console.warn("Token invalid or expired")
            localStorage.removeItem('token') // optional
        } finally {
            this.isUserLoaded = true
        }

        return authData.value.user;
    }

    function setLoginState(state) {
        authData.value.isLoggedIn = state;
    }

    async function setUser(user) {
        authData.value.user = user;
    }

    function getLoginState() {
        return authData.value.isLoggedIn;
    }


    function checkLoginState() {
        return new Promise((resolve, reject) => {
            // check if the user is authenticated
            checkAuthentication()
                .then(async (authenticated) => {
                    try {
                        // if the user is not authenticated, set the login state to false
                        if (!authenticated) {
                            console.log("Not authenticated");
                            setLoginState(false);
                            appLoading.value = false;
                            resolve();
                        } else {
                            // if the user is authenticated, set the login state to true and get the current user
                            console.log("Authenticated");
                            setLoginState(true);
                            haveInitialized.value = true;
                            await getCurrentUser();
                            resolve();
                        }
                    } catch (error) {
                        console.log("Authentication failed due to \n" + error);
                        reject(error);
                    } finally {
                        appLoading.value = false;
                    }
                })
                .catch((error) => {
                    console.error("Error occurred during authentication check:", error);
                    reject(error);
                });

            // refreshAccessTokenAtInterval(); // Move this line within the promise body if it should be executed within the promise context
        });
    }

    async function checkAuthentication() {
        let token = localStorage.getItem("token");
        if (token === null || token === 'undefined') {
            return false;
        } else {
            setAccessToken(token);
            let response = await defaultAxios.get("/me");
            if (response.status === 200) {
                setAccessToken(token);
                return true;
            } else {
                return false;
            }
        }
    }



    return {
        login,
        setAccessToken,
        setUser,
        authData,
        getCurrentUser,
        checkLoginState,
        haveInitialized,
        checkAuthentication,
        getLoginState,
        appLoading,
        changePassword,
        forgotPassword,
        resetPassword
    };
});