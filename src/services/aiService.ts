import OpenAI from 'openai';

// Check if API key is available
const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;

if (!apiKey) {
  console.error('VITE_OPENROUTER_API_KEY is not set in environment variables');
}

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: apiKey || "fallback-key", // Provide fallback to prevent initialization errors
  defaultHeaders: {
    "HTTP-Referer": "https://kitchen-ai.app",
    "X-Title": "Kitchen.AI",
  },
  dangerouslyAllowBrowser: true
});

// Custom error classes
export class AIResponseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AIResponseError';
  }
}

export class JSONParseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'JSONParseError';
  }
}

export interface MealPlanRequest {
  planType: string;
  mealsPerDay: number;
  peopleCount: number;
  skillLevel?: string;
  dietaryRestrictions?: string[];
  allergies?: string[];
  preferences?: string[];
}

export interface GeneratedMeal {
  name: string;
  description: string;
  cookTime: number;
  servings: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  ingredients: string[];
  instructions: string[];
}

// Retry mechanism with exponential backoff
const retryWithBackoff = async <T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> => {
  let lastError: Error;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      
      if (attempt === maxRetries - 1) {
        throw lastError;
      }
      
      const delay = baseDelay * Math.pow(2, attempt);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError!;
};

// Enhanced JSON parsing with better error handling
const parseAIResponse = (response: string): any => {
  if (!response) {
    throw new JSONParseError('Empty response from AI');
  }

  // Clean the response to extract valid JSON
  let cleanedResponse = response.trim();
  
  // Remove any markdown code blocks
  cleanedResponse = cleanedResponse.replace(/```json\s*/g, '').replace(/```\s*/g, '');
  
  // Find the JSON object
  const jsonStart = cleanedResponse.indexOf('{');
  const jsonEnd = cleanedResponse.lastIndexOf('}') + 1;
  
  if (jsonStart === -1 || jsonEnd === 0) {
    throw new JSONParseError('No valid JSON found in AI response');
  }
  
  const jsonString = cleanedResponse.substring(jsonStart, jsonEnd);
  
  // Fix common JSON issues
  const fixedJson = jsonString
    .replace(/,\s*}/g, '}')  // Remove trailing commas
    .replace(/,\s*]/g, ']')  // Remove trailing commas in arrays
    .replace(/\n/g, ' ')     // Remove newlines
    .replace(/\s+/g, ' ')    // Normalize whitespace
    .replace(/([{,]\s*)(\w+):/g, '$1"$2":'); // Quote unquoted keys
  
  try {
    return JSON.parse(fixedJson);
  } catch (parseError) {
    throw new JSONParseError(`Failed to parse AI response: ${parseError.message}`);
  }
};

// Validation functions
const validateGeneratedMeal = (meal: any): GeneratedMeal => {
  const requiredFields = ['name', 'description', 'cookTime', 'servings', 'difficulty', 'ingredients', 'instructions'];
  
  for (const field of requiredFields) {
    if (!meal[field]) {
      throw new Error(`Missing required field: ${field}`);
    }
  }
  
  if (!Array.isArray(meal.ingredients) || meal.ingredients.length === 0) {
    throw new Error('Ingredients must be a non-empty array');
  }
  
  if (!Array.isArray(meal.instructions) || meal.instructions.length === 0) {
    throw new Error('Instructions must be a non-empty array');
  }
  
  if (!['Easy', 'Medium', 'Hard'].includes(meal.difficulty)) {
    throw new Error('Invalid difficulty level');
  }
  
  return meal as GeneratedMeal;
};

