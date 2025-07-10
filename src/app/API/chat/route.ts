// src/app/api/chat/route.ts - AI chat endpoint voor familie reizen
import { streamText } from 'ai';
import { claudeModel, FAMILY_SYSTEM_PROMPTS } from '@/lib/ai/Claude';
import { supabase } from '@/lib/supabase/client';

export async function POST(req: Request) {
  try {
    const { messages, tripId, familyInfo } = await req.json();

    // Bepaal welke system prompt te gebruiken op basis van de context
    let systemPrompt = FAMILY_SYSTEM_PROMPTS.tripPlanner;
    
    // Check de laatste message voor specifieke intents
    const lastMessage = messages[messages.length - 1]?.content?.toLowerCase() || '';
    
    if (lastMessage.includes('restaurant') || lastMessage.includes('eten') || lastMessage.includes('lunch') || lastMessage.includes('diner')) {
      systemPrompt = FAMILY_SYSTEM_PROMPTS.restaurantExpert;
    } else if (lastMessage.includes('activiteit') || lastMessage.includes('bezienswaardigheden') || lastMessage.includes('doen')) {
      systemPrompt = FAMILY_SYSTEM_PROMPTS.activityGuide;
    }

    // Voeg familie context toe aan system prompt
    if (familyInfo) {
      systemPrompt += `\n\nFamilie context voor deze conversatie:
- Kinderen: ${familyInfo.ages?.join(', ') || 'geen'} jaar oud
- Dieetbeperkingen: ${familyInfo.dietaryRestrictions?.join(', ') || 'geen'}
- Interesses: ${familyInfo.interests?.join(', ') || 'algemeen'}
- Budget: ${familyInfo.budget || 'geen voorkeur'}`;
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

// Helper functie om user context op te halen
async function getUserContext(userId: string) {
  try {
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    const { data: trips } = await supabase
      .from('trips')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(5);

    return { profile, recentTrips: trips };
  } catch (error) {
    console.error('Error fetching user context:', error);
    return { profile: null, recentTrips: [] };
  }
}