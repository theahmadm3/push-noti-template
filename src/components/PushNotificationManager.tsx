'use client';

import { useState } from 'react';
import {
  registerServiceWorker,
  subscribeToPushNotifications,
  requestNotificationPermission,
  sendTestNotification,
} from '@/lib/pushNotifications';

export default function PushNotificationManager() {
  // Check if push notifications are supported (computed directly)
  const isSupported = typeof window !== 'undefined' && 
    'serviceWorker' in navigator && 
    'PushManager' in window;
  
  // Get initial permission status
  const initialPermission: NotificationPermission = 
    typeof window !== 'undefined' && 'Notification' in window 
      ? Notification.permission 
      : 'default';
    
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>(initialPermission);
  const [testMessage, setTestMessage] = useState('Hello from Push Notifications!');
  const [status, setStatus] = useState('');

  const handleEnableNotifications = async () => {
    setStatus('Requesting permission...');
    
    // Request notification permission
    const perm = await requestNotificationPermission();
    setPermission(perm);
    
    if (perm !== 'granted') {
      setStatus('Permission denied. Please enable notifications in your browser settings.');
      return;
    }
    
    setStatus('Registering service worker...');
    
    // Register service worker
    const registration = await registerServiceWorker();
    
    if (!registration) {
      setStatus('Failed to register service worker.');
      return;
    }
    
    setStatus('Subscribing to push notifications...');
    
    // Subscribe to push notifications
    const subscription = await subscribeToPushNotifications(registration);
    
    if (subscription) {
      setIsSubscribed(true);
      setStatus('Successfully subscribed to push notifications!');
    } else {
      setStatus('Failed to subscribe to push notifications.');
    }
  };

  const handleSendTestNotification = async () => {
    setStatus('Sending test notification...');
    const success = await sendTestNotification(testMessage);
    
    if (success) {
      setStatus('Test notification sent! Check your notifications.');
    } else {
      setStatus('Failed to send test notification.');
    }
  };

  if (!isSupported) {
    return (
      <div className="w-full max-w-2xl p-6 bg-red-50 border border-red-200 rounded-lg">
        <h2 className="text-xl font-semibold text-red-800 mb-2">
          Push Notifications Not Supported
        </h2>
        <p className="text-red-600">
          Your browser does not support push notifications. Please use a modern browser like Chrome, Firefox, or Edge.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl p-6 bg-white border border-gray-200 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        Push Notifications
      </h2>
      
      <div className="space-y-4">
        {/* Permission Status */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <span className="text-sm font-medium text-gray-700">Permission Status:</span>
          <span className={`text-sm font-semibold ${
            permission === 'granted' ? 'text-green-600' : 
            permission === 'denied' ? 'text-red-600' : 
            'text-yellow-600'
          }`}>
            {permission.toUpperCase()}
          </span>
        </div>

        {/* Subscription Status */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <span className="text-sm font-medium text-gray-700">Subscription Status:</span>
          <span className={`text-sm font-semibold ${
            isSubscribed ? 'text-green-600' : 'text-gray-600'
          }`}>
            {isSubscribed ? 'SUBSCRIBED' : 'NOT SUBSCRIBED'}
          </span>
        </div>

        {/* Enable Notifications Button */}
        {!isSubscribed && (
          <button
            onClick={handleEnableNotifications}
            className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Enable Push Notifications
          </button>
        )}

        {/* Test Notification Section */}
        {isSubscribed && (
          <div className="space-y-3">
            <div>
              <label htmlFor="testMessage" className="block text-sm font-medium text-gray-700 mb-2">
                Test Message:
              </label>
              <input
                id="testMessage"
                type="text"
                value={testMessage}
                onChange={(e) => setTestMessage(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter test message"
              />
            </div>
            <button
              onClick={handleSendTestNotification}
              className="w-full px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
            >
              Send Test Notification
            </button>
          </div>
        )}

        {/* Status Message */}
        {status && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">{status}</p>
          </div>
        )}
      </div>

      {/* Backend Info */}
      <div className="mt-6 p-4 bg-gray-100 rounded-lg">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Backend Information:</h3>
        <p className="text-xs text-gray-600 mb-1">
          <strong>Base URL:</strong> https://fastapi-backend-nt2a.onrender.com
        </p>
        <p className="text-xs text-gray-600 mb-1">
          <strong>Subscribe Endpoint:</strong> POST /subscribe
        </p>
        <p className="text-xs text-gray-600">
          <strong>Notify Endpoint:</strong> GET /notify?message=string
        </p>
      </div>
    </div>
  );
}
