import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, Mail, Loader2, CheckCircle, XCircle, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

interface Subscriber {
  id: number;
  email: string;
  subscribed_at: string;
  ip_address: string | null;
  unsubscribed_at: string | null;
}

interface Stats {
  total: number;
  active: number;
  unsubscribed: number;
}

const NewsletterManager = () => {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [filteredSubscribers, setFilteredSubscribers] = useState<Subscriber[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, active: 0, unsubscribed: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('active');
  const { toast } = useToast();
  const { t } = useLanguage();

  useEffect(() => {
    fetchSubscribers();
  }, []);

  useEffect(() => {
    filterSubscribers();
  }, [subscribers, statusFilter]);

  const fetchSubscribers = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/newsletter-list.php', {
        credentials: 'include',
      });
      const data = await response.json();
      
      if (data.success) {
        setSubscribers(data.subscribers || []);
        setStats(data.stats || { total: 0, active: 0, unsubscribed: 0 });
      } else {
        throw new Error(data.error || 'Failed to fetch subscribers');
      }
    } catch (error) {
      toast({
        title: t('admin.message.error'),
        description: error instanceof Error ? error.message : t('admin.newsletter.fetchError'),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filterSubscribers = () => {
    let filtered = [...subscribers];
    
    if (statusFilter === 'active') {
      filtered = filtered.filter(s => !s.unsubscribed_at);
    } else if (statusFilter === 'unsubscribed') {
      filtered = filtered.filter(s => s.unsubscribed_at);
    }
    
    setFilteredSubscribers(filtered);
  };

  const handleExport = async (exportType: 'active' | 'all' | 'unsubscribed') => {
    setIsExporting(true);
    try {
      const response = await fetch(`/api/newsletter-export.php?type=${exportType}`, {
        credentials: 'include',
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `newsletter_subscribers_${exportType}_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        toast({
          title: t('admin.message.success'),
          description: t('admin.newsletter.exported'),
        });
      } else {
        throw new Error('Export failed');
      }
    } catch (error) {
      toast({
        title: t('admin.message.error'),
        description: error instanceof Error ? error.message : t('admin.newsletter.exportError'),
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-electric-blue" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-black/50 backdrop-blur-md border-white/10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl text-white flex items-center gap-2">
                <Mail className="h-6 w-6 text-electric-blue" />
                {t('admin.newsletter.title')}
              </CardTitle>
              <CardDescription className="text-white/60 mt-2">
                {t('admin.newsletter.subtitle')}
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px] bg-black/40 border-white/10 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-deep-purple border-white/10">
                  <SelectItem value="active" className="text-white">{t('admin.newsletter.filter.active')}</SelectItem>
                  <SelectItem value="all" className="text-white">{t('admin.newsletter.filter.all')}</SelectItem>
                  <SelectItem value="unsubscribed" className="text-white">{t('admin.newsletter.filter.unsubscribed')}</SelectItem>
                </SelectContent>
              </Select>
              <Button
                onClick={() => handleExport(statusFilter as 'active' | 'all' | 'unsubscribed')}
                disabled={isExporting || filteredSubscribers.length === 0}
                className="bg-electric-blue hover:bg-electric-blue/80 text-deep-purple"
              >
                {isExporting ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Download className="h-4 w-4 mr-2" />
                )}
                {isExporting ? t('admin.newsletter.exporting') : t('admin.newsletter.exportCSV')}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Statistics */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <Card className="bg-black/40 border-white/10">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/60 text-sm">{t('admin.newsletter.stats.total')}</p>
                    <p className="text-3xl font-bold text-white">{stats.total}</p>
                  </div>
                  <Users className="h-8 w-8 text-electric-blue" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-black/40 border-white/10">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/60 text-sm">{t('admin.newsletter.stats.active')}</p>
                    <p className="text-3xl font-bold text-green-400">{stats.active}</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-400" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-black/40 border-white/10">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/60 text-sm">{t('admin.newsletter.stats.unsubscribed')}</p>
                    <p className="text-3xl font-bold text-red-400">{stats.unsubscribed}</p>
                  </div>
                  <XCircle className="h-8 w-8 text-red-400" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Subscribers Table */}
          {filteredSubscribers.length === 0 ? (
            <div className="text-center py-12">
              <Mail className="h-12 w-12 text-white/30 mx-auto mb-4" />
              <p className="text-white/60">{t('admin.newsletter.noSubscribers')}</p>
            </div>
          ) : (
            <div className="border border-white/10 rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="border-white/10 hover:bg-white/5">
                    <TableHead className="text-white">{t('admin.newsletter.table.email')}</TableHead>
                    <TableHead className="text-white">{t('admin.newsletter.table.subscribed')}</TableHead>
                    <TableHead className="text-white">{t('admin.newsletter.table.status')}</TableHead>
                    <TableHead className="text-white">{t('admin.newsletter.table.ip')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSubscribers.map((subscriber) => (
                    <TableRow key={subscriber.id} className="border-white/10 hover:bg-white/5">
                      <TableCell className="text-white font-medium">{subscriber.email}</TableCell>
                      <TableCell className="text-white/80 text-sm">
                        {formatDate(subscriber.subscribed_at)}
                      </TableCell>
                      <TableCell>
                        {subscriber.unsubscribed_at ? (
                          <Badge variant="destructive" className="bg-red-500/20 text-red-400 border-red-400/30">
                            <XCircle className="h-3 w-3 mr-1" />
                            {t('admin.newsletter.status.unsubscribed')}
                          </Badge>
                        ) : (
                          <Badge variant="default" className="bg-green-500/20 text-green-400 border-green-400/30">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            {t('admin.newsletter.status.active')}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-white/60 text-sm">
                        {subscriber.ip_address || '-'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          <p className="text-white/40 text-sm mt-4">
            {t('admin.newsletter.showing')} {filteredSubscribers.length} {t('admin.newsletter.of')} {stats.total} {t('admin.newsletter.subscribers')}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default NewsletterManager;

