import { UserType } from './user.model';

export class UserFilterParams {
    page: number = 1;
    limit: number = 10;
    search?: string;
    roleId?: string;
    userType?: UserType;
    isEmailVerified?: boolean;
    isActive?: boolean;
    sortField: string = 'createdAt';
    sortOrder: 'ASC' | 'DESC' = 'DESC';

    constructor(initial?: Partial<UserFilterParams>) {
        if (initial) {
            Object.assign(this, initial);
        }
    }

    toQueryParams(): Record<string, string | number | boolean> {
        const params: Record<string, string | number | boolean> = {
            page: this.page,
            limit: this.limit,
            sortField: this.sortField,
            sortOrder: this.sortOrder
        };

        if (this.search) {
            params['search'] = this.search;
        }

        if (this.roleId) {
            params['roleId'] = this.roleId;
        }

        if (this.userType) {
            params['userType'] = this.userType;
        }

        if (this.isEmailVerified !== undefined) {
            params['isEmailVerified'] = this.isEmailVerified;
        }

        if (this.isActive !== undefined) {
            params['isActive'] = this.isActive;
        }

        return params;
    }

    reset(): void {
        this.page = 1;
        this.limit = 10;
        this.search = undefined;
        this.roleId = undefined;
        this.userType = undefined;
        this.isEmailVerified = undefined;
        this.isActive = undefined;
        this.sortField = 'createdAt';
        this.sortOrder = 'DESC';
    }
}