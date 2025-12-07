import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  CheckCircle2, 
  Circle, 
  Calendar,
  Flag,
  Save,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge'; // Pastikan ada atau ganti dengan div biasa
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const ToDoList = () => {
  // --- STATE MANAGEMENT ---
  // (Nantinya bisa dipindahkan ke useBusinessStore jika ingin terhubung ke Database)
  const [todos, setTodos] = useState([
    { id: 1, text: 'Review business proposal', completed: false, priority: 'high', date: '2025-10-24' },
    { id: 2, text: 'Restock coffee beans', completed: true, priority: 'medium', date: '2025-10-23' },
  ]);

  const [newTask, setNewTask] = useState('');
  const [priority, setPriority] = useState('medium');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // all, active, completed

  // State untuk fitur Edit
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');

  // --- CRUD ACTIONS ---

  // 1. CREATE
  const handleAddTodo = () => {
    if (!newTask.trim()) {
      toast({ title: 'Error', description: 'Task cannot be empty.', variant: 'destructive' });
      return;
    }

    const newTodoItem = {
      id: Date.now(), // Simple ID generation
      text: newTask,
      completed: false,
      priority: priority,
      date: new Date().toISOString().split('T')[0],
    };

    setTodos([newTodoItem, ...todos]);
    setNewTask('');
    toast({ title: 'Success', description: 'New task added successfully!' });
  };

  // 2. UPDATE (Toggle Complete)
  const toggleComplete = (id) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  // 2. UPDATE (Edit Text)
  const startEditing = (todo) => {
    setEditingId(todo.id);
    setEditText(todo.text);
  };

  const saveEdit = (id) => {
    if (!editText.trim()) return;
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, text: editText } : todo
    ));
    setEditingId(null);
    toast({ title: 'Updated', description: 'Task updated successfully.' });
  };

  // 3. DELETE
  const handleDelete = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
    toast({ title: 'Deleted', description: 'Task removed.' });
  };

  // --- FILTERS & HELPER ---
  
  const getPriorityColor = (p) => {
    switch(p) {
      case 'high': return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'medium': return 'bg-warning/10 text-warning border-warning/20';
      case 'low': return 'bg-success/10 text-success border-success/20';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  const filteredTodos = todos.filter(todo => {
    const matchesSearch = todo.text.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = 
      filterStatus === 'all' ? true :
      filterStatus === 'completed' ? todo.completed :
      !todo.completed;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-1">Tasks & Priorities</h1>
          <p className="text-muted-foreground">Keep track of your daily business activities.</p>
        </div>
        
        {/* Quick Stats */}
        <div className="flex gap-3">
          <Card className="px-4 py-2 bg-secondary/50 border-none flex items-center gap-2">
            <span className="text-2xl font-bold text-primary">
              {todos.filter(t => !t.completed).length}
            </span>
            <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
              Pending
            </span>
          </Card>
        </div>
      </div>

      {/* Input Area (Create) */}
      <Card variant="glass" className="border-l-4 border-l-primary">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input 
                placeholder="What needs to be done?" 
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddTodo()}
                className="h-12 text-lg"
              />
            </div>
            <div className="flex items-center gap-2">
              <select 
                className="h-12 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium</option>
                <option value="high">High Priority</option>
              </select>
              <Button size="lg" variant="hero" onClick={handleAddTodo} className="h-12 px-6">
                <Plus className="w-5 h-5 mr-2" /> Add
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex p-1 bg-secondary rounded-lg">
          {['all', 'active', 'completed'].map((filter) => (
            <button
              key={filter}
              onClick={() => setFilterStatus(filter)}
              className={cn(
                "px-4 py-1.5 text-sm font-medium rounded-md transition-all capitalize",
                filterStatus === filter 
                  ? "bg-background shadow-sm text-foreground" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {filter}
            </button>
          ))}
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-9"
          />
        </div>
      </div>

      {/* Task List (Read, Update, Delete) */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {filteredTodos.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="text-center py-12 text-muted-foreground"
            >
              <p>No tasks found matching your criteria.</p>
            </motion.div>
          ) : (
            filteredTodos.map((todo) => (
              <motion.div
                key={todo.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <Card className={cn(
                  "transition-all hover:shadow-md border-l-4",
                  todo.completed ? "opacity-60 bg-secondary/30 border-l-muted-foreground/30" : "bg-card border-l-primary"
                )}>
                  <CardContent className="p-4 flex items-center gap-4">
                    {/* Checkbox Toggle */}
                    <button 
                      onClick={() => toggleComplete(todo.id)}
                      className={cn(
                        "flex-shrink-0 transition-colors",
                        todo.completed ? "text-success" : "text-muted-foreground hover:text-primary"
                      )}
                    >
                      {todo.completed ? (
                        <CheckCircle2 className="w-6 h-6" />
                      ) : (
                        <Circle className="w-6 h-6" />
                      )}
                    </button>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      {editingId === todo.id ? (
                        <div className="flex items-center gap-2">
                          <Input 
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            className="h-8"
                            autoFocus
                          />
                          <Button size="icon" variant="ghost" onClick={() => saveEdit(todo.id)} className="h-8 w-8 text-success">
                            <Save className="w-4 h-4" />
                          </Button>
                          <Button size="icon" variant="ghost" onClick={() => setEditingId(null)} className="h-8 w-8 text-destructive">
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-1">
                          <span className={cn(
                            "font-medium truncate",
                            todo.completed && "line-through text-muted-foreground"
                          )}>
                            {todo.text}
                          </span>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" /> {todo.date}
                            </span>
                            <span>•</span>
                            <span className={cn("px-1.5 py-0.5 rounded border capitalize text-[10px]", getPriorityColor(todo.priority))}>
                              {todo.priority}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1">
                      {!editingId && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => startEditing(todo)}
                          disabled={todo.completed}
                          className="h-8 w-8 text-muted-foreground hover:text-foreground"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(todo.id)}
                        className="h-8 w-8 text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ToDoList;