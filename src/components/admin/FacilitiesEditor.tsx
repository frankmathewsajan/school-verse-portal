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
  GripVertical, Building, Image, FileText, Eye, EyeOff
} from 'lucide-react';
import { ContentService } from '@/services/contentService';

interface FacilityData {
  id: string;
  title: string;
  description: string;
  image_url: string;
  display_order: number;
  is_active: boolean;
}

export function FacilitiesEditor() {
  const [facilities, setFacilities] = useState<FacilityData[]>([]);
  const [editingFacility, setEditingFacility] = useState<FacilityData | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadFacilities();
  }, []);

  const loadFacilities = async () => {
    try {
      setLoading(true);
      setLoadError(null);
      const data = await ContentService.getSchoolFacilities();
      setFacilities(data);
    } catch (error) {
      console.error('Error loading facilities:', error);
      setLoadError('Failed to load facilities. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveFacility = async (facility: Omit<FacilityData, 'id' | 'display_order' | 'is_active'>) => {
    try {
      setSaving(true);
      let success = false;

      if (editingFacility) {
        // Update existing facility
        success = await ContentService.updateSchoolFacility(editingFacility.id, facility);
      } else {
        // Create new facility
        success = await ContentService.createSchoolFacility({
          ...facility,
          display_order: facilities.length + 1,
          is_active: true
        });
      }

      if (success) {
        toast({
          title: "Success",
          description: editingFacility ? "Facility updated successfully" : "Facility created successfully",
        });
        setEditingFacility(null);
        setShowAddForm(false);
        await loadFacilities();
      } else {
        toast({
          title: "Error",
          description: "Failed to save facility",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error saving facility:', error);
      toast({
        title: "Error",
        description: "An error occurred while saving",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteFacility = async (id: string) => {
    if (!confirm('Are you sure you want to delete this facility?')) return;

    try {
      const success = await ContentService.deleteSchoolFacility(id);
      if (success) {
        toast({
          title: "Success",
          description: "Facility deleted successfully",
        });
        await loadFacilities();
      } else {
        toast({
          title: "Error",
          description: "Failed to delete facility",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error deleting facility:', error);
      toast({
        title: "Error",
        description: "An error occurred while deleting",
        variant: "destructive"
      });
    }
  };

  const FacilityForm = ({ facility, onSave, onCancel }: {
    facility?: FacilityData;
    onSave: (facility: Omit<FacilityData, 'id' | 'display_order' | 'is_active'>) => void;
    onCancel: () => void;
  }) => {
    const [formData, setFormData] = useState({
      title: facility?.title || '',
      description: facility?.description || '',
      image_url: facility?.image_url || ''
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!formData.title.trim() || !formData.description.trim()) {
        toast({
          title: "Error",
          description: "Please fill in all required fields",
          variant: "destructive"
        });
        return;
      }
      onSave(formData);
    };

    return (
      <Card>
        <CardHeader>
          <CardTitle>{facility ? 'Edit Facility' : 'Add New Facility'}</CardTitle>
          <CardDescription>
            {facility ? 'Update the facility information' : 'Create a new facility entry'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">Facility Name *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., Modern Library"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe the facility and its features..."
                rows={3}
                required
              />
            </div>
            
            <div>
              <ImageUpload
                label="Facility Image"
                value={formData.image_url}
                onChange={(url) => setFormData(prev => ({ ...prev, image_url: url }))}
                folder="facilities"
              />
            </div>
            
            <div className="flex gap-2">
              <Button type="submit" disabled={saving}>
                {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                {saving ? 'Saving...' : 'Save Facility'}
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
        <span className="ml-2">Loading facilities...</span>
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
            onClick={loadFacilities}
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
            <Building className="h-6 w-6" />
            Facilities Editor
          </h2>
          <p className="text-muted-foreground">
            Manage school facilities displayed on the About page
          </p>
        </div>
        <Button 
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Facility
        </Button>
      </div>

      {/* Add/Edit Form */}
      {(showAddForm || editingFacility) && (
        <FacilityForm
          facility={editingFacility || undefined}
          onSave={handleSaveFacility}
          onCancel={() => {
            setShowAddForm(false);
            setEditingFacility(null);
          }}
        />
      )}

      {/* Facilities List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {facilities.map((facility) => (
          <Card key={facility.id} className="card-hover">
            <CardContent className="p-0">
              {facility.image_url && (
                <div className="h-48 overflow-hidden rounded-t-lg">
                  <img 
                    src={facility.image_url} 
                    alt={facility.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold">{facility.title}</h3>
                  <div className="flex items-center gap-1">
                    {facility.is_active ? (
                      <Eye className="h-4 w-4 text-green-500" />
                    ) : (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    )}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  {facility.description}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingFacility(facility)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteFacility(facility.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {facilities.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Building className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No facilities yet</h3>
            <p className="text-muted-foreground mb-4">
              Add your first facility to get started
            </p>
            <Button onClick={() => setShowAddForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add First Facility
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
