import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Edit2, Trash2, Archive, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from '@/hooks/use-toast';

// Tipe data untuk Bahan Baku
type Material = {
  id: number;
  name: string;
  category: string;
  unit: string;
  stock: number;
  pricePerUnit: number;
};

const Stock = () => {
  // Dummy Data Awal
  const [materials, setMaterials] = useState<Material[]>([
    { id: 1, name: 'Tepung Terigu', category: 'Dry Goods', unit: 'kg', stock: 50, pricePerUnit: 12000 },
    { id: 2, name: 'Susu UHT', category: 'Dairy', unit: 'liter', stock: 24, pricePerUnit: 18000 },
    { id: 3, name: 'Gula Pasir', category: 'Dry Goods', unit: 'kg', stock: 30, pricePerUnit: 15000 },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    unit: '',
    stock: '',
    pricePerUnit: '',
  });

  // Filter Logic
  const filteredMaterials = materials.filter(
    (m) =>
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle Open Dialog (Add or Edit)
  const handleOpenDialog = (material?: Material) => {
    if (material) {
      setEditingMaterial(material);
      setFormData({
        name: material.name,
        category: material.category,
        unit: material.unit,
        stock: material.stock.toString(),
        pricePerUnit: material.pricePerUnit.toString(),
      });
    } else {
      setEditingMaterial(null);
      setFormData({ name: '', category: '', unit: '', stock: '', pricePerUnit: '' });
    }
    setIsDialogOpen(true);
  };

  // Handle Submit (Create or Update)
  const handleSubmit = () => {
    if (!formData.name || !formData.stock || !formData.pricePerUnit) {
      toast({ title: 'Error', description: 'Please fill in all required fields.', variant: 'destructive' });
      return;
    }

    const payload = {
      name: formData.name,
      category: formData.category || 'General',
      unit: formData.unit || 'pcs',
      stock: parseFloat(formData.stock),
      pricePerUnit: parseFloat(formData.pricePerUnit),
    };

    if (editingMaterial) {
      // Update Existing
      setMaterials(materials.map((m) => (m.id === editingMaterial.id ? { ...m, ...payload } : m)));
      toast({ title: 'Success', description: 'Material updated successfully!' });
    } else {
      // Add New
      const newId = materials.length > 0 ? Math.max(...materials.map(m => m.id)) + 1 : 1;
      setMaterials([{ id: newId, ...payload }, ...materials]);
      toast({ title: 'Success', description: 'New material added successfully!' });
    }

    setIsDialogOpen(false);
  };

  // Handle Delete
  const handleDelete = (id: number) => {
    setMaterials(materials.filter((m) => m.id !== id));
    toast({ title: 'Deleted', description: 'Material removed from inventory.' });
  };

  // Helper: Format Rupiah
  const formatRupiah = (value: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-1">Raw Materials & Stock</h1>
          <p className="text-muted-foreground">Manage your inventory ingredients and supplies.</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="hero" onClick={() => handleOpenDialog()}>
              <Plus className="w-4 h-4 mr-2" />
              Add Material
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{editingMaterial ? 'Edit Material' : 'Add New Material'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Nama Bahan</label>
                <Input
                  placeholder="Contoh: Tepung Terigu"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Kategori</label>
                  <Input
                    placeholder="Contoh: Dry Goods"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Satuan</label>
                  <Input
                    placeholder="kg, liter, pcs..."
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Stock Awal</label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Harga per Unit</label>
                  <Input
                    type="number"
                    placeholder="Rp 0"
                    value={formData.pricePerUnit}
                    onChange={(e) => setFormData({ ...formData, pricePerUnit: e.target.value })}
                  />
                </div>
              </div>

              {/* Total Value Preview */}
              {formData.stock && formData.pricePerUnit && (
                 <div className="p-3 rounded-lg bg-secondary/50 border border-border flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Total Asset Value:</span>
                    <span className="font-semibold text-primary">
                      {formatRupiah(parseFloat(formData.stock) * parseFloat(formData.pricePerUnit))}
                    </span>
                 </div>
              )}

              <Button onClick={handleSubmit} className="w-full" variant="hero">
                {editingMaterial ? 'Update Stock' : 'Save Material'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search Bar */}
      <Card variant="glass">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search materials by name or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Materials Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card variant="glass">
          <CardHeader>
             <CardTitle className="text-lg flex items-center gap-2">
                <Archive className="w-5 h-5 text-primary" />
                Inventory List ({filteredMaterials.length})
             </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama Bahan</TableHead>
                    <TableHead>Kategori</TableHead>
                    <TableHead className="text-right">Stock</TableHead>
                    <TableHead className="text-right">Harga / Unit</TableHead>
                    <TableHead className="text-right">Total Value</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMaterials.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>
                        <span className="px-2 py-1 rounded-md bg-secondary text-xs border border-secondary-foreground/10">
                          {item.category}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <span className={item.stock < 10 ? 'text-destructive font-bold' : ''}>
                          {item.stock} {item.unit}
                        </span>
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground">
                        {formatRupiah(item.pricePerUnit)}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatRupiah(item.stock * item.pricePerUnit)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenDialog(item)}
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(item.id)}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Stock;