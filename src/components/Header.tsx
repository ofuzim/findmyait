import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "./ui/sheet";
import { NotificationCenter } from "./NotificationCenter";
import { LocalStorageAuth } from "../utils/localStorage";
import { Badge } from "./ui/badge";
import logoFull from 'figma:asset/28624db62fac154e722120f8f8afb7f175668f82.png';
import { 
  Menu,
  Bell,
  ChevronDown,
  User,
  Settings,
  LogOut,
  Edit,
  X,

} from 'lucide-react';

// Component for mobile user profile menu (using Sheet for better mobile experience)
function MobileUserMenu({ currentUser, userProfile, onNavigate, onLogout }: { 
  currentUser: any; 
  userProfile: any;
  onNavigate: (page: string) => void;
  onLogout?: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Load unread notification count
  useEffect(() => {
    if (currentUser?.id) {
      const count = LocalStorageAuth.getUnreadNotificationCount(currentUser.id);
      setUnreadCount(count);
    }
  }, [currentUser?.id, isOpen]);

  // Build user object
  const user = {
    firstName: userProfile?.firstName || currentUser?.firstName || 'User',
    lastName: userProfile?.lastName || currentUser?.lastName || '',
    email: userProfile?.email || currentUser?.email || '',
    profilePhoto: userProfile?.profilePhoto,
    get fullName() {
      return `${this.firstName} ${this.lastName}`.trim();
    }
  };

  const handleNavigation = (page: string) => {
    setIsOpen(false);
    onNavigate(page);
  };

  const handleLogout = () => {
    setIsOpen(false);
    onLogout?.();
  };

  const handleNotificationsClick = () => {
    setIsOpen(false); // Close user menu
    setIsNotificationsOpen(true); // Open notifications
  };

  const handleNotificationsNavigate = (page: string) => {
    setIsNotificationsOpen(false);
    onNavigate(page);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" className="p-2 relative">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.profilePhoto || undefined} />
            <AvatarFallback className="bg-brand-primary text-white text-sm">
              {user.firstName.charAt(0)}
            </AvatarFallback>
          </Avatar>
          {unreadCount > 0 && (
            <Badge 
              className="absolute -top-0.5 -right-0.5 h-5 w-5 min-w-[20px] flex items-center justify-center p-0 text-white text-[10px] rounded-full border-2 border-white"
              style={{ backgroundColor: 'var(--brand-secondary)' }}
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="rounded-t-2xl p-0 [&>button]:hidden">
        <SheetTitle className="sr-only">User Menu</SheetTitle>
        <SheetDescription className="sr-only">
          Access your profile, settings, and account options
        </SheetDescription>
        
        <div className="flex flex-col">
          {/* User Info Header */}
          <div className="px-6 py-5 border-b border-neutral-200 bg-neutral-50 py-[13px] px-[24px] rounded-t-2xl">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={user.profilePhoto || undefined} />
                <AvatarFallback className="bg-brand-primary text-white">
                  {user.firstName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-semibold text-neutral-900">{user.fullName}</p>
                <p className="text-sm text-neutral-600">{user.email}</p>
              </div>
              <button
                onClick={handleNotificationsClick}
                className="relative p-2 hover:bg-neutral-200 rounded-full transition-colors bg-[rgba(0,0,0,0.04)]"
              >
                <Bell className="h-5 w-5 text-neutral-700" />
                {unreadCount > 0 && (
                  <Badge 
                    className="absolute -top-1 -right-1 h-4 min-w-[16px] flex items-center justify-center p-0 px-1 text-white text-[10px]"
                    style={{ backgroundColor: 'var(--brand-secondary)' }}
                  >
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </Badge>
                )}
              </button>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            <button
              onClick={() => handleNavigation('dashboard')}
              className="w-full flex items-center gap-3 px-6 text-left hover:bg-neutral-50 transition-colors py-[10px] px-[24px] py-[12px]"
            >
              <User className="h-5 w-5 text-neutral-600" />
              <span className="font-medium text-neutral-900">View Dashboard</span>
            </button>
            <button
              onClick={() => handleNavigation('profile-completion')}
              className="w-full flex items-center gap-3 px-6 text-left hover:bg-neutral-50 transition-colors py-[10px] py-[12px] px-[24px]"
            >
              <Edit className="h-5 w-5 text-neutral-600" />
              <span className="font-medium text-neutral-900">Edit Profile</span>
            </button>
            <button
              onClick={() => handleNavigation('account-settings')}
              className="w-full flex items-center gap-3 px-6 text-left hover:bg-neutral-50 transition-colors py-[10px] px-[24px] py-[12px]"
            >
              <Settings className="h-5 w-5 text-neutral-600" />
              <span className="font-medium text-neutral-900">Account Settings</span>
            </button>
          </div>

          {/* Sign Out */}
          <div className="border-t border-neutral-200 p-4 pb-6">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 font-medium transition-colors"
            >
              <LogOut className="h-5 w-5" />
              Sign Out
            </button>
          </div>
        </div>
      </SheetContent>

      {/* Notifications Sheet - Separate from user menu */}
      <Sheet open={isNotificationsOpen} onOpenChange={setIsNotificationsOpen}>
        <SheetContent side="bottom" className="h-[85vh] rounded-t-2xl p-0 [&>button]:top-4 [&>button]:right-4">
          <SheetTitle className="sr-only">Notifications</SheetTitle>
          <SheetDescription className="sr-only">
            View and manage your notifications
          </SheetDescription>
          
          <div className="h-full">
            <NotificationCenter 
              currentUser={currentUser}
              onNavigate={handleNotificationsNavigate}
              variant="inline"
            />
          </div>
        </SheetContent>
      </Sheet>
    </Sheet>
  );
}

interface HeaderProps {
  activeTab?: 'home' | 'jobs' | 'quiz' | 'resources' | 'about';
  currentPage?: string;
  onNavigate?: (page: string) => void;
  onLogout?: () => void;
  isLoggedIn?: boolean;
  // ⚠️ PLACEHOLDER - Current user from LocalStorage auth
  currentUser?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    createdAt: string;
    lastLogin?: string;
  };
  userProfile?: any;
}

export function Header({ activeTab = 'home', currentPage = 'home', onNavigate, onLogout, isLoggedIn, currentUser, userProfile }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Check if current page is a dashboard page
  const isDashboardPage = currentPage === 'dashboard' || 
                         currentPage.startsWith('job-activity') || 
                         currentPage.startsWith('view-matches') || 
                         currentPage === 'profile-completion' || 
                         currentPage === 'account-settings';
  
  // Determine active tab from currentPage if not explicitly set
  const getActiveTab = () => {
    // If on dashboard page, don't highlight any navigation tabs
    if (isDashboardPage) return null;
    if (currentPage === 'jobs') return 'jobs';
    if (currentPage === 'quiz') return 'quiz';
    if (currentPage === 'resources') return 'resources';
    if (currentPage === 'about') return 'about';
    return 'home';
  };
  
  const currentActiveTab = activeTab !== 'home' ? activeTab : getActiveTab();
  
  // Check if user is logged in - use prop if provided, otherwise check LocalStorage
  const userIsLoggedIn = isLoggedIn !== undefined ? isLoggedIn : (LocalStorageAuth.isLoggedIn() && currentUser);
  
  // 🔄 PLACEHOLDER - Using localStorage data, fallback to mock data
  // In production: This would come from authenticated user context
  const user = {
    firstName: currentUser?.firstName || "User",
    fullName: currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : "User",
    email: currentUser?.email || "user@email.com",
    profilePhoto: null // TODO: Add profile photo support to localStorage
  };
  
  const handleLogout = () => {
    // Call the proper logout handler from parent component
    // This will handle localStorage cleanup and navigation
    if (onLogout) {
      onLogout();
    }
    setIsMobileMenuOpen(false); // Close mobile menu after logout
  };

  const handleMobileNavigation = (page: string) => {
    onNavigate?.(page);
    setIsMobileMenuOpen(false); // Close mobile menu after navigation
  };
  return (
    <header className="w-full bg-white shadow-sm sticky top-0 z-50 border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 relative">
          {/* Mobile layout: Menu left, Logo center, Sign in right */}
          <div className="lg:hidden flex items-center justify-between w-full">
            {/* Left: Mobile menu button */}
            <div className="flex items-center">
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="p-2">
                    <Menu className="h-6 w-6 text-neutral-600" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80 p-0 [&>button]:hidden">
                  {/* Hidden accessibility title and description */}
                  <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                  <SheetDescription className="sr-only">
                    Main navigation menu for FindMyAIT platform
                  </SheetDescription>
                  
                  <div className="flex flex-col h-full">
                    {/* Mobile menu header */}
                    <div className="p-6 border-b border-neutral-200">
                      <div className="flex items-center justify-between">
                        {/* Close button on the left */}
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="p-2 hover:bg-neutral-100"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <X className="h-6 w-6 text-neutral-600" />
                        </Button>
                        
                        {/* Logo in the center */}
                        <img 
                          src={logoFull} 
                          alt="FindMyAIT" 
                          className="h-8 w-auto"
                        />
                        
                        {/* Empty div for balance (same width as close button) */}
                        <div className="w-10"></div>
                      </div>
                    </div>

                    {/* Mobile navigation menu */}
                    <div className="flex-1 py-6">
                      <nav className="px-6 space-y-1">
                        <button 
                          onClick={() => handleMobileNavigation('home')}
                          className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors duration-200 ${
                            currentActiveTab === 'home' 
                              ? 'bg-brand-primary/10 text-brand-primary' 
                              : 'text-neutral-700 hover:bg-neutral-100'
                          }`}
                        >
                          Home
                        </button>
                        <button 
                          onClick={() => handleMobileNavigation('jobs')}
                          className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors duration-200 ${
                            currentActiveTab === 'jobs' 
                              ? 'bg-brand-primary/10 text-brand-primary' 
                              : 'text-neutral-700 hover:bg-neutral-100'
                          }`}
                        >
                          Jobs
                        </button>
                        <button 
                          onClick={() => handleMobileNavigation('quiz')}
                          className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors duration-200 ${
                            currentActiveTab === 'quiz' 
                              ? 'bg-brand-primary/10 text-brand-primary' 
                              : 'text-neutral-700 hover:bg-neutral-100'
                          }`}
                        >
                          Quiz
                        </button>
                        <button 
                          onClick={() => handleMobileNavigation('resources')}
                          className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors duration-200 ${
                            currentActiveTab === 'resources' 
                              ? 'bg-brand-primary/10 text-brand-primary' 
                              : 'text-neutral-700 hover:bg-neutral-100'
                          }`}
                        >
                          Resources
                        </button>
                        <button 
                          onClick={() => handleMobileNavigation('about')}
                          className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors duration-200 ${
                            currentActiveTab === 'about' 
                              ? 'bg-brand-primary/10 text-brand-primary' 
                              : 'text-neutral-700 hover:bg-neutral-100'
                          }`}
                        >
                          About
                        </button>
                      </nav>

                      {/* User-specific menu items for logged in users - REMOVED FOR MOBILE */}
                      {/* Dashboard menus are now accessible via the top-right user icon on mobile */}

                      {/* Additional links section */}
                      <div className="px-6 py-4">
                        <div className="h-px bg-neutral-200"></div>
                      </div>
                      <nav className="px-6 space-y-1">
                        <button 
                          onClick={() => handleMobileNavigation('contact')}
                          className="w-full text-left px-4 py-3 rounded-lg font-medium text-neutral-700 hover:bg-neutral-100 transition-colors duration-200"
                        >
                          Contact
                        </button>
                        <button 
                          onClick={() => handleMobileNavigation('privacy')}
                          className="w-full text-left px-4 py-3 rounded-lg font-medium text-neutral-700 hover:bg-neutral-100 transition-colors duration-200"
                        >
                          Privacy Policy
                        </button>
                        <button 
                          onClick={() => handleMobileNavigation('terms')}
                          className="w-full text-left px-4 py-3 rounded-lg font-medium text-neutral-700 hover:bg-neutral-100 transition-colors duration-200"
                        >
                          Terms of Service
                        </button>
                        
                        {/* Auth menu items for non-logged in users */}
                        {!userIsLoggedIn && (
                          <>
                            <div className="h-px bg-neutral-200 my-4"></div>
                            <button 
                              onClick={() => handleMobileNavigation('login')}
                              className="w-full text-left px-4 py-3 rounded-lg font-medium text-neutral-700 hover:bg-neutral-100 transition-colors duration-200"
                            >
                              Sign In
                            </button>
                            <button 
                              onClick={() => handleMobileNavigation('signup')}
                              className="w-full text-left px-4 py-3 rounded-lg font-medium text-neutral-700 hover:bg-neutral-100 transition-colors duration-200"
                            >
                              Sign Up
                            </button>
                          </>
                        )}

                        {/* User account menu items for logged in users */}
                        {userIsLoggedIn && (
                          <>
                            <div className="h-px bg-neutral-200 my-4"></div>
                            <button 
                              onClick={handleLogout}
                              className="w-full text-left px-4 py-3 rounded-lg font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors duration-200"
                            >
                              Sign Out
                            </button>
                          </>
                        )}
                      </nav>
                    </div>

                    {/* Social media links */}



                  </div>
                </SheetContent>
              </Sheet>
            </div>

            {/* Center: Logo */}
            <div 
              className="absolute left-1/2 transform -translate-x-1/2 cursor-pointer hover:opacity-80 transition-opacity z-10"
              onClick={() => onNavigate?.('home')}
            >
              <img 
                src={logoFull} 
                alt="FindMyAIT" 
                className="h-8 w-auto"
              />
            </div>

            {/* Right: User icon with notification count or sign in icon */}
            <div className="flex items-center">
              {userIsLoggedIn ? (
                <MobileUserMenu 
                  currentUser={currentUser}
                  userProfile={userProfile}
                  onNavigate={onNavigate || (() => {})}
                  onLogout={onLogout}
                />
              ) : (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="p-2"
                  onClick={() => onNavigate?.('login')}
                >
                  <User className="h-6 w-6 text-neutral-600" />
                </Button>
              )}
            </div>
          </div>

          {/* Desktop layout: Logo left, Nav center, Actions right */}
          <div className="hidden lg:flex items-center justify-between w-full">
            {/* Logo */}
            <div 
              className="flex items-center cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => onNavigate?.('home')}
            >
              <img 
                src={logoFull} 
                alt="FindMyAIT" 
                className="h-8 w-auto"
              />
            </div>

            {/* Navigation Menu */}
            <nav className="flex items-center space-x-10">
            <button 
              onClick={() => onNavigate?.('home')}
              className={`relative transition-colors duration-200 font-medium ${
                currentActiveTab === 'home' 
                  ? 'nav-active' 
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
              style={currentActiveTab === 'home' ? { color: 'var(--brand-primary)' } : {}}
            >
              Home
            </button>
            <button 
              onClick={() => onNavigate?.('jobs')}
              className={`relative transition-colors duration-200 font-medium ${
                currentActiveTab === 'jobs' 
                  ? 'nav-active' 
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
              style={currentActiveTab === 'jobs' ? { color: 'var(--brand-primary)' } : {}}
            >
              Jobs
            </button>
            <button 
              onClick={() => onNavigate?.('quiz')}
              className={`relative transition-colors duration-200 font-medium ${
                currentActiveTab === 'quiz' 
                  ? 'nav-active' 
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
              style={currentActiveTab === 'quiz' ? { color: 'var(--brand-primary)' } : {}}
            >
              Quiz
            </button>
            <button 
              onClick={() => onNavigate?.('resources')}
              className={`relative transition-colors duration-200 font-medium ${
                currentActiveTab === 'resources' 
                  ? 'nav-active' 
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
              style={currentActiveTab === 'resources' ? { color: 'var(--brand-primary)' } : {}}
            >
              Resources
            </button>
            <button 
              onClick={() => onNavigate?.('about')}
              className={`relative transition-colors duration-200 font-medium ${
                currentActiveTab === 'about' 
                  ? 'nav-active' 
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
              style={currentActiveTab === 'about' ? { color: 'var(--brand-primary)' } : {}}
            >
              About
            </button>
          </nav>

            {/* Action Buttons - Conditional based on login status */}
            <div className="flex items-center space-x-4">
            {userIsLoggedIn ? (
              // Logged in: Show notification icon and user menu
              <>
                <NotificationCenter 
                  currentUser={currentUser}
                  onNavigate={onNavigate || (() => {})}
                />

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-2 p-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.profilePhoto || undefined} />
                        <AvatarFallback className="bg-brand-primary text-white text-sm">
                          {user.firstName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span 
                        className={`hidden md:inline text-sm relative transition-colors duration-200 ${
                          isDashboardPage ? 'nav-active' : ''
                        }`}
                        style={isDashboardPage ? { color: 'var(--brand-primary)' } : {}}
                      >
                        {user.firstName}
                      </span>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="px-3 py-2 border-b">
                      <p className="text-sm font-medium">{user.fullName}</p>
                      <p className="text-xs text-neutral-500">{user.email}</p>
                    </div>
                    <DropdownMenuItem 
                      onClick={() => currentPage !== 'dashboard' && onNavigate?.('dashboard')}
                      disabled={currentPage === 'dashboard'}
                      className={currentPage === 'dashboard' ? 'opacity-50 cursor-not-allowed' : ''}
                    >
                      <User className="h-4 w-4 mr-2" />
                      View Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onNavigate?.('profile-completion')}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onNavigate?.('account-settings')}>
                      <Settings className="h-4 w-4 mr-2" />
                      Account Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              // Not logged in: Show Sign In and Sign Up buttons (desktop only)
              <>
                <Button 
                  variant="ghost" 
                  className="text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 font-medium px-6 border border-neutral-300 hover:border-neutral-400"
                  onClick={() => onNavigate?.('login')}
                >
                  Sign In
                </Button>
                <Button 
                  style={{
                    backgroundColor: 'var(--brand-primary)',
                    color: 'white'
                  }}
                  className="hover:opacity-90 font-medium px-6 py-2.5 rounded-lg transition-all duration-200 hover:shadow-lg"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--brand-primary-hover)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--brand-primary)';
                  }}
                  onClick={() => onNavigate?.('signup')}
                >
                  Sign Up
                </Button>
              </>
            )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}