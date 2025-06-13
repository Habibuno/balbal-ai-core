export type UserProfile = {
  id: string;
  email: string;
  displayName: string;
  avatar?: string;
  role: 'user' | 'admin';
  createdAt: string;
  lastLogin: string;
  preferences: {
    theme: 'light' | 'dark' | 'system';
    language: string;
    notifications: {
      email: boolean;
      push: boolean;
      marketing: boolean;
      updates: boolean;
    };
    display: {
      fontSize: 'small' | 'medium' | 'large';
      density: 'comfortable' | 'compact';
      animations: boolean;
      reducedMotion: boolean;
    };
    privacy: {
      profileVisibility: 'public' | 'private' | 'contacts';
      showOnlineStatus: boolean;
      showLastSeen: boolean;
    };
  };
  security: {
    twoFactorEnabled: boolean;
    lastPasswordChange: string;
    loginHistory: Array<{
      date: string;
      device: string;
      location: string;
    }>;
  };
  subscription: {
    plan: 'free' | 'pro' | 'enterprise';
    status: 'active' | 'inactive' | 'trial';
    expiresAt?: string;
    autoRenew: boolean;
    paymentMethod?: {
      type: 'card' | 'paypal';
      last4?: string;
      expiryDate?: string;
    };
  };
}; 