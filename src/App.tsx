import { CCPProvider } from './ccp/CCPProvider';
import { Workspace } from './pages/Workspace';

export default function App() {
  return (
    <CCPProvider>
      <Workspace />
    </CCPProvider>
  );
}
