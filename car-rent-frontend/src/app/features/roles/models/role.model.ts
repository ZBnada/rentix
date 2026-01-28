export interface Role {
    id: string;
    name: string;
    description: string;
    weight: number;
    createdAt: string;
    updatedAt: string;
}

export interface CreateRoleInput {
    name: string;
    description?: string;
    weight: number;
}

export interface UpdateRoleInput {
    id: string;
    name?: string;
    description?: string;
    weight?: number;
}