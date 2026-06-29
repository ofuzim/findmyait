import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { LocalStorageAuth } from '../utils/localStorage';
import { mockJobs } from '../data/mockJobs';
import { toast } from 'sonner@2.0.3';
import {
  Database,
  Users,
  FileText,
  Heart,
  Briefcase,
  Bell,
  Trash2,
  Download,
  Upload,
  Eye,
  RefreshCw,
  Settings,
  Bug,
  TestTube,
  Copy,
  Check
} from 'lucide-react';

interface DevToolsPanelProps {
  currentUser?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  } | null;
  isOpen: boolean;
  onClose: () => void;
}

export function DevToolsPanel({ currentUser, isOpen, onClose }: DevToolsPanelProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [userData, setUserData] = useState<any>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [importData, setImportData] = useState('');
  const [showCopySuccess, setShowCopySuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load user data whenever user changes or refresh is triggered (optimized)
  useEffect(() => {
    if (currentUser?.id && isOpen) { // Only load when panel is open
      setIsLoading(true);
      setError(null);
      
      try {
        const applications = LocalStorageAuth.getUserApplications(currentUser.id);
        const savedJobs = LocalStorageAuth.getUserSavedJobs(currentUser.id);
        const alerts = LocalStorageAuth.getUserJobAlerts(currentUser.id);
        
        // Only load heavy data when needed
        setUserData({
          user: currentUser,
          applications,
          savedJobs,
          alerts,
          // Load other data lazily
          profile: null,
          quizProgress: null,
          notifications: null,
          notificationPrefs: null
        });
      } catch (error) {
        console.error('Error loading dev tools data:', error);
        setError('Failed to load user data');
        setUserData(null);
      } finally {
        setIsLoading(false);
      }
    } else if (!isOpen) {
      // Clear data when panel is closed to save memory
      setUserData(null);
      setError(null);
    }
  }, [currentUser, refreshTrigger, isOpen]);

  const refreshData = () => {
    setRefreshTrigger(prev => prev + 1);
    toast.success('Data refreshed successfully');
  };

  const clearAllData = () => {
    if (confirm('⚠️ This will permanently delete ALL localStorage data. Are you sure?')) {
      LocalStorageAuth.clearAllData();
      setRefreshTrigger(prev => prev + 1);
      toast.success('All localStorage data cleared');
    }
  };

  const exportData = () => {
    try {
      // Simple export with basic data only to avoid memory issues
      const basicData = {
        users: JSON.parse(localStorage.getItem('findmyait_users') || '[]'),
        applications: JSON.parse(localStorage.getItem('findmyait_user_applications') || '[]'),
        savedJobs: JSON.parse(localStorage.getItem('findmyait_user_saved_jobs') || '[]'),
        exportDate: new Date().toISOString()
      };

      const dataStr = JSON.stringify(basicData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `findmyait-backup-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      URL.revokeObjectURL(url);
      
      toast.success('Data exported successfully');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export data');
    }
  };

  const importDataFile = () => {
    try {
      const data = JSON.parse(importData);
      
      if (data.users) localStorage.setItem('findmyait_users', JSON.stringify(data.users));
      if (data.profiles) localStorage.setItem('findmyait_user_profiles', JSON.stringify(data.profiles));
      if (data.applications) localStorage.setItem('findmyait_user_applications', JSON.stringify(data.applications));
      if (data.savedJobs) localStorage.setItem('findmyait_user_saved_jobs', JSON.stringify(data.savedJobs));
      if (data.alerts) localStorage.setItem('findmyait_user_job_alerts', JSON.stringify(data.alerts));
      if (data.quizProgress) localStorage.setItem('findmyait_user_quiz_progress', JSON.stringify(data.quizProgress));
      if (data.notifications) localStorage.setItem('findmyait_user_notifications', JSON.stringify(data.notifications));
      if (data.notificationPrefs) localStorage.setItem('findmyait_user_notification_preferences', JSON.stringify(data.notificationPrefs));

      setRefreshTrigger(prev => prev + 1);
      setImportData('');
      toast.success('Data imported successfully');
    } catch (error) {
      toast.error('Invalid JSON data');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setShowCopySuccess(true);
    setTimeout(() => setShowCopySuccess(false), 2000);
    toast.success('Copied to clipboard');
  };

  const addTestApplications = () => {
    if (!currentUser?.id) return;
    
    try {
      // Add just a few test applications with simple IDs
      const testJobIds = ['test_job_1', 'test_job_2', 'test_job_3'];
      testJobIds.forEach(jobId => {
        LocalStorageAuth.addJobApplication(currentUser.id, jobId);
      });
      
      setRefreshTrigger(prev => prev + 1);
      toast.success('Added 3 test applications');
    } catch (error) {
      console.error('Error adding test applications:', error);
      toast.error('Failed to add test applications');
    }
  };

  const addTestSavedJobs = () => {
    if (!currentUser?.id) return;
    
    try {
      // Add test saved jobs with simple IDs
      const testJobIds = ['saved_job_1', 'saved_job_2', 'saved_job_3'];
      testJobIds.forEach(jobId => {
        LocalStorageAuth.toggleSavedJob(currentUser.id, jobId);
      });
      
      setRefreshTrigger(prev => prev + 1);
      toast.success('Added 3 test saved jobs');
    } catch (error) {
      console.error('Error adding test saved jobs:', error);
      toast.error('Failed to add test saved jobs');
    }
  };

  const addTestAlert = () => {
    if (!currentUser?.id) return;
    
    const testAlert = {
      name: 'Test Alert - AIT Positions',
      criteria: 'Administrator in Training positions in Colorado',
      frequency: 'daily',
      keywords: 'administrator, training, AIT',
      location: 'Colorado',
      salaryMin: '60',
      jobType: 'full-time',
      experienceLevel: 'entry-level',
      matchCount: Math.floor(Math.random() * 10) + 1,
      active: true
    };
    
    LocalStorageAuth.createJobAlert(currentUser.id, testAlert);
    setRefreshTrigger(prev => prev + 1);
    toast.success('Added test job alert');
  };

  const triggerTestNotification = () => {
    if (!currentUser?.id) return;
    
    LocalStorageAuth.createInAppNotification(currentUser.id, {
      type: 'system',
      title: 'Test Notification',
      message: 'This is a test notification created by the dev tools panel.',
      actionUrl: 'dashboard',
      actionText: 'View Dashboard',
      priority: 'medium'
    });
    
    setRefreshTrigger(prev => prev + 1);
    toast.success('Test notification created');
  };

  const getTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    User Data
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span>Applications:</span>
                    <Badge variant="outline">{Array.isArray(userData?.applications) ? userData.applications.length : 0}</Badge>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>Saved Jobs:</span>
                    <Badge variant="outline">{Array.isArray(userData?.savedJobs) ? userData.savedJobs.length : 0}</Badge>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>Job Alerts:</span>
                    <Badge variant="outline">{Array.isArray(userData?.alerts) ? userData.alerts.length : 0}</Badge>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>Notifications:</span>
                    <Badge variant="outline">--</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <TestTube className="h-4 w-4" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button size="sm" variant="outline" onClick={addTestApplications} className="w-full text-xs">
                    Add Test Applications
                  </Button>
                  <Button size="sm" variant="outline" onClick={addTestSavedJobs} className="w-full text-xs">
                    Add Test Saved Jobs
                  </Button>
                  <Button size="sm" variant="outline" onClick={addTestAlert} className="w-full text-xs">
                    Add Test Alert
                  </Button>
                  <Button size="sm" variant="outline" onClick={triggerTestNotification} className="w-full text-xs">
                    Test Notification
                  </Button>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Database className="h-4 w-4" />
                  Storage Management
                </CardTitle>
              </CardHeader>
              <CardContent className="flex gap-2">
                <Button size="sm" variant="outline" onClick={refreshData}>
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Refresh
                </Button>
                <Button size="sm" variant="outline" onClick={exportData}>
                  <Download className="h-3 w-3 mr-1" />
                  Export
                </Button>
                <Button size="sm" variant="destructive" onClick={clearAllData}>
                  <Trash2 className="h-3 w-3 mr-1" />
                  Clear All
                </Button>
              </CardContent>
            </Card>
          </div>
        );

      case 'data':
        return (
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  Raw Data Viewer
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">User Data JSON</span>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => copyToClipboard(JSON.stringify(userData, null, 2))}
                    >
                      {showCopySuccess ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                    </Button>
                  </div>
                  <Textarea
                    value={JSON.stringify(userData, null, 2)}
                    readOnly
                    className="font-mono text-xs h-64 scrollbar-light"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'import':
        return (
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  Import Data
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-xs text-neutral-600">
                    Paste exported JSON data below to import it into localStorage.
                  </p>
                  <Textarea
                    placeholder="Paste exported JSON data here..."
                    value={importData}
                    onChange={(e) => setImportData(e.target.value)}
                    className="font-mono text-xs h-32"
                  />
                  <Button 
                    size="sm" 
                    onClick={importDataFile}
                    disabled={!importData.trim()}
                  >
                    Import Data
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  if (!isOpen) return null;

  // Safety check to prevent crashes
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bug className="h-5 w-5" />
            Developer Tools - LocalStorage Manager
          </DialogTitle>
          <DialogDescription>
            Manage and inspect localStorage data for testing and development.
            {currentUser ? ` Current user: ${currentUser.email}` : ' (No user logged in)'}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col space-y-4 overflow-hidden">
          {/* Tab Navigation */}
          <div className="flex border-b border-neutral-200">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'overview'
                  ? 'border-brand-primary text-brand-primary'
                  : 'border-transparent text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('data')}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'data'
                  ? 'border-brand-primary text-brand-primary'
                  : 'border-transparent text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Raw Data
            </button>
            <button
              onClick={() => setActiveTab('import')}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'import'
                  ? 'border-brand-primary text-brand-primary'
                  : 'border-transparent text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Import/Export
            </button>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto scrollbar-light">
            {error ? (
              <div className="p-4 text-center">
                <p className="text-red-600 text-sm">{error}</p>
                <Button size="sm" variant="outline" onClick={() => setRefreshTrigger(prev => prev + 1)} className="mt-2">
                  Try Again
                </Button>
              </div>
            ) : isLoading ? (
              <div className="p-4 text-center">
                <p className="text-neutral-600 text-sm">Loading...</p>
              </div>
            ) : (
              getTabContent()
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}