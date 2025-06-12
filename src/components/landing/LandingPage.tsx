import React, { useState, useEffect } from 'react';
import { 
  ChefHat, 
  Camera, 
  BookOpen, 
  Clock, 
  Users, 
  Star,
  ArrowRight,
  Sparkles,
  Heart,
  Smile,
  Coffee,
  ShoppingCart
} from 'lucide-react';
import { useAppStore } from '../../store';

export const LandingPage: React.FC = () => {
  const { setCurrentView } = useAppStore();
  const [currentSection, setCurrentSection] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const section = Math.floor(scrollPosition / (windowHeight * 0.8));
      setCurrentSection(Math.min(section, 3));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleStartCooking = () => {
    setCurrentView('chat');
  };

  return (
    <div className="min-h-screen bg-basil-cream overflow-x-hidden">
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center relative px-4 py-20">
        {/* Floating decorative elements */}
        <div className="absolute top-20 left-10 animate-float">
          <div className="w-8 h-8 bg-basil-orange-400 rounded-full opacity-60"></div>
        </div>
        <div className="absolute top-40 right-20 animate-bounce-gentle">
          <div className="w-6 h-6 bg-basil-green-400 rounded-full opacity-50"></div>
        </div>
        <div className="absolute bottom-40 left-20 animate-pulse-soft">
          <Sparkles className="w-6 h-6 text-basil-green-500" />
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Text content */}
          <div className="text-center lg:text-left space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-basil-green-700 leading-tight">
                Weeknight dinners,{' '}
                <span className="text-basil-green-500 relative">
                  done.
                  <div className="absolute -bottom-2 left-0 w-full h-3 bg-basil-green-200 opacity-50 rounded-full"></div>
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-basil-green-600 leading-relaxed max-w-2xl">
                Let Basil whip up a custom menu (and grocery list) in 
                seconds—zero repeats, zero food waste.
              </p>
            </div>

            {/* Friendly reassurance */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border-2 border-basil-green-200 shadow-lg">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-8 h-8 bg-basil-green-400 rounded-full flex items-center justify-center">
                  <Heart className="w-4 h-4 text-white" />
                </div>
                <span className="text-basil-green-700 font-semibold">For tired parents everywhere</span>
              </div>
              <p className="text-basil-green-600">
                No more staring into the fridge wondering "what's for dinner?" 
                Basil's got your back with personalized meal plans that actually work.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button
                onClick={handleStartCooking}
                className="group bg-basil-green-500 hover:bg-basil-green-600 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center space-x-3"
              >
                <ChefHat className="w-6 h-6" />
                <span>Start Cooking with Basil</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button className="group bg-white/80 backdrop-blur-sm hover:bg-white text-basil-green-700 px-8 py-4 rounded-2xl font-semibold text-lg border-2 border-basil-green-200 hover:border-basil-green-300 transition-all duration-300 flex items-center justify-center space-x-3">
                <Smile className="w-6 h-6" />
                <span>See How It Works</span>
              </button>
            </div>

            {/* Trust indicators */}
            <div className="flex items-center justify-center lg:justify-start space-x-6 text-basil-green-600">
              <div className="flex items-center space-x-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-basil-orange-400 fill-current" />
                  ))}
                </div>
                <span className="text-sm font-medium">4.9/5 from happy families</span>
              </div>
            </div>
          </div>

          {/* Right side - Basil mascot */}
          <div className="relative flex items-center justify-center">
            {/* Main Basil image */}
            <div className="relative animate-float">
              <img 
                src="/image.png" 
                alt="Basil the cooking mascot" 
                className="w-80 h-80 md:w-96 md:h-96 object-contain drop-shadow-2xl"
              />
              
              {/* Floating cooking elements around Basil */}
              <div className="absolute -top-8 -right-8 animate-bounce-gentle">
                <div className="bg-white rounded-full p-3 shadow-lg border-2 border-basil-orange-200">
                  <Coffee className="w-6 h-6 text-basil-orange-400" />
                </div>
              </div>
              
              <div className="absolute -bottom-4 -left-8 animate-wiggle">
                <div className="bg-white rounded-full p-3 shadow-lg border-2 border-basil-green-200">
                  <ShoppingCart className="w-6 h-6 text-basil-green-500" />
                </div>
              </div>
              
              <div className="absolute top-1/2 -right-12 animate-pulse-soft">
                <div className="bg-white rounded-full p-2 shadow-lg border-2 border-basil-orange-200">
                  <Sparkles className="w-4 h-4 text-basil-orange-400" />
                </div>
              </div>
            </div>

            {/* Background decoration */}
            <div className="absolute inset-0 -z-10">
              <div className="w-full h-full bg-gradient-to-br from-basil-green-100/30 to-basil-orange-100/30 rounded-full blur-3xl"></div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-basil-green-400 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-basil-green-400 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Section 1: Fridge Scanning */}
      <section className="min-h-screen flex items-center justify-center px-4 py-20 relative">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1">
            <div className="relative">
              <img 
                src="/6986f9a2-846c-4725-8a06-8b694041f284.png" 
                alt="Basil helping with groceries" 
                className="w-full max-w-md mx-auto animate-float drop-shadow-xl"
              />
              
              {/* Floating scan effect */}
              <div className="absolute top-1/4 right-1/4 animate-pulse">
                <div className="w-3 h-3 bg-basil-green-400 rounded-full"></div>
              </div>
              <div className="absolute bottom-1/3 left-1/4 animate-pulse delay-300">
                <div className="w-2 h-2 bg-basil-orange-400 rounded-full"></div>
              </div>
            </div>
          </div>
          
          <div className="order-1 lg:order-2 space-y-6">
            <div className="inline-flex items-center space-x-2 bg-basil-green-100 px-4 py-2 rounded-full">
              <Camera className="w-5 h-5 text-basil-green-600" />
              <span className="text-basil-green-700 font-semibold">Smart Scanning</span>
            </div>
            
            <h2 className="text-3xl md:text-5xl font-bold text-basil-green-700 leading-tight">
              Snap a photo of your fridge & pantry, and let Basil work his magic
            </h2>
            
            <p className="text-xl text-basil-green-600 leading-relaxed">
              No more guessing what you have at home. Basil's AI instantly recognizes 
              your ingredients and suggests delicious meals you can make right now.
            </p>

            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-basil-green-200">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-basil-orange-400 rounded-full flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <span className="text-basil-green-700 font-medium">
                  "Finally, no more food going bad in my fridge!" - Sarah M.
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Recipe Recommendations */}
      <section className="min-h-screen flex items-center justify-center px-4 py-20 relative">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center space-x-2 bg-basil-orange-100 px-4 py-2 rounded-full">
              <BookOpen className="w-5 h-5 text-basil-orange-600" />
              <span className="text-basil-orange-700 font-semibold">Personalized Recipes</span>
            </div>
            
            <h2 className="text-3xl md:text-5xl font-bold text-basil-green-700 leading-tight">
              Get personalized recipe recommendations based on what you feel like having
            </h2>
            
            <p className="text-xl text-basil-green-600 leading-relaxed">
              Craving comfort food? Want something healthy? Basil learns your family's 
              preferences and suggests meals that everyone will actually eat.
            </p>

            {/* Mock recipe cards */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { name: "Creamy Chicken Pasta", time: "25 min", difficulty: "Easy" },
                { name: "Veggie Stir Fry", time: "15 min", difficulty: "Easy" },
                { name: "Beef Tacos", time: "20 min", difficulty: "Medium" },
                { name: "Salmon & Rice", time: "30 min", difficulty: "Easy" }
              ].map((recipe, index) => (
                <div key={index} className="bg-white rounded-xl p-4 shadow-lg border border-basil-green-100 hover:shadow-xl transition-shadow animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                  <h4 className="font-semibold text-basil-green-700 mb-2">{recipe.name}</h4>
                  <div className="flex items-center justify-between text-sm text-basil-green-600">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{recipe.time}</span>
                    </div>
                    <span className="bg-basil-green-100 px-2 py-1 rounded-full text-xs">
                      {recipe.difficulty}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="relative">
            <div className="w-full max-w-md mx-auto">
              {/* Placeholder for recipe illustration */}
              <div className="bg-gradient-to-br from-basil-green-200 to-basil-orange-200 rounded-3xl p-8 aspect-square flex items-center justify-center">
                <div className="text-center space-y-4">
                  <BookOpen className="w-16 h-16 text-basil-green-600 mx-auto animate-bounce-gentle" />
                  <p className="text-basil-green-700 font-semibold">Recipe Magic Happens Here</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Step-by-Step Guidance */}
      <section className="min-h-screen flex items-center justify-center px-4 py-20 relative">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1 relative">
            <div className="bg-gradient-to-br from-basil-orange-200 to-basil-green-200 rounded-3xl p-8 aspect-square flex items-center justify-center">
              <div className="text-center space-y-4">
                <ChefHat className="w-16 h-16 text-basil-green-600 mx-auto animate-wiggle" />
                <p className="text-basil-green-700 font-semibold">Basil Guides You</p>
                <div className="space-y-2 text-sm text-basil-green-600">
                  <div className="bg-white/80 rounded-lg p-2">Step 1: Prep ingredients</div>
                  <div className="bg-white/80 rounded-lg p-2">Step 2: Heat the pan</div>
                  <div className="bg-white/80 rounded-lg p-2">Step 3: Cook & enjoy!</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="order-1 lg:order-2 space-y-6">
            <div className="inline-flex items-center space-x-2 bg-basil-green-100 px-4 py-2 rounded-full">
              <Users className="w-5 h-5 text-basil-green-600" />
              <span className="text-basil-green-700 font-semibold">Cooking Guidance</span>
            </div>
            
            <h2 className="text-3xl md:text-5xl font-bold text-basil-green-700 leading-tight">
              Step-by-step guidance with amounts, calories, and technique tips
            </h2>
            
            <p className="text-xl text-basil-green-600 leading-relaxed">
              Never feel lost in the kitchen again. Basil breaks down every recipe 
              into simple steps, with helpful tips to make you feel like a pro chef.
            </p>

            <div className="space-y-4">
              {[
                { icon: Clock, text: "Perfect timing for every step" },
                { icon: Users, text: "Portion sizes that actually work" },
                { icon: Star, text: "Pro tips for better flavor" }
              ].map((feature, index) => (
                <div key={index} className="flex items-center space-x-3 bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-basil-green-200">
                  <div className="w-8 h-8 bg-basil-green-400 rounded-full flex items-center justify-center">
                    <feature.icon className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-basil-green-700 font-medium">{feature.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-basil-green-100 to-basil-orange-100">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-3xl md:text-5xl font-bold text-basil-green-700">
            Ready to make dinnertime easy again?
          </h2>
          
          <p className="text-xl text-basil-green-600 max-w-2xl mx-auto">
            Join thousands of families who've said goodbye to mealtime stress. 
            Let Basil handle the planning, so you can focus on enjoying dinner together.
          </p>

          <button
            onClick={handleStartCooking}
            className="group bg-basil-green-500 hover:bg-basil-green-600 text-white px-12 py-6 rounded-2xl font-bold text-xl shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 flex items-center justify-center space-x-4 mx-auto"
          >
            <ChefHat className="w-8 h-8" />
            <span>Start Cooking with Basil</span>
            <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
          </button>

          <p className="text-basil-green-600">
            Free to start • No credit card required • Works on any device
          </p>
        </div>
      </section>

      {/* Floating Basil helper */}
      <div className="fixed bottom-8 right-8 z-50">
        <button
          onClick={handleStartCooking}
          className="group bg-basil-green-500 hover:bg-basil-green-600 text-white p-4 rounded-full shadow-xl hover:shadow-2xl transform hover:scale-110 transition-all duration-300 animate-bounce-gentle"
        >
          <ChefHat className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};