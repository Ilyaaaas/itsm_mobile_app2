import React, { useState, useEffect } from "react";
import * as Font from "expo-font";
import { Spinner, Text } from "native-base";

function Main({ children, isLoaded = true }) {
  const [loading, setLoading] = useState(true);
  const [activeToken, setToken] = useState('');

  useEffect(() => {
    loadFonts();
  }, []);

  async function loadFonts() {
    await Font.loadAsync({
      Roboto: require("../assets/fonts/Roboto.ttf"),
      Roboto_medium: require("../assets/fonts/Roboto_medium.ttf"),
      Ionicons: require("../assets/fonts/Ionicons.ttf")
    });
    setLoading(false);
  }

  return (
    <>
      {loading && isLoaded ? (
        <Spinner />
      ) : (
        <>
          {children}
        </>
      )}
    </>
  );
}

export default Main;
