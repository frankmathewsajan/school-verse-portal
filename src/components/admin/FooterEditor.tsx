import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  GripVertical,
  Eye,
  EyeOff,
  Link,
  Phone,
  Mail,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Type
} from 'lucide-react';
import { ContentService, type FooterSection } from '@/services/contentService';

interface FooterEditorProps {
  onSave?: () => void;
}

const FooterEditor: React.FC<FooterEditorProps> = ({ onSave }) => {
  const [footerSections, setFooterSections] = useState<FooterSection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingSection, setEditingSection] = useState<FooterSection | null>(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    section_type: 'links' as FooterSection['section_type'],
    content: {} as Record<string, any>,
    display_order: 0,
    is_active: true
  });

  useEffect(() => {
    loadFooterSections();
  }, []);

  const loadFooterSections = async () => {
    try {
      setIsLoading(true);
      const sections = await ContentService.getAllFooterSections();
      setFooterSections(sections);
    } catch (error) {
      console.error('Error loading footer sections:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      if (editingSection) {
        await ContentService.updateFooterSection(editingSection.id, formData);
      } else {
        await ContentService.createFooterSection(formData);
      }
      
      await loadFooterSections();
      resetForm();
      onSave?.();
      
      // Notify other components that footer content has been updated
      window.dispatchEvent(new CustomEvent('footerContentUpdated'));
    } catch (error) {
      console.error('Error saving footer section:', error);
    }
  };

  const handleEdit = (section: FooterSection) => {
    setEditingSection(section);
    setFormData({
      title: section.title,
      section_type: section.section_type,
      content: section.content as Record<string, any>,
      display_order: section.display_order,
      is_active: section.is_active
    });
    setIsFormVisible(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this footer section?')) {
      try {
        await ContentService.deleteFooterSection(id);
        await loadFooterSections();
        onSave?.();
        
        // Notify other components that footer content has been updated
        window.dispatchEvent(new CustomEvent('footerContentUpdated'));
      } catch (error) {
        console.error('Error deleting footer section:', error);
      }
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      await ContentService.toggleFooterSectionStatus(id);
      await loadFooterSections();
      onSave?.();
      
      // Notify other components that footer content has been updated
      window.dispatchEvent(new CustomEvent('footerContentUpdated'));
    } catch (error) {
      console.error('Error toggling footer section status:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      section_type: 'links',
      content: {},
      display_order: footerSections.length + 1,
      is_active: true
    });
    setEditingSection(null);
    setIsFormVisible(false);
  };

  const renderContentFields = () => {
    switch (formData.section_type) {
      case 'links':
        return (
          <div className="space-y-4">
            <Label>Links</Label>
            <div className="space-y-2">
              {(formData.content.items || []).map((item: any, index: number) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder="Label"
                    value={item.label || ''}
                    onChange={(e) => {
                      const newItems = [...(formData.content.items || [])];
                      newItems[index] = { ...item, label: e.target.value };
                      setFormData({ ...formData, content: { ...formData.content, items: newItems } });
                    }}
                  />
                  <Input
                    placeholder="URL"
                    value={item.url || ''}
                    onChange={(e) => {
                      const newItems = [...(formData.content.items || [])];
                      newItems[index] = { ...item, url: e.target.value };
                      setFormData({ ...formData, content: { ...formData.content, items: newItems } });
                    }}
                  />
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      const newItems = formData.content.items.filter((_: any, i: number) => i !== index);
                      setFormData({ ...formData, content: { ...formData.content, items: newItems } });
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  const newItems = [...(formData.content.items || []), { label: '', url: '' }];
                  setFormData({ ...formData, content: { ...formData.content, items: newItems } });
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Link
              </Button>
            </div>
          </div>
        );

      case 'contact':
        return (
          <div className="space-y-4">
            <div>
              <Label>Email</Label>
              <Input
                type="email"
                value={formData.content.email || ''}
                onChange={(e) => setFormData({ ...formData, content: { ...formData.content, email: e.target.value } })}
              />
            </div>
            <div>
              <Label>Phone</Label>
              <Input
                type="tel"
                value={formData.content.phone || ''}
                onChange={(e) => setFormData({ ...formData, content: { ...formData.content, phone: e.target.value } })}
              />
            </div>
            <div>
              <Label>Address</Label>
              <Textarea
                value={formData.content.address || ''}
                onChange={(e) => setFormData({ ...formData, content: { ...formData.content, address: e.target.value } })}
              />
            </div>
          </div>
        );

      case 'social':
        return (
          <div className="space-y-4">
            <Label>Social Media Platforms</Label>
            <div className="space-y-2">
              {(formData.content.platforms || []).map((platform: any, index: number) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder="Platform Name"
                    value={platform.name || ''}
                    onChange={(e) => {
                      const newPlatforms = [...(formData.content.platforms || [])];
                      newPlatforms[index] = { ...platform, name: e.target.value };
                      setFormData({ ...formData, content: { ...formData.content, platforms: newPlatforms } });
                    }}
                  />
                  <Input
                    placeholder="URL"
                    value={platform.url || ''}
                    onChange={(e) => {
                      const newPlatforms = [...(formData.content.platforms || [])];
                      newPlatforms[index] = { ...platform, url: e.target.value };
                      setFormData({ ...formData, content: { ...formData.content, platforms: newPlatforms } });
                    }}
                  />
                  <Input
                    placeholder="Icon"
                    value={platform.icon || ''}
                    onChange={(e) => {
                      const newPlatforms = [...(formData.content.platforms || [])];
                      newPlatforms[index] = { ...platform, icon: e.target.value };
                      setFormData({ ...formData, content: { ...formData.content, platforms: newPlatforms } });
                    }}
                  />
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      const newPlatforms = formData.content.platforms.filter((_: any, i: number) => i !== index);
                      setFormData({ ...formData, content: { ...formData.content, platforms: newPlatforms } });
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  const newPlatforms = [...(formData.content.platforms || []), { name: '', url: '', icon: '' }];
                  setFormData({ ...formData, content: { ...formData.content, platforms: newPlatforms } });
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Platform
              </Button>
            </div>
          </div>
        );

      case 'custom':
        return (
          <div>
            <Label>Custom Content</Label>
            <Textarea
              value={formData.content.text || ''}
              onChange={(e) => setFormData({ ...formData, content: { ...formData.content, text: e.target.value } })}
              placeholder="Enter custom content..."
            />
          </div>
        );

      default:
        return null;
    }
  };

  const getSectionIcon = (type: FooterSection['section_type']) => {
    switch (type) {
      case 'links':
        return <Link className="w-4 h-4" />;
      case 'contact':
        return <Phone className="w-4 h-4" />;
      case 'social':
        return <Facebook className="w-4 h-4" />;
      case 'custom':
        return <Type className="w-4 h-4" />;
      default:
        return <Type className="w-4 h-4" />;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading footer sections...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Footer Management</CardTitle>
          <Button onClick={() => setIsFormVisible(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Section
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {footerSections.length === 0 ? (
              <Alert>
                <AlertDescription>
                  No footer sections found. Create your first section to get started!
                </AlertDescription>
              </Alert>
            ) : (
              footerSections.map((section) => (
                <div key={section.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <GripVertical className="w-4 h-4 text-gray-400" />
                    {getSectionIcon(section.section_type)}
                    <div>
                      <div className="font-medium">{section.title}</div>
                      <div className="text-sm text-gray-500">
                        {section.section_type.charAt(0).toUpperCase() + section.section_type.slice(1)} Section
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={section.is_active ? "default" : "secondary"}>
                      {section.is_active ? "Active" : "Inactive"}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleStatus(section.id)}
                    >
                      {section.is_active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(section)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(section.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {isFormVisible && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>
              {editingSection ? 'Edit Footer Section' : 'Add Footer Section'}
            </CardTitle>
            <Button variant="ghost" onClick={resetForm}>
              <X className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label>Title</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Section title"
                />
              </div>

              <div>
                <Label>Section Type</Label>
                <Select
                  value={formData.section_type}
                  onValueChange={(value) => setFormData({ 
                    ...formData, 
                    section_type: value as FooterSection['section_type'],
                    content: {} // Reset content when type changes
                  })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="links">Links</SelectItem>
                    <SelectItem value="contact">Contact Info</SelectItem>
                    <SelectItem value="social">Social Media</SelectItem>
                    <SelectItem value="custom">Custom Content</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {renderContentFields()}

              <div>
                <Label>Display Order</Label>
                <Input
                  type="number"
                  value={formData.display_order}
                  onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                />
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
                <Label>Active</Label>
              </div>

              <Separator />

              <div className="flex gap-2">
                <Button onClick={handleSave}>
                  <Save className="w-4 h-4 mr-2" />
                  {editingSection ? 'Update' : 'Create'}
                </Button>
                <Button variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FooterEditor;
