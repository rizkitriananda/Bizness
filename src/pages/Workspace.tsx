import { useEffect, useState } from 'react';
import { useParams, useNavigate, Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Package,
  Calculator,
  FolderOpen,
  Bot,
  BarChart3,
  Settings,
  ChevronLeft,
  Bell,
  Menu,
  X,
  ListTodo,
  Archive,
  ScanText,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useBusinessStore } from '@/stores/businessStore';
import { useAuthStore } from '@/stores/authStore';
import { NavLink } from '@/components/NavLink';
import { cn } from '@/lib/utils';
import ThemeToggle from '@/components/ThemeToggle';

const navItems = [
  { icon: LayoutDashboard, label: 'Overview', path: '' },
  { icon: Package, label: 'Products', path: 'products' },
  { icon: Calculator, label: 'HPP Calculator', path: 'calculator' },
  //{ icon: FolderOpen, label: 'Files', path: 'files' },
  { icon: ScanText, label: 'OCR Scanner', path: 'ocr' },
  { icon: Bot, label: 'AI Tools', path: 'ai' },
  //{ icon: BarChart3, label: 'Reports', path: 'reports' },
  { icon: ListTodo, label: 'To Do List', path: 'todo' },
  { icon: Archive, label: 'Stock', path: 'stock' },
];

const Workspace = () => {
  const { businessId } = useParams();
  const navigate = useNavigate();
  const { fetchBusinessDetails, currentBusiness } = useBusinessStore();
  const { profile, user } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (businessId) {
      fetchBusinessDetails(businessId);
    }
  }, [businessId, fetchBusinessDetails]);

  const displayName = profile?.name || user?.email?.split('@')[0] || 'User';
  const displayAvatar = profile?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`;

  if (!currentBusiness) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: sidebarOpen ? 260 : 80 }}
        className="hidden lg:flex flex-col bg-sidebar border-r border-sidebar-border"
      >
        <div className="p-4 flex items-center gap-3">
          <button
            onClick={() => navigate('/dashboard')}
            className="w-10 h-10 rounded-xl bg-sidebar-accent flex items-center justify-center hover:bg-sidebar-accent/80 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-sidebar-foreground" />
          </button>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex-1 min-w-0"
            >
              <h2 className="font-semibold text-sidebar-foreground truncate">{currentBusiness.name}</h2>
              <p className="text-xs text-sidebar-foreground/60 truncate">{currentBusiness.category}</p>
            </motion.div>
          )}
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={`/workspace/${businessId}/${item.path}`}
              end={item.path === ''}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors',
                !sidebarOpen && 'justify-center'
              )}
              activeClassName="bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary hover:text-sidebar-primary-foreground"
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-sidebar-border">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors"
          >
            <Settings className="w-4 h-4" />
            {sidebarOpen && <span className="text-sm">Collapse</span>}
          </button>
        </div>
      </motion.aside>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-background/80 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)}>
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            className="w-72 h-full bg-sidebar"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 flex items-center justify-between border-b border-sidebar-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-sidebar-primary flex items-center justify-center text-xl">
                  {currentBusiness.logo}
                </div>
                <div>
                  <h2 className="font-semibold text-sidebar-foreground">{currentBusiness.name}</h2>
                  <p className="text-xs text-sidebar-foreground/60">{currentBusiness.category}</p>
                </div>
              </div>
              <button onClick={() => setMobileMenuOpen(false)} className="text-sidebar-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="p-3 space-y-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={`/workspace/${businessId}/${item.path}`}
                  end={item.path === ''}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors"
                  activeClassName="bg-sidebar-primary text-sidebar-primary-foreground"
                >
                  <item.icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{item.label}</span>
                </NavLink>
              ))}
            </nav>
          </motion.aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="sticky top-0 z-40 h-16 bg-card/80 backdrop-blur-lg border-b border-border flex items-center px-4 gap-4">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden w-10 h-10 rounded-lg bg-secondary flex items-center justify-center"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex-1" />

          <ThemeToggle />

          <Button variant="ghost" size="icon" className="relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full" />
          </Button>

          <div className="flex items-center gap-3">
            <img
              src={displayAvatar}
              alt={displayName}
              className="w-8 h-8 rounded-full"
            />
            <span className="hidden sm:block text-sm font-medium">{displayName}</span>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Workspace;
