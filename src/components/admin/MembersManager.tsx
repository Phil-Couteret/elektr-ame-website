import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, Users, Loader2, CheckCircle, XCircle, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Member {
  id: number;
  first_name: string;
  last_name: string;
  second_name: string | null;
  email: string;
  phone: string;
  street: string | null;
  zip_code: string | null;
  city: string;
  country: string;
  status: 'pending' | 'approved' | 'rejected';
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
  const { toast } = useToast();

  useEffect(() => {
    fetchMembers();
  }, []);

  useEffect(() => {
    // Apply status filter
    if (statusFilter === 'all') {
      setFilteredMembers(members);
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
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to load members",
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
      
      // Create blob from response
      const blob = await response.blob();
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `elektr-ame-members-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: "Success",
        description: "Members list exported successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to export members",
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
          title: "Success",
          description: `Member ${newStatus} successfully`,
        });
        // Refresh the members list
        fetchMembers();
      } else {
        throw new Error(data.error || 'Failed to update status');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update member status",
        variant: "destructive",
      });
    } finally {
      setUpdatingStatus(null);
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
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getStatusCounts = () => {
    return {
      total: members.length,
      pending: members.filter(m => m.status === 'pending').length,
      approved: members.filter(m => m.status === 'approved').length,
      rejected: members.filter(m => m.status === 'rejected').length,
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
                Registered Members
              </CardTitle>
              <CardDescription className="text-white/60">
                Review and manage member applications from the "Join Us" form
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px] bg-black/40 border-white/10 text-white">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent className="bg-deep-purple border-white/10">
                  <SelectItem value="all" className="text-white">All ({counts.total})</SelectItem>
                  <SelectItem value="pending" className="text-white">Pending ({counts.pending})</SelectItem>
                  <SelectItem value="approved" className="text-white">Approved ({counts.approved})</SelectItem>
                  <SelectItem value="rejected" className="text-white">Rejected ({counts.rejected})</SelectItem>
                </SelectContent>
              </Select>
              <Button
                onClick={handleExport}
                disabled={isExporting || members.length === 0}
                className="bg-electric-blue hover:bg-electric-blue/80 text-deep-purple"
              >
                {isExporting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Exporting...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Export CSV
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
              <p>{members.length === 0 ? 'No members registered yet' : `No ${statusFilter} members`}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-white/10 hover:bg-white/5">
                    <TableHead className="text-white/80">Name</TableHead>
                    <TableHead className="text-white/80">Email</TableHead>
                    <TableHead className="text-white/80">Phone</TableHead>
                    <TableHead className="text-white/80">City</TableHead>
                    <TableHead className="text-white/80">Country</TableHead>
                    <TableHead className="text-white/80">Status</TableHead>
                    <TableHead className="text-white/80">Registered</TableHead>
                    <TableHead className="text-white/80 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMembers.map((member) => (
                    <TableRow key={member.id} className="border-white/10 hover:bg-white/5">
                      <TableCell className="text-white">
                        {member.first_name} {member.second_name && `${member.second_name} `}{member.last_name}
                      </TableCell>
                      <TableCell className="text-white/80">{member.email}</TableCell>
                      <TableCell className="text-white/80">{member.phone}</TableCell>
                      <TableCell className="text-white/80">{member.city}</TableCell>
                      <TableCell className="text-white/80">{member.country}</TableCell>
                      <TableCell>{getStatusBadge(member.status)}</TableCell>
                      <TableCell className="text-white/80">{formatDate(member.created_at)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
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
                                  Approve
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
                                  Reject
                                </>
                              )}
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="mt-4 text-white/60 text-sm">
                Showing {filteredMembers.length} of {members.length} members
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MembersManager;

