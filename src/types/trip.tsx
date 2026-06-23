export interface Trip {
    tripId: number;
    startLatitude: number;
    startLongitude: number;
    destLatitude: number;
    destLongitude: number;
    plannedStartTime: Date;
    startTime: Date;
    endTime: Date;
    status: string;
    driverId: number;
    engineId: string;
    fleetManagerId: number;
}
export interface FormTrip {
    tripId?: number;
    startLatitude?: number;
    startLongitude?: number;
    destLatitude?: number;
    destLongitude?: number;
    plannedStartTime?: Date;
    startTime?: Date;
    endTime?: Date;
    status?: string;
    driverId?: number;
    engineId?: string;
    fleetManagerId?: number;
}