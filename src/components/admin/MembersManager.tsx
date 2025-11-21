import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, Users, Loader2, CheckCircle, XCircle, Clock, CreditCard, Calendar, Edit, AlertTriangle, UserPlus, Trash2, Key } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import MembershipDialog from "./MembershipDialog";
import AddMemberDialog from "./AddMemberDialog";
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

interface Member {
  id: number;
  first_name: string;
  last_name: string;
  second_name: string | null;
  artist_name: string | null;
  email: string;
  phone: string;
  street: string | null;
  zip_code: string | null;
  city: string;
  country: string;
  is_dj: boolean;
  is_producer: boolean;
  is_vj: boolean;
  is_visual_artist: boolean;
  is_fan: boolean;
  status: 'pending' | 'approved' | 'rejected';
  membership_type?: 'free_trial' | 'monthly' | 'yearly' | 'lifetime';
  membership_start_date?: string;
  membership_end_date?: string;
  payment_status?: 'unpaid' | 'paid' | 'overdue';
  last_payment_date?: string;
  payment_amount?: string | number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

const MembersManager = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [updatingStatus, setUpdatingStatus] = useState<number | null>(null);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<Member | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [settingPasswordFor, setSettingPasswordFor] = useState<number | null>(null);
  const [generatedPassword, setGeneratedPassword] = useState<{memberId: number, password: string, memberName: string, memberEmail: string} | null>(null);
  const { toast } = useToast();
  const { t } = useLanguage();

  useEffect(() => {
    fetchMembers();
  }, []);

  useEffect(() => {
    // Apply status filter
    if (statusFilter === 'all') {
      setFilteredMembers(members);
    } else if (statusFilter === 'expiring_soon') {
      // Show members expiring in the next 30 days
      const today = new Date();
      const thirtyDaysLater = new Date(today);
      thirtyDaysLater.setDate(today.getDate() + 30);
      
      setFilteredMembers(members.filter(m => {
        if (!m.membership_end_date) return false;
        const endDate = new Date(m.membership_end_date);
        return endDate > today && endDate <= thirtyDaysLater && m.status === 'approved';
      }));
    } else if (statusFilter === 'expired') {
      // Show members with expired memberships
      const today = new Date();
      setFilteredMembers(members.filter(m => {
        if (!m.membership_end_date) return false;
        const endDate = new Date(m.membership_end_date);
        return endDate < today && m.status === 'approved';
      }));
    } else {
      setFilteredMembers(members.filter(m => m.status === statusFilter));
    }
  }, [members, statusFilter]);

