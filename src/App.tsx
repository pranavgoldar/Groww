import { StoreProvider } from './state/store'
import { AppShell } from './components/AppShell'

export default function App() {
  return (
    <StoreProvider>
      <AppShell />
    </StoreProvider>
  )
}
