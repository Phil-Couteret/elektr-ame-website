import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Plus, Edit2, Trash2, User, Music, ExternalLink } from "lucide-react";
import { useAdminData } from "@/hooks/useAdminData";
import { Artist, SocialLinks } from "@/types/admin";

const SOCIAL_PLATFORMS = [
  { key: 'soundcloud', label: 'SoundCloud', icon: '🎵' },
  { key: 'beatport', label: 'Beatport', icon: '🎧' },
  { key: 'instagram', label: 'Instagram', icon: '📷' },
  { key: 'residentAdvisor', label: 'Resident Advisor', icon: '🎪' },
  { key: 'linktree', label: 'Linktree', icon: '🌳' },
  { key: 'tiktok', label: 'TikTok', icon: '📱' },
  { key: 'facebook', label: 'Facebook', icon: '👥' },
  { key: 'twitter', label: 'Twitter/X', icon: '🐦' },
  { key: 'youtube', label: 'YouTube', icon: '📺' },
  { key: 'spotify', label: 'Spotify', icon: '🎶' }
];

const ArtistsManager = () => {
  const { artists, addArtist, updateArtist, deleteArtist, validateArtist } = useAdminData();
  const [isEditing, setIsEditing] = useState(false);
  const [editingArtist, setEditingArtist] = useState<Artist | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    name: "",
    nickname: "",
    bio: "",
    picture: "",
    socialLinks: {} as SocialLinks
  });

  const resetForm = () => {
    setFormData({
      name: "",
      nickname: "",
      bio: "",
      picture: "",
      socialLinks: {}
    });
    setIsEditing(false);
    setEditingArtist(null);
    setShowForm(false);
    setErrors([]);
  };

  const handleEdit = (artist: Artist) => {
    setFormData({
      name: artist.name,
      nickname: artist.nickname || "",
      bio: artist.bio,
      picture: artist.picture || "",
      socialLinks: { ...artist.socialLinks }
    });
    setEditingArtist(artist);
    setIsEditing(true);
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationErrors = validateArtist(formData);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (isEditing && editingArtist) {
      updateArtist(editingArtist.id, formData);
    } else {
      addArtist(formData);
    }

    resetForm();
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this artist?")) {
      deleteArtist(id);
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

  const handleSocialLinkChange = (platform: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [platform]: value
      }
    }));
  };

  const getSocialLinkCount = (socialLinks: SocialLinks) => {
    return Object.values(socialLinks).filter(link => link?.trim()).length;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Artists Management</h2>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="bg-electric-blue hover:bg-electric-blue/80 text-deep-purple"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Artist
        </Button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <Card className="bg-black/40 border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <User className="h-5 w-5 text-electric-blue" />
              {isEditing ? "Edit Artist" : "Add New Artist"}
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-white">
                    Artist Name *
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                    placeholder="Enter artist name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nickname" className="text-white">
                    Nickname (Optional)
                  </Label>
                  <Input
                    id="nickname"
                    value={formData.nickname}
                    onChange={(e) => setFormData(prev => ({ ...prev, nickname: e.target.value }))}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                    placeholder="Enter nickname or stage name"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio" className="text-white">
                  Biography *
                </Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  placeholder="Enter artist biography"
                  rows={4}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="picture" className="text-white">
                  Artist Picture
                </Label>
                <div className="space-y-2">
                  <Input
                    id="picture"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="bg-white/10 border-white/20 text-white file:bg-electric-blue file:text-deep-purple file:border-0 file:rounded-md file:px-3 file:py-1"
                  />
                  {formData.picture && (
                    <div className="mt-2">
                      <img 
                        src={formData.picture} 
                        alt="Preview" 
                        className="h-32 w-32 rounded-full object-cover border border-white/20"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Social Media Links */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Label className="text-white">Social Media Links</Label>
                  <span className="text-sm text-electric-blue">
                    (At least one is required)
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {SOCIAL_PLATFORMS.map((platform) => (
                    <div key={platform.key} className="space-y-2">
                      <Label htmlFor={platform.key} className="text-white text-sm flex items-center gap-2">
                        <span>{platform.icon}</span>
                        {platform.label}
                      </Label>
                      <Input
                        id={platform.key}
                        value={formData.socialLinks[platform.key as keyof SocialLinks] || ""}
                        onChange={(e) => handleSocialLinkChange(platform.key, e.target.value)}
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                        placeholder={`Enter ${platform.label} URL`}
                      />
                    </div>
                  ))}
                </div>
                
                <div className="text-sm text-white/70">
                  Social links added: {getSocialLinkCount(formData.socialLinks)}
                  {getSocialLinkCount(formData.socialLinks) === 0 && (
                    <span className="text-red-400 ml-2">⚠️ At least one social link is required</span>
                  )}
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  type="submit"
                  className="bg-electric-blue hover:bg-electric-blue/80 text-deep-purple"
                >
                  {isEditing ? "Update Artist" : "Add Artist"}
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

      {/* Artists List */}
      <div className="grid gap-4">
        {artists.length === 0 ? (
          <Card className="bg-black/40 border-white/10">
            <CardContent className="p-8 text-center">
              <User className="h-12 w-12 mx-auto mb-4 text-white/50" />
              <p className="text-white/70">No artists found. Add your first artist to get started!</p>
            </CardContent>
          </Card>
        ) : (
          artists.map((artist) => (
            <Card key={artist.id} className="bg-black/40 border-white/10">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      {artist.picture ? (
                        <img 
                          src={artist.picture} 
                          alt={artist.name} 
                          className="h-16 w-16 rounded-full object-cover border border-white/20"
                        />
                      ) : (
                        <div className="h-16 w-16 rounded-full bg-electric-blue/20 flex items-center justify-center border border-white/20">
                          <User className="h-8 w-8 text-electric-blue" />
                        </div>
                      )}
                      <div>
                        <h3 className="text-xl font-semibold text-white">
                          {artist.name}
                          {artist.nickname && (
                            <span className="text-electric-blue ml-2">({artist.nickname})</span>
                          )}
                        </h3>
                        <div className="text-sm text-white/70 mt-1">
                          {getSocialLinkCount(artist.socialLinks)} social link(s)
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-white/80 mb-4 line-clamp-3">{artist.bio}</p>
                    
                    {/* Social Links */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {Object.entries(artist.socialLinks).map(([platform, url]) => {
                        if (!url?.trim()) return null;
                        const platformInfo = SOCIAL_PLATFORMS.find(p => p.key === platform);
                        return (
                          <a
                            key={platform}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-3 py-1 bg-electric-blue/20 text-electric-blue rounded-full text-sm hover:bg-electric-blue/30 transition-colors"
                          >
                            <span>{platformInfo?.icon || '🔗'}</span>
                            <span>{platformInfo?.label || platform}</span>
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        );
                      })}
                    </div>
                    
                    <div className="text-xs text-white/50">
                      Created: {new Date(artist.createdAt).toLocaleString()}
                      {artist.updatedAt !== artist.createdAt && (
                        <> | Updated: {new Date(artist.updatedAt).toLocaleString()}</>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(artist)}
                      className="border-electric-blue text-electric-blue hover:bg-electric-blue/20"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(artist.id)}
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

export default ArtistsManager;

