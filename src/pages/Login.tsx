import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck,
  TrendingUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuthStore } from '@/stores/authStore';
import { toast } from '@/hooks/use-toast';

const features = [
  {
    icon: <TrendingUp className="w-6 h-6" />,
    title: "Real-time Analytics",
    desc: "Monitor your business growth with precision."
  },
  {
    icon: <Sparkles className="w-6 h-6" />,
    title: "AI Optimization",
    desc: "Get smart insights to cut costs effectively."
  },
  {
    icon: <ShieldCheck className="w-6 h-6" />,
    title: "Secure Data",
    desc: "Enterprise-grade security for your business data."
  }
];

const Login = () => {
  const navigate = useNavigate();
  const { login, register, isAuthenticated, role } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("login");

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form state
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      navigate(role === 'admin' ? '/admin' : '/dashboard');
    }
  }, [isAuthenticated, role, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Simulate network delay for UX
      await new Promise(resolve => setTimeout(resolve, 800));
      const { error } = await login(loginEmail, loginPassword);
      if (error) {
        toast({ title: 'Error', description: error, variant: 'destructive' });
      } else {
        toast({ title: 'Welcome back!', description: 'Successfully logged in.' });
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to login.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      const { error } = await register(registerName, registerEmail, registerPassword);
      if (error) {
        toast({ title: 'Error', description: error, variant: 'destructive' });
      } else {
        toast({ title: 'Account created!', description: 'Welcome to Bizness.' });
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to register.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex overflow-hidden">
      
      {/* LEFT PANEL - BRANDING & FEATURES */}
      <div className="hidden lg:flex lg:w-[55%] relative overflow-hidden bg-slate-900 text-white">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-700 to-slate-900 opacity-90" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
        
        {/* Glowing Orbs */}
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-500/30 rounded-full blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-500/30 rounded-full blur-3xl" />

        <div className="relative z-10 flex flex-col justify-between w-full p-12 lg:p-16">
          {/* Logo Area */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3"
          >
            <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-lg">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight">Bizness</span>
          </motion.div>

          {/* Main Content */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="text-5xl font-bold leading-tight mb-6">
                Manage your business <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-purple-200">
                  smarter, not harder.
                </span>
              </h1>
              <p className="text-lg text-blue-100/80 max-w-xl leading-relaxed">
                Join thousands of MSMEs using Bizness to automate inventory, 
                calculate costs with AI, and track profitability in real-time.
              </p>
            </motion.div>

            {/* Feature List */}
            <div className="space-y-4">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + (index * 0.1) }}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors w-fit pr-8"
                >
                  <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-200">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{feature.title}</h3>
                    <p className="text-sm text-blue-100/60">{feature.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Footer Text */}
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-sm text-blue-100/40"
          >
            © 2024 Bizness Platform. All rights reserved.
          </motion.p>
        </div>
      </div>

      {/* RIGHT PANEL - FORMS */}
      <div className="flex-1 flex items-center justify-center p-6 bg-background relative">
        {/* Mobile Background Decoration */}
        <div className="lg:hidden absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-primary/10 to-transparent" />

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-[420px] relative z-10"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden flex flex-col items-center mb-8">
            <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center mb-3">
              <Building2 className="w-6 h-6 text-primary-foreground" />
            </div>
            <h2 className="text-2xl font-bold">Bizness</h2>
          </div>

          <Card className="border-none shadow-2xl bg-card/80 backdrop-blur-xl">
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-2xl font-bold">
                {activeTab === 'login' ? 'Welcome Back' : 'Create Account'}
              </CardTitle>
              <CardDescription>
                {activeTab === 'login' 
                  ? 'Enter your credentials to access your workspace.' 
                  : 'Set up your account to get started with Bizness.'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6 p-1 bg-secondary/50">
                  <TabsTrigger value="login" className="rounded-md transition-all">Login</TabsTrigger>
                  <TabsTrigger value="register" className="rounded-md transition-all">Register</TabsTrigger>
                </TabsList>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {activeTab === 'login' ? (
                      <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Email Address</label>
                          <div className="relative group">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                            <Input
                              type="email"
                              placeholder="name@company.com"
                              value={loginEmail}
                              onChange={(e) => setLoginEmail(e.target.value)}
                              className="pl-10 h-11 bg-background/50 border-input group-hover:border-primary/50 transition-colors"
                              required
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                             <label className="text-sm font-medium">Password</label>
                             <a href="#" className="text-xs text-primary hover:underline">Forgot password?</a>
                          </div>
                          <div className="relative group">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                            <Input
                              type="password"
                              placeholder="••••••••"
                              value={loginPassword}
                              onChange={(e) => setLoginPassword(e.target.value)}
                              className="pl-10 h-11 bg-background/50 border-input group-hover:border-primary/50 transition-colors"
                              required
                            />
                          </div>
                        </div>
                        <Button 
                          type="submit" 
                          variant="hero" 
                          className="w-full h-11 text-base shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all mt-2" 
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <div className="flex items-center gap-2">
                              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              Authenticating...
                            </div>
                          ) : (
                            <>Sign In <ArrowRight className="w-4 h-4 ml-2" /></>
                          )}
                        </Button>
                      </form>
                    ) : (
                      <form onSubmit={handleRegister} className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Full Name</label>
                          <div className="relative group">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                            <Input
                              type="text"
                              placeholder="John Doe"
                              value={registerName}
                              onChange={(e) => setRegisterName(e.target.value)}
                              className="pl-10 h-11 bg-background/50 border-input group-hover:border-primary/50 transition-colors"
                              required
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Email Address</label>
                          <div className="relative group">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                            <Input
                              type="email"
                              placeholder="name@company.com"
                              value={registerEmail}
                              onChange={(e) => setRegisterEmail(e.target.value)}
                              className="pl-10 h-11 bg-background/50 border-input group-hover:border-primary/50 transition-colors"
                              required
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Password</label>
                          <div className="relative group">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                            <Input
                              type="password"
                              placeholder="Create a strong password"
                              value={registerPassword}
                              onChange={(e) => setRegisterPassword(e.target.value)}
                              className="pl-10 h-11 bg-background/50 border-input group-hover:border-primary/50 transition-colors"
                              minLength={6}
                              required
                            />
                          </div>
                          <p className="text-[10px] text-muted-foreground flex items-center gap-1 mt-1">
                            <CheckCircle2 className="w-3 h-3 text-green-500" /> Must be at least 6 characters
                          </p>
                        </div>
                        <Button 
                          type="submit" 
                          variant="hero" 
                          className="w-full h-11 text-base shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all mt-2" 
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <div className="flex items-center gap-2">
                              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              Creating Account...
                            </div>
                          ) : (
                            <>Create Account <ArrowRight className="w-4 h-4 ml-2" /></>
                          )}
                        </Button>
                      </form>
                    )}
                  </motion.div>
                </AnimatePresence>
              </Tabs>

              <div className="mt-6 text-center">
                 <p className="text-xs text-muted-foreground">
                   By continuing, you agree to our <a href="#" className="underline hover:text-primary">Terms of Service</a> and <a href="#" className="underline hover:text-primary">Privacy Policy</a>.
                 </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;