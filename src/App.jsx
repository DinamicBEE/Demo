import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ContextProvider } from './context/ContextProvider';
import { PublicRoute } from './components/ProtectedRoutes';
import Login from './pages/Login/Login';
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

          <Route path="/home" element={<Home />} />

          <Route path="/emptyPage" element={<EmptyPage />}  />

        </Routes>
      </Router>
    </ContextProvider>
  )
}

export default App
