export enum GameState {
  START = 'START',
  ONBOARDING = 'ONBOARDING',
  STEP_SUPERPOWER = 'STEP_SUPERPOWER',
  STEP_TALENTS = 'STEP_TALENTS',
  STEP_ENVIRONMENT = 'STEP_ENVIRONMENT',
  STEP_DRIVE = 'STEP_DRIVE',
  GENERATING = 'GENERATING',
  RESULT = 'RESULT'
}

export interface Interest {
  id: string;
  label: string;
  icon: string;
}

export interface Choice {
  id: string;
  label: string;
  icon: string;
  description?: string;
}

export interface CareerResult {
  jobTitle: string;
  description: string;
  dendronWorld: string;
  dendronTraining: string;
  sectorType?: string;
  imageUrl?: string;
}

export interface UserProfile {
  name: string;
  gender: string;
  superpowers: string[];
}
