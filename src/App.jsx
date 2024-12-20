import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ContextProvider } from './context/ContextProvider';
import ProtectedRoute, { PublicRoute } from './components/ProtectedRoutes';
import Login from './pages/Login/Login';
import Layout from './components/Layout';
import Home from './pages/Home/Home';
import EmptyPage from './pages/Empty/EmptyPage';
import './App.css'

function App() {
  return (
    <ContextProvider>
      <Router>
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

            <Route path="home" element={
                <ProtectedRoute allowedRoles={[1,2]}>
                  <Home />
                </ProtectedRoute>  
              } />

            <Route path="emptyPage" element={
                <ProtectedRoute allowedRoles={[]}>
                  <EmptyPage />
                </ProtectedRoute>
              }  />

          </Route>

        </Routes>
      </Router>
    </ContextProvider>
  )
}

export default App
