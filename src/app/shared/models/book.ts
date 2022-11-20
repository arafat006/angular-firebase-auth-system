export interface Book {
    id: string | null;
    title: string;
    description: string;
    categories: string[];
    imgUrl: string;
    author: string;
    publisher: string;
    uploadedBy: string;
    approvedBy: string;
    releaseDate: Date;
    uploadDate: Date;
    lastUpdatedDate: Date;
    published: Boolean;
 }