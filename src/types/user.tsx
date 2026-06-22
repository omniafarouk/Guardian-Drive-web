export interface DriverResponse {
    id: number;
    email: string;
    role: string;
    fName: string;
    lName: string;
    phone: string[];
    address: string;
    driver: Driver;
}

export interface Driver {
    drivingLicense: string;
    avgHealthReadings: any[];
    medicalInformation: null;
    trips: any[];
}