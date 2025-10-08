import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Alert, AlertDescription } from "../ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Mail, Send, Clock, CheckCircle, XCircle, AlertCircle, PlayCircle, RefreshCw } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";

interface EmailStats {
  template_key: string;
  total: number;
  sent: number;
  failed: number;
}

interface QueueStatus {
  status: string;
  priority: string;
  count: number;
  next_scheduled: string | null;
}

interface RecentEmail {
  id: number;
  email: string;
  first_name: string | null;
  second_name: string | null;
  subject: string;
  template_key: string | null;
  status: string;
  sent_at: string;
}

interface AutomationRule {
  id: number;
  rule_name: string;
  trigger_type: string;
  template_name: string;
  template_key: string;
  days_offset: number;
  active: boolean;
}

interface EmailTemplate {
  id: number;
  template_key: string;
  name: string;
  subject_en: string;
  active: boolean;
}

export default function EmailAutomationManager() {
  const { t } = useLanguage();
  const [stats, setStats] = useState<EmailStats[]>([]);
  const [queueStatus, setQueueStatus] = useState<QueueStatus[]>([]);
  const [recentEmails, setRecentEmails] = useState<RecentEmail[]>([]);
  const [rules, setRules] = useState<AutomationRule[]>([]);
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [testDialogOpen, setTestDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [processingQueue, setProcessingQueue] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [statsRes, templatesRes] = await Promise.all([
        fetch('/api/email-automation-stats.php', { credentials: 'include' }),
        fetch('/api/email-templates-list.php', { credentials: 'include' })
      ]);

      if (!statsRes.ok || !templatesRes.ok) {
        throw new Error('Failed to fetch data');
      }

      const statsData = await statsRes.json();
      const templatesData = await templatesRes.json();

      if (statsData.success) {
        setStats(statsData.statistics || []);
        setQueueStatus(statsData.queue_status || []);
        setRecentEmails(statsData.recent_emails || []);
        setRules(statsData.automation_rules || []);
      }

      if (templatesData.success) {
        setTemplates(templatesData.templates || []);
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const runCronManually = async () => {
    try {
      setProcessingQueue(true);
      setError(null);
      setSuccess(null);

      const res = await fetch('/api/cron-email-automation.php?manual_trigger=1', {
        credentials: 'include'
      });

      if (!res.ok) {
        throw new Error('Failed to run automation');
      }

      const data = await res.json();
      
      if (data.success) {
        setSuccess(t('emailAutomation.cronRunSuccess', `Processed ${data.queue_processing.sent} emails, ${data.expiring_memberships['7d']} expiration reminders sent`));
        await fetchData();
      } else {
        throw new Error(data.error || 'Unknown error');
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setProcessingQueue(false);
    }
  };

  const sendTestEmail = async () => {
    if (!selectedTemplate) {
      setError(t('emailAutomation.selectTemplate', 'Please select a template'));
      return;
    }

    try {
      setError(null);
      setSuccess(null);

      const res = await fetch('/api/email-test-send.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ template_key: selectedTemplate })
      });

      if (!res.ok) {
        throw new Error('Failed to send test email');
      }

      const data = await res.json();
      
      if (data.success) {
        setSuccess(data.message);
        setTestDialogOpen(false);
        await fetchData();
      } else {
        throw new Error(data.error || 'Unknown error');
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'failed': return <XCircle className="h-4 w-4 text-red-600" />;
      case 'pending': return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'processing': return <RefreshCw className="h-4 w-4 text-blue-600 animate-spin" />;
      default: return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTriggerTypeLabel = (triggerType: string) => {
    const labels: Record<string, string> = {
      'member_registered': t('emailAutomation.triggerRegistered', 'Member Registered'),
      'member_approved': t('emailAutomation.triggerApproved', 'Member Approved'),
      'member_rejected': t('emailAutomation.triggerRejected', 'Member Rejected'),
      'membership_expiring_7d': t('emailAutomation.triggerExpiring7d', 'Expiring in 7 Days'),
      'membership_expiring_3d': t('emailAutomation.triggerExpiring3d', 'Expiring in 3 Days'),
      'membership_expiring_1d': t('emailAutomation.triggerExpiring1d', 'Expiring in 1 Day'),
      'membership_expired': t('emailAutomation.triggerExpired', 'Membership Expired'),
      'membership_renewed': t('emailAutomation.triggerRenewed', 'Membership Renewed'),
      'sponsor_tax_receipt': t('emailAutomation.triggerTaxReceipt', 'Tax Receipt (Sponsor)')
    };
    return labels[triggerType] || triggerType;
  };

  if (loading) {
    return <div className="flex items-center justify-center p-8">{t('common.loading', 'Loading...')}</div>;
  }

  // Calculate totals
  const totalSent = stats.reduce((sum, s) => sum + parseInt(s.sent.toString()), 0);
  const totalFailed = stats.reduce((sum, s) => sum + parseInt(s.failed.toString()), 0);
  const pendingInQueue = queueStatus.filter(q => q.status === 'pending').reduce((sum, q) => sum + parseInt(q.count.toString()), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{t('emailAutomation.title', 'Email Automation')}</h2>
          <p className="text-muted-foreground">{t('emailAutomation.description', 'Manage automated email campaigns and notifications')}</p>
        </div>
        <div className="space-x-2">
          <Button onClick={() => setTestDialogOpen(true)} variant="outline">
            <Send className="mr-2 h-4 w-4" />
            {t('emailAutomation.sendTest', 'Send Test')}
          </Button>
          <Button onClick={runCronManually} disabled={processingQueue}>
            <PlayCircle className="mr-2 h-4 w-4" />
            {processingQueue ? t('emailAutomation.processing', 'Processing...') : t('emailAutomation.runNow', 'Run Now')}
          </Button>
          <Button onClick={fetchData} variant="ghost" size="icon">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="bg-green-50 text-green-900 border-green-200">
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('emailAutomation.statsSent', 'Emails Sent')}</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSent}</div>
            <p className="text-xs text-muted-foreground">{t('emailAutomation.statsLast30Days', 'Last 30 days')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('emailAutomation.statsPending', 'Pending in Queue')}</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingInQueue}</div>
            <p className="text-xs text-muted-foreground">{t('emailAutomation.statsWaitingSend', 'Waiting to be sent')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('emailAutomation.statsFailed', 'Failed')}</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalFailed}</div>
            <p className="text-xs text-muted-foreground">{t('emailAutomation.statsLast30Days', 'Last 30 days')}</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="recent" className="space-y-4">
        <TabsList>
          <TabsTrigger value="recent">{t('emailAutomation.tabRecent', 'Recent Emails')}</TabsTrigger>
          <TabsTrigger value="queue">{t('emailAutomation.tabQueue', 'Queue Status')}</TabsTrigger>
          <TabsTrigger value="rules">{t('emailAutomation.tabRules', 'Automation Rules')}</TabsTrigger>
          <TabsTrigger value="templates">{t('emailAutomation.tabTemplates', 'Templates')}</TabsTrigger>
        </TabsList>

        {/* Recent Emails */}
        <TabsContent value="recent">
          <Card>
            <CardHeader>
              <CardTitle>{t('emailAutomation.recentEmailsTitle', 'Recent Emails')}</CardTitle>
              <CardDescription>{t('emailAutomation.recentEmailsDesc', 'Last 50 sent emails')}</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('emailAutomation.colStatus', 'Status')}</TableHead>
                    <TableHead>{t('emailAutomation.colRecipient', 'Recipient')}</TableHead>
                    <TableHead>{t('emailAutomation.colSubject', 'Subject')}</TableHead>
                    <TableHead>{t('emailAutomation.colTemplate', 'Template')}</TableHead>
                    <TableHead>{t('emailAutomation.colSent', 'Sent At')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentEmails.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground">
                        {t('emailAutomation.noEmails', 'No emails sent yet')}
                      </TableCell>
                    </TableRow>
                  ) : (
                    recentEmails.map((email) => (
                      <TableRow key={email.id}>
                        <TableCell>{getStatusIcon(email.status)}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">
                              {email.first_name && email.second_name
                                ? `${email.first_name} ${email.second_name}`
                                : email.email}
                            </div>
                            {email.first_name && <div className="text-sm text-muted-foreground">{email.email}</div>}
                          </div>
                        </TableCell>
                        <TableCell className="max-w-xs truncate">{email.subject}</TableCell>
                        <TableCell>
                          {email.template_key && (
                            <Badge variant="outline">{email.template_key}</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {new Date(email.sent_at).toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Queue Status */}
        <TabsContent value="queue">
          <Card>
            <CardHeader>
              <CardTitle>{t('emailAutomation.queueTitle', 'Email Queue')}</CardTitle>
              <CardDescription>{t('emailAutomation.queueDesc', 'Current status of email queue')}</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('emailAutomation.colStatus', 'Status')}</TableHead>
                    <TableHead>{t('emailAutomation.colPriority', 'Priority')}</TableHead>
                    <TableHead>{t('emailAutomation.colCount', 'Count')}</TableHead>
                    <TableHead>{t('emailAutomation.colNextScheduled', 'Next Scheduled')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {queueStatus.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-muted-foreground">
                        {t('emailAutomation.queueEmpty', 'Queue is empty')}
                      </TableCell>
                    </TableRow>
                  ) : (
                    queueStatus.map((q, idx) => (
                      <TableRow key={idx}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(q.status)}
                            <span className="capitalize">{q.status}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={q.priority === 'high' ? 'destructive' : q.priority === 'normal' ? 'default' : 'secondary'}>
                            {q.priority}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium">{q.count}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {q.next_scheduled ? new Date(q.next_scheduled).toLocaleString() : '-'}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Automation Rules */}
        <TabsContent value="rules">
          <Card>
            <CardHeader>
              <CardTitle>{t('emailAutomation.rulesTitle', 'Automation Rules')}</CardTitle>
              <CardDescription>{t('emailAutomation.rulesDesc', 'Configured email automation triggers')}</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('emailAutomation.colRule', 'Rule')}</TableHead>
                    <TableHead>{t('emailAutomation.colTrigger', 'Trigger')}</TableHead>
                    <TableHead>{t('emailAutomation.colTemplate', 'Template')}</TableHead>
                    <TableHead>{t('emailAutomation.colTiming', 'Timing')}</TableHead>
                    <TableHead>{t('emailAutomation.colStatus', 'Status')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rules.map((rule) => (
                    <TableRow key={rule.id}>
                      <TableCell className="font-medium">{rule.rule_name}</TableCell>
                      <TableCell>{getTriggerTypeLabel(rule.trigger_type)}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{rule.template_name}</Badge>
                      </TableCell>
                      <TableCell>
                        {rule.days_offset === 0
                          ? t('emailAutomation.timingImmediate', 'Immediate')
                          : rule.days_offset < 0
                          ? t('emailAutomation.timingDaysBefore', `${Math.abs(rule.days_offset)} days before`)
                          : t('emailAutomation.timingDaysAfter', `${rule.days_offset} days after`)}
                      </TableCell>
                      <TableCell>
                        <Badge variant={rule.active ? 'default' : 'secondary'}>
                          {rule.active ? t('emailAutomation.statusActive', 'Active') : t('emailAutomation.statusInactive', 'Inactive')}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Templates */}
        <TabsContent value="templates">
          <Card>
            <CardHeader>
              <CardTitle>{t('emailAutomation.templatesTitle', 'Email Templates')}</CardTitle>
              <CardDescription>{t('emailAutomation.templatesDesc', 'Available email templates')}</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('emailAutomation.colTemplate', 'Template')}</TableHead>
                    <TableHead>{t('emailAutomation.colKey', 'Key')}</TableHead>
                    <TableHead>{t('emailAutomation.colSubject', 'Subject (EN)')}</TableHead>
                    <TableHead>{t('emailAutomation.colStatus', 'Status')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {templates.map((template) => (
                    <TableRow key={template.id}>
                      <TableCell className="font-medium">{template.name}</TableCell>
                      <TableCell>
                        <code className="text-xs bg-muted px-2 py-1 rounded">{template.template_key}</code>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">{template.subject_en}</TableCell>
                      <TableCell>
                        <Badge variant={template.active ? 'default' : 'secondary'}>
                          {template.active ? t('emailAutomation.statusActive', 'Active') : t('emailAutomation.statusInactive', 'Inactive')}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Test Email Dialog */}
      <Dialog open={testDialogOpen} onOpenChange={setTestDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('emailAutomation.testDialogTitle', 'Send Test Email')}</DialogTitle>
            <DialogDescription>{t('emailAutomation.testDialogDesc', 'Choose a template to send a test email to your admin email address')}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">{t('emailAutomation.selectTemplate', 'Select Template')}</label>
              <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder={t('emailAutomation.selectTemplatePlaceholder', 'Choose a template...')} />
                </SelectTrigger>
                <SelectContent>
                  {templates.filter(t => t.active).map((template) => (
                    <SelectItem key={template.template_key} value={template.template_key}>
                      {template.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setTestDialogOpen(false)}>
                {t('common.cancel', 'Cancel')}
              </Button>
              <Button onClick={sendTestEmail} disabled={!selectedTemplate}>
                <Send className="mr-2 h-4 w-4" />
                {t('emailAutomation.sendTest', 'Send Test')}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

