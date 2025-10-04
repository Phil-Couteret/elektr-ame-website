import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Plus, Edit2, Trash2, Image, Upload } from "lucide-react";
import { useAdminData } from "@/hooks/useAdminData";
import { GalleryItem } from "@/types/admin";

const GalleryManager = () => {
  const { gallery, addGalleryItem, updateGalleryItem, deleteGalleryItem, validateGalleryItem } = useAdminData();
  const [isEditing, setIsEditing] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    picture: ""
  });

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      picture: ""
    });
    setIsEditing(false);
    setEditingItem(null);
    setShowForm(false);
    setErrors([]);
  };

  const handleEdit = (item: GalleryItem) => {
    setFormData({
      title: item.title,
      description: item.description || "",
      picture: item.picture || ""
    });
    setEditingItem(item);
    setIsEditing(true);
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationErrors = validateGalleryItem(formData);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (isEditing && editingItem) {
      updateGalleryItem(editingItem.id, formData);
    } else {
      addGalleryItem(formData);
    }

    resetForm();
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this gallery item?")) {
      deleteGalleryItem(id);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({
          ...prev,
          picture: e.target?.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Gallery Management</h2>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="bg-electric-blue hover:bg-electric-blue/80 text-deep-purple"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Gallery Item
        </Button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <Card className="bg-black/40 border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Image className="h-5 w-5 text-electric-blue" />
              {isEditing ? "Edit Gallery Item" : "Add New Gallery Item"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {errors.length > 0 && (
                <Alert className="bg-red-500/20 border-red-500/50">
                  <AlertDescription className="text-red-200">
                    <ul className="list-disc list-inside">
                      {errors.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}

              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-white">
                    Title *
                  </Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                    placeholder="Enter gallery item title"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-white">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                    placeholder="Enter description (optional)"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="picture" className="text-white">
                    Picture *
                  </Label>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Input
                        id="picture"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="bg-white/10 border-white/20 text-white file:bg-electric-blue file:text-deep-purple file:border-0 file:rounded-md file:px-3 file:py-1"
                      />
                      <Upload className="h-4 w-4 text-white/50" />
                    </div>
                    <div className="text-sm text-white/70">
                      Or enter image URL:
                    </div>
                    <Input
                      value={formData.picture}
                      onChange={(e) => setFormData(prev => ({ ...prev, picture: e.target.value }))}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                      placeholder="https://example.com/image.jpg"
                    />
                    {formData.picture && (
                      <div className="mt-2">
                        <img 
                          src={formData.picture} 
                          alt="Preview" 
                          className="h-48 w-auto rounded-md border border-white/20"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  type="submit"
                  className="bg-electric-blue hover:bg-electric-blue/80 text-deep-purple"
                >
                  {isEditing ? "Update Item" : "Add Item"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetForm}
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Gallery Items List */}
      <div className="grid gap-4">
        {gallery.length === 0 ? (
          <Card className="bg-black/40 border-white/10">
            <CardContent className="p-8 text-center">
              <Image className="h-12 w-12 mx-auto mb-4 text-white/50" />
              <p className="text-white/70">No gallery items found. Add your first item to get started!</p>
            </CardContent>
          </Card>
        ) : (
          gallery.map((item) => (
            <Card key={item.id} className="bg-black/40 border-white/10">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex gap-4 flex-1">
                    {item.picture && (
                      <img 
                        src={item.picture} 
                        alt={item.title} 
                        className="h-20 w-20 rounded-lg object-cover border border-white/20"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                        }}
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
                      {item.description && (
                        <p className="text-white/80 mb-4">{item.description}</p>
                      )}
                      <div className="text-xs text-white/50">
                        Created: {new Date(item.createdAt).toLocaleString()}
                        {item.updatedAt !== item.createdAt && (
                          <> | Updated: {new Date(item.updatedAt).toLocaleString()}</>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(item)}
                      className="border-electric-blue text-electric-blue hover:bg-electric-blue/20"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(item.id)}
                      className="border-red-400 text-red-400 hover:bg-red-400/20"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default GalleryManager;







