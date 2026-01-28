import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Role, CreateRoleInput, UpdateRoleInput } from '../models';

// ============================================
// GRAPHQL QUERIES & MUTATIONS
// ============================================

const GET_ROLES_QUERY = gql`
    query GetRoles {
        roles {
            id
            name
            description
            weight
            createdAt
            updatedAt
        }
    }
`;

const GET_ROLE_BY_ID = gql`
    query GetRole($id: ID!) {
        role(id: $id) {
            id
            name
            description
            weight
            createdAt
            updatedAt
        }
    }
`;

const GET_ROLE_BY_NAME = gql`
    query GetRoleByName($name: String!) {
        roleByName(name: $name) {
            id
            name
            description
            weight
            createdAt
            updatedAt
        }
    }
`;

const GET_ROLES_BY_MAX_WEIGHT = gql`
    query GetRolesByMaxWeight($maxWeight: Int!) {
        rolesByMaxWeight(maxWeight: $maxWeight) {
            id
            name
            description
            weight
            createdAt
            updatedAt
        }
    }
`;

const CREATE_ROLE_MUTATION = gql`
    mutation CreateRole($createRoleInput: CreateRoleInput!) {
        createRole(createRoleInput: $createRoleInput) {
            id
            name
            description
            weight
            createdAt
            updatedAt
        }
    }
`;

const UPDATE_ROLE_MUTATION = gql`
    mutation UpdateRole($updateRoleInput: UpdateRoleInput!) {
        updateRole(updateRoleInput: $updateRoleInput) {
            id
            name
            description
            weight
            createdAt
            updatedAt
        }
    }
`;

const DELETE_ROLE_MUTATION = gql`
    mutation RemoveRole($id: ID!) {
        removeRole(id: $id)
    }
`;

const COMPARE_ROLES_QUERY = gql`
    query CompareRoles($roleId1: ID!, $roleId2: ID!) {
        roleHasMorePrivileges(roleId1: $roleId1, roleId2: $roleId2)
    }
`;

const CHECK_PRIVILEGE_LEVEL_QUERY = gql`
    query CheckPrivilegeLevel($roleId: ID!, $requiredWeight: Int!) {
        hasRequiredPrivilegeLevel(roleId: $roleId, requiredWeight: $requiredWeight)
    }
`;

// ============================================
// SERVICE
// ============================================

@Injectable({
    providedIn: 'root'
})
export class RoleService {
    constructor(private apollo: Apollo) {}

    /**
     * CREATE - Create a new role
     */
    createRole(input: CreateRoleInput): Observable<Role> {
        return this.apollo
            .mutate<{ createRole: Role }>({
                mutation: CREATE_ROLE_MUTATION,
                variables: { createRoleInput: input },
                refetchQueries: ['GetRoles'],
            })
            .pipe(map((result) => result.data!.createRole));
    }

    /**
     * READ - Get all roles sorted by weight
     */
    getAllRoles(): Observable<Role[]> {
        return this.apollo
            .query<{ roles: Role[] }>({
                query: GET_ROLES_QUERY,
                fetchPolicy: 'network-only',
            })
            .pipe(map((result) => result.data.roles));
    }

    /**
     * READ - Get role by ID
     */
    getRoleById(id: string): Observable<Role> {
        return this.apollo
            .query<{ role: Role }>({
                query: GET_ROLE_BY_ID,
                variables: { id },
                fetchPolicy: 'network-only',
            })
            .pipe(map((result) => result.data.role));
    }

    /**
     * READ - Get role by name
     */
    getRoleByName(name: string): Observable<Role> {
        return this.apollo
            .query<{ roleByName: Role }>({
                query: GET_ROLE_BY_NAME,
                variables: { name },
                fetchPolicy: 'network-only',
            })
            .pipe(map((result) => result.data.roleByName));
    }

    /**
     * READ - Get roles by max weight
     */
    getRolesByMaxWeight(maxWeight: number): Observable<Role[]> {
        return this.apollo
            .query<{ rolesByMaxWeight: Role[] }>({
                query: GET_ROLES_BY_MAX_WEIGHT,
                variables: { maxWeight },
                fetchPolicy: 'network-only',
            })
            .pipe(map((result) => result.data.rolesByMaxWeight));
    }

    /**
     * UPDATE - Update role
     */
    updateRole(id: string, input: UpdateRoleInput): Observable<Role> {
        return this.apollo
            .mutate<{ updateRole: Role }>({
                mutation: UPDATE_ROLE_MUTATION,
                variables: {
                    updateRoleInput: {
                        ...input,
                        id,
                    },
                },
                refetchQueries: ['GetRoles', 'GetRole'],
            })
            .pipe(map((result) => result.data!.updateRole));
    }

    /**
     * DELETE - Delete role
     */
    deleteRole(id: string): Observable<boolean> {
        return this.apollo
            .mutate<{ removeRole: boolean }>({
                mutation: DELETE_ROLE_MUTATION,
                variables: { id },
                refetchQueries: ['GetRoles'],
            })
            .pipe(map((result) => result.data!.removeRole));
    }

    /**
     * UTILITY - Compare roles by privileges
     */
    hasMorePrivileges(roleId1: string, roleId2: string): Observable<boolean> {
        return this.apollo
            .query<{ roleHasMorePrivileges: boolean }>({
                query: COMPARE_ROLES_QUERY,
                variables: { roleId1, roleId2 },
                fetchPolicy: 'network-only',
            })
            .pipe(map((result) => result.data.roleHasMorePrivileges));
    }

    /**
     * UTILITY - Check required privilege level
     */
    hasRequiredPrivilegeLevel(roleId: string, requiredWeight: number): Observable<boolean> {
        return this.apollo
            .query<{ hasRequiredPrivilegeLevel: boolean }>({
                query: CHECK_PRIVILEGE_LEVEL_QUERY,
                variables: { roleId, requiredWeight },
                fetchPolicy: 'network-only',
            })
            .pipe(map((result) => result.data.hasRequiredPrivilegeLevel));
    }
}