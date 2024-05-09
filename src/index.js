import React from 'react';
import ReactDOM from 'react-dom';
import './styles/main.css'; // Import custom CSS for better separation of concerns
import App from './components/App'; // Import the root component

// Optional service worker registration (consider pros and cons for your application)
if (process.env.NODE_ENV === 'production') {
  serviceWorker.register();
} else {
  serviceWorker.unregister();
}

const rootElement = document.getElementById('root');
ReactDOM.render(<App />, rootElement);
