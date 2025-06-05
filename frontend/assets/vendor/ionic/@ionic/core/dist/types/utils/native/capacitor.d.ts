import type { CapacitorGlobal } from '@capacitor/core';
type CustomCapacitorGlobal = CapacitorGlobal & {
    Plugins: {
        [key: string]: any;
    };
};
export declare const getCapacitor: () => CustomCapacitorGlobal | undefined;
export {};
