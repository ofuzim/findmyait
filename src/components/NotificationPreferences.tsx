/**
 * NOTIFICATION PREFERENCES COMPONENT - PLACEHOLDER IMPLEMENTATION
 * 
 * ⚠️ IMPORTANT: This is a frontend-only implementation using localStorage.
 * In production, this would integrate with:
 * - Backend user preferences API
 * - Email service provider settings
 * - Push notification service configuration
 * - GDPR/CCPA compliance systems
 */

import { useState, useEffect } from "react";
import { Bell, Mail, Smartphone, Calendar, Clock, Save, Shield } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Switch } from "./ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { LocalStorageAuth, type NotificationPreferences } from "../utils/localStorage";
import { toast } from "sonner@2.0.3";

interface NotificationPreferencesProps {
  currentUser: any;
}

export function NotificationPreferences({ currentUser }: NotificationPreferencesProps) {
  const [preferences, setPreferences] = useState<NotificationPreferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (currentUser?.id) {
      loadPreferences();
    }
  }, [currentUser?.id]);

  const loadPreferences = () => {
    if (!currentUser?.id) return;

    setLoading(true);
    const userPreferences = LocalStorageAuth.getNotificationPreferences(currentUser.id);
    
    if (!userPreferences) {
      // Initialize default preferences if none exist
      const defaultPrefs = LocalStorageAuth.initializeNotificationPreferences(currentUser.id);
      setPreferences(defaultPrefs);
    } else {
      setPreferences(userPreferences);
    }
    
    setLoading(false);
  };

  const handleSavePreferences = async () => {
    if (!currentUser?.id || !preferences) return;

    setSaving(true);
    
    try {
      const success = LocalStorageAuth.updateNotificationPreferences(currentUser.id, preferences);
      
      if (success) {
        toast.success("Notification preferences saved successfully");
      } else {
        toast.error("Failed to save preferences. Please try again.");
      }
    } catch (error) {
      console.error('Error saving preferences:', error);
      toast.error("An error occurred while saving preferences");
    } finally {
      setSaving(false);
    }
  };

  const updateEmailNotification = (key: keyof NotificationPreferences['emailNotifications'], value: boolean) => {
    if (!preferences) return;
    
    setPreferences({
      ...preferences,
      emailNotifications: {
        ...preferences.emailNotifications,
        [key]: value
      }
    });
  };

  const updatePushNotification = (key: keyof NotificationPreferences['pushNotifications'], value: boolean) => {
    if (!preferences) return;
    
    setPreferences({
      ...preferences,
      pushNotifications: {
        ...preferences.pushNotifications,
        [key]: value
      }
    });
  };

  const updatePreference = (key: keyof NotificationPreferences, value: any) => {
    if (!preferences) return;
    
    setPreferences({
      ...preferences,
      [key]: value
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-neutral-200 rounded w-1/4"></div>
          <div className="h-32 bg-neutral-200 rounded"></div>
          <div className="h-32 bg-neutral-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!preferences) {
    return (
      <div className="text-center py-8">
        <Bell className="h-12 w-12 text-neutral-300 mx-auto mb-4" />
        <p className="text-neutral-600">Unable to load notification preferences</p>
        <Button onClick={loadPreferences} className="mt-4">Try Again</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium text-neutral-900 mb-2">Notification Preferences</h2>
        <p className="text-sm text-neutral-600">
          Manage how and when you receive notifications about jobs, quiz reminders, and updates.
        </p>
      </div>

      {/* Email Notifications */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-brand-primary" />
            <CardTitle className="text-base">Email Notifications</CardTitle>
          </div>
          <CardDescription>
            Choose which email notifications you'd like to receive at {currentUser?.email}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium">Job Alerts</Label>
                <p className="text-xs text-neutral-500">Get notified when new jobs match your saved alerts</p>
              </div>
              <Switch
                checked={preferences.emailNotifications.jobAlerts}
                onCheckedChange={(checked) => updateEmailNotification('jobAlerts', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium">New Job Matches</Label>
                <p className="text-xs text-neutral-500">Receive recommendations for jobs that match your profile</p>
              </div>
              <Switch
                checked={preferences.emailNotifications.newJobMatches}
                onCheckedChange={(checked) => updateEmailNotification('newJobMatches', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium">Application Updates</Label>
                <p className="text-xs text-neutral-500">Status updates on your job applications</p>
              </div>
              <Switch
                checked={preferences.emailNotifications.applicationUpdates}
                onCheckedChange={(checked) => updateEmailNotification('applicationUpdates', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium">Quiz Reminders</Label>
                <p className="text-xs text-neutral-500">Daily reminders to practice NAB exam questions</p>
              </div>
              <Switch
                checked={preferences.emailNotifications.quizReminders}
                onCheckedChange={(checked) => updateEmailNotification('quizReminders', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium">Weekly Digest</Label>
                <p className="text-xs text-neutral-500">Summary of new jobs and your activity</p>
              </div>
              <Switch
                checked={preferences.emailNotifications.weeklyDigest}
                onCheckedChange={(checked) => updateEmailNotification('weeklyDigest', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium">Monthly Report</Label>
                <p className="text-xs text-neutral-500">Detailed progress report and market insights</p>
              </div>
              <Switch
                checked={preferences.emailNotifications.monthlyReport}
                onCheckedChange={(checked) => updateEmailNotification('monthlyReport', checked)}
              />
            </div>
          </div>

          <Separator />

          {/* Email Frequency & Timing */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-neutral-900 flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Email Delivery Preferences
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs text-neutral-600">Alert Frequency</Label>
                <Select
                  value={preferences.alertFrequency}
                  onValueChange={(value: 'immediate' | 'daily' | 'weekly') => updatePreference('alertFrequency', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="immediate">Immediate</SelectItem>
                    <SelectItem value="daily">Daily Summary</SelectItem>
                    <SelectItem value="weekly">Weekly Summary</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-xs text-neutral-600">Preferred Email Time</Label>
                <Select
                  value={preferences.preferredEmailTime}
                  onValueChange={(value) => updatePreference('preferredEmailTime', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="06:00">6:00 AM</SelectItem>
                    <SelectItem value="09:00">9:00 AM</SelectItem>
                    <SelectItem value="12:00">12:00 PM</SelectItem>
                    <SelectItem value="15:00">3:00 PM</SelectItem>
                    <SelectItem value="18:00">6:00 PM</SelectItem>
                    <SelectItem value="21:00">9:00 PM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Push Notifications */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <Smartphone className="h-5 w-5 text-brand-primary" />
            <CardTitle className="text-base">Push Notifications</CardTitle>
          </div>
          <CardDescription>
            Real-time notifications on your device (requires browser permission)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-sm font-medium">Enable Push Notifications</Label>
              <p className="text-xs text-neutral-500">Allow browser notifications from FindMyAIT</p>
            </div>
            <Switch
              checked={preferences.pushNotifications.enabled}
              onCheckedChange={(checked) => updatePushNotification('enabled', checked)}
            />
          </div>

          {preferences.pushNotifications.enabled && (
            <div className="space-y-4 pl-4 border-l-2 border-neutral-100">
              <div className="flex items-center justify-between">
                <Label className="text-sm">Job Alerts</Label>
                <Switch
                  checked={preferences.pushNotifications.jobAlerts}
                  onCheckedChange={(checked) => updatePushNotification('jobAlerts', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label className="text-sm">Quiz Reminders</Label>
                <Switch
                  checked={preferences.pushNotifications.quizReminders}
                  onCheckedChange={(checked) => updatePushNotification('quizReminders', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label className="text-sm">Application Updates</Label>
                <Switch
                  checked={preferences.pushNotifications.applicationUpdates}
                  onCheckedChange={(checked) => updatePushNotification('applicationUpdates', checked)}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Marketing & Communications */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-brand-primary" />
            <CardTitle className="text-base">Marketing & Communications</CardTitle>
          </div>
          <CardDescription>
            Optional communications about FindMyAIT and healthcare opportunities
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-sm font-medium">Marketing Emails</Label>
              <p className="text-xs text-neutral-500">Tips, industry news, and FindMyAIT updates</p>
            </div>
            <Switch
              checked={preferences.marketingEmails}
              onCheckedChange={(checked) => updatePreference('marketingEmails', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-sm font-medium">Product Updates</Label>
              <p className="text-xs text-neutral-500">New features and platform improvements</p>
            </div>
            <Switch
              checked={preferences.productUpdates}
              onCheckedChange={(checked) => updatePreference('productUpdates', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-sm font-medium">Partner Offers</Label>
              <p className="text-xs text-neutral-500">Special offers from healthcare education partners</p>
            </div>
            <Switch
              checked={preferences.partnerOffers}
              onCheckedChange={(checked) => updatePreference('partnerOffers', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex items-center justify-between pt-6 border-t border-neutral-200">
        <p className="text-xs text-neutral-500">
          Your preferences are automatically saved when you make changes.
        </p>
        <Button 
          onClick={handleSavePreferences}
          disabled={saving}
          className="bg-brand-primary hover:bg-brand-primary-hover"
        >
          {saving ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Preferences
            </>
          )}
        </Button>
      </div>

      {/* Privacy Notice */}
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <div className="flex items-start gap-3">
          <Shield className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="text-sm font-medium text-blue-900 mb-1">Privacy & Data Protection</h4>
            <p className="text-xs text-blue-700 leading-relaxed">
              Your notification preferences and personal data are protected according to our Privacy Policy. 
              You can change these settings or unsubscribe at any time. We never share your email with third parties 
              without your explicit consent.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}