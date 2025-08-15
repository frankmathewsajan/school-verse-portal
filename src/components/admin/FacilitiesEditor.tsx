import React, { useState, useEffect, useCallback } from 'react';
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

interface FacilityFormProps {
  formData: {
    title: string;
    description: string;
    image_url: string;
  };
  setFormData: React.Dispatch<React.SetStateAction<{
    title: string;
    description: string;
    image_url: string;
  }>>;
  editingFacility: FacilityData | null;
  saving: boolean;
  onSubmit: () => void;
  onCancel: () => void;
}

const FacilityForm = React.memo(({ 
  formData, 
  setFormData, 
  editingFacility, 
  saving, 
  onSubmit, 
  onCancel 
}: FacilityFormProps) => {
  const { toast } = useToast();

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
    onSubmit();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{editingFacility ? 'Edit Facility' : 'Add New Facility'}</CardTitle>
        <CardDescription>
          {editingFacility ? 'Update the facility information' : 'Create a new facility entry'}
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
});

FacilityForm.displayName = 'FacilityForm';

export function FacilitiesEditor() {
  const [facilities, setFacilities] = useState<FacilityData[]>([]);
  const [editingFacility, setEditingFacility] = useState<FacilityData | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  
  // Form state managed at the parent level to prevent resets
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image_url: ''
  });
  
  const { toast } = useToast();

  useEffect(() => {
    loadFacilities();
  }, []);

  // Reset form when starting to add/edit
  const resetForm = useCallback((facility?: FacilityData) => {
    setFormData({
      title: facility?.title || '',
      description: facility?.description || '',
      image_url: facility?.image_url || ''
    });
  }, []);

  const startAddingFacility = useCallback(() => {
    resetForm();
    setShowAddForm(true);
    setEditingFacility(null);
  }, [resetForm]);

  const startEditingFacility = useCallback((facility: FacilityData) => {
    resetForm(facility);
    setEditingFacility(facility);
    setShowAddForm(false);
  }, [resetForm]);

  const cancelForm = useCallback(() => {
    setShowAddForm(false);
    setEditingFacility(null);
    resetForm();
  }, [resetForm]);

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

  const handleSaveFacility = useCallback(async () => {
    if (!formData.title.trim() || !formData.description.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      setSaving(true);
      console.log('Saving facility:', formData);
      let success = false;

      if (editingFacility) {
        // Update existing facility
        console.log('Updating existing facility with ID:', editingFacility.id);
        success = await ContentService.updateSchoolFacility(editingFacility.id, formData);
      } else {
        // Create new facility
        console.log('Creating new facility');
        success = await ContentService.createSchoolFacility({
          ...formData,
          display_order: facilities.length + 1,
          is_active: true
        });
      }

      console.log('Save operation result:', success);

      if (success) {
        toast({
          title: "Success",
          description: editingFacility ? "Facility updated successfully" : "Facility created successfully",
        });
        cancelForm(); // This will reset the form and close it
        console.log('Reloading facilities...');
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
  }, [formData, editingFacility, facilities.length, toast, cancelForm]);

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
          onClick={startAddingFacility}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Facility
        </Button>
      </div>

      {/* Add/Edit Form */}
      {(showAddForm || editingFacility) && (
        <FacilityForm 
          formData={formData}
          setFormData={setFormData}
          editingFacility={editingFacility}
          saving={saving}
          onSubmit={handleSaveFacility}
          onCancel={cancelForm}
        />
      )}

      {/* Facilities List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {facilities.map((facility) => (
          <Card key={facility.id} className="card-hover overflow-hidden">
            <CardContent className="p-0">
              {/* Image Section */}
              <div className="relative group">
                {facility.image_url ? (
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={facility.image_url} 
                      alt={facility.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      onLoad={() => console.log('Image loaded successfully:', facility.image_url)}
                      onError={() => console.error('Image failed to load:', facility.image_url)}
                    />
                    {/* Debug info - remove in production */}
                    <div className="absolute bottom-0 left-0 bg-black/70 text-white text-xs p-1">
                      {facility.image_url ? 'Image URL exists' : 'No URL'}
                    </div>
                    {/* Image Overlay with Action Buttons */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => startEditingFacility(facility)}
                        className="bg-white/90 text-black hover:bg-white"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteFacility(facility.id)}
                        className="bg-red-500/90 hover:bg-red-600"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="h-48 bg-gray-100 flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                    <div className="text-center text-gray-400">
                      <Image className="h-12 w-12 mx-auto mb-2" />
                      <p className="text-sm">No image uploaded</p>
                    </div>
                    {/* Action Buttons for No Image */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => startEditingFacility(facility)}
                        className="bg-white/90 text-black hover:bg-white"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteFacility(facility.id)}
                        className="bg-red-500/90 hover:bg-red-600"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                )}
                
                {/* Status Badge */}
                <div className="absolute top-2 right-2">
                  {facility.is_active ? (
                    <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      Active
                    </div>
                  ) : (
                    <div className="bg-gray-500 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
                      <EyeOff className="h-3 w-3" />
                      Hidden
                    </div>
                  )}
                </div>
              </div>
              
              {/* Content Section */}
              <div className="p-4">
                <div className="mb-2">
                  <h3 className="text-lg font-semibold line-clamp-2">{facility.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                  {facility.description}
                </p>
                
                {/* Quick Action Buttons */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => startEditingFacility(facility)}
                    className="flex-1"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteFacility(facility.id)}
                    className="text-destructive hover:text-destructive hover:border-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
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
