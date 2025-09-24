import { Route, Routes } from 'react-router-dom';
import EmbedApp from './routes/EmbedApp';
import IntakePage from './routes/IntakePage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<IntakePage />} />
      <Route path="/embed" element={<EmbedApp />} />
    </Routes>
  );
}
