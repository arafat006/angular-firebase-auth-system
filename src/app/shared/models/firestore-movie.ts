import { FirestoreUploader } from "./firestore-uploader";

export interface FirestoreMovie {
    uid: string;
    title: string;
    videoUrl: string;
    imgUrl: string;
    genre: string[];
    uploadedByUid: string;
    uploadedDate: any;
    releasedYear: number;
    private: boolean;
    uploader?: FirestoreUploader;
}