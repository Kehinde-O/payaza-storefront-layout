export declare class ApiError extends Error {
    message: string;
    status?: number;
    data?: any;
    constructor(message: string, status?: number, data?: any);
}
export declare const api: import("axios").AxiosInstance;
//# sourceMappingURL=api.d.ts.map