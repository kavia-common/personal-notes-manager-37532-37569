import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import { getSupabaseClient, isSupabaseConfigured } from './lib/supabaseClient';

// PUBLIC_INTERFACE
function App() {
  const [theme, setTheme] = useState('light');
  const [sbStatus, setSbStatus] = useState('checking');

  // Effect to apply theme to document element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Check Supabase configuration once on mount
  useEffect(() => {
    setSbStatus(isSupabaseConfigured() ? 'configured' : 'not-configured');
  }, []);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  // PUBLIC_INTERFACE
  const testSupabase = async () => {
    try {
      const supabase = getSupabaseClient();
      // A minimal no-op request to validate client works; calls auth.getSession which doesn't require schema.
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;
      alert('Supabase client OK. Session present: ' + Boolean(data?.session));
    } catch (e) {
      alert('Supabase error: ' + e.message);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <button 
          className="theme-toggle" 
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <p>
          Current theme: <strong>{theme}</strong>
        </p>
        <p>
          Supabase: <strong>{sbStatus}</strong>
        </p>
        <div style={{ marginTop: 12 }}>
          <button className="theme-toggle" onClick={testSupabase} aria-label="Test Supabase">
            🔌 Test Supabase
          </button>
        </div>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