// Generate comprehensive absolute requirements based on plan type
const generateAbsoluteRequirements = (planType: string): string => {
  const requirements = [
    `1. If plan type is "healthy meals", focus on nutritious, balanced options with vegetables, lean proteins, whole grains, and minimal processed foods`,
    `2. If plan type is "pasta dishes", the meal MUST be a pasta-based dish (spaghetti, penne, lasagna, fettuccine, ravioli, etc.)`,
    `3. If plan type is "quick meals", meal should be under 30 minutes total time with simple preparation methods`,
    `4. If plan type is "budget-friendly meals", focus on affordable ingredients, bulk cooking, and cost-effective proteins like beans, eggs, and chicken`,
    `5. If plan type is "vegetarian meals", NO meat, poultry, or fish - use plant-based proteins like beans, lentils, tofu, tempeh, nuts, and seeds`,
    `6. If plan type is "keto meals", meals must be high-fat, very low-carb (under 20g net carbs), with no grains, sugar, or starchy vegetables`,
    `7. If plan type is "mediterranean meals", use Mediterranean ingredients (olive oil, herbs, tomatoes, olives, feta, fish, legumes)`,
    `8. If plan type is "asian cuisine", use Asian cooking techniques and ingredients (soy sauce, ginger, garlic, rice, noodles, stir-frying, steaming)`,
    `9. If plan type is "mexican cuisine", use Mexican ingredients and techniques (cumin, chili, lime, cilantro, beans, corn, peppers, tortillas)`,
    `10. If plan type is "comfort food", focus on hearty, warming, familiar dishes that provide emotional satisfaction (casseroles, soups, roasts)`,
    `11. If plan type is "low-carb meals", limit carbohydrates to under 50g per meal, avoid grains, bread, pasta, and starchy vegetables`,
    `12. If plan type is "high-protein meals", ensure each meal contains at least 25-30g of protein from sources like meat, fish, eggs, dairy, or legumes`,
    `13. If plan type is "family-friendly meals", create meals that appeal to both adults and children with familiar flavors and textures`,
    `14. If plan type is "gourmet meals", use sophisticated techniques, premium ingredients, and restaurant-quality presentation`,
    `15. If plan type is "one-pot meals", everything must cook in a single pot, pan, or cooking vessel for easy cleanup`,
    `16. If plan type is "meal prep friendly", meals should store well, reheat easily, and maintain quality for 3-5 days`,
    `17. If plan type is "gluten-free meals", absolutely NO wheat, barley, rye, or gluten-containing ingredients - use certified gluten-free alternatives`,
    `18. If plan type is "dairy-free meals", NO milk, cheese, butter, cream, or any dairy products - use plant-based alternatives`,
    `19. If plan type is "seafood dishes", the main protein MUST be fish, shellfish, or other seafood with appropriate cooking methods`,
    `20. If plan type is "chicken dishes", the main protein MUST be chicken prepared in various ways (grilled, roasted, braised, etc.)`,
    `21. The meal name MUST clearly indicate it belongs to the "${planType}" category`,
    `22. Respect the skill level constraints for cooking time and complexity`,
    `23. Ensure proper serving sizes for the specified number of people`,
    `24. Include detailed ingredients with specific quantities`,
    `25. Provide clear, step-by-step cooking instructions`,
    `26. Make the meal unique and avoid common/generic recipes`,
    `27. Ensure the meal perfectly matches the "${planType}" theme - no exceptions or compromises`
  ];
  
  return requirements.join('\n    ');
};

export const generateSingleMeal = async (request: MealPlanRequest): Promise<GeneratedMeal> => {
  // Check API key before making request
  if (!apiKey) {
    throw new AIResponseError('API key not configured. Please check your environment variables.');
  }

  return retryWithBackoff(async () => {
    const skillConstraint = request.skillLevel ? 
      `- Skill level: ${request.skillLevel} (Easy: 15-30min simple recipes, Medium: 30-60min moderate complexity, Hard: 60+ min advanced techniques)` : '';
    
    const absoluteRequirements = generateAbsoluteRequirements(request.planType);
    
    const prompt = `Generate ONE meal that STRICTLY matches these requirements:
    - Plan type: "${request.planType}" (CRITICAL: The meal MUST be a ${request.planType} dish - this is NON-NEGOTIABLE)
    - For ${request.peopleCount} people
    ${skillConstraint}
    ${request.dietaryRestrictions?.length ? `- Dietary restrictions: ${request.dietaryRestrictions.join(', ')}` : ''}
    ${request.allergies?.length ? `- Allergies to avoid: ${request.allergies.join(', ')}` : ''}
    ${request.preferences?.length ? `- Preferences: ${request.preferences.join(', ')}` : ''}
    
    ABSOLUTE REQUIREMENTS:
    ${absoluteRequirements}
    
    Return ONLY valid JSON in this exact format:
    {
      "name": "Specific meal name that clearly matches the ${request.planType} theme",
      "description": "Brief appetizing description highlighting the ${request.planType} elements",
      "cookTime": 30,
      "servings": ${request.peopleCount},
      "difficulty": "Easy|Medium|Hard",
      "ingredients": ["ingredient 1 (specific quantity for ${request.peopleCount} people)", "ingredient 2 (quantity)", "ingredient 3 (quantity)"],
      "instructions": ["detailed step 1", "detailed step 2", "detailed step 3", "detailed step 4"]
    }
    
    The meal MUST perfectly match "${request.planType}" theme - no exceptions.`;

    const completion = await openai.chat.completions.create({
      model: "google/gemma-2-9b-it:free",
      messages: [{ "role": "user", "content": prompt }],
      temperature: 0.7,
      max_tokens: 1500,
    });

    const response = completion.choices[0].message.content;
    if (!response) {
      throw new AIResponseError('No response from AI service');
    }
    
    const parsed = parseAIResponse(response);
    return validateGeneratedMeal(parsed);
  });
};

