import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format, parseISO } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { Entretien } from '../models/entretien.model';

/**
 * Service PDF Propre et Moderne pour RentIX
 * ✅ Design minimaliste SANS barre noire
 * ✅ Logo RentIX avec fond transparent
 * ✅ Ligne simple sous le header
 */
@Injectable({
    providedIn: 'root',
})
export class PdfService {
    private logoBase64: string = '';

    constructor() {
        this.loadLogo();
    }

    /**
     * Charger le logo depuis les assets
     */
    private async loadLogo(): Promise<void> {
        try {
            const response = await fetch('/assets/images/rentix-logo.png');
            const blob = await response.blob();
            const reader = new FileReader();

            reader.onloadend = () => {
                this.logoBase64 = reader.result as string;
            };

            reader.readAsDataURL(blob);
        } catch (error) {
            console.warn('Logo non chargé, utilisation du texte fallback');
        }
    }

    /**
     * Parser une date
     */
    private parseDate(dateStr: string | null | undefined): Date {
        if (!dateStr) return new Date();
        try {
            return dateStr.includes('T')
                ? parseISO(dateStr)
                : parseISO(`${dateStr}T12:00:00`);
        } catch {
            return new Date();
        }
    }

    /**
     * ✅ En-tête PROPRE sans barre noire
     */
    private addHeader(doc: jsPDF, title: string): number {
        const pageWidth = doc.internal.pageSize.getWidth();

        // Logo RentIX à gauche (SANS FOND)
        if (this.logoBase64) {
            try {
                doc.addImage(this.logoBase64, 'PNG', 15, 10, 35, 25);
            } catch (error) {
                this.addTextLogo(doc);
            }
        } else {
            this.addTextLogo(doc);
        }

        // Titre du document à droite
        doc.setFontSize(18);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0, 0, 0);
        doc.text(title, pageWidth - 15, 20, { align: 'right' });

        // Sous-titre
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(120, 120, 120);
        doc.text('RentIX Car Rental', pageWidth - 15, 28, { align: 'right' });

        // Date de génération
        const dateStr = format(new Date(), 'MM/dd/yyyy \'at\' HH:mm', { locale: enUS });
        doc.setFontSize(9);
        doc.setTextColor(150, 150, 150);
        doc.text(`Generated on ${dateStr}`, pageWidth - 15, 35, { align: 'right' });

        // ✅ LIGNE SIMPLE ET PROPRE (pas de barre noire)
        doc.setDrawColor(220, 220, 220); // Gris très clair
        doc.setLineWidth(0.5);
        doc.line(15, 45, pageWidth - 15, 45);

