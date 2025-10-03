import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

interface Member {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  membership_type?: string;
  membership_start_date?: string;
  membership_end_date?: string;
  payment_status?: string;
  last_payment_date?: string;
  payment_amount?: string | number;
  notes?: string;
}

interface MembershipDialogProps {
  member: Member | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const MembershipDialog = ({ member, open, onOpenChange, onSuccess }: MembershipDialogProps) => {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    membership_type: '',
    membership_start_date: '',
    membership_end_date: '',
    payment_status: '',
    last_payment_date: '',
    payment_amount: '',
    notes: ''
  });

  useEffect(() => {
    if (member) {
      setFormData({
        membership_type: member.membership_type || 'free_trial',
        membership_start_date: member.membership_start_date || '',
        membership_end_date: member.membership_end_date || '',
        payment_status: member.payment_status || 'unpaid',
        last_payment_date: member.last_payment_date || '',
        payment_amount: member.payment_amount?.toString() || '',
        notes: member.notes || ''
      });
    }
  }, [member]);

  const handleQuickRenewal = (months: number) => {
    const today = new Date();
    const endDate = new Date(formData.membership_end_date || today);
    
    // If membership already expired or not set, start from today
    const startDate = endDate < today || !formData.membership_end_date ? today : endDate;
    
    const newEndDate = new Date(startDate);
    newEndDate.setMonth(newEndDate.getMonth() + months);
    
    setFormData({
      ...formData,
      membership_start_date: formData.membership_start_date || today.toISOString().split('T')[0],
      membership_end_date: newEndDate.toISOString().split('T')[0],
      payment_status: 'paid',
      last_payment_date: today.toISOString().split('T')[0]
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!member) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/members-update-membership.php', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          member_id: member.id,
          ...formData,
          payment_amount: formData.payment_amount ? parseFloat(formData.payment_amount) : null
        })
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: t('admin.message.success'),
          description: t('admin.message.membershipUpdated'),
        });
        onSuccess();
        onOpenChange(false);
      } else {
        throw new Error(data.error || 'Failed to update membership');
      }
    } catch (error) {
      toast({
        title: t('admin.message.error'),
        description: error instanceof Error ? error.message : t('admin.message.updateError'),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!member) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-deep-purple border-white/10 text-white max-w-2xl">
        <DialogHeader>
          <DialogTitle>{t('admin.dialog.title')}: {member.first_name} {member.last_name}</DialogTitle>
          <DialogDescription className="text-white/60">
            {member.email}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t('admin.dialog.membershipType')}</Label>
              <Select value={formData.membership_type} onValueChange={(value) => setFormData({ ...formData, membership_type: value })}>
                <SelectTrigger className="bg-black/40 border-white/10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-deep-purple border-white/10">
                  <SelectItem value="free_trial">{t('admin.membership.freeTrial')}</SelectItem>
                  <SelectItem value="monthly">{t('admin.membership.monthly')}</SelectItem>
                  <SelectItem value="yearly">{t('admin.membership.yearly')}</SelectItem>
                  <SelectItem value="lifetime">{t('admin.membership.lifetime')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>{t('admin.dialog.paymentStatus')}</Label>
              <Select value={formData.payment_status} onValueChange={(value) => setFormData({ ...formData, payment_status: value })}>
                <SelectTrigger className="bg-black/40 border-white/10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-deep-purple border-white/10">
                  <SelectItem value="unpaid">{t('admin.payment.unpaid')}</SelectItem>
                  <SelectItem value="paid">{t('admin.payment.paid')}</SelectItem>
                  <SelectItem value="overdue">{t('admin.payment.overdue')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>{t('admin.dialog.quickRenewal')}</Label>
            <div className="flex gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => handleQuickRenewal(1)} className="border-electric-blue text-electric-blue">
                {t('admin.dialog.month1')}
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={() => handleQuickRenewal(3)} className="border-electric-blue text-electric-blue">
                {t('admin.dialog.month3')}
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={() => handleQuickRenewal(6)} className="border-electric-blue text-electric-blue">
                {t('admin.dialog.month6')}
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={() => handleQuickRenewal(12)} className="border-electric-blue text-electric-blue">
                {t('admin.dialog.year1')}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t('admin.dialog.startDate')}</Label>
              <Input
                type="date"
                value={formData.membership_start_date}
                onChange={(e) => setFormData({ ...formData, membership_start_date: e.target.value })}
                className="bg-black/40 border-white/10"
              />
            </div>

            <div className="space-y-2">
              <Label>{t('admin.dialog.endDate')}</Label>
              <Input
                type="date"
                value={formData.membership_end_date}
                onChange={(e) => setFormData({ ...formData, membership_end_date: e.target.value })}
                className="bg-black/40 border-white/10"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t('admin.dialog.lastPayment')}</Label>
              <Input
                type="date"
                value={formData.last_payment_date}
                onChange={(e) => setFormData({ ...formData, last_payment_date: e.target.value })}
                className="bg-black/40 border-white/10"
              />
            </div>

            <div className="space-y-2">
              <Label>{t('admin.dialog.amount')} (€)</Label>
              <Input
                type="number"
                step="0.01"
                value={formData.payment_amount}
                onChange={(e) => setFormData({ ...formData, payment_amount: e.target.value })}
                className="bg-black/40 border-white/10"
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>{t('admin.dialog.notes')}</Label>
            <Textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="bg-black/40 border-white/10 min-h-[80px]"
              placeholder={t('admin.dialog.notesPlaceholder')}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="border-white/10">
              {t('admin.dialog.cancel')}
            </Button>
            <Button type="submit" disabled={isSubmitting} className="bg-electric-blue hover:bg-electric-blue/80 text-deep-purple">
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {t('admin.dialog.saving')}
                </>
              ) : (
                t('admin.dialog.save')
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MembershipDialog;

