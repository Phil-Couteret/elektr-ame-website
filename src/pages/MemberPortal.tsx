import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  User, 
  CreditCard, 
  Download, 
  Calendar, 
  Mail, 
  Phone, 
  MapPin,
  Edit,
  QrCode,
  CheckCircle,
  Clock,
  XCircle,
  Loader2,
  Save,
  X as CloseIcon,
  RefreshCw,
  LogOut
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import MemberCard from "@/components/MemberCard";

interface MemberData {
  id: number;
  email: string;
  first_name: string;
  second_name: string;
  artist_name?: string;
  phone?: string;
  address?: string;
  city?: string;
  postal_code?: string;
  country?: string;
  status: 'pending' | 'approved' | 'rejected';
  membership_type: 'free' | 'basic' | 'sponsor' | 'lifetime';
  membership_start_date?: string;
  membership_end_date?: string;
  payment_status: 'unpaid' | 'paid' | 'overdue';
  is_dj: boolean;
  is_producer: boolean;
  is_vj: boolean;
  is_visual_artist: boolean;
  is_fan: boolean;
  created_at: string;
}

const MemberPortal = () => {
  const [memberData, setMemberData] = useState<MemberData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editFormData, setEditFormData] = useState({
    first_name: '',
    second_name: '',
    artist_name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postal_code: '',
    country: ''
  });
  const { toast } = useToast();
  const { t } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    fetchMemberData();
  }, []);

  const fetchMemberData = async () => {
    try {
      const response = await fetch('/api/member-profile.php', {
        method: 'GET',
        credentials: 'include',
      });

      const data = await response.json();

      if (data.success && data.member) {
        setMemberData(data.member);
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to load member data",
          variant: "destructive",
        });
        // Redirect to login or join page
        navigate('/join-us');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Network error. Please try again.",
        variant: "destructive",
      });
      navigate('/join-us');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/50"><CheckCircle className="h-3 w-3 mr-1" />Approved</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/50"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/50"><XCircle className="h-3 w-3 mr-1" />Rejected</Badge>;
      default:
        return null;
    }
  };

  const getMembershipTypeBadge = (type: string) => {
    const types = {
      free: { label: t('portal.membership.free'), color: 'bg-gray-500/20 text-gray-400 border-gray-500/50' },
      basic: { label: t('portal.membership.basic'), color: 'bg-blue-500/20 text-blue-400 border-blue-500/50' },
      sponsor: { label: t('portal.membership.sponsor'), color: 'bg-purple-500/20 text-purple-400 border-purple-500/50' },
      lifetime: { label: t('portal.membership.lifetime'), color: 'bg-gold-500/20 text-yellow-400 border-yellow-500/50' },
    };
    const typeInfo = types[type as keyof typeof types] || types.free;
    return <Badge className={typeInfo.color}>{typeInfo.label}</Badge>;
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/50">Paid</Badge>;
      case 'unpaid':
        return <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/50">Unpaid</Badge>;
      case 'overdue':
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/50">Overdue</Badge>;
      default:
        return null;
    }
  };

  const getRoles = () => {
    if (!memberData) return [];
    const roles = [];
    if (memberData.is_dj) roles.push('DJ');
    if (memberData.is_producer) roles.push('Producer');
    if (memberData.is_vj) roles.push('VJ');
    if (memberData.is_visual_artist) roles.push('Visual Artist');
    if (memberData.is_fan) roles.push('Fan');
    return roles;
  };

  const downloadMemberCard = () => {
    toast({
      title: "Coming Soon",
      description: "Digital card download will be available soon!",
    });
  };

  const startEditing = () => {
    if (memberData) {
      setEditFormData({
        first_name: memberData.first_name,
        second_name: memberData.second_name,
        artist_name: memberData.artist_name || '',
        email: memberData.email,
        phone: memberData.phone || '',
        address: memberData.address || '',
        city: memberData.city || '',
        postal_code: memberData.postal_code || '',
        country: memberData.country || ''
      });
      setIsEditing(true);
    }
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setEditFormData({
      first_name: '',
      second_name: '',
      artist_name: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      postal_code: '',
      country: ''
    });
  };

  const saveProfile = async () => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/member-profile-update.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(editFormData),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: t('portal.profile.updateSuccess'),
          description: t('portal.profile.updateSuccessMessage'),
        });
        setIsEditing(false);
        // Refresh member data
        fetchMemberData();
      } else {
        throw new Error(data.error || 'Update failed');
      }
    } catch (error) {
      toast({
        title: t('portal.profile.updateError'),
        description: error instanceof Error ? error.message : t('portal.profile.updateErrorMessage'),
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleRenewal = () => {
    toast({
      title: t('portal.renewal.comingSoon'),
      description: t('portal.renewal.comingSoonMessage'),
    });
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/member-logout.php', {
        method: 'POST',
        credentials: 'include',
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: t('portal.logout.success'),
          description: t('portal.logout.goodbye'),
        });
        navigate('/');
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Logout error:', error);
      // Even if logout API fails, redirect to home
      navigate('/');
    }
  };

  const isExpiringSoon = () => {
    if (!memberData?.membership_end_date) return false;
    const expiryDate = new Date(memberData.membership_end_date);
    const today = new Date();
    const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
    return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black flex items-center justify-center">
        <Loader2 className="h-12 w-12 text-blue-light animate-spin" />
      </div>
    );
  }

  if (!memberData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                {t('portal.title')}
              </h1>
              <p className="text-white/70">
                {t('portal.welcomeBack', { name: memberData.first_name })}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => navigate('/')}
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
              >
                {t('portal.backToHome')}
              </Button>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="border-red-500/50 text-red-400 hover:bg-red-500/20"
              >
                <LogOut className="h-4 w-4 mr-2" />
                {t('portal.logout.button')}
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-black/40 border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm mb-1">Status</p>
                  {getStatusBadge(memberData.status)}
                </div>
                <User className="h-10 w-10 text-blue-light" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/40 border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm mb-1">Membership</p>
                  {getMembershipTypeBadge(memberData.membership_type)}
                </div>
                <CreditCard className="h-10 w-10 text-blue-light" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/40 border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm mb-1">Payment</p>
                  {getPaymentStatusBadge(memberData.payment_status)}
                </div>
                <CheckCircle className="h-10 w-10 text-blue-light" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 bg-black/40 border-white/10">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="card">Digital Card</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="mt-6 space-y-6">
            <Card className="bg-black/40 border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <User className="h-5 w-5 text-blue-light" />
                  Membership Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-white/70 text-sm mb-1">Member ID</p>
                    <p className="text-white font-mono">EA-{String(memberData.id).padStart(6, '0')}</p>
                  </div>
                  <div>
                    <p className="text-white/70 text-sm mb-1">Member Since</p>
                    <p className="text-white">{new Date(memberData.created_at).toLocaleDateString()}</p>
                  </div>
                  {memberData.membership_start_date && (
                    <div>
                      <p className="text-white/70 text-sm mb-1">Membership Start</p>
                      <p className="text-white">{new Date(memberData.membership_start_date).toLocaleDateString()}</p>
                    </div>
                  )}
                  {memberData.membership_end_date && (
                    <div>
                      <p className="text-white/70 text-sm mb-1">Membership Expires</p>
                      <p className="text-white">{new Date(memberData.membership_end_date).toLocaleDateString()}</p>
                    </div>
                  )}
                </div>

                {getRoles().length > 0 && (
                  <div>
                    <p className="text-white/70 text-sm mb-2">Roles</p>
                    <div className="flex flex-wrap gap-2">
                      {getRoles().map((role) => (
                        <Badge key={role} className="bg-blue-500/20 text-blue-400 border-blue-500/50">
                          {role}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {memberData.status === 'approved' && memberData.payment_status !== 'overdue' && (
                  <div className="pt-4 border-t border-white/10">
                    <Button
                      className="w-full bg-blue-medium hover:bg-blue-dark text-white"
                      onClick={downloadMemberCard}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download Membership Card
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Renewal Reminder */}
            {isExpiringSoon() && (
              <Card className="bg-orange-500/10 border-orange-500/50">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <RefreshCw className="h-5 w-5 text-orange-400 mt-0.5" />
                    <div className="flex-1">
                      <h3 className="text-white font-semibold mb-1">{t('portal.renewal.title')}</h3>
                      <p className="text-white/70 text-sm mb-4">
                        {t('portal.renewal.message', { date: memberData.membership_end_date ? new Date(memberData.membership_end_date).toLocaleDateString() : '' })}
                      </p>
                      <Button
                        onClick={handleRenewal}
                        className="bg-orange-500 hover:bg-orange-600 text-white"
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        {t('portal.renewal.button')}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {memberData.status === 'pending' && (
              <Card className="bg-yellow-500/10 border-yellow-500/50">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-yellow-400 mt-0.5" />
                    <div>
                      <h3 className="text-white font-semibold mb-1">{t('portal.overview.pending.title')}</h3>
                      <p className="text-white/70 text-sm">
                        {t('portal.overview.pending.message')}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Digital Card Tab */}
          <TabsContent value="card" className="mt-6">
            {memberData.status === 'approved' ? (
              <MemberCard
                memberId={memberData.id}
                firstName={memberData.first_name}
                secondName={memberData.second_name}
                artistName={memberData.artist_name}
                membershipType={memberData.membership_type}
                status={memberData.status}
                memberSince={memberData.created_at}
                expiryDate={memberData.membership_end_date}
              />
            ) : (
              <Card className="bg-black/40 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-blue-light" />
                    Digital Membership Card
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center justify-center py-12">
                    <Clock className="h-32 w-32 text-yellow-400 mb-6" />
                    <p className="text-white text-center mb-4 text-lg font-semibold">
                      Card Not Available
                    </p>
                    <p className="text-white/70 text-center max-w-md">
                      Your digital membership card will be available once your membership is approved.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="mt-6">
            <Card className="bg-black/40 border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <User className="h-5 w-5 text-blue-light" />
                    {t('portal.profile.title')}
                  </div>
                  {!isEditing && (
                    <Button
                      onClick={startEditing}
                      variant="outline"
                      size="sm"
                      className="border-blue-light text-blue-light hover:bg-blue-light/10"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      {t('portal.profile.editProfile')}
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {!isEditing ? (
                  /* View Mode */
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 pb-4 border-b border-white/10">
                      <Mail className="h-5 w-5 text-white/50" />
                      <div className="flex-1">
                        <p className="text-white/70 text-sm">{t('portal.profile.email')}</p>
                        <p className="text-white">{memberData.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 pb-4 border-b border-white/10">
                      <User className="h-5 w-5 text-white/50" />
                      <div className="flex-1">
                        <p className="text-white/70 text-sm">{t('portal.profile.name')}</p>
                        <p className="text-white">{memberData.first_name} {memberData.second_name}</p>
                        {memberData.artist_name && (
                          <p className="text-blue-light text-sm">{t('portal.profile.artist')}: {memberData.artist_name}</p>
                        )}
                      </div>
                    </div>

                    {memberData.phone && (
                      <div className="flex items-center gap-3 pb-4 border-b border-white/10">
                        <Phone className="h-5 w-5 text-white/50" />
                        <div className="flex-1">
                          <p className="text-white/70 text-sm">{t('portal.profile.phone')}</p>
                          <p className="text-white">{memberData.phone}</p>
                        </div>
                      </div>
                    )}

                    {(memberData.address || memberData.city || memberData.country) && (
                      <div className="flex items-start gap-3 pb-4 border-b border-white/10">
                        <MapPin className="h-5 w-5 text-white/50 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-white/70 text-sm">{t('portal.profile.address')}</p>
                          <p className="text-white">
                            {memberData.address && <>{memberData.address}<br /></>}
                            {memberData.city && <>{memberData.city} </>}
                            {memberData.postal_code && <>{memberData.postal_code}<br /></>}
                            {memberData.country}
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-white/50" />
                      <div className="flex-1">
                        <p className="text-white/70 text-sm">{t('portal.overview.memberSince')}</p>
                        <p className="text-white">{new Date(memberData.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Edit Mode */
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="first_name" className="text-white">First Name *</Label>
                        <Input
                          id="first_name"
                          value={editFormData.first_name}
                          onChange={(e) => setEditFormData({...editFormData, first_name: e.target.value})}
                          className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="second_name" className="text-white">Last Name *</Label>
                        <Input
                          id="second_name"
                          value={editFormData.second_name}
                          onChange={(e) => setEditFormData({...editFormData, second_name: e.target.value})}
                          className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="artist_name" className="text-white">Artist Name</Label>
                      <Input
                        id="artist_name"
                        value={editFormData.artist_name}
                        onChange={(e) => setEditFormData({...editFormData, artist_name: e.target.value})}
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                        placeholder="e.g., DJ Shadow"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-white">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={editFormData.email}
                        onChange={(e) => setEditFormData({...editFormData, email: e.target.value})}
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-white">Phone</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={editFormData.phone}
                        onChange={(e) => setEditFormData({...editFormData, phone: e.target.value})}
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                        placeholder="+34 123 456 789"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address" className="text-white">Street Address</Label>
                      <Input
                        id="address"
                        value={editFormData.address}
                        onChange={(e) => setEditFormData({...editFormData, address: e.target.value})}
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city" className="text-white">City</Label>
                        <Input
                          id="city"
                          value={editFormData.city}
                          onChange={(e) => setEditFormData({...editFormData, city: e.target.value})}
                          className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="postal_code" className="text-white">Postal Code</Label>
                        <Input
                          id="postal_code"
                          value={editFormData.postal_code}
                          onChange={(e) => setEditFormData({...editFormData, postal_code: e.target.value})}
                          className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="country" className="text-white">Country</Label>
                        <Input
                          id="country"
                          value={editFormData.country}
                          onChange={(e) => setEditFormData({...editFormData, country: e.target.value})}
                          className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                        />
                      </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Button
                        onClick={saveProfile}
                        disabled={isSaving}
                        className="flex-1 bg-blue-medium hover:bg-blue-dark text-white"
                      >
                        {isSaving ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="h-4 w-4 mr-2" />
                            {t('portal.profile.saveChanges')}
                          </>
                        )}
                      </Button>
                      <Button
                        onClick={cancelEditing}
                        disabled={isSaving}
                        variant="outline"
                        className="border-white/20 text-white hover:bg-white/10"
                      >
                        <CloseIcon className="h-4 w-4 mr-2" />
                        {t('portal.profile.cancel')}
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MemberPortal;

