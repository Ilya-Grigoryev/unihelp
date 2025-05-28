import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Search from './pages/Search.'
import Profile from './pages/Profile'
import About from './pages/About'
import DefaultLayout from './layouts/DefaultLayout'
import PrivateRoute from './components/PrivateRoute'

import './App.css'
import { AuthProvider } from './contexts/AuthContext'
import NewPublication from './pages/NewPublication'
import EditPublication from './pages/EditPublication'


function App() {
  
  return (
    <AuthProvider>
     <Routes>
      <Route element={<DefaultLayout />}>

      <Route path='about' element={<About />}/>
      <Route path='search' element={<Search />}/>
      <Route path='login' element={<Login />}/>
      <Route path='signup' element={<Signup />}/>


      <Route element={<PrivateRoute />}>
        <Route index element={<Home />} />
        <Route path="publication/new" element={<NewPublication />} />
        <Route path="publication/:id" element={<EditPublication />} />
        <Route path="profile/:id?" element={<Profile />} />
      </Route>

      </Route>
     </Routes>
     </AuthProvider>
  )
}

export default App
