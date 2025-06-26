import axios from "axios";
import { clearAuth, getRefreshToken, getToken, setToken } from "./Auth";
import CONST from "./Constant";
import { fetchBaseQuery } from "@reduxjs/toolkit/query";

// Function to refresh the access token
const refreshAccessToken = async () => {
    try {
        const refreshToken = getRefreshToken();
        if (!refreshToken) {
            throw new Error("No refresh token found");
        }

        const response = await axios.post(`${CONST.BASE_URL_API}/refresh-token`, {
            refresh_token: refreshToken,
        });

        if (response.data?.token) {
            setToken(response.data.token.access.token, response.data.token.refresh.token); // Save new tokens
            return response.data.token.access.token;
        }

        throw new Error("Failed to refresh token");
    } catch (error) {
        console.error("Refresh token failed:", error);
        clearAuth(); // Clear tokens if refresh fails
        return null;
    }
};

// Custom baseQuery with refresh logic
const customBaseQuery = async (args, api, extraOptions) => {
    const token = await getToken();
    console.log(token, "token Custom")
    let result = await fetchBaseQuery({
        baseUrl: CONST.BASE_URL_API,
        prepareHeaders: async (headers) => {
            if (token) {
                headers.set("Authorization", `Bearer ${token}`);
            }
            return headers;
        },
    })(args, api, extraOptions);

    // If token is expired (401 Unauthorized), try refreshing
    if (result.error && result.error.status === 401) {
        console.log("Access token expired. Attempting refresh...");
        const newAccessToken = await refreshAccessToken();

        if (newAccessToken) {
            result = await fetchBaseQuery({
                baseUrl: CONST.BASE_URL_API,
                prepareHeaders: (headers) => {
                    headers.set("Authorization", `Bearer ${newAccessToken}`);
                    return headers;
                },
            })(args, api, extraOptions);
        } else {
            console.warn("Refresh token failed. Logging out...");
            clearAuth(); // Clear tokens if refresh fails
        }
    }

    return result;
};

export { customBaseQuery }