import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Eye, EyeOff, Mail, Lock, ArrowLeft, Loader2, Check, X } from "lucide-react";
import aitLogo from 'figma:asset/bbd761c92a4e06f7ed0913518297cce9dea25034.png';
import { LocalStorageAuth } from "../utils/localStorage";
import { toast } from "sonner@2.0.3";

interface LoginPageProps {
  onNavigate?: (page: string) => void;
  onLogin?: (user: any) => void;
  pendingJobApplication?: any;
  signupSuccess?: boolean;
  signupEmail?: string;
}

export function LoginPage({ onNavigate, onLogin, pendingJobApplication, signupSuccess, signupEmail }: LoginPageProps) {
  const [formData, setFormData] = useState({
    email: signupEmail || '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [showSignupSuccess, setShowSignupSuccess] = useState(signupSuccess || false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError('');
    
    try {
      // 🔄 PLACEHOLDER AUTHENTICATION - Using LocalStorage instead of real backend
      // In production: This would be an API call to /api/auth/login
      
      // Simulate network delay to show loading animation (remove in production)
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const result = LocalStorageAuth.loginUser(formData.email, formData.password);
      
      if (result.success && result.user) {
        // Clear guest quiz attempt when user logs in
        // This gives them unlimited access to quiz features
        LocalStorageAuth.clearGuestQuizAttempt();
        console.log('✅ Guest quiz restrictions cleared on login');
        
        toast.success(`Welcome back, ${result.user.firstName}!`);
        
        if (onLogin) {
          // Call the login handler from App component with user data
          onLogin(result.user);
        } else {
          // Fallback: navigate to dashboard
          onNavigate?.('dashboard');
        }
      } else {
        setLoginError(result.message || 'Login failed');
        toast.error(result.message || 'Invalid email or password');
      }
    } catch (error) {
      console.error('Login error:', error);
      setLoginError('An unexpected error occurred. Please try again.');
      toast.error('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear login error when user types
    if (loginError) setLoginError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-primary to-blue-900 flex items-center justify-center p-6">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, var(--brand-secondary) 2px, transparent 2px),
                           radial-gradient(circle at 75% 75%, var(--brand-secondary) 2px, transparent 2px)`,
          backgroundSize: '60px 60px'
        }}></div>
      </div>
      
      <div className="relative z-10 w-full max-w-md">


        {/* AIT Logo in Blue Area */}
        <div className="flex justify-center mb-6">
          <img 
            src={aitLogo} 
            alt="AIT" 
            className="h-8 w-auto opacity-90"
          />
        </div>

        {/* Login Card */}
        <Card className="border-white/20 bg-white/95 backdrop-blur-sm shadow-2xl">
          <CardHeader className="text-center pb-[0px] pt-[24px] pr-[24px] pl-[24px]">
            <div className="mb-4">
              <Badge variant="outline" className="border-brand-primary/20 text-brand-primary bg-brand-primary/10 backdrop-blur-sm text-xs">
                <Mail className="w-3 h-3 mr-1" />
                Welcome Back
              </Badge>
            </div>
            
            <CardTitle className="text-2xl text-neutral-900 tracking-tight">
              Welcome Back
            </CardTitle>
            
            <CardDescription className="text-sm text-neutral-600 mt-1">
              Access your personalized dashboard and AIT opportunities
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4 px-6 pb-6">
            {/* Signup Success Banner */}
            {showSignupSuccess && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <Check className="w-5 h-5 text-green-600" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-green-900 mb-1">
                      Account created successfully! 🎉
                    </p>
                    <p className="text-sm text-green-700">
                      Welcome to FindMyAIT! Please sign in with your new account to get started.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowSignupSuccess(false)}
                    className="text-green-600 hover:text-green-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Pending Application Alert */}
            {pendingJobApplication && (
              <div className="bg-brand-secondary/10 border border-brand-secondary/20 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-brand-secondary rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium text-brand-primary">
                      Application Ready
                    </p>
                    <p className="text-xs text-neutral-600 mt-1">
                      After login, you'll be returned to apply for: <strong>{pendingJobApplication.title}</strong> at {pendingJobApplication.company}
                    </p>
                  </div>
                </div>
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Field */}
              <div className="space-y-1.5">
                <label htmlFor="email" className="text-sm text-neutral-700">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
                  <Input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="pl-[40px] h-11 bg-input-background border-neutral-300 focus:border-brand-primary focus:ring-brand-primary/20 rounded-lg pt-[4px] pr-[12px] pb-[4px] mt-[4px] mr-[0px] mb-[0px] ml-[0px]"
                    placeholder="Enter your email address"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-1.5">
                <label htmlFor="password" className="text-sm text-neutral-700">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className="pl-10 pr-10 h-11 bg-input-background border-neutral-300 focus:border-brand-primary focus:ring-brand-primary/20 rounded-lg mt-[4px] mr-[0px] mb-[0px] ml-[0px]"
                    placeholder="Enter your password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-transparent rounded-md"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-neutral-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-neutral-400" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Login Error */}
              {loginError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-sm text-red-600">{loginError}</p>
                </div>
              )}

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center space-x-2 [color-scheme:light] force-light-theme">
                  <input
                    id="remember"
                    type="checkbox"
                    className="h-4 w-4 rounded border-2 border-neutral-300 bg-white text-brand-primary focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary checked:bg-brand-primary checked:border-brand-primary checked:text-white accent-brand-primary"
                  />
                  <label htmlFor="remember" className="text-sm text-neutral-600">
                    Remember me
                  </label>
                </div>
                
                <Button
                  type="button"
                  variant="link"
                  className="text-sm text-brand-primary hover:text-brand-primary-hover p-0 h-auto"
                >
                  Forgot password?
                </Button>
              </div>

              {/* Submit Button */}
              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-brand-primary hover:bg-brand-primary-hover text-white h-11 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all mt-[10px] mr-[0px] mb-[0px] ml-[0px]"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Signing in...
                  </div>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-neutral-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 text-neutral-500" style={{ backgroundColor: '#f5f6f9' }}>Don't have an account?</span>
              </div>
            </div>

            {/* Sign Up Link */}
            <Button
              variant="outline"
              className="w-full h-11 border-brand-primary/30 text-brand-primary bg-transparent hover:bg-brand-primary/5 hover:border-brand-primary rounded-lg"
              onClick={() => onNavigate?.('signup')}
            >
              Create New Account
            </Button>
          </CardContent>
        </Card>

        {/* Footer Links */}
        <div className="mt-8 text-center">
          <div className="flex justify-center space-x-6 text-sm text-white/80">
            <Button
              variant="link"
              className="text-white/80 hover:text-white p-0 h-auto flex items-center text-[15px]"
              onClick={() => onNavigate?.('home')}
            >
              <ArrowLeft className="w-3 h-3 mr-1" />
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}