// src/lib/ai/claude.ts - CORRECTE versie
import { anthropic } from '@ai-sdk/anthropic';

// Claude model - API key komt automatisch uit environment variables
export const claudeModel = anthropic('claude-3-5-sonnet-20241022');

// Familie-specifieke system prompts
export const FAMILY_SYSTEM_PROMPTS = {
  tripPlanner: `Je bent een expert gezinsreis-assistent die veilige, praktische en leuke reisadviezen geeft.

BELANGRIJKE RICHTLIJNEN:
- Prioriteer altijd kinderveiligheid en leeftijdsgeschiktheid
- Geef praktische informatie (openingstijden, prijzen, reserveringen)
- Vermeld altijd mogelijke risico's of beperkingen
- Gebruik bemoedigende, positieve taal
- Sluit educatieve waarde in waar mogelijk

ANTWOORD FORMAAT:
- Gebruik duidelijke kopjes en bullet points
- Geef concrete adressen en telefoonnummers
- Vermeld kosten in euro's
- Eindig altijd met een leuke tip of feit

Je helpt Nederlandse gezinnen bij het plannen van veilige en onvergetelijke vakanties.`,

  restaurantExpert: `Je bent een familie-restaurant expert die kindvriendelijke eetgelegenheden aanbevelingen doet.

FOCUS OP:
- Kindermenu's en allergie-vriendelijke opties
- Hygiëne en veiligheid
- Ruimte voor kinderwagens en kinderen
- Prijs-kwaliteit verhouding
- Lokale specialiteiten die kinderen lekker vinden

Geef altijd praktische details zoals openingstijden, reserveringsmogelijkheden en prijsklasse.`,

  activityGuide: `Je bent een familie-activiteiten gids die leeftijdsgeschikte en veilige activiteiten aanbeveelt.

BELANGRIJK:
- Controleer altijd leeftijdsbeperkingen
- Vermeld veiligheidsuitrusting of voorzorgsmaatregelen
- Geef alternatieve activiteiten bij slecht weer
- Focus op educatieve en interactieve ervaringen
- Vermeld als ouderlijk toezicht vereist is

Maak onderscheid tussen verschillende leeftijdsgroepen (0-3, 4-8, 9-12, 13+ jaar).`
};

// Gezinsvakanties prompt templates
export const FAMILY_PROMPTS = {
  searchRestaurants: (destination: string, familyInfo: {
    ages: number[];
    dietaryRestrictions?: string[];
    budget?: 'low' | 'medium' | 'high';
  }) => `
Zoek familie-vriendelijke restaurants in ${destination}.

Familie details:
- Kinderen: ${familyInfo.ages.length > 0 ? familyInfo.ages.join(', ') + ' jaar oud' : 'geen kinderen'}
- Dieetbeperkingen: ${familyInfo.dietaryRestrictions?.join(', ') || 'geen'}
- Budget: ${familyInfo.budget === 'low' ? 'beperkt' : familyInfo.budget === 'medium' ? 'gemiddeld' : familyInfo.budget === 'high' ? 'ruim' : 'geen voorkeur'}

Geef 3-5 restaurants met voor elk:
1. **Naam** en adres
2. **Type keuken** 
3. **Prijsklasse** (€/€€/€€€)
4. **Kindvriendelijke aspecten**
5. **Kindermenu** (ja/nee + voorbeelden)
6. **Praktische info** (openingstijden, reservering)
7. **Waarom perfect voor dit gezin**

Focus op veiligheid, hygiëne en een gezellige sfeer voor families.
`,

  searchActivities: (destination: string, familyInfo: {
    ages: number[];
    interests?: string[];
    weather?: string;
  }) => `
Suggereer familie-activiteiten in ${destination}.

Familie details:
- Kinderen: ${familyInfo.ages.length > 0 ? familyInfo.ages.join(', ') + ' jaar oud' : 'geen kinderen'}
- Interesses: ${familyInfo.interests?.join(', ') || 'algemeen'}
- Weer: ${familyInfo.weather || 'onbekend'}

Geef 3-5 activiteiten met voor elk:
1. **Activiteit naam** en locatie
2. **Leeftijdsgeschiktheid** (min/max leeftijd)
3. **Duur** en beste tijdstip
4. **Kosten** per persoon/gezin
5. **Wat te verwachten**
6. **Veiligheidsinformatie**
7. **Boekingsinformatie**

Prioriteer veilige, educatieve en leuke ervaringen die geschikt zijn voor de hele familie.
`,

  emergencyInfo: (destination: string) => `
Geef belangrijke nood- en veiligheidsinformatie voor gezinnen in ${destination}.

Inclusief:
1. **Alarmnummers** (lokaal alarmnummer)
2. **Ziekenhuis** met pediatrische afdeling (naam, adres, telefoon)
3. **Apotheek** (24-uur indien beschikbaar)
4. **Politie** (dichtstbijzijnde bureau)
5. **Nederlandse vertegenwoordiging** (ambassade/consulaat)
6. **Belangrijke zinnen** in lokale taal
7. **Documentverlies** (wat te doen bij verloren paspoort)
8. **Veiligheidstips** specifiek voor families

Geef concrete contactgegevens en praktische stappen.
`,

  createItinerary: (destination: string, duration: number, familyInfo: {
    ages: number[];
    interests?: string[];
    budget?: string;
  }) => `
Maak een ${duration}-daagse reisroute voor een gezin naar ${destination}.

Familie details:
- Kinderen: ${familyInfo.ages.length > 0 ? familyInfo.ages.join(', ') + ' jaar oud' : 'geen kinderen'}
- Interesses: ${familyInfo.interests?.join(', ') || 'algemeen'}
- Budget: ${familyInfo.budget || 'gemiddeld'}

Voor elke dag, geef:
1. **Ochtend activiteit** (9:00-12:00)
2. **Lunch suggestie** 
3. **Middag activiteit** (13:00-17:00)
4. **Diner optie**
5. **Rust momenten** voor kinderen
6. **Alternatief bij slecht weer**

Houd rekening met:
- Vermoeidheid van kinderen
- Reistijd tussen locaties
- Lunch- en slaappauzes
- Flexibiliteit voor spontane momenten
`
};