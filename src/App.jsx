import { ReduxProvider } from "./components/redux-provider"
import { ProjectDashboard } from "./components/project-dashboard"

import './App.css'

function App() {
  return (
    <ReduxProvider>
      <ProjectDashboard />
    </ReduxProvider>
  )
}

export default App
