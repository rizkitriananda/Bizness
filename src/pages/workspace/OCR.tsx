/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ScanText,
  Upload,
  Loader2,
  CheckCircle2,
  History,
  FileText,
  Calendar,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

// --- KONFIGURASI API ---
const API_BASE_URL = "https://6b1ed58c16d3.ngrok-free.app";

// --- Types ---
interface OCRItem {
  name: string;
  price: number;
}

interface OCRData {
  id: string;
  date: string;
  vendor: string;
  items: OCRItem[];
  total: number;
}

// --- Helper: Parse Text from AI to Object ---
const parseOCRText = (text: string): OCRData => {
  const lines = text.split("\n");
  const data: any = { items: [], total: 0 };

  let currentItem: any = {};

  lines.forEach((line) => {
    const [key, ...rest] = line.split(":");
    const value = rest.join(":").trim();

    if (!key || !value) return;

    const lowerKey = key.trim().toLowerCase();

    if (lowerKey.includes("toko") || lowerKey.includes("vendor"))
      data.vendor = value;
    else if (lowerKey.includes("tanggal")) data.date = value;
    else if (lowerKey.includes("total_bayar"))
      data.total = parseInt(value.replace(/\D/g, "")) || 0;
    else if (lowerKey.includes("nama")) currentItem.name = value;
    else if (lowerKey.includes("harga_satuan") || lowerKey.includes("total")) {
      // Jika nemu harga, berarti item selesai atau update harga
      if (lowerKey.includes("total") && !lowerKey.includes("bayar")) {
        currentItem.price = parseInt(value.replace(/\D/g, "")) || 0;
        if (currentItem.name) {
          data.items.push({ ...currentItem });
          currentItem = {}; // Reset for next item
        }
      }
    }
  });

  // Fallback values if parsing fails
  return {
    id: Date.now().toString(),
    date: data.date || new Date().toISOString().split("T")[0],
    vendor: data.vendor || "Unknown Vendor",
    items: data.items.length > 0 ? data.items : [],
    total: data.total || 0,
  };
};

