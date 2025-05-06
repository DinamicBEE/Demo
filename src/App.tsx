import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import { ContextProvider } from "./context/ContextProvider";
import ProtectedRoute, { PublicRoute } from "./components/ProtectedRoutes";
import Layout from "./components/Layout";
//import "./App.css";
import routesConfig from "./routes/routesConfig";
import Loading from "./components/Loading";
import ErrorDialog from "@components/ErrorDialog";
const Login = lazy(() => import("./pages/Login/Login.tsx"));

function App() {
  return (
    <ContextProvider>
      <Suspense fallback={<Loading />}>
        <Router>
          <Routes>
            <Route
              path="/"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />

            <Route
              path="/*"
              element={
                <ProtectedRoute allowedRoles={['admin', 'user']}>
                  <Layout />
                </ProtectedRoute>
              }
            >
              {routesConfig.map(
                ({ path, element: Element, roles, wrapper }) => (
                  <Route
                    key={path}
                    path={path.replace("/", "")}
                    element={
                      <ProtectedRoute allowedRoles={roles}>
                        {wrapper ? wrapper(() => <Element />) : <Element />}
                      </ProtectedRoute>
                    }
                  />
                )
              )}
            </Route>
          </Routes>
        </Router>
      </Suspense>
      <ErrorDialog />
    </ContextProvider>
  );
}

export default App;
