import React from 'react';

import './App.css';
import Sidebar from './components/Sidebar/Sidebar';
import MainContent from './components/MainContent/MainContent';
import Footer from './components/Footer/Footer';

const App = () => {
  return (
    <div className='App'>
      <Sidebar />
      <MainContent />
      <Footer />
    </div>
  );
};

export default App;
