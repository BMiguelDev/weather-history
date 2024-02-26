export interface Coordinates {
    latitude: string;
    longitude: string;
}

export interface LocationItem {
    admin1?: string;
    admin1_id?: number;
    country: string;
    country_code: string;
    country_id: number;
    elevation?: number;
    feature_code?: string;
    id: number;
    latitude: number
    longitude: number
    name: string;
    timezone?: string;
}
