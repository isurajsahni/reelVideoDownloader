/**
 * Client-side download history (last N items) stored in localStorage.
 */
import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'reel-download-history';
const MAX_ITEMS = 50;

function loadHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveHistory(list) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list.slice(0, MAX_ITEMS)));
  } catch (_) {}
}

export function useDownloadHistory() {
  const [history, setHistory] = useState(loadHistory);

  useEffect(() => {
    setHistory(loadHistory());
  }, []);

  const add = useCallback((item) => {
    const entry = {
      url: item.url,
      title: item.title || 'Reel',
      platform: item.platform,
      type: item.type, // 'video' | 'audio'
      at: Date.now(),
    };
    setHistory((prev) => {
      const next = [entry, ...prev.filter((h) => h.url !== item.url)].slice(0, MAX_ITEMS);
      saveHistory(next);
      return next;
    });
  }, []);

  const clear = useCallback(() => {
    setHistory([]);
    saveHistory([]);
  }, []);

  return { history, add, clear };
}
