import React from "react";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthObserver } from "~/providers/AuthObserver";
import { Header } from "~/components/features/Header";
import { RequireProfileRedirect } from "~/components/features/Profile/RequireProfileRedirect";
import { GamePage } from "~/components/pages/GamePage";
import { RankingPage } from "~/components/pages/RankingPage";
import { ProfilePage } from "~/components/pages/ProfilePage";
import { ProfileEditPage } from "~/components/pages/ProfileEditPage";

const queryClient = new QueryClient();

const AppLayout: React.FC = () => (
  <>
    <Header />
    <main style={{ flex: 1 }}>
      <RequireProfileRedirect>
        <Outlet />
      </RequireProfileRedirect>
    </main>
  </>
);

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthObserver>
          <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
            <Routes>
              <Route path="/" element={<AppLayout />}>
                <Route index element={<GamePage />} />
                <Route path="ranking" element={<RankingPage />} />
                <Route path="profiles/:uid" element={<ProfilePage />} />
                <Route path="profiles/:uid/edit" element={<ProfileEditPage />} />
              </Route>
            </Routes>
          </div>
        </AuthObserver>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
