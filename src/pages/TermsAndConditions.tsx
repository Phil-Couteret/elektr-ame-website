import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SEO } from "@/components/SEO";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const TermsAndConditions = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleBack = () => {
    navigate('/');
  };

  return (
    <>
      <SEO 
        title={t('terms.title')}
        description={t('terms.description')}
        url="https://www.elektr-ame.com/terms-and-conditions"
        keywords="terms and conditions, terms of service, purchase policy, refund policy, Elektr-Âme"
      />
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-deep-purple via-black to-deep-purple py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <Card className="bg-black/40 border-white/10">
            <CardHeader>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <CardTitle className="text-3xl font-bold text-white">
                  {t('terms.title')}
                </CardTitle>
                <Button
                  onClick={handleBack}
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/10 flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Home
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 text-white/80">
              <div>
                <h2 className="text-xl font-semibold text-white mb-3">
                  {t('terms.acceptance')}
                </h2>
                <p>{t('terms.acceptanceText')}</p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-white mb-3">
                  {t('terms.membership')}
                </h2>
                <p>{t('terms.membershipText')}</p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-white mb-3">
                  {t('terms.purchasePolicy')}
                </h2>
                <div className="space-y-3">
                  <p>{t('terms.purchasePolicyText')}</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>{t('terms.purchasePolicyItem1')}</li>
                    <li>{t('terms.purchasePolicyItem2')}</li>
                    <li>{t('terms.purchasePolicyItem3')}</li>
                    <li>{t('terms.purchasePolicyItem4')}</li>
                  </ul>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-white mb-3">
                  {t('terms.shippingPolicy')}
                </h2>
                <div className="space-y-3">
                  <p>{t('terms.shippingPolicyText')}</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>{t('terms.shippingPolicyItem1')}</li>
                    <li>{t('terms.shippingPolicyItem2')}</li>
                    <li>{t('terms.shippingPolicyItem3')}</li>
                    <li>{t('terms.shippingPolicyItem4')}</li>
                  </ul>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-white mb-3">
                  {t('terms.returnsPolicy')}
                </h2>
                <div className="space-y-3">
                  <p>{t('terms.returnsPolicyText')}</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>{t('terms.returnsPolicyItem1')}</li>
                    <li>{t('terms.returnsPolicyItem2')}</li>
                    <li>{t('terms.returnsPolicyItem3')}</li>
                    <li>{t('terms.returnsPolicyItem4')}</li>
                  </ul>
                  <p className="mt-3">{t('terms.refundPolicyContact')}</p>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-white mb-3">
                  {t('terms.refundPolicy')}
                </h2>
                <div className="space-y-3">
                  <p>{t('terms.refundPolicyText')}</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>{t('terms.refundPolicyItem1')}</li>
                    <li>{t('terms.refundPolicyItem2')}</li>
                    <li>{t('terms.refundPolicyItem3')}</li>
                    <li>{t('terms.refundPolicyItem4')}</li>
                  </ul>
                  <p className="mt-3">{t('terms.refundPolicyContact')}</p>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-white mb-3">
                  {t('terms.payment')}
                </h2>
                <p>{t('terms.paymentText')}</p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-white mb-3">
                  {t('terms.dataProtection')}
                </h2>
                <p>{t('terms.dataProtectionText')}</p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-white mb-3">
                  {t('terms.modifications')}
                </h2>
                <p>{t('terms.modificationsText')}</p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-white mb-3">
                  {t('terms.contact')}
                </h2>
                <p>{t('terms.contactText')}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default TermsAndConditions;

