import { motion } from 'framer-motion';
import { Download, TrendingUp, TrendingDown, Package, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useBusinessStore } from '@/stores/businessStore';
import { toast } from '@/hooks/use-toast';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';

const stockMovementData = [
  { name: 'Week 1', inbound: 150, outbound: 120 },
  { name: 'Week 2', inbound: 200, outbound: 180 },
  { name: 'Week 3', inbound: 80, outbound: 150 },
  { name: 'Week 4', inbound: 220, outbound: 190 },
];

const cashFlowData = [
  { name: 'Jan', income: 12000000, expense: 8000000 },
  { name: 'Feb', income: 15000000, expense: 9500000 },
  { name: 'Mar', income: 18000000, expense: 11000000 },
  { name: 'Apr', income: 22000000, expense: 14000000 },
];

const Reports = () => {
  const { currentBusiness } = useBusinessStore();

  if (!currentBusiness) return null;

  const handleExport = (reportType: string) => {
    toast({
      title: 'Report Downloaded',
      description: `${reportType} report has been exported successfully.`,
    });
  };

  const transactions = currentBusiness.transactions || [];
  const products = currentBusiness.products || [];

  const totalRevenue = transactions
    .filter((t) => t.type === 'sale')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalExpenses = Math.abs(
    transactions
      .filter((t) => t.type !== 'sale')
      .reduce((sum, t) => sum + Number(t.amount), 0)
  );

  const netProfit = totalRevenue - totalExpenses;
  const profitMargin = totalRevenue > 0 ? ((netProfit / totalRevenue) * 100).toFixed(1) : '0';

  const summaryCards = [
    {
      title: 'Total Revenue',
      value: `Rp ${(totalRevenue / 1000000).toFixed(1)}M`,
      change: '+15.2%',
      trend: 'up',
      icon: TrendingUp,
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
    {
      title: 'Total Expenses',
      value: `Rp ${(totalExpenses / 1000000).toFixed(1)}M`,
      change: '+8.5%',
      trend: 'down',
      icon: TrendingDown,
      color: 'text-destructive',
      bgColor: 'bg-destructive/10',
    },
    {
      title: 'Net Profit',
      value: `Rp ${(netProfit / 1000000).toFixed(1)}M`,
      change: `${profitMargin}% margin`,
      trend: 'up',
      icon: DollarSign,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      title: 'Inventory Value',
      value: `Rp ${(
        products.reduce((sum, p) => sum + Number(p.hpp) * p.stock, 0) / 1000000
      ).toFixed(1)}M`,
      change: `${products.length} items`,
      trend: 'up',
      icon: Package,
      color: 'text-warning',
      bgColor: 'bg-warning/10',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-1">Reports & Analytics</h1>
          <p className="text-muted-foreground">Comprehensive insights into your business performance.</p>
        </div>
        <Button variant="hero" onClick={() => handleExport('Full Business')}>
          <Download className="w-4 h-4 mr-2" />
          Export All Reports
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card variant="stat">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">{card.title}</p>
                    <p className="text-2xl font-bold">{card.value}</p>
                    <p className={`text-xs ${card.trend === 'up' ? 'text-success' : 'text-destructive'}`}>
                      {card.change}
                    </p>
                  </div>
                  <div className={`w-10 h-10 rounded-xl ${card.bgColor} flex items-center justify-center`}>
                    <card.icon className={`w-5 h-5 ${card.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card variant="glass">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg">Stock Movement</CardTitle>
                <CardDescription>Inbound vs outbound inventory flow</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={() => handleExport('Stock Movement')}>
                <Download className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stockMovementData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Bar dataKey="inbound" fill="hsl(var(--success))" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="outbound" fill="hsl(var(--destructive))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="flex items-center justify-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-success" />
                  <span className="text-sm text-muted-foreground">Inbound</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-destructive" />
                  <span className="text-sm text-muted-foreground">Outbound</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card variant="glass">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg">Cash Flow</CardTitle>
                <CardDescription>Income vs expense trends</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={() => handleExport('Cash Flow')}>
                <Download className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={cashFlowData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(v) => `${v / 1000000}M`} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                      formatter={(value: number) => [`Rp ${(value / 1000000).toFixed(1)}M`]}
                    />
                    <Area
                      type="monotone"
                      dataKey="income"
                      stroke="hsl(var(--primary))"
                      fill="hsl(var(--primary) / 0.2)"
                      strokeWidth={2}
                    />
                    <Area
                      type="monotone"
                      dataKey="expense"
                      stroke="hsl(var(--destructive))"
                      fill="hsl(var(--destructive) / 0.2)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="flex items-center justify-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-primary" />
                  <span className="text-sm text-muted-foreground">Income</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-destructive" />
                  <span className="text-sm text-muted-foreground">Expense</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Product Performance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card variant="glass">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">Top Performing Products</CardTitle>
              <CardDescription>Products with highest profit margins</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={() => handleExport('Product Performance')}>
              <Download className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {(currentBusiness.products || [])
                .map((p) => ({
                  ...p,
                  margin: ((Number(p.selling_price) - Number(p.hpp)) / Number(p.selling_price)) * 100,
                  profit: (Number(p.selling_price) - Number(p.hpp)) * p.stock,
                }))
                .sort((a, b) => b.margin - a.margin)
                .slice(0, 5)
                .map((product, index) => (
                  <div key={product.id} className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium">{product.name}</span>
                        <span className="text-success font-semibold">{product.margin.toFixed(1)}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-secondary overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${product.margin}%` }}
                          transition={{ duration: 0.8, delay: index * 0.1 }}
                          className="h-full bg-gradient-primary rounded-full"
                        />
                      </div>
                    </div>
                    <span className="text-sm text-muted-foreground min-w-[100px] text-right">
                      Rp {(product.profit / 1000).toFixed(0)}K potential
                    </span>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Reports;
