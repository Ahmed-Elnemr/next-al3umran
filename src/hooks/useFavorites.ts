import { useState, useEffect } from 'react';
import { toast } from "react-toastify";

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


  }, []);

  const toggleFavorite = (propertyId: number, isAr: boolean = true) => {
    let newFavorites;
    if (favorites.includes(propertyId)) {
      newFavorites = favorites.filter(id => id !== propertyId);
      toast.info(isAr ? "تم إزالة العقار من المفضلة" : "Property removed from favorites", { autoClose: 2000 });
    } else {
      newFavorites = [...favorites, propertyId];
      toast.success(isAr ? "تم إضافة العقار إلى المفضلة" : "Property added to favorites", { autoClose: 2000 });
    }
    
    setFavorites(newFavorites);
    localStorage.setItem('al3umran_favorites', JSON.stringify(newFavorites));
    
    // Dispatch custom event to sync across tabs/components
    window.dispatchEvent(new Event('favoritesChanged'));
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
    isFavorite: (id: number) => favorites.includes(id),
    mounted
  };
}
