
'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Plus, Search, TrendingUp, TrendingDown, Edit, Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface Keyword {
  id: string;
  keyword: string;
  searchVolume: number | null;
  difficulty: number | null;
  targetLocation: string | null;
  priority: number;
  category: string | null;
  isActive: boolean;
  performanceData?: Array<{
    position: number | null;
    clicks: number;
    impressions: number;
  }>;
}

export default function KeywordsPage() {
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  const [newKeyword, setNewKeyword] = useState({
    keyword: '',
    searchVolume: '',
    difficulty: '',
    targetLocation: 'Sparta, NJ',
    priority: '5',
    category: 'local',
  });

  useEffect(() => {
    fetchKeywords();
  }, []);

  const fetchKeywords = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/seo/keywords');
      const data = await response.json();
      setKeywords(data.keywords || []);
    } catch (error) {
      console.error('Error fetching keywords:', error);
      toast.error('Failed to fetch keywords');
    } finally {
      setLoading(false);
    }
  };

  const handleAddKeyword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newKeyword.keyword) {
      toast.error('Keyword is required');
      return;
    }

    try {
      const response = await fetch('/api/seo/keywords', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          keyword: newKeyword.keyword,
          searchVolume: newKeyword.searchVolume ? parseInt(newKeyword.searchVolume) : null,
          difficulty: newKeyword.difficulty ? parseInt(newKeyword.difficulty) : null,
          targetLocation: newKeyword.targetLocation,
          priority: parseInt(newKeyword.priority),
          category: newKeyword.category,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add keyword');
      }

      toast.success('Keyword added successfully');
      setIsAddDialogOpen(false);
      setNewKeyword({
        keyword: '',
        searchVolume: '',
        difficulty: '',
        targetLocation: 'Sparta, NJ',
        priority: '5',
        category: 'local',
      });
      fetchKeywords();
    } catch (error) {
      console.error('Error adding keyword:', error);
      toast.error('Failed to add keyword');
    }
  };

  const handleDeleteKeyword = async (id: string) => {
    if (!confirm('Are you sure you want to delete this keyword?')) {
      return;
    }

    try {
      const response = await fetch(`/api/seo/keywords?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete keyword');
      }

      toast.success('Keyword deleted successfully');
      fetchKeywords();
    } catch (error) {
      console.error('Error deleting keyword:', error);
      toast.error('Failed to delete keyword');
    }
  };

  const filteredKeywords = keywords.filter(kw => {
    const matchesSearch = kw.keyword.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || kw.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const getAveragePosition = (performanceData: Keyword['performanceData']) => {
    if (!performanceData || performanceData.length === 0) return null;
    const sum = performanceData.reduce((acc, p) => acc + (p.position || 0), 0);
    return (sum / performanceData.length).toFixed(1);
  };

  const getTotalClicks = (performanceData: Keyword['performanceData']) => {
    if (!performanceData || performanceData.length === 0) return 0;
    return performanceData.reduce((acc, p) => acc + p.clicks, 0);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">KEYWORD RESEARCH & TRACKING</h1>
          <p className="text-gray-600 mt-1">Manage and track your target keywords</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Keyword
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>ADD NEW KEYWORD</DialogTitle>
              <DialogDescription>Add a keyword to track its performance</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddKeyword} className="space-y-4">
              <div>
                <Label htmlFor="keyword">Keyword *</Label>
                <Input
                  id="keyword"
                  value={newKeyword.keyword}
                  onChange={(e) => setNewKeyword({ ...newKeyword, keyword: e.target.value })}
                  placeholder="e.g., basketball training sparta nj"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="searchVolume">Search Volume</Label>
                  <Input
                    id="searchVolume"
                    type="number"
                    value={newKeyword.searchVolume}
                    onChange={(e) => setNewKeyword({ ...newKeyword, searchVolume: e.target.value })}
                    placeholder="e.g., 140"
                  />
                </div>
                <div>
                  <Label htmlFor="difficulty">Difficulty (0-100)</Label>
                  <Input
                    id="difficulty"
                    type="number"
                    min="0"
                    max="100"
                    value={newKeyword.difficulty}
                    onChange={(e) => setNewKeyword({ ...newKeyword, difficulty: e.target.value })}
                    placeholder="e.g., 35"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Select
                  value={newKeyword.category}
                  onValueChange={(value) => setNewKeyword({ ...newKeyword, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="local">Local</SelectItem>
                    <SelectItem value="statewide">Statewide</SelectItem>
                    <SelectItem value="branded">Branded</SelectItem>
                    <SelectItem value="generic">Generic</SelectItem>
                    <SelectItem value="competitor">Competitor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="targetLocation">Target Location</Label>
                <Input
                  id="targetLocation"
                  value={newKeyword.targetLocation}
                  onChange={(e) => setNewKeyword({ ...newKeyword, targetLocation: e.target.value })}
                  placeholder="e.g., Sparta, NJ"
                />
              </div>
              <div>
                <Label htmlFor="priority">Priority (1-10)</Label>
                <Select
                  value={newKeyword.priority}
                  onValueChange={(value) => setNewKeyword({ ...newKeyword, priority: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[10, 9, 8, 7, 6, 5, 4, 3, 2, 1].map((p) => (
                      <SelectItem key={p} value={p.toString()}>
                        {p} {p >= 8 ? '(High)' : p >= 5 ? '(Medium)' : '(Low)'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Add Keyword</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="search">Search Keywords</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Search keywords..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="category">Filter by Category</Label>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="local">Local</SelectItem>
                  <SelectItem value="statewide">Statewide</SelectItem>
                  <SelectItem value="branded">Branded</SelectItem>
                  <SelectItem value="generic">Generic</SelectItem>
                  <SelectItem value="competitor">Competitor</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Keywords Table */}
      <Card>
        <CardHeader>
          <CardTitle>TRACKED KEYWORDS ({filteredKeywords.length})</CardTitle>
          <CardDescription>Monitor keyword rankings and performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>KEYWORD</TableHead>
                  <TableHead>CATEGORY</TableHead>
                  <TableHead className="text-right">VOLUME</TableHead>
                  <TableHead className="text-right">DIFFICULTY</TableHead>
                  <TableHead className="text-right">POSITION</TableHead>
                  <TableHead className="text-right">CLICKS</TableHead>
                  <TableHead className="text-center">PRIORITY</TableHead>
                  <TableHead className="text-right">ACTIONS</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : filteredKeywords.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                      No keywords found. Add your first keyword to start tracking.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredKeywords.map((kw) => {
                    const avgPosition = getAveragePosition(kw.performanceData);
                    const totalClicks = getTotalClicks(kw.performanceData);
                    
                    return (
                      <TableRow key={kw.id}>
                        <TableCell className="font-medium">
                          <div>
                            <p className="text-sm">{kw.keyword}</p>
                            {kw.targetLocation && (
                              <p className="text-xs text-gray-500">{kw.targetLocation}</p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {kw.category || 'N/A'}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">{kw.searchVolume || '-'}</TableCell>
                        <TableCell className="text-right">{kw.difficulty || '-'}</TableCell>
                        <TableCell className="text-right">
                          {avgPosition ? `#${avgPosition}` : '-'}
                        </TableCell>
                        <TableCell className="text-right">{totalClicks}</TableCell>
                        <TableCell className="text-center">
                          <span
                            className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold ${
                              kw.priority >= 8
                                ? 'bg-red-100 text-red-800'
                                : kw.priority >= 5
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-green-100 text-green-800'
                            }`}
                          >
                            {kw.priority}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteKeyword(kw.id)}
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
