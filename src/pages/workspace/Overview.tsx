import { motion } from 'framer-motion';
import { 
  Package, 
  AlertTriangle, 
  Coins, 
  ArrowUpRight, 
  CheckCircle2,
  XCircle,
  BarChart3
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useBusinessStore } from '@/stores/businessStore';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';

const Overview = () => {
  const { currentBusiness } = useBusinessStore();

  if (!currentBusiness) return null;

  const products = currentBusiness.products || [];

  // --- 1. LOGIC & CALCULATIONS (Menggunakan data dari Products.tsx) ---
  
  // A. Total Asset Value (Nilai Uang yang mengendap di Gudang)
  // Rumus: Sum(HPP * Stock)
  const totalAssetValue = products.reduce((sum, p) => {
    // Pastikan konversi ke number aman
    const hpp = Number(p.hpp) || 0; 
    const stock = Number(p.stock) || 0;
    return sum + (hpp * stock);
  }, 0);

  // B. Estimasi Potensi Omzet (Jika semua barang terjual)
  const potentialRevenue = products.reduce((sum, p) => {
    const price = Number(p.selling_price) || 0;
    const stock = Number(p.stock) || 0;
    return sum + (price * stock);
  }, 0);

  // C. Status Stok
  const lowStockThreshold = 10;
  const outOfStockItems = products.filter((p) => Number(p.stock) === 0);
  const lowStockItems = products.filter((p) => Number(p.stock) > 0 && Number(p.stock) < lowStockThreshold);
  const goodStockItems = products.filter((p) => Number(p.stock) >= lowStockThreshold);

  // D. Stock Health Score (Persentase barang aman)
  const stockHealth = products.length > 0 
    ? Math.round((goodStockItems.length / products.length) * 100) 
    : 0;

  // --- 2. CHART DATA PREPARATION ---

  // Data Bar Chart: Top 5 Kategori berdasarkan Nilai Aset
  const categoryMap = new Map<string, number>();
  products.forEach((p) => {
    const val = (Number(p.hpp) || 0) * (Number(p.stock) || 0);
    const currentVal = categoryMap.get(p.category) || 0;
    categoryMap.set(p.category, currentVal + val);
  });
  
  const barChartData = Array.from(categoryMap.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value) // Sort descending
    .slice(0, 5); // Top 5 only

  // Data Pie Chart: Komposisi Stok
  const pieChartData = [
    { name: 'Aman', value: goodStockItems.length, color: '#10b981' }, // Emerald
    { name: 'Menipis', value: lowStockItems.length, color: '#f59e0b' }, // Amber
    { name: 'Habis', value: outOfStockItems.length, color: '#ef4444' }, // Red
  ].filter(d => d.value > 0);

  // --- 3. WIDGET STATS ---
  const stats = [
    {
      title: 'Total Asset Value',
      value: `Rp ${(totalAssetValue / 1000000).toFixed(1)}M`,
      desc: 'Modal tertahan di stok',
      icon: Coins,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
    },
    {
      title: 'Potential Revenue',
      value: `Rp ${(potentialRevenue / 1000000).toFixed(1)}M`,
      desc: 'Estimasi nilai jual total',
      icon: BarChart3,
      color: 'text-purple-500',
      bg: 'bg-purple-500/10',
    },
    {
      title: 'Stock Health',
      value: `${stockHealth}%`,
      desc: 'Produk stok aman',
      icon: CheckCircle2,
      color: stockHealth > 70 ? 'text-emerald-500' : 'text-orange-500',
      bg: stockHealth > 70 ? 'bg-emerald-500/10' : 'bg-orange-500/10',
    },
    {
      title: 'Restock Needed',
      value: lowStockItems.length + outOfStockItems.length,
      desc: 'Barang perlu dibeli',
      icon: AlertTriangle,
      color: (lowStockItems.length + outOfStockItems.length) > 0 ? 'text-red-500' : 'text-emerald-500',
      bg: (lowStockItems.length + outOfStockItems.length) > 0 ? 'bg-red-500/10' : 'bg-emerald-500/10',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-1">Inventory Overview</h1>
          <p className="text-muted-foreground">Analisis aset dan kesehatan stok barang Anda.</p>
        </div>
        <div className="text-sm px-3 py-1 bg-secondary rounded-lg border border-border text-muted-foreground">
           Total Item Terdaftar: <span className="font-bold text-foreground">{products.length} SKU</span>
        </div>
      </div>

      {/* 1. Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card variant="stat">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground font-medium">{stat.title}</p>
                    <p className="text-2xl font-bold tracking-tight">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.desc}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-2xl ${stat.bg} flex items-center justify-center`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* 2. Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Chart: Asset Value Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2"
        >
          <Card variant="glass" className="h-full">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Coins className="w-4 h-4 text-primary" />
                Distribusi Nilai Aset per Kategori
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                {barChartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barChartData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                      <XAxis type="number" hide />
                      <YAxis 
                        dataKey="name" 
                        type="category" 
                        width={80}
                        tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} 
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip
                        cursor={{ fill: 'hsl(var(--secondary))', opacity: 0.4 }}
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          borderColor: 'hsl(var(--border))',
                          borderRadius: '8px',
                        }}
                        formatter={(value: number) => [`Rp ${value.toLocaleString()}`, 'Total Aset']}
                      />
                      <Bar 
                        dataKey="value" 
                        fill="hsl(var(--primary))" 
                        radius={[0, 4, 4, 0]} 
                        barSize={32}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
                    Belum ada data produk.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Secondary Chart: Stock Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card variant="glass" className="h-full">
            <CardHeader>
              <CardTitle className="text-lg">Kesehatan Stok</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[200px] w-full">
                {pieChartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieChartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        stroke="none"
                      >
                        {pieChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                         contentStyle={{ borderRadius: '8px', borderColor: 'hsl(var(--border))', backgroundColor: 'hsl(var(--card))' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
                    No data
                  </div>
                )}
              </div>
              <div className="space-y-3 mt-4">
                {pieChartData.map((item) => (
                    <div key={item.name} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                            <span className="text-muted-foreground">{item.name}</span>
                        </div>
                        <span className="font-semibold">{item.value} Item</span>
                    </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* 3. Restock Priority List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card variant="glass">
          <CardHeader>
            <CardTitle className="text-lg flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-orange-500" />
                    Prioritas Belanja (Restock)
                </div>
                { (lowStockItems.length + outOfStockItems.length) > 0 && (
                    <span className="text-xs font-medium bg-red-500/10 text-red-500 px-2 py-1 rounded-full animate-pulse">
                        Urgent Action Needed
                    </span>
                )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {lowStockItems.length === 0 && outOfStockItems.length === 0 ? (
                <div className="text-center py-8">
                    <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
                        <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                    </div>
                    <p className="text-muted-foreground font-medium">Semua stok aman!</p>
                    <p className="text-xs text-muted-foreground">Tidak ada barang yang perlu dibeli saat ini.</p>
                </div>
            ) : (
                <div className="space-y-3">
                {[...outOfStockItems, ...lowStockItems].slice(0, 5).map((product) => (
                    <div key={product.id} className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:bg-secondary/40 transition-colors">
                        <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                Number(product.stock) === 0 ? 'bg-red-500/10 text-red-500' : 'bg-orange-500/10 text-orange-500'
                            }`}>
                                {Number(product.stock) === 0 ? <XCircle className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                            </div>
                            <div>
                                <p className="font-semibold text-sm">{product.name}</p>
                                <p className="text-xs text-muted-foreground">{product.category}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className={`font-bold text-sm ${Number(product.stock) === 0 ? 'text-red-500' : 'text-orange-500'}`}>
                                {Number(product.stock) === 0 ? 'Habis' : `Sisa: ${product.stock}`}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                HPP: Rp {Number(product.hpp).toLocaleString()}
                            </p>
                        </div>
                    </div>
                ))}
                </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Overview;