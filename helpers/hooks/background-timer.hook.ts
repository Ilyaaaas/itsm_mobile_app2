import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useMemo, useState } from 'react';

interface BackgroundTimerParams {
  timer: number;
}
export const useBackgroundTimer = (params: BackgroundTimerParams) => {
  const [timer, setTimer] = useState(params.timer);

  const uniqTimerId = useMemo(
    () => '_' + Math.random().toString(36).substr(2, 9),
    []
  );
  useEffect(() => {
    let timerInstance: number;
    if (timer > 0) {
      AsyncStorage.setItem(uniqTimerId, new Date().getTime().toString()).then(
        () => {
          timerInstance = setTimeout(async () => {
            const storageUnixTime = Math.floor(
              parseInt((await AsyncStorage.getItem(uniqTimerId)) ?? '0', 10) /
                1000
            );
            const currentTime = Math.floor(new Date().getTime() / 1000);

            setTimer(params.timer - (currentTime - storageUnixTime));
          }, 1000);
        }
      );
    }
    return () => clearTimeout(timerInstance);
  }, [timer]);

  return [timer, setTimer];
};
