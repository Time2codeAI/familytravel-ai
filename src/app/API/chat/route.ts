import { streamText } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';

// Claude model
const claudeModel = anthropic('claude-3-5-sonnet-20241022');

// System prompts
const FAMILY_SYSTEM_PROMPTS = {
  tripPlanner: `Je bent een expert familie-reisplanner. Help families met het plannen van veilige, leuke en praktische reizen. 

Geef altijd:
- Concrete, actionable adviezen
- Veiligheidsinformatie waar relevant
- Leeftijdsgeschikte suggesties
- Budget-bewuste opties
- Praktische tips voor ouders

Houd antwoorden beknopt maar informatief.`,

  restaurantExpert: `Je bent een expert in familie-vriendelijke restaurants. Help ouders restaurants te vinden die geschikt zijn voor kinderen.

Focus op:
- Kindermenu's en allergieën
- Kinderstoelen en faciliteiten
- Geluidstolerante omgeving
- Prijs-kwaliteit verhouding
- Praktische informatie (openingstijden, reserveringen)`,

  activityGuide: `Je bent een expert in familie-activiteiten. Suggereer leuke, veilige en educatieve activiteiten voor gezinnen.

Let op:
- Leeftijdsgeschiktheid van alle kinderen
- Veiligheidsaspecten
- Educatieve waarde
- Weersomstandigheden
- Toegankelijkheid en kosten`
};

export async function POST(req: Request) {
  try {
    const { messages, familyInfo } = await req.json();

    // Bepaal welke system prompt te gebruiken
    let systemPrompt = FAMILY_SYSTEM_PROMPTS.tripPlanner;
    
    const lastMessage = messages[messages.length - 1]?.content?.toLowerCase() || '';
    
    if (lastMessage.includes('restaurant') || lastMessage.includes('eten') || lastMessage.includes('lunch') || lastMessage.includes('diner')) {
      systemPrompt = FAMILY_SYSTEM_PROMPTS.restaurantExpert;
    } else if (lastMessage.includes('activiteit') || lastMessage.includes('bezienswaardigheden') || lastMessage.includes('doen')) {
      systemPrompt = FAMILY_SYSTEM_PROMPTS.activityGuide;
    }

    // Voeg familie context toe aan system prompt
    if (familyInfo) {
      systemPrompt += `\n\nFamilie context voor deze conversatie:
- Bestemming: ${familyInfo.destination || 'niet opgegeven'}
- Kinderen: ${familyInfo.childrenAges || 'geen'} jaar oud
- Interesses: ${familyInfo.interests || 'algemeen'}
- Budget: ${familyInfo.budget === 'low' ? 'beperkt' : familyInfo.budget === 'medium' ? 'gemiddeld' : 'ruim'}`;
    }

    const result = await streamText({
      model: claudeModel,
      system: systemPrompt,
      messages,
      maxTokens: 1000,
      temperature: 0.7,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error('Chat API Error:', error);
    return new Response(
      JSON.stringify({ error: 'Er ging iets mis bij het verwerken van je vraag.' }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}