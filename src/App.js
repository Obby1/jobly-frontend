import React, { useState, useEffect, createContext } from 'react';
import './css/App.css'
import CompanyList from './components/CompanyList';
import Navbar from './components/Navbar';
import Homepage from './components/Homepage';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';
import JobList from './components/JobList';
import CompanyDetail from './components/CompanyDetail';
import JobDetail from './components/JobDetail';
import ProfileForm from './components/ProfileForm';
import JoblyApi from './api';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import jwt_decode from "jwt-decode"
import useLocalStorage from './hooks/useLocalStorage';
import Protected from './components/Protected';
import 'bootstrap/dist/css/bootstrap.min.css';


const UserContext = createContext(null);

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  // const [token, setToken] = useState(null);
  const [token, setToken] = useLocalStorage('token', null);


  // 5.2.23 save spot here - need to do something after log in. Log in and update state is now working
  useEffect(function loadUserInfo() {
    console.debug("App useEffect loadUserInfo", "token=", token);

    async function getCurrentUser() {
      if (token) {
        try {
          // note: using jsonwebtoken package causing several issues with newer version of CRA. Used jwt-decode package instead
          let { username } = jwt_decode(token);
          // put the token on the Api class so it can use it to call the API.
          JoblyApi.token = token;
          let currentUser = await JoblyApi.getCurrentUser(username);
          setCurrentUser(currentUser);
          // setApplicationIds(new Set(currentUser.applications));
        } catch (err) {
          console.error("App loadUserInfo: problem loading", err);
          setCurrentUser(null);
        }
      }
      // setInfoLoaded(true);
    }

    // set infoLoaded to false while async getCurrentUser runs; once the
    // data is fetched (or even if an error happens!), this will be set back
    // to false to control the spinner.
    // setInfoLoaded(false);
    getCurrentUser();
  }, [token]);



  async function login(formData) {
    const newToken = await JoblyApi.loginUser(formData);
    // console.log(formData)
    setToken(newToken);
    JoblyApi.token = newToken;
  }

  async function signup(formData) {
    const newToken = await JoblyApi.registerUser(formData);
    setToken(newToken);
    JoblyApi.token = newToken;
  }

  function logout() {
    setCurrentUser(null);
    setToken(null);
  }

  function updateCurrentUser(updatedUser) {
    setCurrentUser(updatedUser);
  }

  async function applyForJob(jobId) {
    if (currentUser) {
      await JoblyApi.applyToJob(currentUser.username, jobId);
      const updatedUser = await JoblyApi.getCurrentUser(currentUser.username);
      setCurrentUser(updatedUser);
    }
  }

  return (
    <UserContext.Provider value={{ currentUser, updateCurrentUser, applyForJob }}>
      <div className="App">
        <Router>
          <Navbar currentUser={currentUser} logout={logout} />
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/login" element={<LoginForm login={login} />} />
            <Route path="/signup" element={<SignupForm signup={signup} />} />
            <Route element={<Protected />}>
              <Route path="/companies/:handle" element={<CompanyDetail />} />
              <Route path="/companies" element={<CompanyList />} />
              <Route path="/jobs/:id" element={<JobDetail />} />
              <Route path="/jobs" element={<JobList />} />
              <Route path="/profile" element={<ProfileForm />} />
            </Route>
          </Routes>
        </Router>
      </div>
    </UserContext.Provider>
  );
}

export default App;
export { UserContext };
// Note on using Routes, Route, and Protected component:
// With the updated configuration, the Protected component is now directly used as the parent route element. This means that when any of the child routes (companies, jobs, etc.) are matched, the Protected component will be rendered first.
// The Protected component will check if the user is logged in (using the UserContext). If the user is logged in, it will render its child routes using the <Outlet /> component. If the user is not logged in, it will navigate the user to the /login route.
