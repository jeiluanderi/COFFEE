import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const PageSettingsContext = createContext();
export const usePageSettings = () => useContext(PageSettingsContext);

export const PageSettingsProvider = ({ children }) => {
  const backendUrl = 'http://localhost:3001';

  const [settingsMap, setSettingsMap] = useState({});
  const [isLoadingSettings, setIsLoadingSettings] = useState(true);

  const getAuthHeaders = useCallback(() => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : null;
  }, []);

  const fetchSettings = useCallback(async () => {
    setIsLoadingSettings(true);
    const headers = getAuthHeaders();
    const url = headers
      ? `${backendUrl}/api/admin/page-settings/all`
      : `${backendUrl}/api/page-settings`; // public route

    try {
      const config = headers ? { headers } : {};
      const response = await axios.get(url, config);

      let newSettingsMap = {};
      if (headers) {
        // Admin: array of {id, key, value}
        response.data.forEach(item => {
          newSettingsMap[item.key] = item.value;
        });
      } else {
        // Public: { settings: { key: value } }
        newSettingsMap = response.data.settings;
      }

      setSettingsMap(newSettingsMap);
    } catch (error) {
      console.error('Failed to fetch global page settings:', error);
      setSettingsMap({});
    } finally {
      setIsLoadingSettings(false);
    }
  }, [backendUrl, getAuthHeaders]);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  return (
    <PageSettingsContext.Provider
      value={{ settings: settingsMap, refreshSettings: fetchSettings, isLoading: isLoadingSettings }}
    >
      {children}
    </PageSettingsContext.Provider>
  );
};
