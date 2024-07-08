export type Id=string | number  ;




export type Colum={
    id:Id,
    title:string,
}
export type Task={
    id:Id,
    columnId:Id,
    content:string,
}