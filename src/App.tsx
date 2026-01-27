import React, {  } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GamePage } from "./components/pages/game";

const queryClient = new QueryClient();

const App: React.FC = () => {


  return (
    <QueryClientProvider client={queryClient}>
      <GamePage />
    </QueryClientProvider>
  );
};

export default App;
