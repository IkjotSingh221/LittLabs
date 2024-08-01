import React from 'react';
import NavBar from '../Components/Common/SideNavBar/SideNav';

const Layout = ({ children }) => {
  return (
    <div>
      <NavBar />
      <main>
        {children}
      </main>
    </div>
  );
};

export default Layout;
