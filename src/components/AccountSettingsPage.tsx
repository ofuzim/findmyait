import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { Separator } from "./ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { NotificationPreferences } from "./NotificationPreferences";
import { LocalStorageAuth } from "../utils/localStorage";
import { toast } from "sonner@2.0.3";
import { Toaster } from "./ui/sonner";
import { 
  User, 
  Lock, 
  Bell, 
  Shield, 
  Mail,
  Phone,
  MapPin,
  Save,
  Trash2,
  Eye,
  EyeOff
} from "lucide-react";

interface AccountSettingsPageProps {
  onNavigate: (page: string) => void;
  onLogout?: () => void; // Added logout handler prop
  onProfileUpdate?: () => void; // Callback to refresh profile data in parent
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

export function AccountSettingsPage({ onNavigate, onLogout, onProfileUpdate, currentUser, userProfile }: AccountSettingsPageProps) {
  // Profile form state - controlled inputs
  const [profileForm, setProfileForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    city: "",
    state: ""
  });

  // Load user data on mount
  useEffect(() => {
    if (currentUser && userProfile) {
      setProfileForm({
        firstName: currentUser.firstName || "",
        lastName: currentUser.lastName || "",
        email: currentUser.email || "",
        phone: userProfile.phone || "",
        city: userProfile.city || "",
        state: userProfile.state || ""
      });
    }
  }, [currentUser, userProfile]);

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [notifications, setNotifications] = useState({
    jobAlerts: true,
    applicationUpdates: true,
    weeklyDigest: true,
    practiceReminders: true,
    marketingEmails: false
  });

  const [privacy, setPrivacy] = useState({
    profileVisibility: true,
    showEmail: false,
    showPhone: false,
    allowContactFromRecruiters: true
  });

  const handleSaveProfile = () => {
    if (!currentUser?.id) {
      toast.error("Unable to save profile. Please log in again.");
      return;
    }

    try {
      // Update user profile in localStorage
      const success = LocalStorageAuth.updateUserProfile(currentUser.id, {
        phone: profileForm.phone,
        city: profileForm.city,
        state: profileForm.state
      });

      if (success) {
        toast.success("Profile updated successfully!");
        
        // Trigger profile refresh in parent component
        if (onProfileUpdate) {
          onProfileUpdate();
        }
      } else {
        toast.error("Failed to update profile. Please try again.");
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error("An error occurred while saving your profile.");
    }
  };

  const handleChangePassword = () => {
    // Handle password change logic here
    console.log("Password changed");
  };

  const handleDeleteAccount = () => {
    // Handle account deletion logic here
    console.log("Delete account requested");
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <Header 
        onNavigate={onNavigate} 
        onLogout={onLogout || (() => {})} 
        currentPage="account-settings" 
        currentUser={currentUser} 
      />

      <div className="max-w-4xl mx-auto px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-neutral-900 mb-2">Account Settings</h1>
          <p className="text-neutral-600">Manage your account preferences and security settings</p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 bg-neutral-100 h-auto lg:h-12 mb-6 md:mb-8">
            <TabsTrigger value="profile" className="flex items-center gap-1 lg:gap-2 py-3 lg:py-2">
              <User className="h-4 w-4" />
              <span className="text-sm lg:text-base">Profile</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-1 lg:gap-2 py-3 lg:py-2">
              <Lock className="h-4 w-4" />
              <span className="text-sm lg:text-base">Security</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-1 lg:gap-2 py-3 lg:py-2">
              <Bell className="h-4 w-4" />
              <span className="text-sm lg:text-base">Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="privacy" className="flex items-center gap-1 lg:gap-2 py-3 lg:py-2">
              <Shield className="h-4 w-4" />
              <span className="text-sm lg:text-base">Privacy</span>
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6 pb-8 md:pb-12">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input 
                      id="firstName" 
                      value={profileForm.firstName}
                      onChange={(e) => setProfileForm({...profileForm, firstName: e.target.value})}
                      disabled
                      className="bg-neutral-100 cursor-not-allowed"
                    />
                    <p className="text-xs text-neutral-500">Contact support to change your name</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input 
                      id="lastName" 
                      value={profileForm.lastName}
                      onChange={(e) => setProfileForm({...profileForm, lastName: e.target.value})}
                      disabled
                      className="bg-neutral-100 cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email Address
                  </Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={profileForm.email}
                    onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
                    disabled
                    className="bg-neutral-100 cursor-not-allowed"
                  />
                  <p className="text-xs text-neutral-500">Contact support to change your email</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Phone Number
                  </Label>
                  <Input 
                    id="phone" 
                    type="tel" 
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})}
                    placeholder="(555) 123-4567"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city" className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      City
                    </Label>
                    <Input 
                      id="city" 
                      value={profileForm.city}
                      onChange={(e) => setProfileForm({...profileForm, city: e.target.value})}
                      placeholder="Denver"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input 
                      id="state" 
                      value={profileForm.state}
                      onChange={(e) => setProfileForm({...profileForm, state: e.target.value})}
                      placeholder="Colorado"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleSaveProfile} className="bg-brand-primary hover:bg-brand-primary-hover">
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6 pb-8 md:pb-12">
            <Card>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <div className="relative">
                    <Input 
                      id="currentPassword" 
                      type={showCurrentPassword ? "text" : "password"}
                      placeholder="Enter current password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    >
                      {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <div className="relative">
                    <Input 
                      id="newPassword" 
                      type={showNewPassword ? "text" : "password"}
                      placeholder="Enter new password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <div className="relative">
                    <Input 
                      id="confirmPassword" 
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm new password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleChangePassword} className="bg-brand-primary hover:bg-brand-primary-hover">
                    <Lock className="h-4 w-4 mr-2" />
                    Update Password
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-red-600">Danger Zone</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50">
                  <div>
                    <h4 className="font-medium text-red-900">Delete Account</h4>
                    <p className="text-sm text-red-700">Permanently delete your account and all associated data. This action cannot be undone.</p>
                  </div>
                  <Button variant="destructive" onClick={handleDeleteAccount}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Account
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6 pb-8 md:pb-12">
            <NotificationPreferences currentUser={currentUser} />
          </TabsContent>

          {/* Privacy Tab */}
          <TabsContent value="privacy" className="space-y-6 pb-8 md:pb-12">
            <Card>
              <CardHeader>
                <CardTitle>Privacy Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Profile Visibility</Label>
                    <p className="text-sm text-neutral-600">Make your profile visible to potential employers</p>
                  </div>
                  <Switch 
                    checked={privacy.profileVisibility}
                    onCheckedChange={(checked) => setPrivacy({...privacy, profileVisibility: checked})}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Show Email Address</Label>
                    <p className="text-sm text-neutral-600">Display your email address on your public profile</p>
                  </div>
                  <Switch 
                    checked={privacy.showEmail}
                    onCheckedChange={(checked) => setPrivacy({...privacy, showEmail: checked})}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Show Phone Number</Label>
                    <p className="text-sm text-neutral-600">Display your phone number on your public profile</p>
                  </div>
                  <Switch 
                    checked={privacy.showPhone}
                    onCheckedChange={(checked) => setPrivacy({...privacy, showPhone: checked})}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Allow Contact from Recruiters</Label>
                    <p className="text-sm text-neutral-600">Let healthcare recruiters reach out to you directly</p>
                  </div>
                  <Switch 
                    checked={privacy.allowContactFromRecruiters}
                    onCheckedChange={(checked) => setPrivacy({...privacy, allowContactFromRecruiters: checked})}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Footer onNavigate={onNavigate} />
      <Toaster />
    </div>
  );
}