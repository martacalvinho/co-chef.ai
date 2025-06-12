import React, { useState } from 'react';
import { Camera, Upload, X, Scan, ArrowRight, Check, RefreshCw } from 'lucide-react';
import { useAppStore } from '../../store';

interface InventoryAnalysisFlowProps {
  onComplete: (analyzedIngredients: string[]) => void;
  onBack: () => void;
}

interface PhotoUpload {
  id: string;
  file: File;
  preview: string;
  location: 'fridge' | 'freezer' | 'pantry';
  status: 'uploading' | 'analyzing' | 'complete' | 'error';
  ingredients?: string[];
}

export const InventoryAnalysisFlow: React.FC<InventoryAnalysisFlowProps> = ({
  onComplete,
  onBack
}) => {
  const [currentStep, setCurrentStep] = useState<'intro' | 'fridge' | 'freezer' | 'pantry' | 'analyzing' | 'review'>('intro');
  const [photos, setPhotos] = useState<PhotoUpload[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzedIngredients, setAnalyzedIngredients] = useState<string[]>([]);

  const handlePhotoUpload = async (files: FileList, location: 'fridge' | 'freezer' | 'pantry') => {
    const newPhotos: PhotoUpload[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const preview = URL.createObjectURL(file);
      
      const photo: PhotoUpload = {
        id: `${location}-${Date.now()}-${i}`,
        file,
        preview,
        location,
        status: 'uploading'
      };
      
      newPhotos.push(photo);
    }
    
    setPhotos(prev => [...prev, ...newPhotos]);
    
    // Simulate AI analysis for each photo
    for (const photo of newPhotos) {
      await analyzePhoto(photo);
    }
  };

  const analyzePhoto = async (photo: PhotoUpload) => {
    setPhotos(prev => prev.map(p => 
      p.id === photo.id ? { ...p, status: 'analyzing' } : p
    ));

    // Simulate AI analysis delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mock AI analysis results based on location
    const mockIngredients = {
      fridge: ['milk', 'eggs', 'cheese', 'leftover chicken', 'carrots', 'bell peppers', 'yogurt'],
      freezer: ['frozen peas', 'ground beef', 'ice cream', 'frozen berries', 'chicken breasts'],
      pantry: ['rice', 'pasta', 'canned tomatoes', 'olive oil', 'onions', 'garlic', 'flour', 'sugar']
    };

    const ingredients = mockIngredients[photo.location] || [];
    
    setPhotos(prev => prev.map(p => 
      p.id === photo.id ? { 
        ...p, 
        status: 'complete',
        ingredients: ingredients.slice(0, Math.floor(Math.random() * 4) + 3) // Random 3-6 ingredients
      } : p
    ));
  };

  const handleNextStep = () => {
    switch (currentStep) {
      case 'intro':
        setCurrentStep('fridge');
        break;
      case 'fridge':
        setCurrentStep('freezer');
        break;
      case 'freezer':
        setCurrentStep('pantry');
        break;
      case 'pantry':
        setCurrentStep('analyzing');
        analyzeAllPhotos();
        break;
    }
  };

  const analyzeAllPhotos = async () => {
    setIsAnalyzing(true);
    
    // Combine all ingredients from all photos
    const allIngredients = photos.flatMap(photo => photo.ingredients || []);
    const uniqueIngredients = [...new Set(allIngredients)];
    
    // Simulate final analysis
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setAnalyzedIngredients(uniqueIngredients);
    setIsAnalyzing(false);
    setCurrentStep('review');
  };

  const handleComplete = () => {
    onComplete(analyzedIngredients);
  };

  const renderPhotoUploadSection = (location: 'fridge' | 'freezer' | 'pantry') => {
    const locationPhotos = photos.filter(p => p.location === location);
    const locationLabels = {
      fridge: 'Refrigerator',
      freezer: 'Freezer',
      pantry: 'Pantry & Cabinets'
    };

    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">
          {locationLabels[location]} Photos
        </h3>
        <p className="text-gray-600">
          Take photos of your {location} contents. Multiple angles help me identify more ingredients.
        </p>
        
        {/* Upload Area */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-500 transition-colors">
          <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">Take photos or upload existing ones</p>
          
          <div className="flex justify-center space-x-3">
            <label className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg cursor-pointer transition-colors">
              <Camera className="w-4 h-4 inline mr-2" />
              Take Photo
              <input
                type="file"
                accept="image/*"
                capture="environment"
                multiple
                className="hidden"
                onChange={(e) => e.target.files && handlePhotoUpload(e.target.files, location)}
              />
            </label>
            
            <label className="bg-secondary-500 hover:bg-secondary-600 text-white px-4 py-2 rounded-lg cursor-pointer transition-colors">
              <Upload className="w-4 h-4 inline mr-2" />
              Upload Photos
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => e.target.files && handlePhotoUpload(e.target.files, location)}
              />
            </label>
          </div>
        </div>
        
        {/* Uploaded Photos */}
        {locationPhotos.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {locationPhotos.map((photo) => (
              <div key={photo.id} className="relative">
                <img
                  src={photo.preview}
                  alt={`${location} photo`}
                  className="w-full h-32 object-cover rounded-lg"
                />
                <div className={`absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center ${
                  photo.status === 'complete' ? 'bg-green-500' :
                  photo.status === 'analyzing' ? 'bg-yellow-500' :
                  photo.status === 'error' ? 'bg-red-500' : 'bg-blue-500'
                }`}>
                  {photo.status === 'complete' ? (
                    <Check className="w-4 h-4 text-white" />
                  ) : photo.status === 'analyzing' ? (
                    <RefreshCw className="w-4 h-4 text-white animate-spin" />
                  ) : (
                    <Scan className="w-4 h-4 text-white" />
                  )}
                </div>
                
                {photo.status === 'complete' && photo.ingredients && (
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white p-2 rounded-b-lg">
                    <p className="text-xs">Found: {photo.ingredients.slice(0, 3).join(', ')}
                      {photo.ingredients.length > 3 && ` +${photo.ingredients.length - 3} more`}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        
        <div className="flex justify-between">
          <button
            onClick={onBack}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            ← Back
          </button>
          
          <button
            onClick={handleNextStep}
            disabled={locationPhotos.length === 0}
            className="bg-primary-500 hover:bg-primary-600 disabled:bg-gray-300 text-white px-6 py-2 rounded-lg transition-colors flex items-center space-x-2"
          >
            <span>{location === 'pantry' ? 'Analyze All Photos' : 'Next'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  };

  if (currentStep === 'intro') {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Camera className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Use What You Have at Home</h2>
          <p className="text-gray-600">
            I'll analyze photos of your fridge, freezer, and pantry to identify available ingredients 
            and suggest meals you can make right now.
          </p>
        </div>
        
        <div className="bg-blue-50 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-3">How it works:</h3>
          <ol className="space-y-2 text-blue-800">
            <li className="flex items-center space-x-2">
              <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
              <span>Take photos of your refrigerator (cold & freezer sections)</span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
              <span>Photograph your pantry and cabinets</span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">3</span>
              <span>AI analyzes and identifies your ingredients</span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">4</span>
              <span>Get personalized meal suggestions using what you have</span>
            </li>
          </ol>
        </div>
        
        <div className="flex space-x-3">
          <button
            onClick={onBack}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Back to Menu Options
          </button>
          <button
            onClick={handleNextStep}
            className="flex-1 bg-primary-500 hover:bg-primary-600 text-white py-3 px-6 rounded-lg transition-colors font-medium"
          >
            Start Photo Analysis
          </button>
        </div>
      </div>
    );
  }

  if (currentStep === 'analyzing') {
    return (
      <div className="text-center space-y-6">
        <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto">
          <RefreshCw className="w-8 h-8 text-primary-600 animate-spin" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Analyzing Your Ingredients</h2>
        <p className="text-gray-600">
          AI is processing your photos and identifying available ingredients...
        </p>
        
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary-600">
                {photos.filter(p => p.location === 'fridge').length}
              </div>
              <div className="text-sm text-gray-600">Fridge Photos</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-secondary-600">
                {photos.filter(p => p.location === 'freezer').length}
              </div>
              <div className="text-sm text-gray-600">Freezer Photos</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-accent-600">
                {photos.filter(p => p.location === 'pantry').length}
              </div>
              <div className="text-sm text-gray-600">Pantry Photos</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentStep === 'review') {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Ingredients Identified!</h2>
          <p className="text-gray-600">
            I found {analyzedIngredients.length} ingredients in your kitchen. 
            Review the list and I'll suggest meals you can make.
          </p>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Available Ingredients:</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {analyzedIngredients.map((ingredient, index) => (
              <div key={index} className="bg-green-50 text-green-800 px-3 py-2 rounded-lg text-sm">
                {ingredient}
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-blue-50 rounded-lg p-4">
          <p className="text-blue-800 text-sm">
            <strong>Next:</strong> I'll generate meal suggestions using these ingredients, 
            along with common pantry staples you likely have.
          </p>
        </div>
        
        <div className="flex space-x-3">
          <button
            onClick={() => setCurrentStep('pantry')}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Add More Photos
          </button>
          <button
            onClick={handleComplete}
            className="flex-1 bg-primary-500 hover:bg-primary-600 text-white py-3 px-6 rounded-lg transition-colors font-medium"
          >
            Generate Meal Suggestions
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {currentStep === 'fridge' && renderPhotoUploadSection('fridge')}
      {currentStep === 'freezer' && renderPhotoUploadSection('freezer')}
      {currentStep === 'pantry' && renderPhotoUploadSection('pantry')}
    </div>
  );
};