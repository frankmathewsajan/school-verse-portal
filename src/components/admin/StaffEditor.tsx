import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ImageUpload } from '@/components/ui/image-upload';
import { useToast } from '@/hooks/use-toast';
import { 
  Save, Loader2, CheckCircle, XCircle, Plus, Trash2, Edit, 
  Users, Image, FileText, Eye, EyeOff, Mail, Phone
} from 'lucide-react';
import { ContentService } from '@/services/contentService';

interface StaffData {
  id: string;
  name: string;
  position: string;
  bio: string;
  image_url: string;
  email: string;
  phone: string;
  department: string;
  display_order: number;
  is_active: boolean;
}

export function StaffEditor() {
  const [staff, setStaff] = useState<StaffData[]>([]);
  const [editingStaff, setEditingStaff] = useState<StaffData | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadStaff();
  }, []);

  const loadStaff = async () => {
    try {
      setLoading(true);
      setLoadError(null);
      const data = await ContentService.getStaffMembers();
      setStaff(data);
    } catch (error) {
      console.error('Error loading staff:', error);
      setLoadError('Failed to load staff members. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveStaff = async (staffData: Omit<StaffData, 'id' | 'display_order' | 'is_active'>) => {
    try {
      setSaving(true);
      let success = false;

      if (editingStaff) {
        // Update existing staff member
        success = await ContentService.updateStaffMember(editingStaff.id, staffData);
      } else {
        // Create new staff member
        success = await ContentService.createStaffMember({
          ...staffData,
          display_order: staff.length + 1,
          is_active: true
        });
      }

      if (success) {
        toast({
          title: "Success",
          description: editingStaff ? "Staff member updated successfully" : "Staff member created successfully",
        });
        setEditingStaff(null);
        setShowAddForm(false);
        await loadStaff();
      } else {
        toast({
          title: "Error",
          description: "Failed to save staff member",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error saving staff:', error);
      toast({
        title: "Error",
        description: "An error occurred while saving",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteStaff = async (id: string) => {
    if (!confirm('Are you sure you want to delete this staff member?')) return;

    try {
      const success = await ContentService.deleteStaffMember(id);
      if (success) {
        toast({
          title: "Success",
          description: "Staff member deleted successfully",
        });
        await loadStaff();
      } else {
        toast({
          title: "Error",
          description: "Failed to delete staff member",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error deleting staff:', error);
      toast({
        title: "Error",
        description: "An error occurred while deleting",
        variant: "destructive"
      });
    }
  };

  const StaffForm = ({ staffMember, onSave, onCancel }: {
    staffMember?: StaffData;
    onSave: (staff: Omit<StaffData, 'id' | 'display_order' | 'is_active'>) => void;
    onCancel: () => void;
  }) => {
    const [formData, setFormData] = useState({
      name: staffMember?.name || '',
      position: staffMember?.position || '',
      bio: staffMember?.bio || '',
      image_url: staffMember?.image_url || '',
      email: staffMember?.email || '',
      phone: staffMember?.phone || '',
      department: staffMember?.department || ''
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!formData.name.trim() || !formData.position.trim()) {
        toast({
          title: "Error",
          description: "Please fill in the required fields (Name and Position)",
          variant: "destructive"
        });
        return;
      }
      onSave(formData);
    };

    return (
      <Card>
        <CardHeader>
          <CardTitle>{staffMember ? 'Edit Staff Member' : 'Add New Staff Member'}</CardTitle>
          <CardDescription>
            {staffMember ? 'Update the staff member information' : 'Create a new staff member profile'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Dr. John Smith"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="position">Position *</Label>
                <Input
                  id="position"
                  value={formData.position}
                  onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
                  placeholder="e.g., Principal"
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="john.smith@school.edu"
                />
              </div>
              
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                value={formData.department}
                onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                placeholder="e.g., Administration, Science, Mathematics"
              />
            </div>
            
            <div>
              <Label htmlFor="bio">Biography</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                placeholder="Brief biography and qualifications..."
                rows={4}
              />
            </div>
            
            <div>
              <ImageUpload
                label="Staff Photo"
                value={formData.image_url}
                onChange={(url) => setFormData(prev => ({ ...prev, image_url: url }))}
                folder="staff"
              />
            </div>
            
            <div className="flex gap-2">
              <Button type="submit" disabled={saving}>
                {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                {saving ? 'Saving...' : 'Save Staff Member'}
              </Button>
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading staff members...</span>
      </div>
    );
  }

  if (loadError) {
    return (
      <Alert variant="destructive">
        <XCircle className="h-4 w-4" />
        <AlertDescription>
          {loadError}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={loadStaff}
            className="ml-2"
          >
            Retry
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Users className="h-6 w-6" />
            Staff Editor
          </h2>
          <p className="text-muted-foreground">
            Manage staff members displayed on the About page
          </p>
        </div>
        <Button 
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Staff Member
        </Button>
      </div>

      {/* Add/Edit Form */}
      {(showAddForm || editingStaff) && (
        <StaffForm
          staffMember={editingStaff || undefined}
          onSave={handleSaveStaff}
          onCancel={() => {
            setShowAddForm(false);
            setEditingStaff(null);
          }}
        />
      )}

      {/* Staff List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {staff.map((member) => (
          <Card key={member.id} className="card-hover">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4 mb-4">
                {member.image_url ? (
                  <div className="h-16 w-16 rounded-full overflow-hidden">
                    <img 
                      src={member.image_url} 
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center">
                    <Users className="h-8 w-8 text-gray-400" />
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-semibold">{member.name}</h3>
                    {member.is_active ? (
                      <Eye className="h-4 w-4 text-green-500" />
                    ) : (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{member.position}</p>
                  {member.department && (
                    <p className="text-xs text-muted-foreground">{member.department}</p>
                  )}
                </div>
              </div>
              
              {member.bio && (
                <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                  {member.bio}
                </p>
              )}
              
              <div className="space-y-2 mb-4">
                {member.email && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <span>{member.email}</span>
                  </div>
                )}
                {member.phone && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <span>{member.phone}</span>
                  </div>
                )}
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingStaff(member)}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeleteStaff(member.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {staff.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No staff members yet</h3>
            <p className="text-muted-foreground mb-4">
              Add your first staff member to get started
            </p>
            <Button onClick={() => setShowAddForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add First Staff Member
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
