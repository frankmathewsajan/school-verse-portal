// System Settings Service
// This service manages system-wide settings like signup disable functionality

export interface SystemSettings {
  signupDisabled: boolean;
}

export class SystemSettingsService {
  private static readonly SETTINGS_KEY = 'school_verse_system_settings';
  
  // Default settings
  private static defaultSettings: SystemSettings = {
    signupDisabled: false
  };

  // Get current system settings
  static getSettings(): SystemSettings {
    try {
      const stored = localStorage.getItem(this.SETTINGS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return { ...this.defaultSettings, ...parsed };
      }
      return this.defaultSettings;
    } catch (error) {
      console.error('Error reading system settings:', error);
      return this.defaultSettings;
    }
  }

  // Save system settings
  static saveSettings(settings: Partial<SystemSettings>): boolean {
    try {
      const currentSettings = this.getSettings();
      const newSettings = { ...currentSettings, ...settings };
      localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(newSettings));
      
      // Dispatch event to notify components of settings change
      window.dispatchEvent(new CustomEvent('systemSettingsChanged', { 
        detail: newSettings 
      }));
      
      return true;
    } catch (error) {
      console.error('Error saving system settings:', error);
      return false;
    }
  }

  // Check if signup is disabled
  static isSignupDisabled(): boolean {
    return this.getSettings().signupDisabled;
  }

  // Toggle signup disabled state
  static toggleSignupDisabled(): boolean {
    const current = this.getSettings();
    const newState = !current.signupDisabled;
    return this.saveSettings({ signupDisabled: newState });
  }

  // Reset all settings to default
  static resetToDefaults(): boolean {
    try {
      localStorage.removeItem(this.SETTINGS_KEY);
      window.dispatchEvent(new CustomEvent('systemSettingsChanged', { 
        detail: this.defaultSettings 
      }));
      return true;
    } catch (error) {
      console.error('Error resetting system settings:', error);
      return false;
    }
  }
}
