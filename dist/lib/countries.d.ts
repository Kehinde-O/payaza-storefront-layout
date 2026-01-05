export interface Country {
    code: string;
    name: string;
    flag: string;
}
export declare const countries: Country[];
export declare const getCountryByCode: (code: string) => Country | undefined;
export declare const getCountryByName: (name: string) => Country | undefined;
export declare const citiesByCountry: Record<string, string[]>;
export declare const getCitiesByCountry: (countryName: string) => string[];
//# sourceMappingURL=countries.d.ts.map