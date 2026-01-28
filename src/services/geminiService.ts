import { UserProfile, Interest, Choice, CareerResult } from '../types';

const careerDatabase = [
  {
    keywords: ['creative', 'digital', 'make-happy'],
    jobTitle: 'Metaverse Experience Designer',
    dendronWorld: 'Creatieve Technologie',
    sectorType: 'Digitale Ervarings-industrie',
    description: 'Jij bedenkt en bouwt coole digitale werelden waar mensen kunnen spelen en ontdekken! Van interactieve musea tot spannende games - jij maakt ervaringen die mensen nooit vergeten. Je combineert tekenen, programmeren en verhalen bedenken.',
    dendronTraining: 'Je leert Engels voor internationale samenwerking, Wiskunde voor 3D-ontwerpen en Tekenen om je ideeën zichtbaar te maken. Met Nederlands leg je jouw creatieve plannen helder uit aan je team.'
  },
  {
    keywords: ['technical', 'analytical', 'digital'],
    jobTitle: 'AI Ethics Programmer',
    dendronWorld: 'Technologie & Robots',
    sectorType: 'Slimme Technologie & Ethiek',
    description: 'Jij leert robots en slimme computers hoe ze mensen kunnen helpen! Je zorgt ervoor dat technologie eerlijk is en iedereen helpt. Je maakt apps en robots die het leven makkelijker en leuker maken voor iedereen.',
    dendronTraining: 'Je begint met Wiskunde voor computerberekeningen, Maatschappijleer voor het begrijpen van menselijke waarden en Engels voor het schrijven van code. Geschiedenis laat zien hoe technologie de maatschappij heeft veranderd.'
  },
  {
    keywords: ['social', 'helper', 'people', 'make-happy'],
    jobTitle: 'Community Happiness Architect',
    dendronWorld: 'Mensen Helpen',
    sectorType: 'Sociale Welzijns-netwerken',
    description: 'Jij zorgt ervoor dat mensen in jouw buurt blij en gezond zijn! Je organiseert activiteiten, helpt mensen elkaar te ontmoeten en zorgt dat niemand zich eenzaam voelt. Met apps en evenementen maak jij van je buurt een fijne plek.',
    dendronTraining: 'Je leert Biologie voor begrip van emoties en gezondheid, Maatschappijleer voor groepsdynamiek en Nederlands voor het vertellen van verhalen die mensen verbinden. Aardrijkskunde toont hoe diverse culturen samenleven.'
  },
  {
    keywords: ['athletic', 'nature', 'save-world'],
    jobTitle: 'Bio-Performance Coach',
    dendronWorld: 'Sport & Gezondheid',
    sectorType: 'Duurzame Sport & Prestatie',
    description: 'Jij helpt sporters beter te worden en tegelijk de natuur te beschermen! Met coole technologie volg je hoe sporters presteren en maak je trainingen op maat. Je zorgt dat sporten goed is voor het lichaam én voor de aarde.',
    dendronTraining: 'Je gebruikt Lichamelijke Opvoeding voor bewegingsleer, Biologie voor spierfuncties en Aardrijkskunde voor duurzaamheid. Wiskunde helpt je bij het analyseren en verbeteren van sportprestaties.'
  },
  {
    keywords: ['musical', 'creative', 'digital', 'make-happy'],
    jobTitle: 'Sonic Experience Creator',
    dendronWorld: 'Muziek & Audio',
    sectorType: 'Audio Innovatie & Belevingen',
    description: 'Jij maakt muziek en geluiden die mensen raken! Van muziek voor films tot coole effecten in games - jij brengt geluid tot leven. Je werkt met moderne apparatuur waarmee je onmogelijke sounds kunt maken die emoties oproepen.',
    dendronTraining: 'Je combineert Muziek voor ritme en melodie, Natuurkunde voor geluidstechniek en Wiskunde voor frequentieberekeningen. Engels opent deuren naar samenwerking met internationale artiesten.'
  },
  {
    keywords: ['social', 'helper', 'digital', 'make-happy'],
    jobTitle: 'Neural Learning Designer',
    dendronWorld: 'Onderwijs van de Toekomst',
    sectorType: 'Adaptief Onderwijs & Leertech',
    description: 'Jij maakt leren super leuk en spannend! Je bedenkt games, apps en activiteiten waardoor kinderen spelenderwijs dingen leren. Van geschiedenis tot rekenen - jij zorgt dat iedereen op zijn eigen manier kan leren en slim wordt.',
    dendronTraining: 'Je leert Nederlands voor heldere communicatie, Engels voor mondiale onderwijstrends en Biologie voor begrip van hoe hersenen leren. Geschiedenis geeft je verhalen waarmee je kennis tot leven brengt.'
  },
  {
    keywords: ['analytical', 'researcher', 'nature', 'save-world'],
    jobTitle: 'Climate Intelligence Specialist',
    dendronWorld: 'Natuur & Milieu',
    sectorType: 'Klimaat Data & Eco-herstel',
    description: 'Jij gebruikt computers en satellietendata om de aarde te redden! Je voorspelt het weer, helpt bossen te beschermen en bedenkt slimme oplossingen tegen vervuiling. Met technologie houd je de natuur gezond voor de toekomst.',
    dendronTraining: 'Je wordt sterk in Wiskunde voor data-analyse, Aardrijkskunde voor planetaire systemen en Biologie voor ecosystemen. Natuurkunde legt uit hoe klimaatprocessen werken.'
  },
  {
    keywords: ['analytical', 'entrepreneur', 'money-success'],
    jobTitle: 'Future Scenario Strategist',
    dendronWorld: 'Bedrijven & Plannen',
    sectorType: 'Strategische Toekomstplanning',
    description: 'Jij helpt bedrijven en organisaties om slimme keuzes te maken voor later! Je bedenkt plannen waardoor bedrijven succesvol worden én de wereld beter maken. Je kijkt naar wat mensen willen en bedenkt nieuwe ideeën die niemand nog heeft bedacht.',
    dendronTraining: 'Je leert Maatschappijleer voor organisatiestructuren, Engels voor internationale zakelijke communicatie en Wiskunde voor trendanalyse. Geschiedenis toont patronen die zich in nieuwe vormen herhalen.'
  },
  {
    keywords: ['maker', 'technical', 'workshop'],
    jobTitle: 'Smart Materials Engineer',
    dendronWorld: 'Bouwen & Maken',
    sectorType: 'Maakbare Innovatie & Fabricage',
    description: 'Jij maakt met je handen de coolste dingen! Van robots tot meubels, van kleding tot kunstwerken - jij bedenkt iets en maakt het echt. Je gebruikt nieuwe materialen en machines om dingen te bouwen die nuttig en mooi zijn.',
    dendronTraining: 'Je leert Handvaardigheid voor vakmanschap met gereedschap, Wiskunde voor nauwkeurige metingen en Tekenen voor visualisatie van ideeën. Natuurkunde laat zien hoe je sterke constructies maakt.'
  },
  {
    keywords: ['researcher', 'analytical', 'discover'],
    jobTitle: 'Discovery Science Explorer',
    dendronWorld: 'Wetenschap & Ontdekken',
    sectorType: 'Wetenschappelijk Onderzoek',
    description: 'Jij bent altijd nieuwsgierig en wilt alles weten! Je doet experimenten, onderzoekt nieuwe dingen en lost mysteries op. Van ruimtevaart tot geneeskunde - jij ontdekt dingen die nog niemand wist en deelt je bevindingen met de wereld.',
    dendronTraining: 'Je leert Natuurkunde voor experimenten, Biologie voor het bestuderen van leven en Wiskunde voor het bewijzen van ontdekkingen. Engels gebruik je voor het delen van resultaten met de wereldwijde wetenschappelijke gemeenschap.'
  }
];

