import React from 'react';
import App from './App.jsx';
import { hydrateRoot } from 'react-dom/client';
import ReactDOM from 'react-dom/client';
// hydrateRoot(document.getElementById('root'), <App />);

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
  // <UserProvider>
  //   <SessionProvider>
  //     <SubscriberProvider>
  <App />
  //     </SubscriberProvider>
  //   </SessionProvider>
  // </UserProvider>
  // </React.StrictMode>
);
