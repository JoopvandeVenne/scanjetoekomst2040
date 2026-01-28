import { Interest, Choice } from '../types';

export interface AdaptationRecommendation {
  id: string;
  relevanceScore: number;
  personalizedMessage?: string;
}

const SUPERPOWER_TO_TALENT_MAPPING: Record<string, string[]> = {
  'creatief brein': ['creative', 'maker', 'entrepreneur'],
  'snel denken': ['researcher', 'organizer', 'entrepreneur'],
  'groot hart': ['helper', 'organizer'],
  'gouden handen': ['maker'],
  'doorzetter': ['organizer', 'entrepreneur'],
  'super focus': ['researcher', 'maker', 'organizer']
};

const TALENT_TO_ENVIRONMENT_MAPPING: Record<string, string[]> = {
  'maker': ['workshop', 'digital'],
  'researcher': ['nature', 'digital'],
  'creative': ['digital', 'workshop'],
  'helper': ['people', 'nature'],
  'organizer': ['people', 'digital'],
  'entrepreneur': ['digital', 'people']
};

const ENVIRONMENT_TO_DRIVE_MAPPING: Record<string, string[]> = {
  'digital': ['discover', 'money-success'],
  'nature': ['save-world', 'discover'],
  'workshop': ['discover', 'make-happy'],
  'people': ['make-happy', 'save-world']
};

export function getRecommendedTalents(superpowers: string[]): AdaptationRecommendation[] {
  const talentScores: Record<string, number> = {};

  superpowers.forEach(superpower => {
    const normalized = superpower.toLowerCase();
    const relatedTalents = SUPERPOWER_TO_TALENT_MAPPING[normalized] || [];

    relatedTalents.forEach(talent => {
      talentScores[talent] = (talentScores[talent] || 0) + 1;
    });
  });

  return Object.entries(talentScores).map(([id, score]) => ({
    id,
    relevanceScore: score,
    personalizedMessage: getPersonalizedTalentMessage(id, superpowers)
  }));
}

export function getRecommendedEnvironments(
  superpowers: string[],
  talents: Interest[]
): AdaptationRecommendation[] {
  const envScores: Record<string, number> = {};

  talents.forEach(talent => {
    const relatedEnvs = TALENT_TO_ENVIRONMENT_MAPPING[talent.id] || [];
    relatedEnvs.forEach(env => {
      envScores[env] = (envScores[env] || 0) + 1;
    });
  });

  return Object.entries(envScores).map(([id, score]) => ({
    id,
    relevanceScore: score,
    personalizedMessage: getPersonalizedEnvironmentMessage(id, superpowers, talents)
  }));
}

export function getRecommendedDrives(
  superpowers: string[],
  talents: Interest[],
  environment: Choice
): AdaptationRecommendation[] {
  const driveScores: Record<string, number> = {};

  const relatedDrives = ENVIRONMENT_TO_DRIVE_MAPPING[environment.id] || [];
  relatedDrives.forEach(drive => {
    driveScores[drive] = (driveScores[drive] || 0) + 2;
  });

  if (superpowers.some(sp => sp.toLowerCase().includes('hart'))) {
    driveScores['make-happy'] = (driveScores['make-happy'] || 0) + 1;
  }

  if (talents.some(t => t.id === 'entrepreneur')) {
    driveScores['money-success'] = (driveScores['money-success'] || 0) + 1;
  }

  if (talents.some(t => t.id === 'researcher')) {
    driveScores['discover'] = (driveScores['discover'] || 0) + 1;
  }

  return Object.entries(driveScores).map(([id, score]) => ({
    id,
    relevanceScore: score,
    personalizedMessage: getPersonalizedDriveMessage(id, superpowers, talents, environment)
  }));
}

function getPersonalizedTalentMessage(talentId: string, _superpowers: string[]): string {
  const messages: Record<string, string[]> = {
    'maker': [
      'Perfect voor jouw Gouden Handen!',
      'Ideaal voor creatieve makers zoals jij!',
      'Jouw handen kunnen wonderen verrichten!'
    ],
    'researcher': [
      'Geweldig voor Snel Denken!',
      'Perfect voor nieuwsgierige geesten!',
      'Jouw focus maakt je een geweldige onderzoeker!'
    ],
    'creative': [
      'Ideaal voor Creatief Brein!',
      'Laat je creativiteit de vrije loop!',
      'Jouw verbeelding is jouw kracht!'
    ],
    'helper': [
      'Perfect voor Groot Hart!',
      'Jouw empathie maakt het verschil!',
      'Mensen helpen is jouw talent!'
    ],
    'organizer': [
      'Top voor Doorzetter!',
      'Organiseren zit in je bloed!',
      'Jouw Super Focus maakt je een geweldige regelaar!'
    ],
    'entrepreneur': [
      'Ideaal voor jouw ondernemende geest!',
      'Snel Denken + actie = succes!',
      'Jouw Doorzetter mentaliteit brengt je ver!'
    ]
  };

  const options = messages[talentId] || ['Goed bij jouw profiel!'];
  return options[Math.floor(Math.random() * options.length)];
}

function getPersonalizedEnvironmentMessage(
  envId: string,
  _superpowers: string[],
  talents: Interest[]
): string {
  const talentNames = talents.map(t => t.label.toLowerCase()).join(', ');

  const messages: Record<string, string> = {
    'digital': `Met jouw talenten (${talentNames}) kun je hier echt uitblinken!`,
    'nature': `${talents[0]?.label} combineren met de natuur? Geweldig!`,
    'workshop': `Jouw Gouden Handen komen hier helemaal tot hun recht!`,
    'people': `Met jouw Groot Hart maak je hier het verschil!`
  };

  return messages[envId] || 'Een geweldige match met jouw keuzes!';
}

function getPersonalizedDriveMessage(
  driveId: string,
  _superpowers: string[],
  _talents: Interest[],
  environment: Choice
): string {
  const messages: Record<string, string> = {
    'save-world': `${environment.label} is perfect om de wereld te helpen!`,
    'money-success': `Jouw ondernemende talenten kunnen hier succesvol zijn!`,
    'make-happy': `Met jouw Groot Hart maak je mensen echt gelukkig!`,
    'discover': `Jouw nieuwsgierigheid leidt tot geweldige ontdekkingen!`
  };

  return messages[driveId] || 'Dit past bij jouw reis tot nu toe!';
}

export function getContextualMessage(
  step: string,
  userProfile: { name: string; gender: string; superpowers: string[] },
  talents?: Interest[],
  environment?: Choice
): string {
  const name = userProfile.name || 'daar';

  switch (step) {
    case 'talents':
      if (userProfile.superpowers.length === 2) {
        return `Geweldig ${name}! Met ${userProfile.superpowers[0]} en ${userProfile.superpowers[1]} ben je nu klaar voor de volgende stap.`;
      }
      return `Oké ${name}, laten we verder gaan!`;

    case 'environment':
      if (talents && talents.length > 0) {
        const talentStr = talents.map(t => t.label).join(', ');
        return `${name}, met jouw talenten (${talentStr}) kun je op veel plekken werken. Waar voel jij je het beste?`;
      }
      return `${name}, waar werk je het liefst?`;

    case 'drive':
      if (environment) {
        return `Mooi ${name}! Je hebt ${environment.label} gekozen. Wat is het belangrijkste voor jou?`;
      }
      return `${name}, wat wil jij bereiken?`;

    default:
      return '';
  }
}