const fallbackCareer: CareerResult = {
  jobTitle: 'Cross-Sector Innovation Specialist',
  dendronWorld: 'Alles Combineren',
  sectorType: 'Interdisciplinaire Innovatie',
  description: 'Jij bent super veelzijdig en houdt van alles een beetje! Je combineert verschillende dingen op verrassende manieren en verzint oplossingen waar niemand anders aan denkt. Jouw superpower is dat je overal een beetje van weet en alles met elkaar kunt verbinden.',
  dendronTraining: 'Je mag van alles proberen - van Tekenen tot Wiskunde, van Sport tot Muziek, van Biologie tot Engels. Je brede interesse helpt je patronen te zien die anderen missen, perfect voor het bedenken van vernieuwende ideeën.'
};

const SUPERPOWER_KEYWORD_MAPPING: Record<string, string[]> = {
  'creatief brein': ['creative'],
  'snel denken': ['analytical'],
  'groot hart': ['social'],
  'gouden handen': ['technical', 'maker'],
  'doorzetter': ['athletic'],
  'super focus': ['musical']
};

function mapSuperpowerToKeywords(superpower: string): string[] {
  const normalized = superpower.toLowerCase();
  return SUPERPOWER_KEYWORD_MAPPING[normalized] || [normalized];
}

export async function generateCareerContent(
  userProfile: UserProfile,
  talents: Interest[],
  environment: Choice,
  drive: Choice
): Promise<CareerResult> {
  await new Promise(resolve => setTimeout(resolve, 2000));

  const superpowerKeywords = userProfile.superpowers.flatMap(sp => mapSuperpowerToKeywords(sp));

  const allKeywords = [
    ...superpowerKeywords,
    ...talents.map(t => t.id),
    environment.id,
    drive.id
  ];

  let bestMatch = fallbackCareer;
  let maxScore = 0;

  for (const career of careerDatabase) {
    const score = career.keywords.filter(kw =>
      allKeywords.some(uk => uk.includes(kw) || kw.includes(uk))
    ).length;

    if (score > maxScore) {
      maxScore = score;
      bestMatch = { ...career };
    }
  }

  return {
    ...bestMatch
  };
}
