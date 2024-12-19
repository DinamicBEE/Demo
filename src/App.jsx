import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import Login from './pages/Login/Login';
import { AuthProvider } from './context/AutContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path='/' element={<Login/>} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
