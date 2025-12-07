import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Building2, 
  ArrowRight, 
  BarChart3, 
  Package, 
  Bot, 
  Shield, 
  CheckCircle2, 
  TrendingUp,
  Menu
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/stores/authStore';
import ThemeToggle from '@/components/ThemeToggle';
import { Card } from '@/components/ui/card';

const features = [
  {
    icon: BarChart3,
    title: 'Real-time Analytics',
    description: 'Monitor pendapatan, pengeluaran, dan margin keuntungan dalam satu dashboard interaktif.',
    color: 'text-blue-500',
    bg: 'bg-blue-500/10'
  },
  {
    icon: Package,
    title: 'Smart Inventory',
    description: 'Kelola stok multi-gudang, lacak HPP, dan dapatkan notifikasi stok menipis otomatis.',
    color: 'text-purple-500',
    bg: 'bg-purple-500/10'
  },
  {
    icon: Bot,
    title: 'AI Assistant',
    description: 'Gunakan AI untuk scan faktur (OCR), rekomendasi harga jual, dan analisis performa.',
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10'
  },
  {
    icon: Shield,
    title: 'Multi-Business',
    description: 'Kelola banyak cabang atau unit bisnis berbeda hanya dengan satu akun terintegrasi.',
    color: 'text-amber-500',
    bg: 'bg-amber-500/10'
  },
];

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated && user) {
      navigate(user.role === 'admin' ? '/admin' : '/dashboard');
    }
  }, [isAuthenticated, user, navigate]);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden selection:bg-primary/20 font-sans">
      
      {/* --- NAVIGATION --- */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border transition-all">
        <div className="container mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-600/20">
              <Building2 className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <span className="text-lg sm:text-xl font-bold tracking-tight">Bizness</span>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />
            <Button 
              variant="hero" 
              size="sm"
              onClick={() => navigate('/login')}
              className="shadow-lg shadow-primary/25 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs sm:text-sm px-4 sm:px-6"
            >
              Get Started
              <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-2" />
            </Button>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="relative pt-28 pb-20 lg:pt-40 lg:pb-48 px-4 sm:px-6 overflow-visible z-10">
        {/* Background Elements (Responsive Blur) */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] sm:w-[600px] lg:w-[1000px] h-[300px] sm:h-[600px] bg-blue-500/20 rounded-full blur-[60px] sm:blur-[120px] -z-10 opacity-50 dark:opacity-20 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[200px] sm:w-[500px] lg:w-[800px] h-[200px] sm:h-[600px] bg-purple-500/20 rounded-full blur-[60px] sm:blur-[120px] -z-10 opacity-50 dark:opacity-20 pointer-events-none" />

        <div className="container mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            {/* Badge */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }} 
              animate={{ opacity: 1, scale: 1 }} 
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/50 border border-border mb-6 backdrop-blur-sm mx-auto"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              <span className="text-[10px] sm:text-xs font-medium text-muted-foreground">New: AI-Powered Pricing Calculator</span>
            </motion.div>
            
            {/* Heading Responsive */}
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-6 leading-tight sm:leading-[1.1] tracking-tight">
              Manage your business <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400">
                with Intelligence.
              </span>
            </h1>
            
            <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed px-2">
              Platform all-in-one untuk UMKM. Kelola inventaris, hitung HPP, dan pantau keuntungan secara real-time dengan bantuan AI.
            </p>
            
            {/* Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 px-4 sm:px-0">
              <Button 
                size="lg" 
                onClick={() => navigate('/login')}
                className="w-full sm:w-auto h-12 px-8 text-base sm:text-lg rounded-full shadow-xl shadow-primary/20 bg-primary hover:bg-primary/90"
              >
                Start Your bizness Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="w-full sm:w-auto h-12 px-8 text-base sm:text-lg rounded-full bg-background/50 backdrop-blur-sm border-2 hover:bg-secondary/80"
              >
                View Demo
              </Button>
            </div>
          </motion.div>

          {/* 3D Dashboard Mockup */}
          <motion.div
            initial={{ opacity: 0, y: 60, rotateX: 10 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 1, delay: 0.2, type: "spring", stiffness: 50 }}
            className="mt-16 sm:mt-20 relative max-w-5xl mx-auto perspective-1000 z-20 px-2 sm:px-4"
          >
            <div className="relative bg-card rounded-xl sm:rounded-2xl border border-border/50 shadow-2xl overflow-hidden aspect-[16/10] sm:aspect-[21/9] transform-gpu">
              {/* Fake UI Header */}
              <div className="h-8 sm:h-12 bg-secondary/50 border-b border-border flex items-center px-4 gap-2">
                <div className="flex gap-1.5">
                   <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-red-400/80" />
                   <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-yellow-400/80" />
                   <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-green-400/80" />
                </div>
                <div className="ml-2 sm:ml-4 h-4 sm:h-6 w-32 sm:w-64 bg-background/50 rounded-md" />
              </div>
              
              {/* Fake UI Body */}
              <div className="p-4 sm:p-6 bg-gradient-to-b from-background/50 to-background h-full grid grid-cols-12 gap-4 sm:gap-6">
                {/* Sidebar (Hidden on Mobile) */}
                <div className="hidden md:block col-span-2 space-y-3">
                   {[1,2,3,4,5].map(i => (
                     <div key={i} className="h-8 w-full bg-secondary/50 rounded-lg" />
                   ))}
                </div>
                
                {/* Main Content */}
                <div className="col-span-12 md:col-span-10 space-y-4 sm:space-y-6">
                   {/* Stats Row */}
                   <div className="grid grid-cols-3 gap-2 sm:gap-4">
                      {[
                        { label: 'Revenue', val: 'Rp 45M', color: 'bg-blue-500/10 text-blue-500' },
                        { label: 'Profit', val: '+24%', color: 'bg-green-500/10 text-green-500' },
                        { label: 'Orders', val: '1,203', color: 'bg-purple-500/10 text-purple-500' }
                      ].map((stat, i) => (
                        <div key={i} className="p-2 sm:p-4 rounded-lg sm:rounded-xl bg-card border border-border shadow-sm flex flex-col justify-center">
                           <div className="h-3 sm:h-4 w-12 sm:w-20 bg-secondary rounded mb-1 sm:mb-2" />
                           <div className="h-5 sm:h-8 w-16 sm:w-32 bg-foreground/10 rounded" />
                        </div>
                      ))}
                   </div>
                   {/* Chart Area */}
                   <div className="h-32 sm:h-64 rounded-lg sm:rounded-xl bg-card border border-border shadow-sm p-3 sm:p-4 flex items-end justify-between gap-1 sm:gap-2">
                      {[40, 60, 45, 70, 50, 80, 65, 85, 90, 75, 60, 95].map((h, i) => (
                        <motion.div 
                          key={i}
                          initial={{ height: 0 }}
                          animate={{ height: `${h}%` }}
                          transition={{ duration: 1, delay: 0.5 + (i * 0.05) }}
                          className="w-full bg-gradient-to-t from-blue-600/20 to-blue-600 rounded-t-sm opacity-80" 
                        />
                      ))}
                   </div>
                </div>
              </div>


              
              {/* Card Sales Growth */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute right-4 top-20 bg-card/90 backdrop-blur-md border border-border p-3 sm:p-4 rounded-xl shadow-2xl hidden md:block z-30 max-w-[180px]"
              >
                 <div className="flex items-center gap-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                       <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                    </div>
                    <div>
                       <p className="text-[10px] sm:text-xs text-muted-foreground">Sales Growth</p>
                       <p className="font-bold text-sm sm:text-lg">+12.5%</p>
                    </div>
                 </div>
              </motion.div>

              {/* Card AI Insight */}
               <motion.div 
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute left-4 bottom-12 bg-card/90 backdrop-blur-md border border-border p-3 sm:p-4 rounded-xl shadow-2xl hidden md:block z-30 max-w-[180px]"
              >
                 <div className="flex items-center gap-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                       <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                    </div>
                    <div>
                       <p className="text-[10px] sm:text-xs text-muted-foreground">AI Insight</p>
                       <p className="font-bold text-xs sm:text-sm">Stock Optimized</p>
                    </div>
                 </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- FEATURES SECTION --- */}
      <section className="py-16 sm:py-24 bg-secondary/30 relative z-0 mt-8 sm:mt-12 lg:-mt-24">
        <div className="container mx-auto px-4 sm:px-6 pt-0 lg:pt-32">
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Everything you need to <span className="text-primary">scale up</span>
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground px-4">
              Fitur lengkap yang didesain khusus untuk kebutuhan UMKM modern. Hemat waktu, kurangi biaya, dan tingkatkan keuntungan.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full p-6 hover:shadow-lg hover:border-primary/30 transition-all duration-300 group bg-card/50 backdrop-blur-sm">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ${feature.bg}`}>
                    <feature.icon className={`w-6 h-6 ${feature.color}`} />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- STATS / TRUST --- */}
      <section className="py-16 sm:py-20 border-y border-border/50 bg-background/50">
        <div className="container mx-auto px-4">
           <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { label: 'Active Users', value: '10k+' },
                { label: 'Transactions', value: 'Rp 500M+' },
                { label: 'Countries', value: '5+' },
                { label: 'Uptime', value: '99.9%' },
              ].map((stat, i) => (
                <div key={i}>
                   <h4 className="text-3xl sm:text-4xl font-bold mb-2 text-foreground">{stat.value}</h4>
                   <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* --- CTA SECTION --- */}
      <section className="py-20 sm:py-24 px-4 relative overflow-hidden">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden bg-slate-900 text-white p-8 sm:p-16 text-center shadow-2xl shadow-blue-900/20"
          >
             {/* Abstract Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-700 to-slate-900 opacity-90" />
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
            
            <div className="relative z-10 space-y-6 sm:space-y-8">
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold leading-tight">
                Ready to transform your business?
              </h2>
              <p className="text-base sm:text-lg text-blue-100/80 max-w-xl mx-auto px-2">
                Bergabunglah dengan ribuan pengusaha yang telah beralih ke Bizness. Mulai Bangun Bisnis Anda Hari Ini!
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <Button 
                  size="xl" 
                  onClick={() => navigate('/login')}
                  className="w-full sm:w-auto h-12 sm:h-14 px-8 text-lg bg-white text-indigo-600 hover:bg-blue-50 hover:text-indigo-700 border-none shadow-xl"
                >
                  Get Started Now
                </Button>
                
                <div className="flex items-center gap-2 text-sm text-blue-200">
                   <CheckCircle2 className="w-4 h-4" /> Build your business 
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-8 sm:py-12 px-4 border-t border-border bg-background">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-center items-center gap-6 text-center md:text-left">
 
            <p className="text-xs sm:text-sm text-muted-foreground">
              © 2025 Bizness. Made with ❤️ for MSMEs.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;