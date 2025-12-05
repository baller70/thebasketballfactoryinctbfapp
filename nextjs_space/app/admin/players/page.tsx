'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Search, Plus, Eye, Edit, TrendingUp, Users, Award } from 'lucide-react'

interface PlayerProfile {
  id: string
  firstName: string
  lastName: string
  email: string
  age: number
  grade: string
  school?: string
  position?: string
  skillLevel?: string
  totalSessions: number
  lastSessionDate?: string
  isActive: boolean
  createdAt: string
}

export default function PlayersPage() {
  const [players, setPlayers] = useState<PlayerProfile[]>([])
  const [filteredPlayers, setFilteredPlayers] = useState<PlayerProfile[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [skillFilter, setSkillFilter] = useState('all')
  const [selectedPlayer, setSelectedPlayer] = useState<PlayerProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPlayers()
  }, [])

  useEffect(() => {
    filterPlayers()
  }, [players, searchTerm, skillFilter])

  const fetchPlayers = async () => {
    try {
      const response = await fetch('/api/admin/players')
      const data = await response.json()
      setPlayers(data)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching players:', error)
      setLoading(false)
    }
  }

  const filterPlayers = () => {
    let filtered = [...players]

    if (searchTerm) {
      filtered = filtered.filter(player =>
        player.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        player.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        player.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (skillFilter !== 'all') {
      filtered = filtered.filter(player => player.skillLevel === skillFilter)
    }

    setFilteredPlayers(filtered)
  }

  const getSkillBadge = (skill: string | undefined) => {
    if (!skill) return <Badge variant="secondary">Not Assessed</Badge>
    
    const colors: Record<string, string> = {
      beginner: 'bg-blue-100 text-blue-800',
      intermediate: 'bg-green-100 text-green-800',
      advanced: 'bg-purple-100 text-purple-800',
      elite: 'bg-yellow-100 text-yellow-800'
    }
    return (
      <Badge className={colors[skill] || ''}>
        {skill.charAt(0).toUpperCase() + skill.slice(1)}
      </Badge>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Player Development Profiles</h1>
          <p className="text-gray-600 mt-1">Track and manage player progress and assessments</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Player
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Player Profile</DialogTitle>
            </DialogHeader>
            <p className="text-sm text-gray-500">Player profile form coming soon...</p>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4" />
              Total Players
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{players.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Active Players
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{players.filter(p => p.isActive).length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Award className="h-4 w-4" />
              Elite Players
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {players.filter(p => p.skillLevel === 'elite').length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search players..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={skillFilter} onValueChange={setSkillFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Skill Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
                <SelectItem value="elite">Elite</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : filteredPlayers.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No players found</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Age/Grade</TableHead>
                  <TableHead>School</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Skill Level</TableHead>
                  <TableHead>Sessions</TableHead>
                  <TableHead>Last Session</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPlayers.map((player) => (
                  <TableRow key={player.id}>
                    <TableCell className="font-medium">
                      {player.firstName} {player.lastName}
                    </TableCell>
                    <TableCell>{player.age} / {player.grade}</TableCell>
                    <TableCell>{player.school || 'N/A'}</TableCell>
                    <TableCell>{player.position || 'N/A'}</TableCell>
                    <TableCell>{getSkillBadge(player.skillLevel)}</TableCell>
                    <TableCell>{player.totalSessions}</TableCell>
                    <TableCell>
                      {player.lastSessionDate 
                        ? new Date(player.lastSessionDate).toLocaleDateString()
                        : 'N/A'}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" variant="ghost" onClick={() => setSelectedPlayer(player)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!selectedPlayer} onOpenChange={() => setSelectedPlayer(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Player Profile: {selectedPlayer?.firstName} {selectedPlayer?.lastName}
            </DialogTitle>
          </DialogHeader>
          {selectedPlayer && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Email</label>
                  <p className="mt-1">{selectedPlayer.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Age / Grade</label>
                  <p className="mt-1">{selectedPlayer.age} / {selectedPlayer.grade}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">School</label>
                  <p className="mt-1">{selectedPlayer.school || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Position</label>
                  <p className="mt-1">{selectedPlayer.position || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Skill Level</label>
                  <div className="mt-1">{getSkillBadge(selectedPlayer.skillLevel)}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Total Sessions</label>
                  <p className="mt-1">{selectedPlayer.totalSessions}</p>
                </div>
              </div>
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-4">Performance Metrics</h3>
                <p className="text-sm text-gray-500">Detailed metrics and assessments coming soon...</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
