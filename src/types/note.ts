export interface Note {
    id: number,
    title: string,
    content: string,
    tag: string,
    createdAt: string,
    updatedAt: string,
}


export interface NoteInputValues {
    title: string,
    content?: string,
    tag: string,
}


