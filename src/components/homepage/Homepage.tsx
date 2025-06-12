import React, { useState, useEffect } from 'react';
import { 
  ChefHat, 
  Brain, 
  Users, 
  Calendar, 
  ShoppingCart, 
  Sparkles,
  ArrowRight,
  Play,
  Check,
  Star,
  Clock,
  TrendingUp,
  Shield,
  Zap,
  Heart,
  Camera,
  MessageSquare,
  BarChart3
} from 'lucide-react';
import { useAppStore } from '../../store';

const AnimatedCounter: React.FC<{ end: number; duration?: number; suffix?: string }> = ({ 
  end, 
  duration = 2000, 
  suffix = '' 
}) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [end, duration]);

  return <span>{count}{suffix}</span>;
};

const FeatureCard: React.FC<{
  icon: React.ElementType;
  title: string;
  description: string;
  color: string;
  delay?: number;
}> = ({ icon: Icon, title, description, color, delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div 
      className={`group bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-xl hover:border-primary-200 transition-all duration-500 transform ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
      }`}
    >
      <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
};

const TestimonialCard: React.FC<{
  name: string;
  role: string;
  content: string;
  avatar: string;
  rating: number;
}> = ({ name, role, content, avatar, rating }) => (
  <div className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
    <div className="flex items-center space-x-1 mb-4">
      {[...Array(5)].map((_, i) => (
        <Star 
          key={i} 
          className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
        />
      ))}
    </div>
    <p className="text-gray-700 mb-4 italic">"{content}"</p>
    <div className="flex items-center space-x-3">
      <img src={avatar} alt={name} className="w-10 h-10 rounded-full object-cover" />
      <div>
        <p className="font-medium text-gray-900">{name}</p>
        <p className="text-sm text-gray-500">{role}</p>
      </div>
    </div>
  </div>
);

export const Homepage: React.FC = () => {
  const { setCurrentView } = useAppStore();
  const [currentDemo, setCurrentDemo] = useState(0);

  const demoFeatures = [
    {
      title: "AI Menu Generation",
      description: "Watch as AI creates personalized weekly menus based on your family's preferences",
      image: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800"
    },
    {
      title: "Smart Inventory Tracking",
      description: "Scan receipts and fridge photos to automatically update your inventory",
      image: "https://images.pexels.com/photos/4099354/pexels-photo-4099354.jpeg?auto=compress&cs=tinysrgb&w=800"
    },
    {
      title: "Recipe Management",
      description: "Organize and discover recipes that your family will love",
      image: "https://images.pexels.com/photos/3184183/pexels-photo-3184183.jpeg?auto=compress&cs=tinysrgb&w=800"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDemo((prev) => (prev + 1) % demoFeatures.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleGetStarted = () => {
    setCurrentView('menu');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600 via-primary-500 to-secondary-500 opacity-90"></div>
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white opacity-10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent-400 opacity-10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <div className="flex items-center space-x-2 mb-6">
                <div className="flex items-center justify-center w-12 h-12 bg-white bg-opacity-20 rounded-xl backdrop-blur-sm">
                  <ChefHat className="w-7 h-7 text-white" />
                </div>
                <span className="text-xl font-semibold">Kitchen.AI</span>
              </div>
              
              <h1 className="text-5xl lg:text-7xl font-bold leading-tight mb-6">
                Your AI-Powered
                <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                  Kitchen Assistant
                </span>
              </h1>
              
              <p className="text-xl lg:text-2xl text-primary-100 mb-8 leading-relaxed">
                Transform meal planning from a chore into an intelligent, seamless experience. 
                Plan meals, manage recipes, and shop smarter with AI that learns your preferences.
              </p>
              
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-12">
                <button
                  onClick={handleGetStarted}
                  className="group bg-white text-primary-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-50 transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  <span>Start Planning Today</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                
                <button className="group bg-white bg-opacity-20 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center space-x-2 border border-white border-opacity-30">
                  <Play className="w-5 h-5" />
                  <span>Watch Demo</span>
                </button>
              </div>
              
              <div className="grid grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="text-3xl font-bold mb-1">
                    <AnimatedCounter end={98} suffix="%" />
                  </div>
                  <div className="text-primary-200 text-sm">Satisfaction Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-1">
                    <AnimatedCounter end={50} suffix="%" />
                  </div>
                  <div className="text-primary-200 text-sm">Time Saved</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-1">
                    <AnimatedCounter end={30} suffix="%" />
                  </div>
                  <div className="text-primary-200 text-sm">Food Waste Reduced</div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="relative bg-white bg-opacity-10 backdrop-blur-lg rounded-3xl p-8 border border-white border-opacity-20">
                <div className="aspect-video bg-gray-900 rounded-2xl overflow-hidden relative">
                  <img 
                    src={demoFeatures[currentDemo].image}
                    alt={demoFeatures[currentDemo].title}
                    className="w-full h-full object-cover transition-opacity duration-1000"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h3 className="text-xl font-semibold mb-2">{demoFeatures[currentDemo].title}</h3>
                    <p className="text-sm text-gray-200">{demoFeatures[currentDemo].description}</p>
                  </div>
                </div>
                
                <div className="flex justify-center space-x-2 mt-4">
                  {demoFeatures.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentDemo(index)}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        index === currentDemo ? 'bg-white w-8' : 'bg-white bg-opacity-50'
                      }`}
                    />
                  ))}
                </div>
              </div>
              
              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 bg-success-500 text-white p-3 rounded-xl shadow-lg animate-bounce">
                <Sparkles className="w-6 h-6" />
              </div>
              <div className="absolute -bottom-4 -left-4 bg-accent-500 text-white p-3 rounded-xl shadow-lg animate-pulse">
                <Brain className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Simple Features That
              <span className="block text-primary-600">Transform Your Kitchen</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our AI-powered platform focuses on the essentials: planning meals, managing recipes, 
              and shopping smarter - all in a beautifully simple interface.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={Calendar}
              title="Smart Menu Planning"
              description="Generate personalized weekly menus in seconds. AI learns your preferences and creates variety that your family will love."
              color="bg-primary-500"
              delay={0}
            />
            
            <FeatureCard
              icon={ShoppingCart}
              title="Intelligent Shopping"
              description="Automatically generate shopping lists from your menu plans. Scan receipts to update inventory effortlessly."
              color="bg-secondary-500"
              delay={200}
            />
            
            <FeatureCard
              icon={Camera}
              title="Recipe Management"
              description="Organize your favorite recipes, discover new ones, and rate meals to help AI understand your tastes better."
              color="bg-accent-500"
              delay={400}
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get started in minutes and watch as your AI assistant becomes smarter with every meal.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Plan Your Meals",
                description: "Use AI to generate weekly menus or create your own. Add your favorite recipes and dietary preferences.",
                icon: Calendar,
                color: "bg-primary-500"
              },
              {
                step: "2",
                title: "Shop Smarter",
                description: "Get automatic shopping lists from your meal plans. Scan receipts to track inventory and reduce waste.",
                icon: ShoppingCart,
                color: "bg-secondary-500"
              },
              {
                step: "3",
                title: "Cook & Enjoy",
                description: "Follow your meal plan and rate dishes. AI learns your preferences to make better suggestions.",
                icon: ChefHat,
                color: "bg-accent-500"
              }
            ].map((item, index) => (
              <div key={index} className="relative">
                <div className="bg-white rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-shadow">
                  <div className={`w-16 h-16 ${item.color} rounded-2xl flex items-center justify-center mx-auto mb-6`}>
                    <item.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute -top-4 -right-4 bg-gray-900 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
                
                {index < 2 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ArrowRight className="w-6 h-6 text-gray-400" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-8">
                Why Families Love
                <span className="block text-primary-600">Kitchen.AI</span>
              </h2>
              
              <div className="space-y-6">
                {[
                  {
                    icon: Clock,
                    title: "Save 5+ Hours Per Week",
                    description: "Eliminate the daily 'what's for dinner?' stress with AI-generated meal plans."
                  },
                  {
                    icon: Heart,
                    title: "Healthier Family Meals",
                    description: "Balanced nutrition recommendations based on your family's health goals."
                  },
                  {
                    icon: Zap,
                    title: "Reduce Food Waste by 30%",
                    description: "Smart inventory tracking and meal planning minimize waste and save money."
                  },
                  {
                    icon: BarChart3,
                    title: "Learn & Improve Over Time",
                    description: "Our AI gets smarter with every meal, providing better suggestions."
                  }
                ].map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="bg-primary-100 p-3 rounded-xl">
                      <benefit.icon className="w-6 h-6 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                      <p className="text-gray-600">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-gradient-to-br from-primary-500 to-secondary-500 rounded-3xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-6">Real Results from Real Families</h3>
                
                <div className="grid grid-cols-2 gap-6 mb-8">
                  <div className="text-center">
                    <div className="text-4xl font-bold mb-2">
                      <AnimatedCounter end={92} suffix="%" />
                    </div>
                    <div className="text-primary-200 text-sm">Report Less Stress</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold mb-2">
                      <AnimatedCounter end={87} suffix="%" />
                    </div>
                    <div className="text-primary-200 text-sm">Eat More Variety</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold mb-2">
                      <AnimatedCounter end={78} suffix="%" />
                    </div>
                    <div className="text-primary-200 text-sm">Save Money</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold mb-2">
                      <AnimatedCounter end={95} suffix="%" />
                    </div>
                    <div className="text-primary-200 text-sm">Would Recommend</div>
                  </div>
                </div>
                
                <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl p-6">
                  <div className="flex items-center space-x-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-300 fill-current" />
                    ))}
                  </div>
                  <p className="text-sm italic mb-3">
                    "Kitchen.AI has completely transformed how our family approaches meal planning. 
                    We're eating healthier, wasting less food, and actually enjoying the process!"
                  </p>
                  <p className="text-xs text-primary-200">- Sarah M., Mother of 3</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Loved by Families Everywhere
            </h2>
            <p className="text-xl text-gray-600">
              Join thousands of families who have transformed their kitchen experience
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <TestimonialCard
              name="Michael Chen"
              role="Busy Dad of 2"
              content="The AI suggestions are spot-on! It's like having a personal chef who knows exactly what my family likes."
              avatar="https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2"
              rating={5}
            />
            
            <TestimonialCard
              name="Emma Rodriguez"
              role="Working Mom"
              content="I love how simple it is to use. Menu planning used to take hours, now it takes minutes."
              avatar="https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2"
              rating={5}
            />
            
            <TestimonialCard
              name="David Thompson"
              role="Home Chef"
              content="The recipe management is genius. I can finally organize all my favorite recipes in one place."
              avatar="https://images.pexels.com/photos/3771118/pexels-photo-3771118.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2"
              rating={5}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-secondary-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Kitchen?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Join thousands of families who have revolutionized their meal planning with AI
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <button
              onClick={handleGetStarted}
              className="group bg-white text-primary-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-50 transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <span>Start Your Free Trial</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            
            <div className="flex items-center justify-center space-x-4 text-primary-100">
              <div className="flex items-center space-x-1">
                <Check className="w-5 h-5" />
                <span>Free 14-day trial</span>
              </div>
              <div className="flex items-center space-x-1">
                <Check className="w-5 h-5" />
                <span>No credit card required</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};