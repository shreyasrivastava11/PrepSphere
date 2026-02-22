import React from 'react';
import { useTheme } from '../context/ThemeContext';
import Navbar from './Navbar';

export default function Layout({ children }) {
  const { isDark } = useTheme();
  const shellThemeClass = isDark ? 'theme-auth-dark' : 'theme-auth-light';

  return (
    <div className={`app-shell ${shellThemeClass}`}>
      <Navbar />
      <main className="container app-main app-main-home">
        <div className="app-main-content">{children}</div>
      </main>
    </div>
  );
}
