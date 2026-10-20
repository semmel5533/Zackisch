/**
 * Verified Research Library & Scientific Citations
 *
 * Implements docs/SOURCES_AND_VALIDATION.md and ZACKISCH_WEBSITE_MASTER_BRIEF.md (Section 11).
 * All URLs and DOIs are primary sources verified as of October 2026.
 */

export interface ResearchStudy {
  id: string;
  category: "waiting" | "recommendations" | "payment" | "technology" | "pricing";
  title: string;
  authors: string;
  year: number;
  publication: string;
  type: string;
  sample: string;
  originalUrl: string;
  claim: {
    de: string;
    en: string;
  };
  context: {
    de: string;
    en: string;
  };
  limitations: {
    de: string;
    en: string;
  };
}

export const RESEARCH_STUDIES: ResearchStudy[] = [
  {
    id: "Q01",
    category: "waiting",
    title: "Lightspeed × Medallia: Verbraucherumfrage Gastronomie Deutschland 2025",
    authors: "Lightspeed & Medallia",
    year: 2025,
    publication: "Repräsentative Verbraucherstudie Deutschland",
    type: "Verbraucherumfrage",
    sample: "Rund 1.000 erwachsene Restaurantbesucher in Deutschland",
    originalUrl: "https://www.presseportal.de/pm/165632/6151909",
    claim: {
      de: "27 % der befragten deutschen Restaurantgäste gaben an, ein Lokal wegen langer Wartezeiten schon vor der Bestellung verlassen zu haben.",
      en: "27% of surveyed German restaurant guests reported having left a venue before ordering due to long wait times.",
    },
    context: {
      de: "Untersuchung von Gästebedürfnissen, Wartezeittoleranz und Servicebewertungen in deutschen Speiserestaurants.",
      en: "Investigation of guest expectations, wait tolerance, and service satisfaction in German dining restaurants.",
    },
    limitations: {
      de: "Bezieht sich auf historische Einzelerlebnisse der Befragten; stellt keine generelle tägliche Abbruchquote je Betrieb dar.",
      en: "Reflects past individual experiences of respondents; does not represent an average daily abandonment rate per restaurant.",
    },
  },
  {
    id: "Q02",
    category: "waiting",
    title: "Worth the wait? How restaurant waiting time influences customer behavior and revenue",
    authors: "Jelle de Vries, Debjit Roy, René de Koster",
    year: 2018,
    publication: "Journal of Operations Management (Vol. 63, S. 59–78)",
    type: "Empirische Beobachtung & Verhaltenssimulation",
    sample: "94.404 Gäste eines Full-Service-Restaurants über 12 Monate",
    originalUrl: "https://doi.org/10.1016/j.jom.2018.05.001",
    claim: {
      de: "Lange Wartezeiten erhöhen die Abbruchwahrscheinlichkeit und verlängern die Wiederkehrintervalle von Gästen signifikant.",
      en: "Excessive waiting times significantly increase abandonment probability and lengthen customer return intervals.",
    },
    context: {
      de: "Ökonometrische Analyse realer Sitzplatz- und Servicedaten zur Quantifizierung des Umsatzverlusts durch Wartezeiten.",
      en: "Econometric analysis of dining transaction records quantifying revenue impacts of table waiting delays.",
    },
    limitations: {
      de: "Ergebnisse stammen aus einem indischen Großrestaurant. Das in der Simulation errechnete 15-%-Potenzial lässt sich nicht pauschal auf deutsche Gastronomien übertragen.",
      en: "Based on a single large-scale Indian restaurant. The simulated 15% revenue potential cannot be generalized across German hospitality.",
    },
  },
  {
    id: "Q03",
    category: "waiting",
    title: "The Psychology of Waiting Lines",
    authors: "David H. Maister",
    year: 1985,
    publication: "Harvard Business School & Management Theory",
    type: "Wirtschaftspsychologischer Grundlagenaufsatz",
    sample: "Dienstleistungs- und Warteschlangentheorie",
    originalUrl: "https://davidmaister.com/articles/1/52/",
    claim: {
      de: "Unbeschäftigtes Warten wird subjektiv als wesentlich länger empfunden als aktives Warten; Ungewissheit verstärkt Stress.",
      en: "Unoccupied time feels longer than occupied time; unexplained waits provoke greater anxiety than explained waits.",
    },
    context: {
      de: "Systematische Aufschlüsselung der Wahrnehmungsmechanismen von Warteschlangen im Dienstleistungssektor.",
      en: "Fundamental breakdown of psychological perception mechanisms in hospitality and service waiting lines.",
    },
    limitations: {
      de: "Theoretisches Managementmodell ohne spezifische quantitative Umsatzmessungen für digitale Menüs.",
      en: "Qualitative conceptual framework without direct statistical measurements for QR digital ordering.",
    },
  },
  {
    id: "Q04",
    category: "technology",
    title: "At Your Service on the Table: Impact of Tabletop Technology on Restaurant Performance",
    authors: "Tom Fangyun Tan, Serguei Netessine",
    year: 2020,
    publication: "Management Science (Vol. 66, No. 10, S. 4496–4515)",
    type: "Quasi-experimentelle Kausalstudie",
    sample: "Gestaffelte Einführung an Tischen einer großen Restaurantkette",
    originalUrl: "https://doi.org/10.1287/mnsc.2019.3430",
    claim: {
      de: "Digitale Tischtechnik steigerte den durchschnittlichen Bon um ca. 1 % und verkürzte die Mahlzeitendauer um knapp 10 %, ohne dass Personal entlassen wurde.",
      en: "Tabletop devices increased average check size by ~1% and reduced meal duration by ~10% with zero staff reductions.",
    },
    context: {
      de: "Vergleichende Analyse von Restaurantstandorten vor und nach Installation interaktiver Bezahl- und Bestellgeräte am Tisch.",
      en: "Comparative performance analysis before and after tabletop payment and ordering deployment.",
    },
    limitations: {
      de: "Untersuchte fest installierte proprietäre Hardware-Kioske, keine browserbasierten QR-Codes auf Gast-Smartphones.",
      en: "Evaluated fixed proprietary tabletop tablets, not browser-based guest mobile smartphone flows.",
    },
  },
  {
    id: "Q05",
    category: "recommendations",
    title: "How Do Recommender Systems Lead to Consumer Purchases? A Causal Mediation Analysis",
    authors: "Xitong Li, Jörn Grahl, Oliver Hinz",
    year: 2022,
    publication: "Information Systems Research (Vol. 33, No. 2, S. 620–637)",
    type: "Randomisiertes Feldexperiment",
    sample: "Online-Buchhandel mit echten Konsumenten-Käufen",
    originalUrl: "https://doi.org/10.1287/isre.2021.1074",
    claim: {
      de: "Personalisierte Empfehlungen steigerten die Kaufwahrscheinlichkeit um 12,4 % und den durchschnittlichen Warenkorbwert um 1,7 % im Experiment.",
      en: "Personalized recommendation algorithms increased purchase probability by 12.4% and basket value by 1.7% in the experiment.",
    },
    context: {
      de: "Kausale Zerlegung der psychologischen Wirkungsmechanismen von Produktempfehlungen im Online-Handel.",
      en: "Causal mediation analysis examining how algorithmic item recommendations drive cross-category discovery.",
    },
    limitations: {
      de: "Die Studie wurde im Online-Buchhandel durchgeführt, nicht in der Gastronomie. Sie stützt den psychologischen Mechanismus, beweist aber keine 4-%-Gastro-Steigerung.",
      en: "Conducted in online book retail, not hospitality. Demonstrates the cognitive mechanism but does not prove a 4% restaurant basket uplift.",
    },
  },
  {
    id: "Q06",
    category: "payment",
    title: "Zahlungsverhalten in Deutschland 2025",
    authors: "Deutsche Bundesbank",
    year: 2026,
    publication: "Deutsche Bundesbank Forschungsbericht (Veröffentlicht 17.06.2026)",
    type: "Repräsentative Erhebung mit Zahlungstagebuch",
    sample: "6.070 befragte Bürgerinnen und Bürger in Deutschland",
    originalUrl: "https://www.bundesbank.de/de/publikationen/berichte/studien/zahlungsverhalten-in-deutschland-2025-997848",
    claim: {
      de: "45 % aller erfassten Transaktionen in Deutschland wurden 2025 bar abgewickelt; 80 % der Bevölkerung halten den Erhalt von Bargeld für wichtig.",
      en: "45% of all recorded payment transactions in Germany were cash in 2025; 80% view continued cash acceptance as essential.",
    },
    context: {
      de: "Offizielle regelmäßige Bundesbankstudie zu Zahlungsgewohnheiten, Bar- und Kartennutzung im stationären Handel und Alltag.",
      en: "Official recurring central bank study examining payment methods, cash shares, and card usage across Germany.",
    },
    limitations: {
      de: "Umfasst den gesamten Zahlungsverkehr aller Branchen, keine isolierte Auswertung von Gastronomiebetrieben.",
      en: "Covers economy-wide payment volume, not isolated hospitality or dining venue subsets.",
    },
  },
  {
    id: "Q07",
    category: "technology",
    title: "Self-Service-Terminals in 20 Fast-Food-Restaurants: Ausgabensteigerung",
    authors: "Universität Hamburg (Fachbereich Betriebswirtschaftslehre)",
    year: 2023,
    publication: "Forschungsmitteilung Universität Hamburg",
    type: "Empirische Feldbeobachtung",
    sample: "20 Fast-Food-Filialen mit parallelem Kassen- und Terminalbetrieb",
    originalUrl: "https://www.uni-hamburg.de/newsroom/forschung/2023/0816-fv-24-bwl-marketing.html",
    claim: {
      de: "Gäste gaben an digitalen Self-Service-Terminals in den untersuchten Betrieben 14 % bzw. 16 % mehr aus als an der bemannten Theke.",
      en: "Customers ordering via digital self-service terminals spent 14% to 16% more compared to manual counter ordering.",
    },
    context: {
      de: "Untersuchung des Konsumentenverhaltens bei bildschirmgestützter visueller Menüführung und automatischen Zusatzangeboten.",
      en: "Observation of consumer item selection behavior with visual item modifiers and automated upselling cues.",
    },
    limitations: {
      de: "Gilt für standardisierte Fast-Food-Ketten mit Großbildschirmen; die 4-%-Upselling-Annahme im Zackisch-Rechner ist ein eigenständiges vorsichtiges Szenario.",
      en: "Observed in fast-food kiosk chains; the 4% digital uplift in Zackisch's calculator is an independent illustrative scenario.",
    },
  },
  {
    id: "Q08",
    category: "pricing",
    title: "Wolt Merchant Fees & Commission Structure",
    authors: "Wolt Enterprises Oy",
    year: 2026,
    publication: "Offizielle Händlerdokumentation Deutschland",
    type: "Anbieterdokumentation & Preismodell",
    sample: "B2B-Händlerkonditionen für Gastronomiebetriebe",
    originalUrl: "https://merchant.wolt.com/de/deu/learning-center/wolt-merchant-fees-and-commissions",
    claim: {
      de: "Marktplatzplattformen erheben vertragsabhängige Gebühren für Lieferung, Abholung und Werbeleistungen.",
      en: "Delivery marketplace platforms charge contract-dependent commission fees for logistics, takeaway, and placement.",
    },
    context: {
      de: "Transparente Dokumentation der vertraglichen Aufschläge und Abrechnungsmethoden für Partnerrestaurants.",
      en: "Public merchant guidance detailing revenue sharing and fulfillment charges for restaurant partners.",
    },
    limitations: {
      de: "Ein direkter Gebührenvergleich zwischen Full-Service-Liefermarktplätzen und lokaler In-House-Bestellsoftware greift zu kurz.",
      en: "Direct fee comparisons between full delivery logistics marketplaces and local in-house table software are not 1:1 equivalent.",
    },
  },
];
