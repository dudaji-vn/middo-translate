'use client';

import { useEffect } from "react";

import { ACCESS_TOKEN_NAME, REFRESH_TOKEN_NAME } from "@/configs/store-key";
import { getProfileService } from "@/services/authService";
import { useAuthStore } from "@/stores/auth";

const BootstrapProvider = () => {
    const { setData } = useAuthStore();
    useEffect(() => {
        if(localStorage.getItem(ACCESS_TOKEN_NAME)) {
            getProfileService()
                .then((res) => {
                    const { data } = res;
                    setData({ isAuthentication: true, user: data })
                    // Check is fill data
                })
                .catch(() => {
                    localStorage.removeItem(ACCESS_TOKEN_NAME);
                    localStorage.removeItem(REFRESH_TOKEN_NAME);
                    setData({ isAuthentication: false, user: null })
                });
        }
    }, [setData]);

    return null;
};

export default BootstrapProvider;
