// src/app/features/notifications/services/notification-sound.service.ts

import { Injectable } from '@angular/core';

/**
 * Types de sons disponibles
 */
export enum SoundType {
    BEEP = 'beep',
    DING = 'ding',
    POP = 'pop',
    CHIME = 'chime',
    NOTIFICATION = 'notification',
    FACEBOOK = 'facebook'  // ✨ NOUVEAU
}

/**
 * Service pour jouer les sons de notification
 */
@Injectable({
    providedIn: 'root'
})
export class NotificationSoundService {
    private isEnabled = true;
    private currentSoundType: SoundType = SoundType.FACEBOOK; // ✅ Par défaut : FACEBOOK

    constructor() {
        const savedPreference = localStorage.getItem('notificationSoundEnabled');
        this.isEnabled = savedPreference !== 'false';

        const savedSound = localStorage.getItem('notificationSoundType') as SoundType;
        if (savedSound) {
            this.currentSoundType = savedSound;
        }
    }

    /**
     * Jouer le son de notification
     */
    play(soundType?: SoundType): void {
        if (!this.isEnabled) {
            return;
        }

        const type = soundType || this.currentSoundType;

        try {
            switch (type) {
                case SoundType.BEEP:
                    this.playBeep();
                    break;
                case SoundType.DING:
                    this.playDing();
                    break;
                case SoundType.POP:
                    this.playPop();
                    break;
                case SoundType.CHIME:
                    this.playChime();
                    break;
                case SoundType.NOTIFICATION:
                    this.playNotification();
                    break;
                case SoundType.FACEBOOK:
                    this.playFacebookStyle();
                    break;
                default:
                    this.playFacebookStyle(); // ✅ Par défaut : FACEBOOK
            }
        } catch (error) {
            console.error('Error playing sound:', error);
        }
    }

    /**
     * Son BEEP (simple)
     */
    private playBeep(): void {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = 800;
        oscillator.type = 'sine';
        gainNode.gain.value = 0.3;

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.15);

