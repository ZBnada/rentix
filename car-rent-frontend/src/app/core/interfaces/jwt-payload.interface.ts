/**
 * Interface représentant les données de l'utilisateur dans le JWT
 * Doit correspondre exactement à ce que le backend envoie
 */
export interface JwtPayload {
    sub: string;              // User ID
    email: string;
    firstName: string;
    lastName: string;
    roleId: string;
    profileImage: string | null;  // URL complète de l'image ou null
    initials: string;             // Initiales calculées par le backend (ex: "JD")
    iat?: number;                 // Issued at (timestamp)
    exp?: number;                 // Expiration (timestamp)
}

/**
 * Interface pour l'utilisateur courant utilisé dans l'application
 */
export interface CurrentUser {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    roleId: string;
    profileImage: string | null;
    initials: string;
}