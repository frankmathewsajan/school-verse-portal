import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LockIcon, KeyIcon } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passkey, setPasskey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPasskeyStep, setShowPasskeyStep] = useState(false);
  const [activeTab, setActiveTab] = useState('signin');
  
  const navigate = useNavigate();
  const { signIn, signUp, verifyPasskey, user, isAuthenticated, loading: authLoading } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      navigate('/admin/dashboard');
    }
  }, [isAuthenticated, authLoading, navigate]);

  // Show passkey step if user is signed in but not admin verified
  useEffect(() => {
    if (user && !isAuthenticated) {
      setShowPasskeyStep(true);
    } else {
      setShowPasskeyStep(false);
    }
  }, [user, isAuthenticated]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await signIn(email, password);
      if (result.success) {
        // User signed in successfully, will show passkey step via useEffect
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      return;
    }

    setIsLoading(true);

    try {
      const result = await signUp(email, password);
      if (result.success) {
        setActiveTab('signin');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasskeyVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await verifyPasskey(passkey);
      if (result.success) {
        navigate('/admin/dashboard');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5">
      <div className="flex flex-col justify-center items-center w-full p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              {showPasskeyStep ? 'Admin Verification' : 'Admin Login'}
            </CardTitle>
            <CardDescription className="text-center">
              {showPasskeyStep 
                ? 'Enter the admin passkey to access the dashboard'
                : 'Sign in to your account or create a new one'
              }
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {showPasskeyStep ? (
              <form onSubmit={handlePasskeyVerification} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="passkey">Admin Passkey</Label>
                  <div className="relative">
                    <KeyIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="passkey"
                      type="password"
                      placeholder="Enter admin passkey"
                      value={passkey}
                      onChange={(e) => setPasskey(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Verifying...' : 'Verify & Access Dashboard'}
                </Button>
              </form>
            ) : (
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="signin">Sign In</TabsTrigger>
                  <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>
                
                <TabsContent value="signin">
                  <form onSubmit={handleSignIn} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signin-email">Email</Label>
                      <Input
                        id="signin-email"
                        type="email"
                        placeholder="your.email@domain.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signin-password">Password</Label>
                      <Input
                        id="signin-password"
                        type="password"
                        placeholder="Your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? 'Signing in...' : 'Sign In'}
                    </Button>
                  </form>
                </TabsContent>
                
                <TabsContent value="signup">
                  <form onSubmit={handleSignUp} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-email">Email</Label>
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="your.email@domain.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                      <p className="text-xs text-muted-foreground">
                        Only gmail.com, outlook.com, and hotmail.com domains are allowed
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-password">Password</Label>
                      <Input
                        id="signup-password"
                        type="password"
                        placeholder="Choose a password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm Password</Label>
                      <Input
                        id="confirm-password"
                        type="password"
                        placeholder="Confirm your password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={isLoading || password !== confirmPassword}>
                      {isLoading ? 'Creating account...' : 'Create Account'}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            )}
          </CardContent>
          
          <CardFooter className="flex flex-col">
            <div className="text-sm text-muted-foreground text-center mt-2">
              {showPasskeyStep ? (
                <p>Contact the administrator if you don't have the passkey</p>
              ) : (
                <>
                  <p>St. G. D. Convent School Admin Portal</p>
                  <p className="mt-1">Two-factor authentication required</p>
                </>
              )}
            </div>
          </CardFooter>
        </Card>
        
        <div className="mt-4 text-sm text-muted-foreground text-center flex items-center gap-1">
          <LockIcon size={14} />
          <span>Secure admin portal for St. G. D. Convent School</span>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
