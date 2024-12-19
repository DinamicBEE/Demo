import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import Login from './pages/Login/Login';
import { ContextProvider } from './context/ContextProvider';

function App() {
  return (
    <ContextProvider>
      <Router>
        <Routes>
          <Route path='/' element={<Login/>} />
        </Routes>
      </Router>
    </ContextProvider>
  )
}

export default App