        setTimeout(() => audioContext.close(), 200);
    }

    /**
     * Son DING (doux et agréable)
     */
    private playDing(): void {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = 1200;
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(0.4, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);

        setTimeout(() => audioContext.close(), 400);
    }

    /**
     * Son POP (très court)
     */
    private playPop(): void {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = 600;
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(0.5, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);

        setTimeout(() => audioContext.close(), 150);
    }

    /**
     * Son CHIME (deux notes)
     */
    private playChime(): void {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

        // Première note
        const osc1 = audioContext.createOscillator();
        const gain1 = audioContext.createGain();
        osc1.connect(gain1);
        gain1.connect(audioContext.destination);
        osc1.frequency.value = 800;
        osc1.type = 'sine';
        gain1.gain.setValueAtTime(0.3, audioContext.currentTime);
        gain1.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
        osc1.start(audioContext.currentTime);
        osc1.stop(audioContext.currentTime + 0.15);

        // Deuxième note (plus haute)
        const osc2 = audioContext.createOscillator();
        const gain2 = audioContext.createGain();
        osc2.connect(gain2);
        gain2.connect(audioContext.destination);
        osc2.frequency.value = 1200;
        osc2.type = 'sine';
        gain2.gain.setValueAtTime(0.3, audioContext.currentTime + 0.1);
        gain2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.35);
        osc2.start(audioContext.currentTime + 0.1);
        osc2.stop(audioContext.currentTime + 0.35);

        setTimeout(() => audioContext.close(), 400);
    }

    /**
     * Son NOTIFICATION (style iOS)
     */
    private playNotification(): void {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

        // Note principale
        const osc1 = audioContext.createOscillator();
        const gain1 = audioContext.createGain();
        osc1.connect(gain1);
        gain1.connect(audioContext.destination);
        osc1.frequency.value = 1000;
        osc1.type = 'sine';
        gain1.gain.setValueAtTime(0.4, audioContext.currentTime);
        gain1.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
        osc1.start(audioContext.currentTime);
        osc1.stop(audioContext.currentTime + 0.2);

        // Note harmonique
        const osc2 = audioContext.createOscillator();
        const gain2 = audioContext.createGain();
        osc2.connect(gain2);
        gain2.connect(audioContext.destination);
        osc2.frequency.value = 1500;
        osc2.type = 'sine';
        gain2.gain.setValueAtTime(0.2, audioContext.currentTime);
        gain2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
        osc2.start(audioContext.currentTime);
        osc2.stop(audioContext.currentTime + 0.2);

        setTimeout(() => audioContext.close(), 300);
    }

    /**
     * Son FACEBOOK/INSTAGRAM ✨✨✨
     * Le fameux "ding-dong" reconnaissable
     */
    private playFacebookStyle(): void {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

        // ============================================
        // PREMIÈRE NOTE (Ding) - Note haute
        // ============================================
        const osc1 = audioContext.createOscillator();
        const gain1 = audioContext.createGain();

        osc1.connect(gain1);
        gain1.connect(audioContext.destination);

        // Fréquence haute pour le "ding"
        osc1.frequency.value = 1318.51; // Note E6 (Mi)
        osc1.type = 'sine';

        // Volume avec attack/decay rapide
        gain1.gain.setValueAtTime(0, audioContext.currentTime);
        gain1.gain.linearRampToValueAtTime(0.5, audioContext.currentTime + 0.01); // Attack rapide
        gain1.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15); // Decay

        osc1.start(audioContext.currentTime);
        osc1.stop(audioContext.currentTime + 0.15);

        // ============================================
        // DEUXIÈME NOTE (Dong) - Note plus grave
        // ============================================
        const osc2 = audioContext.createOscillator();
        const gain2 = audioContext.createGain();

        osc2.connect(gain2);
        gain2.connect(audioContext.destination);

        // Fréquence plus basse pour le "dong"
        osc2.frequency.value = 987.77; // Note B5 (Si)
        osc2.type = 'sine';

        // Commence légèrement après la première note
        const startTime = audioContext.currentTime + 0.08;

        gain2.gain.setValueAtTime(0, startTime);
        gain2.gain.linearRampToValueAtTime(0.5, startTime + 0.01); // Attack rapide
        gain2.gain.exponentialRampToValueAtTime(0.01, startTime + 0.2); // Decay plus long

        osc2.start(startTime);
        osc2.stop(startTime + 0.2);

        // ============================================
        // HARMONIQUES (pour enrichir le son)
        // ============================================

        // Harmonique 1 pour la première note
        const harmonic1 = audioContext.createOscillator();
        const gainH1 = audioContext.createGain();

        harmonic1.connect(gainH1);
        gainH1.connect(audioContext.destination);

        harmonic1.frequency.value = 1318.51 * 2; // Octave supérieure
        harmonic1.type = 'sine';

        gainH1.gain.setValueAtTime(0, audioContext.currentTime);
        gainH1.gain.linearRampToValueAtTime(0.15, audioContext.currentTime + 0.01);
        gainH1.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);

        harmonic1.start(audioContext.currentTime);
        harmonic1.stop(audioContext.currentTime + 0.15);

        // Harmonique 2 pour la deuxième note
        const harmonic2 = audioContext.createOscillator();
        const gainH2 = audioContext.createGain();

        harmonic2.connect(gainH2);
        gainH2.connect(audioContext.destination);

        harmonic2.frequency.value = 987.77 * 2; // Octave supérieure
        harmonic2.type = 'sine';

        gainH2.gain.setValueAtTime(0, startTime);
        gainH2.gain.linearRampToValueAtTime(0.15, startTime + 0.01);
        gainH2.gain.exponentialRampToValueAtTime(0.01, startTime + 0.2);

        harmonic2.start(startTime);
        harmonic2.stop(startTime + 0.2);

        // Fermer le contexte après le son
        setTimeout(() => {
            audioContext.close();
        }, 400);
    }

    /**
     * Changer le type de son
     */
    setSoundType(type: SoundType): void {
        this.currentSoundType = type;
        localStorage.setItem('notificationSoundType', type);
    }

    /**
     * Obtenir le type de son actuel
     */
    getCurrentSoundType(): SoundType {
        return this.currentSoundType;
    }

    /**
     * Activer/désactiver les sons
     */
    toggleSound(enabled: boolean): void {
        this.isEnabled = enabled;
        localStorage.setItem('notificationSoundEnabled', enabled.toString());
    }

    /**
     * Vérifier si les sons sont activés
     */
    isSoundEnabled(): boolean {
        return this.isEnabled;
    }
}