export type BookDto = {
    title:string,
    author:string,
    genre:string,
    quantity?:number
}

export type Book = {
    id: string,
    title:string,
    author:string,
    genre: BookGenres,
    status: BookStatus,
    pickList: PickRecord[]
}

export enum BookGenres {
    "SCI_FI" = 'sci-fi',
    "ADVENTURE" = 'adventure',
    "FANTASY" = 'fantasy',
    "ROMANTIC" = 'romantic',
    "CLASSIC" = 'classic',
    "DYSTOPIA" = 'dystopia',
    "DETECTIVE" = "detective"
}

export enum BookStatus {
    "ON_STOCK" = "on_stock",
    "ON_HAND" = "on_hand",
    "REMOVED" = "removed"
}

export type PickRecord = {
    readerId:number
    readerName: string,
    pick_date: string,
    return_date:string | null
}