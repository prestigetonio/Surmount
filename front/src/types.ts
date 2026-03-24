export interface WeatherData {
    temperature: number;
    windSpeed: number;
    snowDepth: number;
    snowfall: number;
    slopeAngle: number;
    risk: number;
    riskLabel: string;
}

export interface PointData {
    id?: number;
    name: string;
    lat: number;
    lon: number;
    alt: number;
    addedAt: string;
    weather?: WeatherData;
}
