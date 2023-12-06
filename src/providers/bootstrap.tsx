'use client';

import { useEffect } from "react";

import { getProfileService } from "@/services/authService";
import { useAuthStore } from "@/stores/auth";

const BootstrapProvider = () => {
    const { setData } = useAuthStore();
    useEffect(() => {
        getProfileService()
            .then((res) => {
                const { data } = res;
                setData({ isAuthentication: true, user: data, isLoaded: true })
            })
            .catch(() => {
                setData({ isAuthentication: false, user: null, isLoaded: true })
            });
    }, [setData]);

    return null;
};

export default BootstrapProvider;