export const generateMealPlan = async (request: MealPlanRequest): Promise<GeneratedMeal[]> => {
  // Check API key before making request
  if (!apiKey) {
    throw new AIResponseError('API key not configured. Please check your environment variables.');
  }

  return retryWithBackoff(async () => {
    const skillConstraint = request.skillLevel ? 
      `- Skill level: ${request.skillLevel} (Easy: 15-30min simple recipes, Medium: 30-60min moderate complexity, Hard: 60+ min advanced techniques)` : '';
    
    const totalMeals = request.mealsPerDay * 7;
    const absoluteRequirements = generateAbsoluteRequirements(request.planType);
    
    const prompt = `Generate a weekly meal plan with STRICT adherence to these requirements:
    - Plan type: "${request.planType}" (CRITICAL: ALL ${totalMeals} meals MUST be ${request.planType} dishes)
    - ${request.mealsPerDay} meals per day for 7 days (total: ${totalMeals} meals)
    - For ${request.peopleCount} people
    ${skillConstraint}
    ${request.dietaryRestrictions?.length ? `- Dietary restrictions: ${request.dietaryRestrictions.join(', ')}` : ''}
    ${request.allergies?.length ? `- Allergies to avoid: ${request.allergies.join(', ')}` : ''}
    ${request.preferences?.length ? `- Preferences: ${request.preferences.join(', ')}` : ''}
    
    ABSOLUTE REQUIREMENTS:
    ${absoluteRequirements}
    
    ADDITIONAL REQUIREMENTS FOR WEEKLY PLANS:
    - Generate ${totalMeals} COMPLETELY DIFFERENT meals - no repetition
    - Ensure variety within the theme (different proteins, cooking methods, flavors)
    - Each meal must be unique and creative while staying within the "${request.planType}" category
    - Balance the week with different cooking techniques and ingredient combinations
    
    Return ONLY valid JSON in this exact format:
    {
      "meals": [
        {
          "name": "Unique meal name matching ${request.planType} theme",
          "description": "Brief description highlighting ${request.planType} elements",
          "cookTime": 30,
          "servings": ${request.peopleCount},
          "difficulty": "Easy|Medium|Hard",
          "ingredients": ["ingredient 1 (quantity)", "ingredient 2 (quantity)", "ingredient 3 (quantity)"],
          "instructions": ["step 1", "step 2", "step 3"]
        }
      ]
    }
    
    Generate exactly ${totalMeals} unique meals, all matching "${request.planType}" theme perfectly.`;

    const completion = await openai.chat.completions.create({
      model: "google/gemma-2-9b-it:free",
      messages: [{ "role": "user", "content": prompt }],
      temperature: 0.7,
      max_tokens: 4000,
    });

    const response = completion.choices[0].message.content;
    if (!response) {
      throw new AIResponseError('No response from AI service');
    }
    
    const parsed = parseAIResponse(response);
    
    if (!parsed.meals || !Array.isArray(parsed.meals)) {
      throw new Error('Invalid response structure: meals array not found');
    }
    
    const validatedMeals = parsed.meals.map((meal: any, index: number) => {
      try {
        return validateGeneratedMeal(meal);
      } catch (error) {
        throw new Error(`Invalid meal at index ${index}: ${error.message}`);
      }
    });
    
    if (validatedMeals.length !== totalMeals) {
      throw new Error(`Expected ${totalMeals} meals, got ${validatedMeals.length}`);
    }
    
    return validatedMeals;
  });
};

export const generateShoppingList = async (meals: GeneratedMeal[]): Promise<string[]> => {
  // Check API key before making request
  if (!apiKey) {
    throw new AIResponseError('API key not configured. Please check your environment variables.');
  }

  return retryWithBackoff(async () => {
    // Extract all ingredients from all meals
    const allIngredients = meals.flatMap(meal => meal.ingredients);
    const ingredientText = allIngredients.join(', ');
    
    const prompt = `Given these ingredients from ${meals.length} meals in a weekly meal plan: ${ingredientText}
    
    Create a consolidated shopping list that:
    1. Combines similar ingredients with realistic total quantities needed
    2. Groups by category (produce, meat, dairy, pantry, etc.)
    3. Includes proper amounts for all the meals
    4. Removes duplicates and consolidates quantities
    5. Uses standard shopping quantities (e.g., "2 lbs ground beef" not "ground beef")
    6. Accounts for typical package sizes available in stores
    
    Return ONLY valid JSON format: {"items": ["2 lbs ground beef", "1 box spaghetti (16 oz)", "1 jar marinara sauce (24 oz)"]}
    
    Make sure to include ALL ingredients needed for the ${meals.length} meals with appropriate consolidated quantities.`;

    const completion = await openai.chat.completions.create({
      model: "google/gemma-2-9b-it:free",
      messages: [{ "role": "user", "content": prompt }],
      temperature: 0.3,
      max_tokens: 2000,
    });

    const response = completion.choices[0].message.content;
    if (!response) {
      throw new AIResponseError('No response from AI service');
    }
    
    const parsed = parseAIResponse(response);
    
    if (!parsed.items || !Array.isArray(parsed.items)) {
      throw new Error('Invalid shopping list response structure');
    }
    
    return parsed.items;
  });
};