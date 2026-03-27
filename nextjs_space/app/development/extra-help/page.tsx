'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { HelpCircle, CheckCircle } from 'lucide-react';

const HELP_TYPES = [
  'Ball Handling',
  'Shooting',
  'Finishing',
  'Defense',
  'Speed & Agility',
  'Footwork',
  'General',
] as const;

export default function ExtraHelpPage() {
  const [helpType, setHelpType] = useState<string>('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch('/api/development/extra-help', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ helpType, message }),
      });
      if (!res.ok) throw new Error('Failed to submit');
      setSubmitted(true);
      setHelpType('');
      setMessage('');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Extra Help</h1>
          <p className="text-slate-600 mt-1">
            Request help from your coach.
          </p>
        </div>
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <CheckCircle className="h-12 w-12 text-green-600 shrink-0" />
              <div>
                <h3 className="font-semibold text-green-900">
                  Request submitted!
                </h3>
                <p className="text-green-800 mt-1">
                  Your coach will review your request and get back to you soon.
                </p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => setSubmitted(false)}
                >
                  Submit another request
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Extra Help</h1>
        <p className="text-slate-600 mt-1">
          Request extra help from your coach. Describe what you&apos;re working on
          and what you need.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-blue-600" />
            Request Help
          </CardTitle>
          <p className="text-sm text-slate-600">
            Your coach will review your request and reach out.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="helpType">Type of help needed</Label>
              <Select
                value={helpType}
                onValueChange={setHelpType}
                required
              >
                <SelectTrigger id="helpType" className="mt-2">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {HELP_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                placeholder="Describe what you're working on and what kind of help you need..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="mt-2 min-h-[120px]"
                required
              />
            </div>
            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700"
              disabled={submitting}
            >
              {submitting ? 'Submitting...' : 'Submit Request'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
