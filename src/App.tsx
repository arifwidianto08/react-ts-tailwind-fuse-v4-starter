import React from "react";
import { Routes } from "./views/screens";
import { SWRConfig } from "swr";
import { Api } from "./config/api";

function App() {
  return (
    <SWRConfig
      value={{
        fetcher: (url) =>
          Api.get(url)
            .then((value) => value.data)
            .catch((error) => error),
        revalidateOnFocus: true,
        suspense: true,
      }}
    >
      <Routes />
    </SWRConfig>
  );
}

export default App;
