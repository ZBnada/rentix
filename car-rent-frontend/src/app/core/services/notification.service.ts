import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
    providedIn: 'root'
})
export class NotificationService {
    // Configuration par défaut pour RentIX
    private readonly defaultConfig = {
        confirmButtonColor: '#f97316', // Orange RentIX
        cancelButtonColor: '#6b7280',  // Gris
        background: '#ffffff',
        color: '#1f2937',
        customClass: {
            popup: 'rentix-popup',
            title: 'rentix-title',
            confirmButton: 'rentix-confirm-btn',
            cancelButton: 'rentix-cancel-btn'
        }
    };

    // ============================================
    // NOTIFICATIONS DE SUCCÈS
    // ============================================

    success(message: string, title: string = 'Succès'): void {
        Swal.fire({
            icon: 'success',
            title: title,
            text: message,
            confirmButtonText: 'OK',
            timer: 3000,
            timerProgressBar: true,
            showConfirmButton: true,
            ...this.defaultConfig
        });
    }

    roleCreated(roleName: string): void {
        Swal.fire({
            icon: 'success',
            title: 'Rôle créé !',
            html: `Le rôle <strong>"${roleName}"</strong> a été créé avec succès.`,
            confirmButtonText: 'Super !',
            timer: 3000,
            timerProgressBar: true,
            ...this.defaultConfig
        });
    }

    roleUpdated(roleName: string): void {
        Swal.fire({
            icon: 'success',
            title: 'Rôle modifié !',
            html: `Le rôle <strong>"${roleName}"</strong> a été mis à jour avec succès.`,
            confirmButtonText: 'Parfait !',
            timer: 3000,
            timerProgressBar: true,
            ...this.defaultConfig
        });
    }

    roleDeleted(roleName: string): void {
        Swal.fire({
            icon: 'success',
            title: 'Rôle supprimé !',
            html: `Le rôle <strong>"${roleName}"</strong> a été supprimé définitivement.`,
            confirmButtonText: 'OK',
            timer: 3000,
            timerProgressBar: true,
            ...this.defaultConfig
        });
    }

    // ============================================
    // NOTIFICATIONS D'ERREUR
    // ============================================

    error(message: string, title: string = 'Erreur'): void {
        Swal.fire({
            icon: 'error',
            title: title,
            text: message,
            confirmButtonText: 'Fermer',
            ...this.defaultConfig
        });
    }

    roleCreateError(): void {
        Swal.fire({
            icon: 'error',
            title: 'Erreur de création',
            text: 'Une erreur est survenue lors de la création du rôle. Veuillez réessayer.',
            confirmButtonText: 'Fermer',
            ...this.defaultConfig
        });
    }

    roleUpdateError(): void {
        Swal.fire({
            icon: 'error',
            title: 'Erreur de modification',
            text: 'Une erreur est survenue lors de la mise à jour du rôle. Veuillez réessayer.',
            confirmButtonText: 'Fermer',
            ...this.defaultConfig
        });
    }

    roleDeleteError(message?: string): void {
        Swal.fire({
            icon: 'error',
            title: 'Erreur de suppression',
            text: message || 'Une erreur est survenue lors de la suppression du rôle. Veuillez réessayer.',
            confirmButtonText: 'Fermer',
            ...this.defaultConfig
        });
    }

    roleInUseError(): void {
        Swal.fire({
            icon: 'error',
            title: 'Rôle en cours d\'utilisation',
            html: `
                <p>Impossible de supprimer ce rôle car des utilisateurs l'utilisent actuellement.</p>
                <p class="mt-2 text-sm text-gray-600">Veuillez d'abord réassigner ces utilisateurs à un autre rôle.</p>
            `,
            confirmButtonText: 'Compris',
            ...this.defaultConfig
        });
    }

    // ============================================
    // NOTIFICATIONS D'AVERTISSEMENT
    // ============================================

    warning(message: string, title: string = 'Attention'): void {
        Swal.fire({
            icon: 'warning',
            title: title,
            text: message,
            confirmButtonText: 'OK',
            ...this.defaultConfig
        });
    }

    // ============================================
    // NOTIFICATIONS D'INFORMATION
    // ============================================

    info(message: string, title: string = 'Information'): void {
        Swal.fire({
            icon: 'info',
            title: title,
            text: message,
            confirmButtonText: 'OK',
            ...this.defaultConfig
        });
    }

    // ============================================
    // CONFIRMATIONS
    // ============================================

