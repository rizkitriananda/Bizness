import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Plus, Building2, LogOut, ChevronRight, Store, Package, 
  Coffee, Shirt, Laptop, Heart, Home, Wrench, Palette, BookOpen, 
  Briefcase, Utensils, Zap, ShoppingBag, AlertTriangle 
} from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuthStore } from '@/stores/authStore';
import { useBusinessStore } from '@/stores/businessStore';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

// --- Configuration ---

const businessCategories = [
  'Food & Beverage',
  'Fashion & Apparel',
  'Electronics',
  'Health & Beauty',
  'Home & Garden',
  'Services',
  'Other',
];

// Mapping string names to Lucide Components
const iconMap: Record<string, any> = {
  Store: Store,
  Coffee: Coffee,
  Utensils: Utensils,
  Shirt: Shirt,
  ShoppingBag: ShoppingBag,
  Laptop: Laptop,
  Zap: Zap,
  Heart: Heart,
  Home: Home,
  Wrench: Wrench,
  Palette: Palette,
  BookOpen: BookOpen,
  Briefcase: Briefcase,
};

const availableIcons = Object.keys(iconMap);

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, profile, logout } = useAuthStore();
  const { businesses, fetchBusinesses, addBusiness, setCurrentBusiness, isLoading } = useBusinessStore();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newBusinessName, setNewBusinessName] = useState('');
  const [newBusinessCategory, setNewBusinessCategory] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('Store');

  useEffect(() => {
    fetchBusinesses();
  }, [fetchBusinesses]);

  const handleCreateBusiness = async () => {
    if (!newBusinessName || !newBusinessCategory) {
      toast({ title: 'Error', description: 'Please fill in all fields.', variant: 'destructive' });
      return;
    }

    if (!user) {
      toast({ title: 'Error', description: 'You must be logged in.', variant: 'destructive' });
      return;
    }

    const newBusiness = await addBusiness({
      name: newBusinessName,
      category: newBusinessCategory,
      logo: selectedIcon, 
      owner_id: user.id,
    });

    if (newBusiness) {
      toast({ title: 'Success', description: 'Business created successfully!' });
      setIsDialogOpen(false);
      setNewBusinessName('');
      setNewBusinessCategory('');
      setSelectedIcon('Store');
    }
  };

  const handleSelectBusiness = (business: typeof businesses[0]) => {
    setCurrentBusiness(business);
    navigate(`/workspace/${business.id}`);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  // --- Stats Calculation ---
  
  // 1. Total Produk (Accumulated)
  const totalProducts = businesses.reduce((acc, b) => acc + (b.products?.length || 0), 0);

  // 2. Low Stock (Global across all businesses)
  const lowStockCount = businesses.reduce((acc, b) => {
     const lowStock = (b.products || []).filter(p => Number(p.stock) < 10).length;
     return acc + lowStock;
  }, 0);

  const displayName = profile?.name || user?.email?.split('@')[0] || 'User';
  const displayAvatar = profile?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`;

  const renderIcon = (iconName: string, className?: string) => {
    const IconComponent = iconMap[iconName] || Store;
    return <IconComponent className={className} />;
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden font-sans">
      {/* Background Decoration */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />

      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border transition-all">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/20">
              <Building2 className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold tracking-tight">Bizness</span>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <div className="hidden sm:flex items-center gap-3 pl-4 border-l border-border">
              <div className="text-right hidden md:block">
                <p className="text-sm font-semibold leading-none">{displayName}</p>
                <p className="text-xs text-muted-foreground mt-1">{user?.email}</p>
              </div>
              <img
                src={displayAvatar}
                alt={displayName}
                className="w-9 h-9 rounded-full border-2 border-background ring-2 ring-border"
              />
            </div>
            <Button variant="ghost" size="icon" onClick={handleLogout} className="text-muted-foreground hover:text-destructive">
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 relative z-10">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
              Welcome back, {displayName.split(' ')[0]}
            </h1>
            <p className="text-muted-foreground text-lg">Here's an overview of your business portfolio.</p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all">
                <Plus className="w-5 h-5 mr-2" />
                New Business
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Create New Business</DialogTitle>
                <DialogDescription>Setup your new workspace identity.</DialogDescription>
              </DialogHeader>
              <div className="space-y-6 mt-4">
                {/* Icon Selection */}
                <div>
                  <label className="text-sm font-medium mb-3 block">Choose an Icon</label>
                  <div className="grid grid-cols-6 gap-2 max-h-[200px] overflow-y-auto pr-2">
                    {availableIcons.map((iconKey) => (
                      <button
                        key={iconKey}
                        type="button"
                        onClick={() => setSelectedIcon(iconKey)}
                        className={cn(
                          "aspect-square rounded-xl flex items-center justify-center transition-all border",
                          selectedIcon === iconKey
                            ? "bg-primary text-primary-foreground border-primary ring-2 ring-primary/20 ring-offset-2"
                            : "bg-secondary/50 hover:bg-secondary border-transparent hover:border-border text-muted-foreground"
                        )}
                      >
                        {renderIcon(iconKey, "w-5 h-5")}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Business Name</label>
                    <Input
                      placeholder="e.g., Kopi Senja"
                      value={newBusinessName}
                      onChange={(e) => setNewBusinessName(e.target.value)}
                      className="h-11"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Category</label>
                    <Select value={newBusinessCategory} onValueChange={setNewBusinessCategory}>
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Select business type" />
                      </SelectTrigger>
                      <SelectContent>
                        {businessCategories.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button onClick={handleCreateBusiness} className="w-full h-11 text-base" variant="default">
                  Create Workspace
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </motion.div>

        {/* Updated Stats Overview: Total Business, Products, Low Stock */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {[
            { 
              label: 'Total Businesses', 
              value: businesses.length, 
              icon: Store, 
              color: 'text-blue-500', 
              bg: 'bg-blue-500/10',
              desc: 'Active workspaces' 
            },
            { 
              label: 'Total Products', 
              value: totalProducts, 
              icon: Package, 
              color: 'text-emerald-500', 
              bg: 'bg-emerald-500/10',
              desc: 'Across all businesses'
            },
            { 
              label: 'Low Stock Alerts', 
              value: lowStockCount, 
              icon: AlertTriangle, 
              color: lowStockCount > 0 ? 'text-amber-500' : 'text-slate-500', 
              bg: lowStockCount > 0 ? 'bg-amber-500/10' : 'bg-slate-500/10',
              desc: 'Items need restock'
            },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + (i * 0.1) }}
            >
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card transition-colors h-full">
                <CardContent className="p-6 flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold tracking-tight mb-1">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.desc}</p>
                  </div>
                  <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shrink-0", stat.bg)}>
                    <stat.icon className={cn("w-6 h-6", stat.color)} />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Business List */}
        <div>
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            Your Workspaces
            <span className="text-xs font-normal text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
              {businesses.length}
            </span>
          </h2>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-40 rounded-xl bg-muted/50 animate-pulse" />
              ))}
            </div>
          ) : businesses.length === 0 ? (
            <Card className="border-dashed border-2 p-12 text-center bg-transparent">
              <div className="w-16 h-16 rounded-full bg-secondary/50 flex items-center justify-center mx-auto mb-4">
                <Store className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No businesses yet</h3>
              <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                Create your first business workspace to start tracking sales, inventory, and more.
              </p>
              <Button onClick={() => setIsDialogOpen(true)}>
                Start Your First Business
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {businesses.map((business, index) => (
                <motion.div
                  key={business.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div
                    onClick={() => handleSelectBusiness(business)}
                    className="group relative bg-card hover:bg-accent/5 rounded-xl border border-border/50 p-1 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer h-full"
                  >
                    <div className="bg-card border border-border/50 rounded-lg p-5 h-full relative z-10 overflow-hidden flex flex-col justify-between">
                      {/* Decorative gradient blob */}
                      <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-all" />

                      <div>
                        <div className="flex items-start justify-between mb-6">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-300">
                            {renderIcon(business.logo, "w-6 h-6")}
                          </div>
                          <div className="w-8 h-8 rounded-full bg-secondary/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <ChevronRight className="w-4 h-4 text-muted-foreground" />
                          </div>
                        </div>

                        <div>
                          <h3 className="font-bold text-lg mb-1 truncate pr-4">{business.name}</h3>
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-secondary text-muted-foreground border border-border/50">
                            {business.category}
                          </span>
                        </div>
                      </div>

                      <div className="mt-6 pt-4 border-t border-border/50 flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <Package className="w-4 h-4" />
                          <span className="font-medium text-foreground">{business.products?.length || 0}</span> Products
                        </div>
                        {/* Status Indicator based on products count */}
                        <div className={`flex items-center gap-1.5 ${business.products?.length > 0 ? 'text-emerald-500' : 'text-amber-500'}`}>
                           <div className={`w-2 h-2 rounded-full ${business.products?.length > 0 ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                           <span className="text-xs">{business.products?.length > 0 ? 'Active' : 'Setup'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;