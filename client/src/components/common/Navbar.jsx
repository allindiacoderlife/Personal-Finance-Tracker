import { useAuth } from '../../context/AuthContext';
import { Wallet, LogOut, Plus, User } from 'lucide-react';

const Navbar = ({ onOpenAddModal }) => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white border-b border-slate-200/80 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center shadow-md shadow-indigo-100">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <span className="text-lg font-black text-slate-800 tracking-tight">FinTrack</span>
              <span className="hidden sm:inline-block ml-2 px-2 py-0.5 text-[10px] font-semibold bg-indigo-50 text-indigo-700 rounded-full border border-indigo-100">
                PRO
              </span>
            </div>
          </div>

          {/* Right Action buttons */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            <button
              onClick={onOpenAddModal}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-sm font-semibold rounded-xl shadow-xs shadow-indigo-200 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Transaction</span>
            </button>

            <div className="h-6 w-px bg-slate-200 hidden sm:block" />

            <div className="flex items-center space-x-3">
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-xs font-semibold text-slate-800">{user?.name}</span>
                <span className="text-[11px] text-slate-400">{user?.email}</span>
              </div>
              <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 font-bold text-sm">
                {user?.name ? user.name.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
              </div>
              <button
                onClick={() => logout(true)}
                title="Logout"
                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

