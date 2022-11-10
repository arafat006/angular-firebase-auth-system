export interface FormValidationCustomModel {
    valid: boolean,
    field: string,
    errorType: string,
    normalizedError: string,
    errorDetails: any
}