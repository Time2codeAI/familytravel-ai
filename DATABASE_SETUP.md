# Database Setup for Family Travel AI

This document explains how to set up the database for the trip creation functionality based on the existing schema structure.

## Supabase Setup

### 1. Create Database Schema

Run the SQL commands from `src/lib/supabase/schema.sql` in your Supabase SQL editor:

```sql
-- Copy and paste the entire contents of src/lib/supabase/schema.sql
-- This will create all necessary tables with proper RLS policies
```

### 2. Environment Variables

Make sure your `.env.local` file contains:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Database Structure

The database includes the following tables:

#### `profiles` table:

- `id` - UUID primary key (references auth.users)
- `email` - User email
- `full_name` - User's full name
- `family_size` - Number of family members
- `children_ages` - Array of children ages
- `dietary_restrictions` - Array of dietary restrictions
- `mobility_needs` - Mobility requirements
- `preferred_language` - Language preference (default: 'nl')
- `emergency_contact` - Emergency contact info (jsonb)
- `created_at` / `updated_at` - Timestamps

#### `trips` table:

- `id` - UUID primary key
- `user_id` - Reference to auth.users (with RLS)
- `title` - Trip title
- `destination` - Destination location
- `start_date` - Trip start date
- `end_date` - Trip end date
- `family_composition` - JSONB object with adults and children array
- `preferences` - JSONB object with interests, budget, and other preferences
- `status` - Trip status (default: 'planning')
- `total_budget` - Total budget in cents/smallest currency unit
- `is_public` - Whether trip is publicly visible
- `created_at` / `updated_at` - Timestamps

#### `trip_items` table:

- `id` - UUID primary key
- `trip_id` - Reference to trips table
- `category` - Item category (restaurant, activity, etc.)
- `title` - Item title
- `description` - Item description
- `content` - JSONB with item details
- `status` - Item status (default: 'suggested')
- `ai_prompt` / `ai_response` - AI interaction data
- `location_data` - JSONB with location information
- `priority` - Priority level
- `estimated_cost` - Estimated cost
- `visit_date` - Planned visit date
- `rating` - User rating (1-5)
- `notes` - User notes
- `created_at` / `updated_at` - Timestamps

#### `trip_expenses` table:

- `id` - UUID primary key
- `trip_id` - Reference to trips table
- `trip_item_id` - Optional reference to trip_items
- `user_id` - User who created the expense
- `title` - Expense title
- `amount` - Amount in cents/smallest currency unit
- `category` - Expense category
- `description` - Expense description
- `receipt_url` - URL to receipt image
- `expense_date` - Date of expense
- `split_among` - Array of user IDs to split expense
- `created_at` - Timestamp

#### `chat_messages` table:

- `id` - UUID primary key
- `trip_id` - Reference to trips table
- `role` - Message role (user/assistant/system)
- `content` - Message content
- `metadata` - JSONB with additional message data
- `created_at` - Timestamp

### 4. Row Level Security (RLS)

All tables have RLS enabled with comprehensive policies:

- **Profiles**: Users can only access their own profile
- **Trips**: Users can only access their own trips
- **Trip Items**: Users can only access items for their trips
- **Trip Expenses**: Users can only access expenses for their trips
- **Chat Messages**: Users can only access messages for their trips

### 5. Family Composition Structure

The `family_composition` field in the trips table uses this structure:

```json
{
  "adults": 2,
  "children": [5, 8, 12]
}
```

### 6. Preferences Structure

The `preferences` field in the trips table can contain:

```json
{
  "interests": ["🏖️ Strand", "🎢 Pretparken", "🍕 Eten"],
  "budget": "medium",
  "description": "Extra wishes and requirements",
  "dietary_restrictions": ["vegetarian", "gluten-free"],
  "mobility_needs": "wheelchair accessible"
}
```

## API Endpoints

### POST /api/trips

Creates a new trip for the authenticated user.

**Request Headers:**

```
Authorization: Bearer {access_token}
Content-Type: application/json
```

**Request Body:**

```typescript
{
  title: string;
  destination: string;
  start_date?: string; // YYYY-MM-DD format
  end_date?: string; // YYYY-MM-DD format
  family_composition?: {
    adults: number;
    children: number[];
  };
  preferences?: {
    interests?: string[];
    budget?: 'low' | 'medium' | 'high';
    [key: string]: any;
  };
  status?: string;
  total_budget?: number;
  is_public?: boolean;
}
```

**Response:**

```typescript
{
  success: true;
  trip: Trip; // Full trip object with id, user_id, timestamps, etc.
}
```

### GET /api/trips

Retrieves all trips for the authenticated user.

**Request Headers:**

```
Authorization: Bearer {access_token}
```

**Response:**

```typescript
{
  trips: Trip[];
}
```

## Testing

1. Make sure you're authenticated (sign in through `/login`)
2. Navigate to `/trips/create`
3. Fill out the form and submit
4. The trip should be created in the database and you should be redirected to the trip detail page

## Troubleshooting

- **401 Unauthorized**: Make sure you're signed in and the session token is valid
- **500 Database Error**: Check your Supabase connection and that the schema is properly set up
- **RLS Policy Error**: Ensure the RLS policies are correctly applied to all tables
- **JSONB Format Error**: Ensure family_composition and preferences are properly formatted JSON objects

## Migration from Old Schema

If you have an existing schema that doesn't match this structure, you'll need to:

1. Back up your existing data
2. Run the new schema SQL
3. Migrate your data to the new structure, converting flat fields to JSONB where needed
4. Update your application code to use the new structure
