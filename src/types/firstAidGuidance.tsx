import { ConditionType, Severity } from "./enums";

export interface FirstAidGuidance {
    guidanceId: number;
    condition: ConditionType;
    severity: Severity;
    description: String;
    specificAction?: String;
}
