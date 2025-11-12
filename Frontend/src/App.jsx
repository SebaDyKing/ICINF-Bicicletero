import React from "react"
import AppRoutes from "./routes/main.routes.jsx"
import {BrowserRouter} from 'react-router-dom'
function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}

export default App;

