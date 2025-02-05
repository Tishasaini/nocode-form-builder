import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FileSpreadsheet, LogOut } from 'lucide-react';
import { supabase } from '../lib/supabase';

export function Layout() {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200">
        <div className="flex flex-col h-full">
          <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-200">
            <FileSpreadsheet className="w-6 h-6 text-indigo-600" />
            <span className="text-xl font-semibold text-gray-900">FormBuilder</span>
          </div>
          
          <nav className="flex-1 p-4 space-y-1">
            <Link
              to="/"
              className="flex items-center gap-2 px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100"
            >
              <LayoutDashboard className="w-5 h-5" />
              Dashboard
            </Link>
          </nav>

          <div className="p-4 border-t border-gray-200">
            <button
              onClick={handleSignOut}
              className="flex items-center w-full gap-2 px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="pl-64">
        <main className="p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}