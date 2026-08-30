import { useState, useEffect } from 'react';
import { toast } from "react-toastify";
let hasSyncedFavorites = false;

export function useFavorites() {
  const [favorites, setFavorites] = useState<number[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('al3umran_favorites');
    if (saved) {
      try {
        setFavorites(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse favorites', e);
      }
    }

    // Background sync with the server for logged in users
    const hasToken = document.cookie.includes('token=');
    if (hasToken && !hasSyncedFavorites) {
      hasSyncedFavorites = true;
      const syncWithBackend = async () => {
        try {
          const { getFavoritesAction } = await import('../lib/serverActions');
          const locale = window.location.pathname.startsWith('/en') ? 'en' : 'ar';
          const response = await getFavoritesAction(locale);
          if (response?.data && Array.isArray(response.data)) {
            const realIds = response.data.map((item: any) => Number(item.id));
            const currentSaved = localStorage.getItem('al3umran_favorites');
            if (currentSaved !== JSON.stringify(realIds)) {
              setFavorites(realIds);
              localStorage.setItem('al3umran_favorites', JSON.stringify(realIds));
              window.dispatchEvent(new Event('favoritesChanged'));
            }
          }
        } catch (e) {
          hasSyncedFavorites = false; // retry next time if failed
        }
      };
      syncWithBackend();
    }

  }, []);

  const toggleFavorite = async (propertyId: number | string, isAr: boolean = true) => {
    const numericId = Number(propertyId);
    let newFavorites;
    if (favorites.some(id => Number(id) === numericId)) {
      newFavorites = favorites.filter(id => Number(id) !== numericId);
      toast.info(isAr ? "تم إزالة العقار من المفضلة" : "Property removed from favorites", { autoClose: 2000 });
    } else {
      newFavorites = [...favorites, numericId];
      toast.success(isAr ? "تم إضافة العقار إلى المفضلة" : "Property added to favorites", { autoClose: 2000 });
    }
    
    setFavorites(newFavorites);
    localStorage.setItem('al3umran_favorites', JSON.stringify(newFavorites));
    
    // Dispatch custom event to sync across tabs/components
    window.dispatchEvent(new Event('favoritesChanged'));

    // API call in the background
    try {
      const { toggleFavoriteAction } = await import('../lib/serverActions');
      await toggleFavoriteAction(isAr ? 'ar' : 'en', propertyId);
    } catch (e) {
      console.error('Failed to sync favorite with API', e);
    }
  };

  // Sync across tabs or other components in the same window
  useEffect(() => {
    const handleStorageChange = () => {
      const saved = localStorage.getItem('al3umran_favorites');
      if (saved) {
        try {
          setFavorites(JSON.parse(saved));
        } catch (e) {
          console.error(e);
        }
      } else {
        setFavorites([]);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('favoritesChanged', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('favoritesChanged', handleStorageChange);
    };
  }, []);

  return {
    favorites,
    toggleFavorite,
    isFavorite: (id: number | string) => favorites.some(favId => Number(favId) === Number(id)),
    mounted
  };
}
