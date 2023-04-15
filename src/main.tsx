import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import App from './App'
import './index.css'
import store from './store'
import { NotificationProvider } from './components/notification'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <NotificationProvider>
      <Provider store={store}>
        <App />
      </Provider>
    </NotificationProvider>
  </React.StrictMode>,
)