const OCRPage = () => {
  // --- State ---
  const [isScanning, setIsScanning] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [currentResult, setCurrentResult] = useState<OCRData | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // History Data
  const [history, setHistory] = useState<OCRData[]>([]);

  // --- Handlers ---

  // 1. File Upload Handler
  const handleFileUpload = (file: File) => {
    if (!file) return;

    setSelectedFile(file);
    setCurrentResult(null); // Reset previous result

    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  // 2. Scan Process (Fetch to Backend)
  const handleScan = async () => {
    if (!selectedFile) {
      toast({
        title: "Error",
        description: "Silakan upload gambar struk terlebih dahulu.",
        variant: "destructive",
      });
      return;
    }

    setIsScanning(true);
    setCurrentResult(null);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await fetch(`${API_BASE_URL}/ocr`, {
        method: "POST",
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
        body: formData,
      });

      if (!response.ok) throw new Error("Gagal memproses gambar");

      const data = await response.json();
      const parsedData = parseOCRText(data.result);

      setCurrentResult(parsedData);
      setHistory((prev) => [parsedData, ...prev]);
      toast({
        title: "Scan Complete",
        description: "Data struk berhasil diekstrak!",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Gagal terhubung ke server OCR.",
        variant: "destructive",
      });
    } finally {
      setIsScanning(false);
    }
  };

  const handleSelectHistory = (data: OCRData) => {
    setCurrentResult(data);
    // Optional: Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
          <ScanText className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">OCR Scanner</h1>
          <p className="text-muted-foreground">
            Digitize your physical receipts and invoices instantly.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Scanner & Results (Takes up 2/3 space) */}
        <div className="lg:col-span-2 space-y-6">
          {/* 1. Upload Area */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card variant="glass">
              <CardHeader>
                <CardTitle>Upload Receipt</CardTitle>
                <CardDescription>
                  Drag and drop image or click to browse
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={onDrop}
                  className={cn(
                    "relative border-2 border-dashed rounded-xl p-4 text-center transition-all min-h-[250px] flex flex-col items-center justify-center overflow-hidden",
                    isDragging
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50 hover:bg-secondary/50"
                  )}
                >
                  {preview ? (
                    <div className="relative w-full h-full flex flex-col items-center gap-4">
                      <img
                        src={preview}
                        alt="Receipt Preview"
                        className="max-h-[200px] object-contain rounded-lg shadow-sm"
                      />
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          onClick={() => {
                            setPreview(null);
                            setSelectedFile(null);
                          }}
                        >
                          Change
                        </Button>
                        <Button
                          variant="hero"
                          onClick={handleScan}
                          disabled={isScanning}
                        >
                          {isScanning ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />{" "}
                              Scanning...
                            </>
                          ) : (
                            <>
                              <ScanText className="w-4 h-4 mr-2" /> Process OCR
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div
                      className="space-y-4 cursor-pointer w-full"
                      onClick={() =>
                        document.getElementById("file-upload")?.click()
                      }
                    >
                      <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mx-auto shadow-sm">
                        <Upload className="w-8 h-8 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium text-lg">Drop receipt here</p>
                        <p className="text-sm text-muted-foreground">
                          Supports JPG, PNG
                        </p>
                      </div>
                      <input
                        id="file-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={onFileSelect}
                      />
                      <Button
                        variant="outline"
                        className="mt-2 pointer-events-none"
                      >
                        Select File
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* 2. Result Display */}
          <AnimatePresence mode="wait">
            {currentResult && (
              <motion.div
                key={currentResult.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <Card
                  variant="glass"
                  className="border-primary/20 bg-primary/5"
                >
                  <CardHeader className="border-b border-border/50 pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-success" />
                        <CardTitle className="text-lg">
                          Extracted Data
                        </CardTitle>
                      </div>
                      <span className="text-xs font-mono bg-background/50 px-2 py-1 rounded text-muted-foreground">
                        ID: {currentResult.id.slice(-6)}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-6">
                    {/* Header Info */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-muted-foreground uppercase flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> Date
                        </label>
                        <Input
                          value={currentResult.date}
                          readOnly
                          className="bg-background/50 font-medium"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-muted-foreground uppercase flex items-center gap-1">
                          <FileText className="w-3 h-3" /> Vendor
                        </label>
                        <Input
                          value={currentResult.vendor}
                          readOnly
                          className="bg-background/50 font-medium"
                        />
                      </div>
                    </div>

                    {/* Items Table */}
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-muted-foreground uppercase">
                        Items Found
                      </label>
                      <div className="rounded-lg border border-border overflow-hidden bg-background/40">
                        {currentResult.items.length > 0 ? (
                          currentResult.items.map((item, i) => (
                            <div
                              key={i}
                              className="flex items-center justify-between p-3 border-b border-border last:border-0 hover:bg-background/60 transition-colors"
                            >
                              <span className="text-sm font-medium">
                                {item.name}
                              </span>
                              <span className="text-sm font-bold text-muted-foreground">
                                Rp {item.price.toLocaleString()}
                              </span>
                            </div>
                          ))
                        ) : (
                          <div className="p-4 text-center text-sm text-muted-foreground">
                            Tidak ada item spesifik terdeteksi.
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Total */}
                    <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-primary/10 to-transparent border border-primary/10">
                      <span className="font-semibold text-muted-foreground">
                        Total Amount
                      </span>
                      <span className="text-2xl font-bold text-primary">
                        Rp {currentResult.total.toLocaleString()}
                      </span>
                    </div>

                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => setCurrentResult(null)}
                      >
                        Cancel
                      </Button>
                      <Button variant="hero" className="flex-1">
                        Save to Inventory
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Column: History (Takes up 1/3 space) */}
        <div className="lg:col-span-1">
          <Card
            variant="glass"
            className="h-full max-h-[calc(100vh-120px)] flex flex-col"
          >
            <CardHeader className="pb-3 border-b border-border">
              <CardTitle className="flex items-center gap-2 text-base">
                <History className="w-4 h-4" />
                Scan History
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 flex-1 overflow-hidden">
              <div className="h-full overflow-y-auto p-4 space-y-3">
                {history.length === 0 ? (
                  <div className="text-center py-10 text-muted-foreground text-sm">
                    No scan history yet.
                  </div>
                ) : (
                  history.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      onClick={() => handleSelectHistory(item)}
                      className={cn(
                        "group p-3 rounded-lg border cursor-pointer transition-all hover:shadow-md",
                        currentResult?.id === item.id
                          ? "bg-primary/10 border-primary shadow-sm"
                          : "bg-card hover:bg-secondary border-border"
                      )}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-semibold text-sm truncate max-w-[120px]">
                            {item.vendor}
                          </p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                            <Calendar className="w-3 h-3" /> {item.date}
                          </p>
                        </div>
                        <div className="bg-secondary p-1.5 rounded-md group-hover:bg-background transition-colors">
                          <ArrowRight className="w-3 h-3 text-muted-foreground" />
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-border/50">
                        <span className="text-xs text-muted-foreground">
                          {item.items.length} Items
                        </span>
                        <span className="text-sm font-bold text-primary">
                          Rp {(item.total / 1000).toFixed(0)}k
                        </span>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OCRPage;
