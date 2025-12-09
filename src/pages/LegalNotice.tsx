import { SEO } from "@/components/SEO";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const LegalNotice = () => {
  const { t } = useLanguage();

  return (
    <>
      <SEO 
        title={t('legal.title')}
        description={t('legal.description')}
        url="https://www.elektr-ame.com/legal-notice"
        keywords="legal notice, aviso legal, terms, Elektr-Âme"
      />
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-deep-purple via-black to-deep-purple py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <Card className="bg-black/40 border-white/10">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-white">
                {t('legal.title')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 text-white/80">
              <div>
                <h2 className="text-xl font-semibold text-white mb-3">
                  {t('legal.companyInfo')}
                </h2>
                <div className="space-y-2">
                  <p><strong>{t('legal.commercialName')}:</strong> {t('legal.commercialNameValue')}</p>
                  <p><strong>{t('legal.identification')}:</strong> {t('legal.identificationValue')}</p>
                  <p><strong>{t('legal.address')}:</strong> {t('legal.addressValue')}</p>
                  <p><strong>{t('legal.country')}:</strong> {t('legal.countryValue')}</p>
                  <p><strong>{t('legal.contact')}:</strong> {t('legal.contactValue')}</p>
                  <p><strong>{t('legal.email')}:</strong> {t('legal.emailValue')}</p>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-white mb-3">
                  {t('legal.object')}
                </h2>
                <p>{t('legal.objectText')}</p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-white mb-3">
                  {t('legal.intellectualProperty')}
                </h2>
                <p>{t('legal.intellectualPropertyText')}</p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-white mb-3">
                  {t('legal.responsibility')}
                </h2>
                <p>{t('legal.responsibilityText')}</p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-white mb-3">
                  {t('legal.modifications')}
                </h2>
                <p>{t('legal.modificationsText')}</p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-white mb-3">
                  {t('legal.applicableLaw')}
                </h2>
                <p>{t('legal.applicableLawText')}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default LegalNotice;