    async confirmDeleteRole(roleName: string): Promise<boolean> {
        const result = await Swal.fire({
            icon: 'warning',
            title: 'Supprimer le rôle ?',
            html: `
                <div class="text-left">
                    <p class="mb-3">Vous êtes sur le point de supprimer le rôle :</p>
                    <p class="mb-3 font-semibold text-orange-600">"${roleName}"</p>
                    <p class="mb-3">⚠️ Cette action est <strong>irréversible</strong> et ne peut pas être annulée.</p>
                    <p class="text-sm text-gray-600">Toutes les données associées à ce rôle seront perdues définitivement.</p>
                </div>
            `,
            showCancelButton: true,
            confirmButtonText: 'Oui, supprimer',
            cancelButtonText: 'Annuler',
            reverseButtons: true,
            focusCancel: true,
            ...this.defaultConfig
        });

        return result.isConfirmed;
    }

    async confirmCreateRole(): Promise<boolean> {
        const result = await Swal.fire({
            icon: 'question',
            title: 'Créer ce rôle ?',
            html: `
                <div class="text-left">
                    <p class="mb-3">Êtes-vous sûr de vouloir créer ce nouveau rôle ?</p>
                    <p class="text-sm text-gray-600">Vous pourrez le modifier ultérieurement si nécessaire.</p>
                </div>
            `,
            showCancelButton: true,
            confirmButtonText: 'Oui, créer',
            cancelButtonText: 'Annuler',
            reverseButtons: true,
            ...this.defaultConfig
        });

        return result.isConfirmed;
    }

    async confirmUpdateRole(roleName: string): Promise<boolean> {
        const result = await Swal.fire({
            icon: 'question',
            title: 'Modifier le rôle ?',
            html: `
                <div class="text-left">
                    <p class="mb-3">Voulez-vous enregistrer les modifications du rôle :</p>
                    <p class="mb-3 font-semibold text-orange-600">"${roleName}"</p>
                    <p class="text-sm text-gray-600">Les changements seront appliqués immédiatement.</p>
                </div>
            `,
            showCancelButton: true,
            confirmButtonText: 'Oui, modifier',
            cancelButtonText: 'Annuler',
            reverseButtons: true,
            ...this.defaultConfig
        });

        return result.isConfirmed;
    }

    async confirm(message: string, title: string = 'Confirmation'): Promise<boolean> {
        const result = await Swal.fire({
            icon: 'question',
            title: title,
            text: message,
            showCancelButton: true,
            confirmButtonText: 'Confirmer',
            cancelButtonText: 'Annuler',
            reverseButtons: true,
            ...this.defaultConfig
        });

        return result.isConfirmed;
    }

    // ============================================
    // NOTIFICATIONS DE CHARGEMENT
    // ============================================

    loading(title: string = 'Chargement...', message?: string): void {
        Swal.fire({
            title: title,
            text: message,
            allowOutsideClick: false,
            allowEscapeKey: false,
            showConfirmButton: false,
            didOpen: () => {
                Swal.showLoading();
            },
            ...this.defaultConfig
        });
    }

    closeLoading(): void {
        Swal.close();
    }
    // Ajouter ces méthodes au NotificationService existant

// ============================================
// NOTIFICATIONS UTILISATEURS
// ============================================

    userCreated(userName: string): void {
        Swal.fire({
            icon: 'success',
            title: 'Utilisateur créé !',
            html: `L'utilisateur <strong>"${userName}"</strong> a été créé avec succès.`,
            confirmButtonText: 'Super !',
            timer: 3000,
            timerProgressBar: true,
            ...this.defaultConfig
        });
    }

    userUpdated(userName: string): void {
        Swal.fire({
            icon: 'success',
            title: 'Utilisateur modifié !',
            html: `L'utilisateur <strong>"${userName}"</strong> a été mis à jour avec succès.`,
            confirmButtonText: 'Parfait !',
            timer: 3000,
            timerProgressBar: true,
            ...this.defaultConfig
        });
    }

    userDeleted(userName: string): void {
        Swal.fire({
            icon: 'success',
            title: 'Utilisateur supprimé !',
            html: `L'utilisateur <strong>"${userName}"</strong> a été supprimé définitivement.`,
            confirmButtonText: 'OK',
            timer: 3000,
            timerProgressBar: true,
            ...this.defaultConfig
        });
    }

    userCreateError(errorMessage?: string): void {
        Swal.fire({
            icon: 'error',
            title: 'Erreur de création',
            text: errorMessage || 'Une erreur est survenue lors de la création de l\'utilisateur. Veuillez réessayer.',
            confirmButtonText: 'Fermer',
            ...this.defaultConfig
        });
    }

