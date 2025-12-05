'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  RefreshCw,
  Link as LinkIcon,
  CheckCircle,
  XCircle,
  Settings,
  Unlink,
} from 'lucide-react';
import toast from 'react-hot-toast';

interface SyncStatus {
  connected: boolean;
  configured: boolean;
  propertyId?: string;
  siteUrl?: string;
  lastSync?: string;
}

export function GoogleAnalyticsCard() {
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    connected: false,
    configured: false,
  });
  const [syncing, setSyncing] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [propertyId, setPropertyId] = useState('');
  const [siteUrl, setSiteUrl] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSyncStatus();
  }, []);

  const fetchSyncStatus = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/seo/google/sync', {
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'same-origin',
      });
      
      if (!response.ok) {
        console.error('Failed to fetch sync status:', response.statusText);
        setSyncStatus({ connected: false, configured: false });
        setLoading(false);
        return;
      }
      
      const data = await response.json();
      
      // Ensure data has the expected structure
      const safeData = {
        connected: data?.connected ?? false,
        configured: data?.configured ?? false,
        propertyId: data?.propertyId ?? '',
        siteUrl: data?.siteUrl ?? '',
        lastSync: data?.lastSync ?? undefined
      };
      
      setSyncStatus(safeData);
      setPropertyId(safeData.propertyId);
      setSiteUrl(safeData.siteUrl);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching sync status:', error);
      // Set safe default values on error
      setSyncStatus({ connected: false, configured: false });
      setPropertyId('');
      setSiteUrl('');
      setLoading(false);
    }
  };

  const handleConnectGA = async () => {
    try {
      const response = await fetch('/api/seo/google/auth');
      
      if (!response.ok) {
        toast.error('Failed to initiate Google connection');
        return;
      }
      
      const data = await response.json();
      
      if (data?.authUrl) {
        if (typeof window !== 'undefined') {
          window.location.href = data.authUrl;
        }
      } else {
        toast.error('No authorization URL received');
      }
    } catch (error) {
      console.error('Error connecting Google Analytics:', error);
      toast.error('Failed to connect Google Analytics');
    }
  };

  const handleSaveSettings = async () => {
    console.log('[Client] handleSaveSettings called');
    console.log('[Client] propertyId:', propertyId);
    console.log('[Client] siteUrl:', siteUrl);
    
    if (!propertyId || !siteUrl) {
      console.error('[Client] Missing propertyId or siteUrl');
      toast.error('Please fill in both fields');
      return;
    }

    try {
      console.log('[Client] Sending settings to API...');
      const response = await fetch('/api/seo/google/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ propertyId, siteUrl }),
      });

      console.log('[Client] Response status:', response.status);
      console.log('[Client] Response ok:', response.ok);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('[Client] Error response:', errorData);
        toast.error(errorData?.error || 'Failed to save settings');
        return;
      }

      const data = await response.json();
      console.log('[Client] Success response:', data);
      
      toast.success('Settings saved successfully');
      setShowSettings(false);
      await fetchSyncStatus();
      console.log('[Client] Settings saved and status refreshed');
    } catch (error) {
      console.error('[Client] Error saving settings:', error);
      toast.error('Failed to save settings');
    }
  };

  const handleSyncData = async () => {
    console.log('[Client] handleSyncData called');
    console.log('[Client] propertyId:', propertyId);
    console.log('[Client] siteUrl:', siteUrl);
    
    if (!propertyId || !siteUrl) {
      console.error('[Client] Missing propertyId or siteUrl for sync');
      toast.error('Please configure Property ID and Site URL first');
      setShowSettings(true);
      return;
    }

    try {
      setSyncing(true);
      console.log('[Client] Starting sync...');
      
      const response = await fetch('/api/seo/google/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ propertyId, siteUrl, days: 30 }),
      });

      console.log('[Client] Sync response status:', response.status);
      console.log('[Client] Sync response ok:', response.ok);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('[Client] Sync error response:', errorData);
        
        // Check for permission errors
        const errorMsg = errorData?.error || 'Sync failed';
        if (errorMsg.includes('PERMISSION_DENIED') || errorMsg.includes('permissions') || errorMsg.includes('sufficient permissions')) {
          toast.error('⚠️ Permission Error: The authorized Google account does not have access to this GA4 property. Please verify the Property ID in your settings matches your Google Analytics property, or grant the account access in Google Analytics.', {
            duration: 10000,
          });
        } else {
          toast.error(errorMsg);
        }
        return;
      }

      const data = await response.json();
      console.log('[Client] Sync success response:', data);
      
      // Check for warnings
      if (data.warnings && data.warnings.length > 0) {
        console.log('[Client] Sync completed with warnings:', data.warnings);
        toast.success(data?.message || 'Data synced successfully!', { duration: 3000 });
        // Show warning messages
        data.warnings.forEach((warning: string) => {
          toast.error(warning, { duration: 8000 });
        });
      } else {
        toast.success(data?.message || 'Data synced successfully!');
      }
      
      await fetchSyncStatus();
      console.log('[Client] Sync completed, refreshing page...');
      
      // Trigger a page refresh to show new data
      if (typeof window !== 'undefined') {
        window.location.reload();
      }
    } catch (error) {
      console.error('[Client] Error syncing data:', error);
      toast.error('Failed to sync data');
    } finally {
      setSyncing(false);
    }
  };

  const handleDisconnect = async () => {
    console.log('[Client] handleDisconnect called');
    
    // Confirm with user
    if (!confirm('Are you sure you want to disconnect Google Analytics? This will remove all stored credentials and settings.')) {
      console.log('[Client] Disconnect cancelled by user');
      return;
    }

    try {
      console.log('[Client] Sending disconnect request...');
      const response = await fetch('/api/seo/google/settings', {
        method: 'DELETE',
      });

      console.log('[Client] Disconnect response status:', response.status);
      console.log('[Client] Disconnect response ok:', response.ok);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('[Client] Disconnect error response:', errorData);
        toast.error(errorData?.error || 'Failed to disconnect');
        return;
      }

      const data = await response.json();
      console.log('[Client] Disconnect success response:', data);
      
      toast.success('Google Analytics disconnected successfully');
      
      // Reset local state
      setPropertyId('');
      setSiteUrl('');
      setShowSettings(false);
      
      // Refresh sync status
      await fetchSyncStatus();
      console.log('[Client] Disconnect completed');
    } catch (error) {
      console.error('[Client] Error disconnecting:', error);
      toast.error('Failed to disconnect Google Analytics');
    }
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="text-center text-gray-500">Loading...</div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <LinkIcon className="w-6 h-6 text-blue-600" />
            <h3 className="text-lg font-bold">Google Analytics & Search Console</h3>
            {syncStatus.connected ? (
              <span className="flex items-center gap-1 text-sm text-green-600 font-medium">
                <CheckCircle className="w-4 h-4" />
                Connected
              </span>
            ) : (
              <span className="flex items-center gap-1 text-sm text-gray-500 font-medium">
                <XCircle className="w-4 h-4" />
                Not Connected
              </span>
            )}
          </div>
          <p className="text-sm text-gray-600 mb-4">
            {syncStatus.connected
              ? 'Automatically pull data from Google Analytics and Search Console'
              : 'Connect your Google account to automatically sync SEO data'}
          </p>
          {syncStatus.lastSync && (
            <p className="text-xs text-gray-500">
              Last synced: {new Date(syncStatus.lastSync).toISOString().replace('T', ' ').slice(0, 19)}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          {!syncStatus.connected ? (
            <Button onClick={handleConnectGA} className="bg-blue-600 hover:bg-blue-700">
              <LinkIcon className="w-4 h-4 mr-2" />
              Connect Google
            </Button>
          ) : (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSettings(!showSettings)}
              >
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
              <Button
                onClick={handleSyncData}
                disabled={syncing || !syncStatus.configured}
                className="bg-green-600 hover:bg-green-700"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${syncing ? 'animate-spin' : ''}`} />
                {syncing ? 'Syncing...' : 'Sync Now'}
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDisconnect}
              >
                <Unlink className="w-4 h-4 mr-2" />
                Disconnect
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && syncStatus.connected && (
        <div className="mt-4 pt-4 border-t border-blue-200 space-y-4">
          <div>
            <Label htmlFor="propertyId">GA4 Property ID</Label>
            <Input
              id="propertyId"
              placeholder="123456789"
              value={propertyId}
              onChange={(e) => setPropertyId(e.target.value)}
              className="mt-1"
            />
            <p className="text-xs text-gray-500 mt-1">
              Find this in Google Analytics: Admin → Property Settings → Property ID
            </p>
          </div>
          <div>
            <Label htmlFor="siteUrl">Search Console Site URL</Label>
            <Input
              id="siteUrl"
              placeholder="https://thebasketballfactoryinc.com"
              value={siteUrl}
              onChange={(e) => setSiteUrl(e.target.value)}
              className="mt-1"
            />
            <p className="text-xs text-gray-500 mt-1">
              Find this in Google Search Console (exact URL including https://)
            </p>
          </div>
          <Button onClick={handleSaveSettings} className="w-full">
            Save Settings
          </Button>
        </div>
      )}
    </Card>
  );
}
