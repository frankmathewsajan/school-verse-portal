import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { PlusIcon, UsersIcon, UploadIcon } from 'lucide-react';

interface LeadershipManagerProps {
  onContentUpdate?: () => void;
}

const LeadershipManager = ({ onContentUpdate }: LeadershipManagerProps) => {
  return (
    <div className="space-y-6">
      {/* Add New Team Member */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PlusIcon className="w-5 h-5" />
            Add Leadership Team Member
          </CardTitle>
          <CardDescription>
            Add staff members to the leadership team section
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Full Name</label>
              <Input placeholder="Staff member name" />
            </div>
            <div>
              <label className="text-sm font-medium">Position</label>
              <Input placeholder="e.g., Principal, Vice Principal" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Email</label>
              <Input placeholder="email@school.edu" type="email" />
            </div>
            <div>
              <label className="text-sm font-medium">Phone</label>
              <Input placeholder="Phone number" />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Qualifications</label>
            <Input placeholder="e.g., M.Ed., B.A., Ph.D." />
          </div>
          <div>
            <label className="text-sm font-medium">Bio</label>
            <Textarea 
              placeholder="Brief biography..." 
              className="min-h-[100px]"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Profile Photo</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <UploadIcon className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <p className="text-sm text-gray-500">
                Click to upload profile photo
              </p>
              <p className="text-xs text-gray-400 mt-1">
                PNG, JPG up to 5MB
              </p>
            </div>
          </div>
          <Button>Add Team Member</Button>
        </CardContent>
      </Card>

      {/* Leadership Team List */}
      <Card>
        <CardHeader>
          <CardTitle>Leadership Team</CardTitle>
          <CardDescription>
            Manage existing leadership team members
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <UsersIcon className="w-12 h-12 mx-auto mb-4" />
            <p>No team members found. Add your first team member above.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LeadershipManager;