    userUpdateError(errorMessage?: string): void {
        Swal.fire({
            icon: 'error',
            title: 'Erreur de modification',
            text: errorMessage || 'Une erreur est survenue lors de la mise à jour de l\'utilisateur. Veuillez réessayer.',
            confirmButtonText: 'Fermer',
            ...this.defaultConfig
        });
    }

    userDeleteError(message?: string): void {
        Swal.fire({
            icon: 'error',
            title: 'Erreur de suppression',
            text: message || 'Une erreur est survenue lors de la suppression de l\'utilisateur. Veuillez réessayer.',
            confirmButtonText: 'Fermer',
            ...this.defaultConfig
        });
    }

    emailAlreadyExists(): void {
        Swal.fire({
            icon: 'error',
            title: 'Email déjà utilisé',
            html: `
            <p>Cet email est déjà associé à un compte existant.</p>
            <p class="mt-2 text-sm text-gray-600">Veuillez utiliser une autre adresse email.</p>
        `,
            confirmButtonText: 'Compris',
            ...this.defaultConfig
        });
    }

    userStatusToggled(userName: string, isActive: boolean): void {
        Swal.fire({
            icon: 'success',
            title: 'Statut modifié !',
            html: `Le compte de <strong>"${userName}"</strong> a été <strong>${isActive ? 'activé' : 'désactivé'}</strong>.`,
            confirmButtonText: 'OK',
            timer: 3000,
            timerProgressBar: true,
            ...this.defaultConfig
        });
    }

    userEmailVerified(userName: string): void {
        Swal.fire({
            icon: 'success',
            title: 'Email vérifié !',
            html: `L'email de <strong>"${userName}"</strong> a été vérifié avec succès.`,
            confirmButtonText: 'Parfait !',
            timer: 3000,
            timerProgressBar: true,
            ...this.defaultConfig
        });
    }

    async confirmDeleteUser(userName: string): Promise<boolean> {
        const result = await Swal.fire({
            icon: 'warning',
            title: 'Supprimer l\'utilisateur ?',
            html: `
            <div class="text-left">
                <p class="mb-3">Vous êtes sur le point de supprimer l'utilisateur :</p>
                <p class="mb-3 font-semibold text-orange-600">"${userName}"</p>
                <p class="mb-3">⚠️ Cette action est <strong>irréversible</strong> et ne peut pas être annulée.</p>
                <p class="text-sm text-gray-600">Toutes les données associées à cet utilisateur seront perdues définitivement.</p>
            </div>
        `,
            showCancelButton: true,
            confirmButtonText: 'Oui, supprimer',
            cancelButtonText: 'Annuler',
            reverseButtons: true,
            focusCancel: true,
            ...this.defaultConfig
        });

        return result.isConfirmed;
    }

    async confirmToggleUserStatus(userName: string, currentStatus: boolean): Promise<boolean> {
        const action = currentStatus ? 'désactiver' : 'activer';
        const actionPast = currentStatus ? 'désactivé' : 'activé';

        const result = await Swal.fire({
            icon: 'question',
            title: `${action.charAt(0).toUpperCase() + action.slice(1)} ce compte ?`,
            html: `
            <div class="text-left">
                <p class="mb-3">Voulez-vous ${action} le compte de :</p>
                <p class="mb-3 font-semibold text-orange-600">"${userName}"</p>
                <p class="text-sm text-gray-600">
                    ${currentStatus
                ? 'L\'utilisateur ne pourra plus se connecter.'
                : 'L\'utilisateur pourra à nouveau se connecter.'}
                </p>
            </div>
        `,
            showCancelButton: true,
            confirmButtonText: `Oui, ${action}`,
            cancelButtonText: 'Annuler',
            reverseButtons: true,
            ...this.defaultConfig
        });

        return result.isConfirmed;
    }

    async confirmVerifyEmail(userName: string): Promise<boolean> {
        const result = await Swal.fire({
            icon: 'question',
            title: 'Vérifier cet email ?',
            html: `
            <div class="text-left">
                <p class="mb-3">Voulez-vous marquer l'email de <strong>"${userName}"</strong> comme vérifié ?</p>
                <p class="text-sm text-gray-600">Cette action confirmera manuellement l'adresse email de l'utilisateur.</p>
            </div>
        `,
            showCancelButton: true,
            confirmButtonText: 'Oui, vérifier',
            cancelButtonText: 'Annuler',
            reverseButtons: true,
            ...this.defaultConfig
        });

        return result.isConfirmed;
    }
}