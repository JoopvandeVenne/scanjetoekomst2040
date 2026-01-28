import { Interest, Choice } from './types';

export const GENDERS: Choice[] = [
  { id: 'boy', label: 'Jongen', icon: 'fa-mars' },
  { id: 'girl', label: 'Meisje', icon: 'fa-venus' },
  { id: 'other', label: 'Anders', icon: 'fa-genderless' }
];

export const SUPERPOWERS: Interest[] = [
  { id: 'creative', label: 'Creatief Brein', icon: 'fa-palette' },
  { id: 'analytical', label: 'Snel Denken', icon: 'fa-brain' },
  { id: 'social', label: 'Groot Hart', icon: 'fa-users' },
  { id: 'technical', label: 'Gouden Handen', icon: 'fa-cogs' },
  { id: 'athletic', label: 'Doorzetter', icon: 'fa-running' },
  { id: 'musical', label: 'Super Focus', icon: 'fa-music' }
];

export const TALENTS: Interest[] = [
  { id: 'maker', label: 'De Maker', icon: 'fa-tools' },
  { id: 'researcher', label: 'De Onderzoeker', icon: 'fa-search' },
  { id: 'creative', label: 'De Creatieveling', icon: 'fa-lightbulb' },
  { id: 'helper', label: 'De Helper', icon: 'fa-heart' },
  { id: 'organizer', label: 'De Regelaar', icon: 'fa-list-check' },
  { id: 'entrepreneur', label: 'De Ondernemer', icon: 'fa-briefcase' }
];

export const ENVIRONMENTS: Choice[] = [
  {
    id: 'digital',
    label: 'De Digitale Wereld',
    icon: 'fa-gamepad',
    description: 'Gamen, VR en Computers'
  },
  {
    id: 'nature',
    label: 'Buiten in de Natuur',
    icon: 'fa-tree',
    description: 'Dieren, Planten en Milieu'
  },
  {
    id: 'workshop',
    label: 'De Werkplaats',
    icon: 'fa-wrench',
    description: 'Experimenteren en Bouwen'
  },
  {
    id: 'people',
    label: 'Tussen de Mensen',
    icon: 'fa-users',
    description: 'Helpen en Samenwerken'
  }
];

export const DRIVES: Choice[] = [
  {
    id: 'save-world',
    label: 'De Wereld Redden',
    icon: 'fa-earth-americas',
    description: 'Duurzaamheid en Veiligheid'
  },
  {
    id: 'money-success',
    label: 'Geld en Succes',
    icon: 'fa-trophy',
    description: 'Business en Groei'
  },
  {
    id: 'make-happy',
    label: 'Mensen Blij Maken',
    icon: 'fa-smile',
    description: 'Entertainment en Zorg'
  },
  {
    id: 'discover',
    label: 'Nieuwe Dingen Ontdekken',
    icon: 'fa-compass',
    description: 'Innovatie'
  }
];
