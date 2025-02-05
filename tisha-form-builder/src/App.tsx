import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { FormBuilder } from './pages/FormBuilder';
import { FormView } from './pages/FormView';
import { Responses } from './pages/Responses';
import { Auth } from './pages/Auth';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="builder" element={<FormBuilder />} />
          <Route path="builder/:id" element={<FormBuilder />} />
          <Route path="form/:id" element={<FormView />} />
          <Route path="responses/:id" element={<Responses />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;