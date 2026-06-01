// instead of enum
export const Role = {
    ADMIN: "ADMIN",
    FLEET_MANAGER: "FLEET_MANAGER",
    DRIVER: "DRIVER"
} as const

export type Role = typeof Role[keyof typeof Role]
// Role type = "ADMIN" | "FLEET_MANAGER"

export const AlertStatus = {
    ACTIVE: "ACTIVE",
    RESOLVED: "RESOLVED"
} as const

export type AlertStatus = typeof AlertStatus[keyof typeof AlertStatus]

export const AlertType = {
    SOS: "SOS",
    HEALTH_ABNORMAL: "HEALTH_ABNORMAL"
} as const

export type AlertType = typeof AlertType[keyof typeof AlertType]


export const Severity = {
    MILD: "MILD",
    MODERATE: "MODERATE",
    CRITICAL: "CRITICAL",
    NORMAL: "NORMAL"
}
export type Severity = typeof Severity[keyof typeof Severity]

export const ConditionType = {
    LOW_SPO2: "LOW_SPO2",
    HIGH_HEART_RATE: "HIGH_HEART_RATE",
    LOW_HEART_RATE: "LOW_HEART_RATE",
    HIGH_TEMP: "HIGH_TEMP",
    LOW_TEMP: "LOW_TEMP"
}
export type ConditionType = typeof ConditionType[keyof typeof ConditionType]
