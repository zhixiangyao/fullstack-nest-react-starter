import { Router } from '~/router'

import { AntApp } from './components/AntApp'
import { AntConfigProvider } from './components/AntConfigProvider'

import '~/styles/global.css'

function App() {
  return (
    <AntConfigProvider>
      <AntApp>
        <Router />
      </AntApp>
    </AntConfigProvider>
  )
}

export { App }