  const fetchMembers = async () => {
    try {
      const response = await fetch('/api/members-list.php', {
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch members');
      }
      
      const data = await response.json();
      
      if (data.success) {
        setMembers(data.members);
      } else {
        throw new Error(data.error || 'Failed to load members');
      }
    } catch (error) {
      toast({
        title: t('admin.message.error'),
        description: error instanceof Error ? error.message : t('admin.message.loadError'),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const response = await fetch('/api/members-export.php', {
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to export members');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `elektr-ame-members-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: t('admin.message.success'),
        description: t('admin.message.exportSuccess'),
      });
    } catch (error) {
      toast({
        title: t('admin.message.error'),
        description: error instanceof Error ? error.message : t('admin.message.exportError'),
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleStatusUpdate = async (memberId: number, newStatus: 'approved' | 'rejected') => {
    setUpdatingStatus(memberId);
    try {
      const response = await fetch('/api/members-update-status.php', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          member_id: memberId,
          status: newStatus
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to update status');
      }
      
      const data = await response.json();
      
      if (data.success) {
        toast({
          title: t('admin.message.success'),
          description: t('admin.message.statusUpdated').replace('{status}', newStatus),
        });
        fetchMembers();
      } else {
        throw new Error(data.error || 'Failed to update status');
      }
    } catch (error) {
      toast({
        title: t('admin.message.error'),
        description: error instanceof Error ? error.message : t('admin.message.updateError'),
        variant: "destructive",
      });
    } finally {
      setUpdatingStatus(null);
    }
  };

  const handleEditMembership = (member: Member) => {
    setSelectedMember(member);
    setIsDialogOpen(true);
  };

  const handleDeleteMember = async (member: Member) => {
    if (!memberToDelete) {
      // First click - show confirmation
      setMemberToDelete(member);
      return;
    }

    // Second confirmation - actually delete
    setIsDeleting(true);
    try {
      const response = await fetch('/api/members-delete.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          member_id: member.id
        })
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: t('admin.message.success'),
          description: t('admin.members.deleted'),
        });
        fetchMembers();
        setMemberToDelete(null);
      } else {
        throw new Error(data.error || 'Failed to delete member');
      }
    } catch (error) {
      toast({
        title: t('admin.message.error'),
        description: error instanceof Error ? error.message : t('admin.members.deleteError'),
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSetPassword = async (member: Member) => {
    setSettingPasswordFor(member.id);
    try {
      const response = await fetch('/api/admin-set-member-password.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          member_id: member.id
        })
      });

      const data = await response.json();

      if (data.success) {
        setGeneratedPassword({
          memberId: member.id,
          password: data.new_password,
          memberName: member.first_name + ' ' + member.second_name,
          memberEmail: member.email
        });
      } else {
        throw new Error(data.message || 'Failed to set password');
      }
    } catch (error) {
      toast({
        title: t('admin.message.error'),
        description: error instanceof Error ? error.message : 'Failed to set password',
        variant: 'destructive',
      });
    } finally {
      setSettingPasswordFor(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const config: Record<string, { variant: "default" | "secondary" | "destructive", icon: any }> = {
      pending: { variant: "secondary", icon: Clock },
      approved: { variant: "default", icon: CheckCircle },
      rejected: { variant: "destructive", icon: XCircle }
    };
    
    const { variant, icon: Icon } = config[status] || config.pending;
    
    return (
      <Badge variant={variant} className="flex items-center gap-1 w-fit">
        <Icon className="h-3 w-3" />
        {t(`admin.status.${status}`)}
      </Badge>
    );
  };

  const getMembershipTypeBadge = (type?: string) => {
    if (!type) return <span className="text-white/40">-</span>;
    
    const config: Record<string, { color: string }> = {
      free_trial: { color: 'bg-gray-500' },
      monthly: { color: 'bg-blue-500' },
      yearly: { color: 'bg-purple-500' },
      lifetime: { color: 'bg-green-500' }
    };
    
    const { color } = config[type] || { color: 'bg-gray-500' };
    const label = type === 'free_trial' ? t('admin.membership.freeTrial') :
                  type === 'monthly' ? t('admin.membership.monthly') :
                  type === 'yearly' ? t('admin.membership.yearly') :
                  type === 'lifetime' ? t('admin.membership.lifetime') : type;
    
    return (
      <Badge className={`${color} text-white border-0`}>
        {label}
      </Badge>
    );
  };

  const getPaymentStatusBadge = (status?: string) => {
    if (!status) return <span className="text-white/40">-</span>;
    
    const config: Record<string, { variant: "default" | "secondary" | "destructive", icon: any }> = {
      paid: { variant: "default", icon: CheckCircle },
      unpaid: { variant: "secondary", icon: Clock },
      overdue: { variant: "destructive", icon: AlertTriangle }
    };
    
    const { variant, icon: Icon } = config[status] || config.unpaid;
    
    return (
      <Badge variant={variant} className="flex items-center gap-1 w-fit">
        <Icon className="h-3 w-3" />
        {t(`admin.payment.${status}`)}
      </Badge>
    );
  };

  const getExpirationWarning = (endDate?: string) => {
    if (!endDate) return null;
    
    const today = new Date();
    const end = new Date(endDate);
    const daysUntilExpiry = Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilExpiry < 0) {
      return <span className="text-red-400 text-xs flex items-center gap-1"><AlertTriangle className="h-3 w-3" /> {t('admin.expiry.expired')}</span>;
    } else if (daysUntilExpiry <= 7) {
      return <span className="text-orange-400 text-xs flex items-center gap-1"><AlertTriangle className="h-3 w-3" /> {daysUntilExpiry} {t('admin.expiry.daysLeft')}</span>;
    } else if (daysUntilExpiry <= 30) {
      return <span className="text-yellow-400 text-xs">{t('admin.expiry.expiresIn')} {daysUntilExpiry} {t('admin.expiry.daysLeft')}</span>;
    }
    return null;
  };

  const getStatusCounts = () => {
    const today = new Date();
    const thirtyDaysLater = new Date(today);
    thirtyDaysLater.setDate(today.getDate() + 30);
    
    return {
      total: members.length,
      pending: members.filter(m => m.status === 'pending').length,
      approved: members.filter(m => m.status === 'approved').length,
      rejected: members.filter(m => m.status === 'rejected').length,
      expiring_soon: members.filter(m => {
        if (!m.membership_end_date || m.status !== 'approved') return false;
        const endDate = new Date(m.membership_end_date);
        return endDate > today && endDate <= thirtyDaysLater;
      }).length,
      expired: members.filter(m => {
        if (!m.membership_end_date || m.status !== 'approved') return false;
        const endDate = new Date(m.membership_end_date);
        return endDate < today;
      }).length,
    };
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatSimpleDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-GB');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-electric-blue" />
      </div>
    );
  }

  const counts = getStatusCounts();

  return (
    <div className="space-y-6">
      <Card className="bg-black/40 border-white/10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white flex items-center gap-2">
                <Users className="h-5 w-5 text-electric-blue" />
                {t('admin.members.title')}
              </CardTitle>
              <CardDescription className="text-white/60">
                {t('admin.members.subtitle')}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[200px] bg-black/40 border-white/10 text-white">
                  <SelectValue placeholder="Filter" />
                </SelectTrigger>
                <SelectContent className="bg-deep-purple border-white/10">
                  <SelectItem value="all" className="text-white">{t('admin.filter.all')} ({counts.total})</SelectItem>
                  <SelectItem value="pending" className="text-white">{t('admin.filter.pending')} ({counts.pending})</SelectItem>
                  <SelectItem value="approved" className="text-white">{t('admin.filter.approved')} ({counts.approved})</SelectItem>
                  <SelectItem value="rejected" className="text-white">{t('admin.filter.rejected')} ({counts.rejected})</SelectItem>
                  <SelectItem value="expiring_soon" className="text-yellow-400">{t('admin.filter.expiringSoon')} ({counts.expiring_soon})</SelectItem>
                  <SelectItem value="expired" className="text-red-400">{t('admin.filter.expired')} ({counts.expired})</SelectItem>
                </SelectContent>
              </Select>
              <Button
                onClick={() => setIsAddDialogOpen(true)}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                {t('admin.addMember.button')}
              </Button>
              <Button
                onClick={handleExport}
                disabled={isExporting || members.length === 0}
                className="bg-electric-blue hover:bg-electric-blue/80 text-deep-purple"
              >
                {isExporting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {t('admin.members.exporting')}
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    {t('admin.members.exportCSV')}
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredMembers.length === 0 ? (
            <div className="text-center py-8 text-white/60">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>{members.length === 0 ? t('admin.members.noMembers') : `No ${statusFilter} members`}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-white/10 hover:bg-white/5">
                    <TableHead className="text-white/80">{t('admin.members.table.name')}</TableHead>
                    <TableHead className="text-white/80">{t('admin.members.table.email')}</TableHead>
                    <TableHead className="text-white/80">{t('admin.members.table.status')}</TableHead>
                    <TableHead className="text-white/80">{t('admin.members.table.membership')}</TableHead>
                    <TableHead className="text-white/80">{t('admin.members.table.expires')}</TableHead>
                    <TableHead className="text-white/80">{t('admin.members.table.payment')}</TableHead>
                    <TableHead className="text-white/80">{t('admin.members.table.amount')}</TableHead>
                    <TableHead className="text-white/80 text-right">{t('admin.members.table.actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMembers.map((member) => (
                    <>
                      {/* Roles Row */}
                      {(member.is_dj || member.is_producer || member.is_vj || member.is_visual_artist || member.is_fan) && (
                        <TableRow key={`${member.id}-roles`} className="border-white/5 hover:bg-white/5">
                          <TableCell className="text-white">
                            <div className="font-medium">{member.first_name} {member.second_name && `${member.second_name} `}{member.last_name}</div>
                            {member.artist_name && <div className="text-sm text-electric-blue">"{member.artist_name}"</div>}
                            <div className="text-xs text-white/40">{member.city}</div>
                          </TableCell>
                          <TableCell colSpan={7}>
                            <div className="flex gap-1 flex-wrap">
                              {member.is_dj && <span className="text-xs bg-purple-600/30 text-purple-300 px-1.5 py-0.5 rounded">DJ</span>}
                              {member.is_producer && <span className="text-xs bg-blue-600/30 text-blue-300 px-1.5 py-0.5 rounded">Producer</span>}
                              {member.is_vj && <span className="text-xs bg-pink-600/30 text-pink-300 px-1.5 py-0.5 rounded">VJ</span>}
                              {member.is_visual_artist && <span className="text-xs bg-green-600/30 text-green-300 px-1.5 py-0.5 rounded">Visual Artist</span>}
                              {member.is_fan && <span className="text-xs bg-yellow-600/30 text-yellow-300 px-1.5 py-0.5 rounded">Fan</span>}
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                      {/* Main Data Row */}
                      <TableRow key={member.id} className="border-white/10 hover:bg-white/5">
                        <TableCell className="text-white">
                          {!(member.is_dj || member.is_producer || member.is_vj || member.is_visual_artist || member.is_fan) && (
                            <>
                              <div className="font-medium">{member.first_name} {member.second_name && `${member.second_name} `}{member.last_name}</div>
                              {member.artist_name && <div className="text-sm text-electric-blue">"{member.artist_name}"</div>}
                              <div className="text-xs text-white/40">{member.city}</div>
                            </>
                          )}
                        </TableCell>
                        <TableCell className="text-white/80 text-sm">{member.email}</TableCell>
                        <TableCell>{getStatusBadge(member.status)}</TableCell>
                        <TableCell>{getMembershipTypeBadge(member.membership_type)}</TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            <span className="text-white/80 text-sm">{formatSimpleDate(member.membership_end_date)}</span>
                            {member.status === 'approved' && getExpirationWarning(member.membership_end_date)}
                          </div>
                        </TableCell>
                        <TableCell>{getPaymentStatusBadge(member.payment_status)}</TableCell>
                        <TableCell className="text-white/80">
                          {member.payment_amount ? `€${parseFloat(member.payment_amount.toString()).toFixed(2)}` : '-'}
                        </TableCell>
                        <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleEditMembership(member)}
                            className="bg-electric-blue hover:bg-electric-blue/80 text-deep-purple"
                          >
                            <Edit className="h-3 w-3 mr-1" />
                            {t('admin.status.manage')}
                          </Button>

                          <Button
                            size="sm"
                            onClick={() => handleSetPassword(member)}
                            disabled={settingPasswordFor === member.id}
                            variant="outline"
                            className="border-yellow-500 text-yellow-500 hover:bg-yellow-500/20"
                            title={t('admin.members.setPassword')}
                          >
                            {settingPasswordFor === member.id ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <Key className="h-3 w-3" />
                            )}
                          </Button>
                          
                          {memberToDelete?.id === member.id ? (
                            <Button
                              size="sm"
                              onClick={() => handleDeleteMember(member)}
                              disabled={isDeleting}
                              className="bg-red-600 hover:bg-red-700 text-white"
                            >
                              {isDeleting ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                              ) : (
                                <>
                                  <Trash2 className="h-3 w-3 mr-1" />
                                  {t('admin.members.confirmDelete')}
                                </>
                              )}
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              onClick={() => setMemberToDelete(member)}
                              variant="outline"
                              className="border-red-400 text-red-400 hover:bg-red-400/20"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          )}
                          {member.status !== 'approved' && (
                            <Button
                              size="sm"
                              onClick={() => handleStatusUpdate(member.id, 'approved')}
                              disabled={updatingStatus === member.id}
                              className="bg-green-600 hover:bg-green-700 text-white"
                            >
                              {updatingStatus === member.id ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                              ) : (
                                <>
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  {t('admin.status.approve')}
                                </>
                              )}
                            </Button>
                          )}
                          {member.status !== 'rejected' && (
                            <Button
                              size="sm"
                              onClick={() => handleStatusUpdate(member.id, 'rejected')}
                              disabled={updatingStatus === member.id}
                              variant="destructive"
                            >
                              {updatingStatus === member.id ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                              ) : (
                                <>
                                  <XCircle className="h-3 w-3 mr-1" />
                                  {t('admin.status.reject')}
                                </>
                              )}
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                    </>
                  ))}
                </TableBody>
              </Table>
              <div className="mt-4 text-white/60 text-sm flex items-center justify-between">
                <span>{t('admin.members.showing')} {filteredMembers.length} {t('admin.members.of')} {members.length} {t('admin.members.members')}</span>
                {counts.expiring_soon > 0 && (
                  <span className="text-yellow-400 flex items-center gap-1">
                    <AlertTriangle className="h-4 w-4" />
                    {counts.expiring_soon} {t('admin.expiry.expiringSoon')}
                  </span>
                )}
                {counts.expired > 0 && (
                  <span className="text-red-400 flex items-center gap-1">
                    <AlertTriangle className="h-4 w-4" />
                    {counts.expired} {t('admin.expiry.expiredCount')}
                  </span>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <MembershipDialog
        member={selectedMember}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSuccess={fetchMembers}
      />

      <AddMemberDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSuccess={fetchMembers}
      />

      <AlertDialog open={generatedPassword !== null} onOpenChange={() => setGeneratedPassword(null)}>
        <AlertDialogContent className="bg-black/95 border-electric-blue/50">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl text-electric-blue">
              {t('admin.members.passwordGenerated')}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-white/80 space-y-4">
              <p>{t('admin.members.passwordGeneratedFor', { name: generatedPassword?.memberName || '' })}</p>
              
              <div className="bg-black/60 p-4 rounded-lg border border-electric-blue/30">
                <p className="text-sm text-white/60 mb-2">{t('admin.members.emailLabel')}</p>
                <p className="text-lg font-medium text-white mb-4">{generatedPassword?.memberEmail}</p>
                
                <p className="text-sm text-white/60 mb-2">{t('admin.members.temporaryPassword')}</p>
                <p className="text-2xl font-mono font-bold text-electric-blue tracking-wider">
                  {generatedPassword?.password}
                </p>
              </div>

              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                <p className="text-yellow-400 text-sm">
                  ⚠️ {t('admin.members.passwordWarning')}
                </p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button
              onClick={() => {
                navigator.clipboard.writeText(generatedPassword?.password || '');
                toast({
                  title: t('admin.message.success'),
                  description: t('admin.members.passwordCopied'),
                });
              }}
              className="bg-electric-blue hover:bg-electric-blue/80 text-deep-purple"
            >
              {t('admin.members.copyPassword')}
            </Button>
            <Button
              onClick={() => setGeneratedPassword(null)}
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
            >
              {t('common.close')}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MembersManager;

