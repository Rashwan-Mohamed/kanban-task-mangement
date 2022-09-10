import React from 'react'
import { AppContextProvider } from './context'
import Home from './home'
function App() {
  return (
    <AppContextProvider>
      <Home />
    </AppContextProvider>
  )
}

export default App
