import React, { createContext, useEffect, useState } from 'react';
import * as Location from 'expo-location';

export const LocationContext = createContext();

export default function LocationProvider({ children }) {
  const [location, setLocation] = useState(null);

  const getLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.warn('Permission denied');
        return;
      }

      let loc = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getLocation();
  }, []);

  return (
    <LocationContext.Provider value={{ location, refreshLocation: getLocation }}>
      {children}
    </LocationContext.Provider>
  );
}
