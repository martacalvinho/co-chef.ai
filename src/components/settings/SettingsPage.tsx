import React, { useState } from 'react';
import { Settings, User, Bell, Shield, Database, Palette, Globe, Save, Eye, EyeOff } from 'lucide-react';
import { useAppStore } from '../../store';

interface SettingsSectionProps {
  title: string;
  description: string;
  icon: React.ElementType;
  children: React.ReactNode;
}

const SettingsSection: React.FC<SettingsSectionProps> = ({ title, description, icon: Icon, children }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-start space-x-3 mb-4">
        <div className="p-2 bg-primary-100 rounded-lg">
          <Icon className="w-5 h-5 text-primary-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
      {children}
    </div>
  );
};

interface ToggleSwitchProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  label: string;
  description?: string;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ enabled, onChange, label, description }) => {
  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex-1">
        <label className="text-sm font-medium text-gray-900">{label}</label>
        {description && <p className="text-xs text-gray-500">{description}</p>}
      </div>
      <button
        onClick={() => onChange(!enabled)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          enabled ? 'bg-primary-500' : 'bg-gray-200'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            enabled ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );
};

export const SettingsPage: React.FC = () => {
  const { user, household } = useAppStore();
  const [showPassword, setShowPassword] = useState(false);
  const [settings, setSettings] = useState({
    // Profile settings
    name: user?.name || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    
    // Notification settings
    emailNotifications: true,
    pushNotifications: true,
    taskReminders: true,
    mealReminders: true,
    shoppingListUpdates: true,
    feedbackRequests: true,
    newMenuAvailable: true,
    inventoryAlerts: true,
    digestFrequency: 'daily',
    quietHoursStart: '22:00',
    quietHoursEnd: '08:00',
    
    // AI settings
    aiCreativity: 0.7,
    strictDietaryAdherence: true,
    autoGenerateMenus: false,
    learningEnabled: true,
    
    // Privacy settings
    dataSharing: false,
    analyticsOptIn: true,
    
    // Appearance settings
    theme: 'light',
    language: 'en',
    timezone: household?.timezone || 'UTC',
    currency: household?.currency || 'USD',
  });

  const handleSave = (section: string) => {
    console.log(`Saving ${section} settings:`, settings);
    // TODO: Implement save functionality
  };

  const handleExportData = () => {
    console.log('Exporting user data...');
    // TODO: Implement data export
  };

  const handleDeleteAccount = () => {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      console.log('Deleting account...');
      // TODO: Implement account deletion
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6 animate-fade-in">
      <div className="flex items-center space-x-2">
        <Settings className="w-7 h-7 text-primary-600" />
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Settings</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Settings */}
        <SettingsSection
          title="Profile Settings"
          description="Manage your personal information and account details"
          icon={User}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <input
                type="text"
                value={settings.name}
                onChange={(e) => setSettings({ ...settings, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={settings.currentPassword}
                  onChange={(e) => setSettings({ ...settings, currentPassword: e.target.value })}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter current password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                <input
                  type="password"
                  value={settings.newPassword}
                  onChange={(e) => setSettings({ ...settings, newPassword: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="New password"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                <input
                  type="password"
                  value={settings.confirmPassword}
                  onChange={(e) => setSettings({ ...settings, confirmPassword: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Confirm password"
                />
              </div>
            </div>
            
            <button
              onClick={() => handleSave('profile')}
              className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Save Profile</span>
            </button>
          </div>
        </SettingsSection>

        {/* Notification Settings */}
        <SettingsSection
          title="Notifications"
          description="Control how and when you receive notifications"
          icon={Bell}
        >
          <div className="space-y-3">
            <ToggleSwitch
              enabled={settings.emailNotifications}
              onChange={(enabled) => setSettings({ ...settings, emailNotifications: enabled })}
              label="Email Notifications"
              description="Receive notifications via email"
            />
            
            <ToggleSwitch
              enabled={settings.pushNotifications}
              onChange={(enabled) => setSettings({ ...settings, pushNotifications: enabled })}
              label="Push Notifications"
              description="Receive browser push notifications"
            />
            
            <ToggleSwitch
              enabled={settings.taskReminders}
              onChange={(enabled) => setSettings({ ...settings, taskReminders: enabled })}
              label="Task Reminders"
              description="Get reminded about assigned tasks"
            />
            
            <ToggleSwitch
              enabled={settings.mealReminders}
              onChange={(enabled) => setSettings({ ...settings, mealReminders: enabled })}
              label="Meal Reminders"
              description="Reminders to start cooking"
            />
            
            <ToggleSwitch
              enabled={settings.inventoryAlerts}
              onChange={(enabled) => setSettings({ ...settings, inventoryAlerts: enabled })}
              label="Inventory Alerts"
              description="Alerts for expiring items"
            />
            
            <div className="pt-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Digest Frequency</label>
              <select
                value={settings.digestFrequency}
                onChange={(e) => setSettings({ ...settings, digestFrequency: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="immediate">Immediate</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="none">None</option>
              </select>
            </div>
            
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Quiet Hours Start</label>
                <input
                  type="time"
                  value={settings.quietHoursStart}
                  onChange={(e) => setSettings({ ...settings, quietHoursStart: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Quiet Hours End</label>
                <input
                  type="time"
                  value={settings.quietHoursEnd}
                  onChange={(e) => setSettings({ ...settings, quietHoursEnd: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <button
              onClick={() => handleSave('notifications')}
              className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Save Notifications</span>
            </button>
          </div>
        </SettingsSection>

        {/* AI Behavior Settings */}
        <SettingsSection
          title="AI Behavior"
          description="Customize how the AI assistant works for you"
          icon={Shield}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                AI Creativity Level ({Math.round(settings.aiCreativity * 100)}%)
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={settings.aiCreativity}
                onChange={(e) => setSettings({ ...settings, aiCreativity: parseFloat(e.target.value) })}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Conservative</span>
                <span>Balanced</span>
                <span>Creative</span>
              </div>
            </div>
            
            <ToggleSwitch
              enabled={settings.strictDietaryAdherence}
              onChange={(enabled) => setSettings({ ...settings, strictDietaryAdherence: enabled })}
              label="Strict Dietary Adherence"
              description="Never suggest meals that violate dietary restrictions"
            />
            
            <ToggleSwitch
              enabled={settings.autoGenerateMenus}
              onChange={(enabled) => setSettings({ ...settings, autoGenerateMenus: enabled })}
              label="Auto-Generate Weekly Menus"
              description="Automatically create new menus each week"
            />
            
            <ToggleSwitch
              enabled={settings.learningEnabled}
              onChange={(enabled) => setSettings({ ...settings, learningEnabled: enabled })}
              label="Learning Enabled"
              description="Allow AI to learn from your feedback and patterns"
            />
            
            <button
              onClick={() => handleSave('ai')}
              className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Save AI Settings</span>
            </button>
          </div>
        </SettingsSection>

        {/* Appearance Settings */}
        <SettingsSection
          title="Appearance & Localization"
          description="Customize the look and feel of the application"
          icon={Palette}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
              <select
                value={settings.theme}
                onChange={(e) => setSettings({ ...settings, theme: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="auto">Auto (System)</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
              <select
                value={settings.language}
                onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
                <option value="de">Deutsch</option>
              </select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
                <select
                  value={settings.timezone}
                  onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="UTC">UTC</option>
                  <option value="America/New_York">Eastern Time</option>
                  <option value="America/Chicago">Central Time</option>
                  <option value="America/Denver">Mountain Time</option>
                  <option value="America/Los_Angeles">Pacific Time</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                <select
                  value={settings.currency}
                  onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="CAD">CAD (C$)</option>
                </select>
              </div>
            </div>
            
            <button
              onClick={() => handleSave('appearance')}
              className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Save Appearance</span>
            </button>
          </div>
        </SettingsSection>

        {/* Privacy & Data Settings */}
        <SettingsSection
          title="Privacy & Data"
          description="Control your data and privacy preferences"
          icon={Database}
        >
          <div className="space-y-4">
            <ToggleSwitch
              enabled={settings.dataSharing}
              onChange={(enabled) => setSettings({ ...settings, dataSharing: enabled })}
              label="Anonymous Data Sharing"
              description="Help improve the service by sharing anonymous usage data"
            />
            
            <ToggleSwitch
              enabled={settings.analyticsOptIn}
              onChange={(enabled) => setSettings({ ...settings, analyticsOptIn: enabled })}
              label="Analytics"
              description="Allow collection of analytics data for service improvement"
            />
            
            <div className="pt-4 border-t border-gray-200">
              <h4 className="font-medium text-gray-900 mb-3">Data Management</h4>
              <div className="space-y-3">
                <button
                  onClick={handleExportData}
                  className="w-full bg-secondary-500 hover:bg-secondary-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Export My Data
                </button>
                
                <button
                  onClick={handleDeleteAccount}
                  className="w-full bg-error-500 hover:bg-error-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Delete Account
                </button>
              </div>
            </div>
            
            <button
              onClick={() => handleSave('privacy')}
              className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Save Privacy Settings</span>
            </button>
          </div>
        </SettingsSection>
      </div>
    </div>
  );
};