/**
 * NOTIFICATION CENTER COMPONENT - PLACEHOLDER IMPLEMENTATION
 * 
 * ⚠️ IMPORTANT: This is a frontend-only implementation using localStorage.
 * In production, this would integrate with:
 * - Real-time notification services (Socket.io, Pusher, Firebase)
 * - Backend notification APIs
 * - Email service providers (SendGrid, AWS SES)
 * - Push notification services (FCM, APNS)
 */

import { useState, useEffect } from "react";
import { Bell, X, CheckCheck, Archive, ExternalLink, Clock, AlertCircle, CheckCircle, Info, Star } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import { LocalStorageAuth, type InAppNotification } from "../utils/localStorage";
import { toast } from "sonner@2.0.3";

interface NotificationCenterProps {
  currentUser: any;
  onNavigate: (page: string) => void;
  variant?: 'popover' | 'inline'; // New prop to support inline mode for mobile sheets
}

export function NotificationCenter({ currentUser, onNavigate, variant = 'popover' }: NotificationCenterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<InAppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showOnlyUnread, setShowOnlyUnread] = useState(false);

  // Load notifications on component mount and when user changes or filter changes
  useEffect(() => {
    if (currentUser?.id) {
      loadNotifications();
    }
  }, [currentUser?.id, isOpen, showOnlyUnread]);

  const loadNotifications = () => {
    if (!currentUser?.id) return;

    const allNotifications = LocalStorageAuth.getUserNotifications(currentUser.id);
    const unreadNotifications = LocalStorageAuth.getUserNotifications(currentUser.id, undefined, true);
    const count = LocalStorageAuth.getUnreadNotificationCount(currentUser.id);

    setNotifications(showOnlyUnread ? unreadNotifications : allNotifications);
    setUnreadCount(count);
  };

  const handleMarkAsRead = (notificationId: string) => {
    if (currentUser?.id) {
      const success = LocalStorageAuth.markNotificationAsRead(currentUser.id, notificationId);
      if (success) {
        loadNotifications();
        toast.success("Notification marked as read");
      }
    }
  };

  const handleMarkAllAsRead = () => {
    if (currentUser?.id) {
      const success = LocalStorageAuth.markAllNotificationsAsRead(currentUser.id);
      if (success) {
        loadNotifications();
        toast.success("All notifications marked as read");
      }
    }
  };

  const handleArchive = (notificationId: string) => {
    if (currentUser?.id) {
      const success = LocalStorageAuth.archiveNotification(currentUser.id, notificationId);
      if (success) {
        loadNotifications();
        toast.success("Notification archived");
      }
    }
  };

  const handleNotificationClick = (notification: InAppNotification) => {
    // Mark as read when clicked
    if (!notification.read) {
      handleMarkAsRead(notification.id);
    }

    // Navigate to action URL if provided
    if (notification.actionUrl) {
      setIsOpen(false);
      onNavigate(notification.actionUrl);
    }
  };

  const getNotificationIcon = (type: InAppNotification['type'], priority: InAppNotification['priority']) => {
    const iconClass = `h-4 w-4 ${
      priority === 'urgent' ? 'text-red-500' :
      priority === 'high' ? 'text-orange-500' :
      priority === 'medium' ? 'text-blue-500' :
      'text-gray-500'
    }`;

    switch (type) {
      case 'job_alert':
        return <Bell className={iconClass} />;
      case 'application_update':
        return <CheckCircle className={iconClass} />;
      case 'quiz_reminder':
        return <Clock className={iconClass} />;
      case 'achievement':
        return <Star className={iconClass} />;
      case 'system':
        return <Info className={iconClass} />;
      default:
        return <Bell className={iconClass} />;
    }
  };

  const getPriorityColor = (priority: InAppNotification['priority']) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'low':
      default:
        return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return date.toLocaleDateString();
  };

  // Filter out archived notifications for display
  const displayNotifications = notifications.filter(n => !n.archived);

  // Notification content component (used in both popover and inline modes)
  const notificationContent = (
    <div className={variant === 'inline' ? 'h-full flex flex-col' : ''}>
      {/* Header */}
      <div className={`p-4 border-b border-neutral-200 ${variant === 'inline' ? 'pr-12' : ''}`}>
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-neutral-900">Notifications</h3>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleMarkAllAsRead}
                className="text-xs text-neutral-600 hover:text-neutral-900"
              >
                <CheckCheck className="h-3 w-3 mr-1" />
                Mark all read
              </Button>
            )}
          </div>
        </div>
        
        {/* Filter toggle */}
        <div className="flex items-center gap-2 mt-2">
          <Button
            variant={showOnlyUnread ? "ghost" : "secondary"}
            size="sm"
            onClick={() => setShowOnlyUnread(false)}
            className="text-xs"
          >
            All
          </Button>
          <Button
            variant={showOnlyUnread ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setShowOnlyUnread(true)}
            className="text-xs"
          >
            Unread ({unreadCount})
          </Button>
        </div>
      </div>

      {/* Notifications List */}
      <ScrollArea className={variant === 'inline' ? 'flex-1' : 'h-96'}>
        {displayNotifications.length === 0 ? (
          <div className="p-8 text-center">
            <Bell className="h-12 w-12 text-neutral-300 mx-auto mb-3" />
            <p className="text-neutral-500 text-sm">
              {showOnlyUnread ? 'No unread notifications' : 'No notifications yet'}
            </p>
            <p className="text-neutral-400 text-xs mt-1">
              {showOnlyUnread 
                ? 'Check back later for new updates'
                : 'We\'ll notify you about job matches, quiz reminders, and more'
              }
            </p>
          </div>
        ) : (
          <div className="divide-y divide-neutral-100">
            {displayNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 hover:bg-neutral-50 transition-colors ${
                  !notification.read ? 'bg-blue-50/50' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    {getNotificationIcon(notification.type, notification.priority)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p className={`text-sm ${!notification.read ? 'font-medium text-neutral-900' : 'text-neutral-700'}`}>
                          {notification.title}
                        </p>
                        <p className="text-xs text-neutral-500 mt-1 line-clamp-2">
                          {notification.message}
                        </p>
                        
                        {/* Action button */}
                        {notification.actionUrl && notification.actionText && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleNotificationClick(notification)}
                            className="mt-2 h-7 text-xs text-brand-primary hover:text-brand-primary-hover hover:bg-blue-50 bg-[rgba(106,134,227,0.08)]"
                          >
                            {notification.actionText}
                            <ExternalLink className="h-3 w-3 ml-1" />
                          </Button>
                        )}
                      </div>
                      
                      {/* Actions */}
                      <div className="flex items-center gap-1 ml-2">
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleMarkAsRead(notification.id)}
                            className="h-6 w-6 p-0 text-neutral-400 hover:text-neutral-600"
                            title="Mark as read"
                          >
                            <CheckCircle className="h-3 w-3" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleArchive(notification.id)}
                          className="h-6 w-6 p-0 text-neutral-400 hover:text-neutral-600"
                          title="Archive"
                        >
                          <Archive className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    
                    {/* Metadata */}
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-neutral-400">
                        {formatTimeAgo(notification.createdAt)}
                      </span>
                      
                      {notification.priority !== 'low' && (
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${getPriorityColor(notification.priority)}`}
                        >
                          {notification.priority}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>

      {/* Footer */}
      {displayNotifications.length > 0 && (
        <>
          <Separator />
          <div className="p-3 text-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                if (variant === 'inline') {
                  // For inline mode (mobile), just navigate
                  onNavigate('account-settings');
                } else {
                  // For popover mode, close first then navigate
                  setIsOpen(false);
                  onNavigate('account-settings');
                }
              }}
              className="text-xs text-neutral-600 hover:text-neutral-900"
            >
              Notification Settings
            </Button>
          </div>
        </>
      )}
    </div>
  );

  // Return popover version or inline version based on variant
  if (variant === 'inline') {
    return notificationContent;
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="relative p-2 hover:bg-neutral-100 bg-[rgba(85,85,85,0.12)]"
          aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
        >
          <Bell className="h-5 w-5 text-neutral-600" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-brand-secondary hover:bg-brand-secondary-hover"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      
      <PopoverContent 
        className="w-96 p-0 mr-4" 
        align="end"
        sideOffset={8}
      >
        {notificationContent}
      </PopoverContent>
    </Popover>
  );
}