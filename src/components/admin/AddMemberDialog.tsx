import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

interface AddMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const AddMemberDialog = ({ open, onOpenChange, onSuccess }: AddMemberDialogProps) => {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    second_name: '',
    email: '',
    phone: '',
    street: '',
    zip_code: '',
    city: '',
    country: '',
    status: 'approved',
    membership_type: 'free_trial',
    membership_start_date: '',
    membership_end_date: '',
    payment_status: 'unpaid',
    last_payment_date: '',
    payment_amount: '',
    notes: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/members-create.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: t('admin.message.success'),
          description: t('admin.addMember.created'),
        });
        onSuccess();
        onOpenChange(false);
        // Reset form
        setFormData({
          first_name: '',
          last_name: '',
          second_name: '',
          email: '',
          phone: '',
          street: '',
          zip_code: '',
          city: '',
          country: '',
          status: 'approved',
          membership_type: 'free_trial',
          membership_start_date: '',
          membership_end_date: '',
          payment_status: 'unpaid',
          last_payment_date: '',
          payment_amount: '',
          notes: ''
        });
      } else {
        throw new Error(data.error || 'Failed to create member');
      }
    } catch (error) {
      toast({
        title: t('admin.message.error'),
        description: error instanceof Error ? error.message : t('admin.addMember.createError'),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-deep-purple border-white/10 text-white max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('admin.addMember.title')}</DialogTitle>
          <DialogDescription className="text-white/60">
            {t('admin.addMember.description')}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Personal Information */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-white border-b border-white/10 pb-2">
              {t('admin.addMember.personalInfo')}
            </h3>
            
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-2">
                <Label>{t('admin.addMember.firstName')} *</Label>
                <Input
                  value={formData.first_name}
                  onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                  className="bg-black/40 border-white/10 text-white"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>{t('admin.addMember.lastName')} *</Label>
                <Input
                  value={formData.last_name}
                  onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                  className="bg-black/40 border-white/10 text-white"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>{t('admin.addMember.secondName')}</Label>
                <Input
                  value={formData.second_name}
                  onChange={(e) => setFormData({ ...formData, second_name: e.target.value })}
                  className="bg-black/40 border-white/10 text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>{t('admin.addMember.email')} *</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="bg-black/40 border-white/10 text-white"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>{t('admin.addMember.phone')} *</Label>
                <Input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="bg-black/40 border-white/10 text-white"
                  placeholder="+1234567890"
                  required
                />
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-white border-b border-white/10 pb-2">
              {t('admin.addMember.address')}
            </h3>
            
            <div className="space-y-2">
              <Label>{t('admin.addMember.street')}</Label>
              <Input
                value={formData.street}
                onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                className="bg-black/40 border-white/10 text-white"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-2">
                <Label>{t('admin.addMember.zipCode')}</Label>
                <Input
                  value={formData.zip_code}
                  onChange={(e) => setFormData({ ...formData, zip_code: e.target.value })}
                  className="bg-black/40 border-white/10 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label>{t('admin.addMember.city')} *</Label>
                <Input
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="bg-black/40 border-white/10 text-white"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>{t('admin.addMember.country')} *</Label>
                <Input
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  className="bg-black/40 border-white/10 text-white"
                  required
                />
              </div>
            </div>
          </div>

          {/* Membership Details */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-white border-b border-white/10 pb-2">
              {t('admin.addMember.membershipDetails')}
            </h3>
            
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-2">
                <Label>{t('admin.addMember.status')}</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                  <SelectTrigger className="bg-black/40 border-white/10 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-deep-purple border-white/10">
                    <SelectItem value="pending" className="text-white">{t('admin.status.pending')}</SelectItem>
                    <SelectItem value="approved" className="text-white">{t('admin.status.approved')}</SelectItem>
                    <SelectItem value="rejected" className="text-white">{t('admin.status.rejected')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>{t('admin.dialog.membershipType')}</Label>
                <Select value={formData.membership_type} onValueChange={(value) => setFormData({ ...formData, membership_type: value })}>
                  <SelectTrigger className="bg-black/40 border-white/10 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-deep-purple border-white/10">
                    <SelectItem value="free_trial" className="text-white">{t('admin.membership.freeTrial')}</SelectItem>
                    <SelectItem value="monthly" className="text-white">{t('admin.membership.monthly')}</SelectItem>
                    <SelectItem value="yearly" className="text-white">{t('admin.membership.yearly')}</SelectItem>
                    <SelectItem value="lifetime" className="text-white">{t('admin.membership.lifetime')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>{t('admin.dialog.paymentStatus')}</Label>
                <Select value={formData.payment_status} onValueChange={(value) => setFormData({ ...formData, payment_status: value })}>
                  <SelectTrigger className="bg-black/40 border-white/10 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-deep-purple border-white/10">
                    <SelectItem value="unpaid" className="text-white">{t('admin.payment.unpaid')}</SelectItem>
                    <SelectItem value="paid" className="text-white">{t('admin.payment.paid')}</SelectItem>
                    <SelectItem value="overdue" className="text-white">{t('admin.payment.overdue')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>{t('admin.dialog.startDate')}</Label>
                <Input
                  type="date"
                  value={formData.membership_start_date}
                  onChange={(e) => setFormData({ ...formData, membership_start_date: e.target.value })}
                  className="bg-black/40 border-white/10 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label>{t('admin.dialog.endDate')}</Label>
                <Input
                  type="date"
                  value={formData.membership_end_date}
                  onChange={(e) => setFormData({ ...formData, membership_end_date: e.target.value })}
                  className="bg-black/40 border-white/10 text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>{t('admin.dialog.lastPayment')}</Label>
                <Input
                  type="date"
                  value={formData.last_payment_date}
                  onChange={(e) => setFormData({ ...formData, last_payment_date: e.target.value })}
                  className="bg-black/40 border-white/10 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label>{t('admin.dialog.amount')} (€)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.payment_amount}
                  onChange={(e) => setFormData({ ...formData, payment_amount: e.target.value })}
                  className="bg-black/40 border-white/10 text-white"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>{t('admin.dialog.notes')}</Label>
              <Textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="bg-black/40 border-white/10 text-white min-h-[60px]"
                placeholder={t('admin.dialog.notesPlaceholder')}
              />
            </div>
          </div>

          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)} 
              className="border-white/10 text-white"
            >
              {t('admin.dialog.cancel')}
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting} 
              className="bg-electric-blue hover:bg-electric-blue/80 text-deep-purple"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {t('admin.addMember.creating')}
                </>
              ) : (
                t('admin.addMember.create')
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddMemberDialog;

