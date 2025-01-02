import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { ContextProvider } from './context/ContextProvider';
import ProtectedRoute, { PublicRoute } from './components/ProtectedRoutes';
import Layout from './components/Layout';
import './App.css'
import routesConfig from './routes/routesConfig';
import Loading from './components/Loading';

const Login = lazy (() => import('./pages/Login/Login'));

function App() {
  return (
    <ContextProvider>
      <Router>
        <Suspense fallback={<Loading />}>
          <Routes>
            
            <Route path='/' element={ 
              <PublicRoute>
                <Login/>
              </PublicRoute> } 
            />

            <Route path='/*' element={
              <ProtectedRoute allowedRoles={[1,2]}>
                <Layout />
              </ProtectedRoute>
            }>
              {
                routesConfig.map(({path, element: Element, roles}) => (
                  <Route
                    key={path}
                    path={path.replace('/','')}
                    element={
                      <ProtectedRoute allowedRoles={roles}>
                        <Element />
                      </ProtectedRoute>
                    }
                  
                  />
                ))
              }

            </Route>

          </Routes>
        </Suspense>
      </Router>
    </ContextProvider>
  )
}

export default App
