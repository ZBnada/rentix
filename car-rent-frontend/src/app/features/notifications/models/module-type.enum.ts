export enum ModuleType {
  ENTRETIEN = 'ENTRETIEN',
  ASSURANCE = 'ASSURANCE',
  VIGNETTE = 'VIGNETTE',
  CONTROLE_TECHNIQUE = 'CONTROLE_TECHNIQUE',
  REVISION = 'REVISION',
  REPARATION = 'REPARATION',
}

export const ModuleTypeLabels: Record<ModuleType, string> = {
  [ModuleType.ENTRETIEN]: 'Maintenance',
  [ModuleType.ASSURANCE]: 'Insurance',
  [ModuleType.VIGNETTE]: 'Vignette',
  [ModuleType.CONTROLE_TECHNIQUE]: 'Technical Control',
  [ModuleType.REVISION]: 'Revision',
  [ModuleType.REPARATION]: 'Repair',
};

export const ModuleTypeIcons: Record<ModuleType, string> = {
  [ModuleType.ENTRETIEN]: 'wrench',
  [ModuleType.ASSURANCE]: 'shield-alt',
  [ModuleType.VIGNETTE]: 'file-alt',
  [ModuleType.CONTROLE_TECHNIQUE]: 'clipboard-check',
  [ModuleType.REVISION]: 'tools',
  [ModuleType.REPARATION]: 'screwdriver',
};

export const ModuleTypeColors: Record<ModuleType, string> = {
  [ModuleType.ENTRETIEN]: 'blue',
  [ModuleType.ASSURANCE]: 'purple',
  [ModuleType.VIGNETTE]: 'green',
  [ModuleType.CONTROLE_TECHNIQUE]: 'orange',
  [ModuleType.REVISION]: 'indigo',
  [ModuleType.REPARATION]: 'red',
};






















