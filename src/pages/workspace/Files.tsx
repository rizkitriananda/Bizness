import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Folder,
  FileText,
  FileSpreadsheet,
  Image,
  Upload,
  FolderPlus,
  ChevronRight,
  Home,
  Grid3X3,
  List,
  Trash2,
  MoreVertical,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useBusinessStore, FileItem } from '@/stores/businessStore';
import { toast } from '@/hooks/use-toast';

const getFileIcon = (type: string) => {
  switch (type) {
    case 'folder':
      return <Folder className="w-full h-full text-warning" />;
    case 'pdf':
      return <FileText className="w-full h-full text-destructive" />;
    case 'xlsx':
      return <FileSpreadsheet className="w-full h-full text-success" />;
    case 'jpg':
    case 'png':
      return <Image className="w-full h-full text-primary" />;
    default:
      return <FileText className="w-full h-full text-muted-foreground" />;
  }
};

const formatFileSize = (sizeStr?: string) => {
  if (!sizeStr) return '';
  const bytes = parseInt(sizeStr);
  if (isNaN(bytes)) return sizeStr;
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const Files = () => {
  const { currentBusiness, addFile, deleteFile } = useBusinessStore();
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isNewFolderOpen, setIsNewFolderOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  if (!currentBusiness) return null;

  const files = currentBusiness.files || [];
  const currentFiles = files.filter((f) => f.parent_id === currentFolderId);
  const breadcrumbs = getBreadcrumbs(files, currentFolderId);

  function getBreadcrumbs(allFiles: FileItem[], folderId: string | null): FileItem[] {
    const crumbs: FileItem[] = [];
    let currentId = folderId;
    while (currentId) {
      const folder = allFiles.find((f) => f.id === currentId);
      if (folder) {
        crumbs.unshift(folder);
        currentId = folder.parent_id;
      } else {
        break;
      }
    }
    return crumbs;
  }

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) {
      toast({ title: 'Error', description: 'Please enter a folder name.', variant: 'destructive' });
      return;
    }

    await addFile({
      name: newFolderName,
      type: 'folder',
      size: '0',
      parent_id: currentFolderId,
      is_folder: true,
      business_id: currentBusiness.id,
    });

    toast({ title: 'Success', description: 'Folder created successfully!' });
    setIsNewFolderOpen(false);
    setNewFolderName('');
  };

  const handleUploadFile = async () => {
    // Simulate file upload
    const fileTypes = ['pdf', 'xlsx', 'jpg', 'png', 'doc'];
    const randomType = fileTypes[Math.floor(Math.random() * fileTypes.length)];
    const randomSize = Math.floor(Math.random() * 5000000) + 100000;

    await addFile({
      name: `Uploaded_File_${Date.now()}.${randomType}`,
      type: randomType,
      size: randomSize.toString(),
      parent_id: currentFolderId,
      is_folder: false,
      business_id: currentBusiness.id,
    });

    toast({ title: 'Upload Complete', description: 'File uploaded successfully!' });
  };

  const handleDeleteFile = async (fileId: string) => {
    await deleteFile(fileId);
    toast({ title: 'Deleted', description: 'File removed successfully.' });
  };

  const handleOpenFolder = (folder: FileItem) => {
    if (folder.is_folder) {
      setCurrentFolderId(folder.id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-1">File Explorer</h1>
          <p className="text-muted-foreground">Manage your business documents and files.</p>
        </div>
        <div className="flex items-center gap-2">
          <Dialog open={isNewFolderOpen} onOpenChange={setIsNewFolderOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <FolderPlus className="w-4 h-4 mr-2" />
                New Folder
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Folder</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <Input
                  placeholder="Folder name"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                />
                <Button onClick={handleCreateFolder} className="w-full" variant="hero">
                  Create Folder
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          <Button variant="hero" onClick={handleUploadFile}>
            <Upload className="w-4 h-4 mr-2" />
            Upload
          </Button>
        </div>
      </div>

      {/* Breadcrumb & View Toggle */}
      <Card variant="glass">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm overflow-x-auto">
              <button
                onClick={() => setCurrentFolderId(null)}
                className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
              >
                <Home className="w-4 h-4" />
                <span>Root</span>
              </button>
              {breadcrumbs.map((crumb) => (
                <div key={crumb.id} className="flex items-center gap-2">
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  <button
                    onClick={() => setCurrentFolderId(crumb.id)}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {crumb.name}
                  </button>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                size="icon"
                onClick={() => setViewMode('grid')}
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                size="icon"
                onClick={() => setViewMode('list')}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Files Grid/List */}
      {currentFiles.length === 0 ? (
        <Card variant="glass" className="p-12 text-center">
          <Folder className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">This folder is empty</h3>
          <p className="text-muted-foreground mb-4">Upload files or create folders to get started.</p>
        </Card>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {currentFiles.map((file, index) => (
            <motion.div
              key={file.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card
                variant="interactive"
                className="group p-4 cursor-pointer"
                onDoubleClick={() => handleOpenFolder(file)}
              >
                <div className="relative">
                  <div className="w-16 h-16 mx-auto mb-3">{getFileIcon(file.type)}</div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-secondary">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => handleDeleteFile(file.id)}
                        className="text-destructive"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <p className="text-sm font-medium text-center truncate">{file.name}</p>
                {!file.is_folder && file.size && (
                  <p className="text-xs text-muted-foreground text-center">{formatFileSize(file.size)}</p>
                )}
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <Card variant="glass">
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {currentFiles.map((file, index) => (
                <motion.div
                  key={file.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center gap-4 p-4 hover:bg-secondary/50 transition-colors cursor-pointer group"
                  onDoubleClick={() => handleOpenFolder(file)}
                >
                  <div className="w-10 h-10">{getFileIcon(file.type)}</div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{file.name}</p>
                    <p className="text-xs text-muted-foreground">{file.created_at}</p>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {file.is_folder ? 'Folder' : formatFileSize(file.size)}
                  </span>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded hover:bg-secondary">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => handleDeleteFile(file.id)}
                        className="text-destructive"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Files;