        return 55; // Position Y après l'en-tête
    }

    /**
     * Logo texte RENTIX (fallback)
     */
    private addTextLogo(doc: jsPDF): void {
        doc.setFontSize(20);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0, 0, 0);
        doc.text('RENT', 20, 25);
        doc.setTextColor(255, 102, 0); // Orange
        doc.text('IX', 48, 25);
    }

    /**
     * Pied de page simple
     */
    private addFooter(doc: jsPDF, pageNumber: number, totalPages: number): void {
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const footerY = pageHeight - 15;

        // Ligne de séparation légère
        doc.setDrawColor(220, 220, 220);
        doc.setLineWidth(0.3);
        doc.line(15, footerY - 5, pageWidth - 15, footerY - 5);

        // Informations (gauche)
        doc.setFontSize(8);
        doc.setTextColor(120, 120, 120);
        doc.setFont('helvetica', 'normal');
        doc.text('RentIX Car Rental Services', 15, footerY);
        doc.text('Beja 9021, Tunis - RC: HBZRC', 15, footerY + 4);

        // Numéro de page (centre)
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(80, 80, 80);
        doc.text(
            `Page ${pageNumber} / ${totalPages}`,
            pageWidth / 2,
            footerY + 2,
            { align: 'center' }
        );
    }

    /**
     * ✅ Export liste des entretiens - Design propre
     */
    exportMaintenanceList(entretiens: Entretien[], filename: string = 'maintenance-records.pdf'): void {
        const doc = new jsPDF();

        // En-tête SANS barre noire
        let currentY = this.addHeader(doc, 'MAINTENANCE RECORDS');

        currentY += 5;

        // Tableau
        const tableData = entretiens.map((e) => {
            try {
                const dateDebut = this.parseDate(e.dateDebutOperation);
                const dateFin = this.parseDate(e.dateFinOperation);

                return [
                    e.vehicule?.matricule || 'N/A',
                    e.typeEntretien?.designation || 'N/A',
                    format(dateDebut, 'MM/dd/yyyy'),
                    format(dateFin, 'MM/dd/yyyy'),
                    e.kilometrageArret.toLocaleString('en-US') + ' km',
                    e.coutTotal.toFixed(3) + ' DT',
                    e.etat,
                ];
            } catch {
                return [
                    e.vehicule?.matricule || 'N/A',
                    e.typeEntretien?.designation || 'N/A',
                    'Invalid date',
                    'Invalid date',
                    e.kilometrageArret.toLocaleString('en-US') + ' km',
                    e.coutTotal.toFixed(3) + ' DT',
                    e.etat,
                ];
            }
        });

        autoTable(doc, {
            startY: currentY,
            head: [['Vehicle', 'Type', 'Start Date', 'End Date', 'Mileage', 'Cost', 'Status']],
            body: tableData,
            theme: 'striped', // ✅ Design plus doux que 'grid'
            headStyles: {
                fillColor: [70, 70, 70] as [number, number, number], // Gris foncé au lieu de noir
                textColor: [255, 255, 255] as [number, number, number],
                fontSize: 9,
                fontStyle: 'bold',
                halign: 'center',
            },
            styles: {
                fontSize: 8,
                cellPadding: 4,
                lineColor: [220, 220, 220] as [number, number, number], // Lignes grises claires
                lineWidth: 0.1,
            },
            alternateRowStyles: {
                fillColor: [250, 250, 250] as [number, number, number],
            },
            columnStyles: {
                0: { cellWidth: 25, halign: 'center' },
                1: { cellWidth: 'auto' },
                2: { cellWidth: 25, halign: 'center' },
                3: { cellWidth: 25, halign: 'center' },
                4: { cellWidth: 25, halign: 'right' },
                5: { cellWidth: 25, halign: 'right', fontStyle: 'bold' },
                6: { cellWidth: 22, halign: 'center' },
            },
        });

        // Total en bas
        const finalY = (doc as any).lastAutoTable.finalY || currentY;
        const totalCost = entretiens.reduce((sum, e) => sum + e.coutTotal, 0);

        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0, 0, 0);
        doc.text(
            `Total Cost: ${totalCost.toFixed(3)} DT`,
            doc.internal.pageSize.getWidth() - 15,
            finalY + 10,
            { align: 'right' }
        );

        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(120, 120, 120);
        doc.text(
            `Total Records: ${entretiens.length}`,
            doc.internal.pageSize.getWidth() - 15,
            finalY + 16,
            { align: 'right' }
        );

        // Pied de page
        const totalPages = doc.getNumberOfPages();
        for (let i = 1; i <= totalPages; i++) {
            doc.setPage(i);
            this.addFooter(doc, i, totalPages);
        }

        doc.save(filename);
    }

    /**
     * ✅ Export historique véhicule - Design propre
     */
    exportVehicleHistory(
        vehicule: { matricule: string; marque?: { libelle: string }; type?: string },
        entretiens: Entretien[],
        filename?: string
    ): void {
        const doc = new jsPDF();

        // En-tête SANS barre noire
        let currentY = this.addHeader(doc, 'VEHICLE MAINTENANCE HISTORY');

        currentY += 5;

        // Informations véhicule (cadre léger)
        const pageWidth = doc.internal.pageSize.getWidth();

        doc.setDrawColor(200, 200, 200); // Bordure grise claire
        doc.setFillColor(250, 250, 250); // Fond gris très clair
        doc.setLineWidth(0.5);
        doc.roundedRect(15, currentY, pageWidth - 30, 20, 2, 2, 'FD'); // F = Fill, D = Draw

        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0, 0, 0);
        doc.text(`Vehicle: ${vehicule.matricule}`, 20, currentY + 8);

        if (vehicule.marque && vehicule.type) {
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(100, 100, 100);
            doc.text(
                `${vehicule.marque.libelle} ${vehicule.type}`,
                20,
                currentY + 15
            );
        }

        currentY += 30;

        // Statistiques
        const totalCost = entretiens.reduce((sum, e) => sum + e.coutTotal, 0);
        const avgCost = entretiens.length > 0 ? totalCost / entretiens.length : 0;

        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0, 0, 0);
        doc.text(`Total Records: ${entretiens.length}`, 20, currentY);
        doc.text(`Total Cost: ${totalCost.toFixed(3)} DT`, pageWidth / 2, currentY);
        doc.text(`Average Cost: ${avgCost.toFixed(3)} DT`, pageWidth - 80, currentY);

        currentY += 10;

        // Tableau
        const tableData = entretiens.map((e) => {
            try {
                const dateDebut = this.parseDate(e.dateDebutOperation);
                return [
                    format(dateDebut, 'MM/dd/yyyy'),
                    e.typeEntretien?.designation || 'N/A',
                    e.kilometrageArret.toLocaleString('en-US') + ' km',
                    e.coutTotal.toFixed(3) + ' DT',
                    e.etat,
                    e.observations?.substring(0, 35) || '-',
                ];
            } catch {
                return [
                    'Invalid date',
                    e.typeEntretien?.designation || 'N/A',
                    e.kilometrageArret.toLocaleString('en-US') + ' km',
                    e.coutTotal.toFixed(3) + ' DT',
                    e.etat,
                    e.observations?.substring(0, 35) || '-',
                ];
            }
        });

        autoTable(doc, {
            startY: currentY,
            head: [['Date', 'Maintenance Type', 'Mileage', 'Cost', 'Status', 'Notes']],
            body: tableData,
            theme: 'striped', // ✅ Plus doux
            headStyles: {
                fillColor: [70, 70, 70] as [number, number, number], // Gris foncé
                textColor: [255, 255, 255] as [number, number, number],
                fontSize: 9,
                fontStyle: 'bold',
                halign: 'center',
            },
            styles: {
                fontSize: 8,
                cellPadding: 4,
                lineColor: [220, 220, 220] as [number, number, number],
                lineWidth: 0.1,
            },
            alternateRowStyles: {
                fillColor: [250, 250, 250] as [number, number, number],
            },
        });

        // Pied de page
        const totalPages = doc.getNumberOfPages();
        for (let i = 1; i <= totalPages; i++) {
            doc.setPage(i);
            this.addFooter(doc, i, totalPages);
        }

        const pdfFilename = filename || `maintenance-history-${vehicule.matricule}.pdf`;
        doc.save(pdfFilename);
    }
}