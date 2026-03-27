'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle, Circle, Video } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const SKILL_CATEGORIES = [
  'Ball Handling',
  'Shooting',
  'Finishing',
  'Defense',
  'Speed & Agility',
  'Footwork',
] as const;

interface Assignment {
  id: string;
  title: string;
  category: string;
  description: string;
  status: 'completed' | 'pending';
  videoUrl?: string;
  submittedAt?: string;
}

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submittingId, setSubmittingId] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [openDialogId, setOpenDialogId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetch('/api/development/assignments')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch assignments');
        return res.json();
      })
      .then((data) => {
        const groups = data.assignments ?? [];
        const flat = groups.flatMap((g: { category?: { name: string }; assignments?: Array<{ id: string; title: string; description?: string; category?: { name: string }; mySubmission?: { submittedAt?: string } | null }> }) =>
          (g.assignments ?? []).map((a) => ({
            id: a.id,
            title: a.title,
            category: a.category?.name ?? g.category?.name ?? 'General',
            description: a.description ?? '',
            status: a.mySubmission ? 'completed' : 'pending',
            submittedAt: a.mySubmission?.submittedAt
              ? new Date(a.mySubmission.submittedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
              : undefined,
          }))
        );
        setAssignments(flat);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (assignmentId: string) => {
    setSubmittingId(assignmentId);
    try {
      const res = await fetch('/api/development/assignments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assignmentId,
          videoUrl,
          notes,
        }),
      });
      if (!res.ok) throw new Error('Failed to submit');
      const { submission } = await res.json();
      setAssignments((prev) =>
        prev.map((a) =>
          a.id === assignmentId
            ? {
                ...a,
                status: 'completed' as const,
                submittedAt: submission?.submittedAt
                  ? new Date(submission.submittedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                  : new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
              }
            : a
        )
      );
      setOpenDialogId(null);
      setVideoUrl('');
      setNotes('');
      toast({
        title: 'Submission successful',
        description: 'Your assignment has been submitted.',
      });
    } catch (err) {
      toast({
        title: 'Submission failed',
        description: (err as Error).message,
        variant: 'destructive',
      });
    } finally {
      setSubmittingId(null);
    }
  };

  const groupedByCategory = SKILL_CATEGORIES.map((cat) => ({
    category: cat,
    items: assignments.filter((a) => a.category === cat),
  })).filter((g) => g.items.length > 0);

  const completedCount = assignments.filter((a) => a.status === 'completed').length;
  const pendingCount = assignments.filter((a) => a.status === 'pending').length;

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="pt-6">
          <p className="text-red-700">{error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Assignments & Drills
        </h1>
        <p className="text-slate-600 mt-1">
          Complete drills and submit your video for review.
        </p>
      </div>

      {/* Summary */}
      <div className="flex gap-4">
        <Badge variant="secondary" className="px-3 py-1">
          {completedCount} completed
        </Badge>
        <Badge variant="outline" className="px-3 py-1">
          {pendingCount} pending
        </Badge>
      </div>

      {loading ? (
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 rounded-lg" />
          ))}
        </div>
      ) : (
        <div className="space-y-8">
          {groupedByCategory.length ? (
            groupedByCategory.map((group) => (
              <Card key={group.category}>
                <CardHeader>
                  <CardTitle className="text-lg">{group.category}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {group.items.map((assignment) => (
                    <div
                      key={assignment.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg border border-slate-200 bg-slate-50/50"
                    >
                      <div className="flex items-start gap-3">
                        {assignment.status === 'completed' ? (
                          <CheckCircle className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                        ) : (
                          <Circle className="h-5 w-5 text-slate-400 shrink-0 mt-0.5" />
                        )}
                        <div>
                          <p className="font-medium text-slate-900">
                            {assignment.title}
                          </p>
                          <p className="text-sm text-slate-600 mt-1">
                            {assignment.description}
                          </p>
                          {assignment.submittedAt && (
                            <p className="text-xs text-slate-500 mt-1">
                              Submitted {assignment.submittedAt}
                            </p>
                          )}
                        </div>
                      </div>
                      {assignment.status === 'pending' && (
                        <Dialog
                          open={openDialogId === assignment.id}
                          onOpenChange={(open) =>
                            setOpenDialogId(open ? assignment.id : null)
                          }
                        >
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              className="bg-blue-600 hover:bg-blue-700 shrink-0"
                            >
                              <Video className="h-4 w-4 mr-2" />
                              Submit
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Submit {assignment.title}</DialogTitle>
                              <DialogDescription>
                                Add your video URL and any notes for the coach.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                              <div>
                                <Label htmlFor="videoUrl">Video URL</Label>
                                <Input
                                  id="videoUrl"
                                  placeholder="https://..."
                                  value={videoUrl}
                                  onChange={(e) => setVideoUrl(e.target.value)}
                                  className="mt-2"
                                />
                              </div>
                              <div>
                                <Label htmlFor="notes">Notes (optional)</Label>
                                <Textarea
                                  id="notes"
                                  placeholder="Any notes for your coach..."
                                  value={notes}
                                  onChange={(e) => setNotes(e.target.value)}
                                  className="mt-2"
                                  rows={3}
                                />
                              </div>
                            </div>
                            <DialogFooter>
                              <Button
                                variant="outline"
                                onClick={() => setOpenDialogId(null)}
                              >
                                Cancel
                              </Button>
                              <Button
                                className="bg-blue-600 hover:bg-blue-700"
                                onClick={() => handleSubmit(assignment.id)}
                                disabled={
                                  !videoUrl.trim() ||
                                  submittingId === assignment.id
                                }
                              >
                                {submittingId === assignment.id
                                  ? 'Submitting...'
                                  : 'Submit'}
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="py-12 text-center text-slate-500">
                No assignments available at this time.
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
