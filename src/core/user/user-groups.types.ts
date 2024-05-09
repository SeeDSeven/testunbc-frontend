
export interface Permission{
    ID: number;
    Name: string;

    CreatedAt: Date;
    UpdatedAt: Date;
    DeletedAt: Date;
}
export interface Group {
    ID: number;
    Name: string;
    Permissions: Permission[] | number[];

    CreatedAt: Date;
    UpdatedAt: Date;
    DeletedAt: Date;
}