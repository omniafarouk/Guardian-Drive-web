import type { AlertStatus, AlertType } from "./enums";
import type { FirstAidGuidance } from "./firstAidGuidance";
export interface AlertByIdRes {
    message: string;
    data: Data;
}

export interface Data {
    alertId: number;
    type: AlertType;
    status: AlertStatus;
    generatedAt: Date;
    solvedAt?: Date;
    tripId: number;
    triggeredLocationId?: number;
    stoppedLocationId?: number;
    trip: Trip;
    healthEvent?: HealthEventAlertRes;
    triggeredLocation: Location;
    stoppedLocation?: Location;
    emergencyServiceRequest?: EmergencyServiceRequest;
}
export interface EmergencyServiceRequest {
    requestId: number;
    status: string;
    requestTime: Date;
    phone: string;
    completionTime: null;
    hospitalAssigned: string;
    alertId: number;
}

export interface Location {
    locationId: number;
    time: Date;
    longitude: number;
    latitude: number;
    tripId: number;
}
export interface HealthEventAlertRes {
    temp: GLfloat;
    spo2: GLfloat;
    heartRate: GLfloat;
    guidances: FirstAidGuidance[];
}

export interface Trip {
    tripId: number;
    startLatitude: number;
    startLongitude: number;
    destLatitude: number;
    destLongitude: number;
    plannedStartTime: Date;
    startTime: null;
    endTime: null;
    status: string;
    driverId: number;
    engineId: null;
    fleetManagerId: number;
    towingRequest: TowingRequest;
    driver: Driver;
    car: null;
}

export interface Driver {
    id: number;
    drivingLicense: string;
    user: User;
}

export interface User {
    email: string;
    fName: string;
    lName: string;
    phone: string[];
    address: string;
    hiredAt: Date;
}

export interface TowingRequest {
    requestId: number;
    status: string;
    requestTime: Date;
    completionTime: null;
    towingCompany: string;
    tripId: number;
    alertId: number;
}
