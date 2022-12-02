export interface FirestoreUser {
    uid: string;
    email: string;
    displayName: string;
    photoURL: string;
    emailVerified: boolean;
    tenantId: string;
    role: string;
    isDisabled: boolean;
}