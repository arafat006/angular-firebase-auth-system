export interface FirestoreMovie {
    uid: string;
    title: string;
    url: string;
    category: string[];
    uploadedByUid: string;
    uploadedDate: Date;
    published: boolean;
    private: boolean;
}