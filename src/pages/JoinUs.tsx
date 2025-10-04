import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useLanguage } from "@/contexts/LanguageContext";
import { ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";

// Form validation schema
const joinUsSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  secondName: z.string().optional(),
  artistName: z.string().optional(),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().regex(/^\+\d{1,3}\d{4,14}$/, "Please enter a valid international phone number (e.g., +1234567890)"),
  street: z.string().optional(),
  zipCode: z.string().optional(),
  city: z.string().min(2, "City must be at least 2 characters"),
  country: z.string().min(2, "Country must be at least 2 characters"),
  isDj: z.boolean().optional(),
  isProducer: z.boolean().optional(),
  isVj: z.boolean().optional(),
  isVisualArtist: z.boolean().optional(),
  isFan: z.boolean().optional(),
});

type JoinUsFormData = z.infer<typeof joinUsSchema>;

const JoinUs = () => {
  const { t } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<JoinUsFormData>({
    resolver: zodResolver(joinUsSchema),
  });

  const onSubmit = async (data: JoinUsFormData) => {
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      const response = await fetch('/api/join-us.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setSubmitStatus('success');
        reset();
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message || 'An error occurred while submitting the form');
        setSubmitStatus('error');
      }
    } catch (error) {
      setErrorMessage('Network error. Please try again.');
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-deep-purple via-black to-electric-blue pt-20 overflow-y-auto">
      <div className="container mx-auto px-4 py-8 pb-20">
        {/* Back button */}
        <div className="mb-6">
          <Link 
            to="/" 
            className="inline-flex items-center text-white/80 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </div>

        {/* Main content */}
        <div className="max-w-2xl mx-auto">
          <Card className="bg-black/50 backdrop-blur-md border-white/10">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold text-white mb-2">
                {t('joinUs.title', 'Join Elektr-Âme')}
              </CardTitle>
              <CardDescription className="text-white/70 text-lg">
                {t('joinUs.description', 'Become part of Barcelona\'s vibrant electronic music community')}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Success message */}
              {submitStatus === 'success' && (
                <Alert className="border-green-500/50 bg-green-500/10">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <AlertDescription className="text-green-400">
                    {t('joinUs.success', 'Thank you! Your application has been submitted successfully.')}
                  </AlertDescription>
                </Alert>
              )}

              {/* Error message */}
              {submitStatus === 'error' && (
                <Alert className="border-red-500/50 bg-red-500/10">
                  <AlertCircle className="h-4 w-4 text-red-400" />
                  <AlertDescription className="text-red-400">
                    {errorMessage}
                  </AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-white border-b border-white/20 pb-2">
                    {t('joinUs.personalInfo', 'Personal Information')}
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-white">
                        {t('joinUs.firstName', 'First Name')} *
                      </Label>
                      <Input
                        id="firstName"
                        {...register('firstName')}
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                        placeholder={t('joinUs.firstNamePlaceholder', 'Enter your first name')}
                      />
                      {errors.firstName && (
                        <p className="text-red-400 text-sm">{errors.firstName.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-white">
                        {t('joinUs.lastName', 'Last Name')} *
                      </Label>
                      <Input
                        id="lastName"
                        {...register('lastName')}
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                        placeholder={t('joinUs.lastNamePlaceholder', 'Enter your last name')}
                      />
                      {errors.lastName && (
                        <p className="text-red-400 text-sm">{errors.lastName.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="secondName" className="text-white">
                      {t('joinUs.secondName', 'Second Name')} ({t('joinUs.optional', 'Optional')})
                    </Label>
                    <Input
                      id="secondName"
                      {...register('secondName')}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                      placeholder={t('joinUs.secondNamePlaceholder', 'Enter your second name (optional)')}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="artistName" className="text-white">
                      {t('joinUs.artistName', 'Nickname / Artist Name')} ({t('joinUs.optional', 'Optional')})
                    </Label>
                    <Input
                      id="artistName"
                      {...register('artistName')}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                      placeholder={t('joinUs.artistNamePlaceholder', 'e.g. DJ Shadow, VJ Luna')}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white">
                      {t('joinUs.roles', 'What describes you best?')} ({t('joinUs.optional', 'Optional')})
                    </Label>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                      <label className="flex items-center space-x-2 cursor-pointer bg-white/5 p-3 rounded-lg border border-white/20 hover:border-electric-blue/50 transition-colors">
                        <input
                          type="checkbox"
                          {...register('isDj')}
                          className="rounded border-white/20 text-electric-blue focus:ring-electric-blue"
                        />
                        <span className="text-sm text-white">DJ</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer bg-white/5 p-3 rounded-lg border border-white/20 hover:border-electric-blue/50 transition-colors">
                        <input
                          type="checkbox"
                          {...register('isProducer')}
                          className="rounded border-white/20 text-electric-blue focus:ring-electric-blue"
                        />
                        <span className="text-sm text-white">{t('joinUs.producer', 'Producer')}</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer bg-white/5 p-3 rounded-lg border border-white/20 hover:border-electric-blue/50 transition-colors">
                        <input
                          type="checkbox"
                          {...register('isVj')}
                          className="rounded border-white/20 text-electric-blue focus:ring-electric-blue"
                        />
                        <span className="text-sm text-white">VJ</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer bg-white/5 p-3 rounded-lg border border-white/20 hover:border-electric-blue/50 transition-colors">
                        <input
                          type="checkbox"
                          {...register('isVisualArtist')}
                          className="rounded border-white/20 text-electric-blue focus:ring-electric-blue"
                        />
                        <span className="text-sm text-white">{t('joinUs.visualArtist', 'Visual Artist')}</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer bg-white/5 p-3 rounded-lg border border-white/20 hover:border-electric-blue/50 transition-colors">
                        <input
                          type="checkbox"
                          {...register('isFan')}
                          className="rounded border-white/20 text-electric-blue focus:ring-electric-blue"
                        />
                        <span className="text-sm text-white">{t('joinUs.fan', 'Fan')}</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-white border-b border-white/20 pb-2">
                    {t('joinUs.contactInfo', 'Contact Information')}
                  </h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-white">
                      {t('joinUs.email', 'Email Address')} *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      {...register('email')}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                      placeholder={t('joinUs.emailPlaceholder', 'Enter your email address')}
                    />
                    {errors.email && (
                      <p className="text-red-400 text-sm">{errors.email.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-white">
                      {t('joinUs.phone', 'Phone Number')} *
                    </Label>
                    <Input
                      id="phone"
                      {...register('phone')}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                      placeholder={t('joinUs.phonePlaceholder', '+1234567890')}
                    />
                    {errors.phone && (
                      <p className="text-red-400 text-sm">{errors.phone.message}</p>
                    )}
                    <p className="text-white/60 text-sm">
                      {t('joinUs.phoneHelp', 'Use international format with country code (e.g., +34 for Spain)')}
                    </p>
                  </div>
                </div>

                {/* Address Information */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-white border-b border-white/20 pb-2">
                    {t('joinUs.addressInfo', 'Address Information')}
                  </h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="street" className="text-white">
                      {t('joinUs.street', 'Street Address')} ({t('joinUs.optional', 'Optional')})
                    </Label>
                    <Input
                      id="street"
                      {...register('street')}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                      placeholder={t('joinUs.streetPlaceholder', 'Enter your street address')}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="zipCode" className="text-white">
                        {t('joinUs.zipCode', 'Zip Code')} ({t('joinUs.optional', 'Optional')})
                      </Label>
                      <Input
                        id="zipCode"
                        {...register('zipCode')}
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                        placeholder={t('joinUs.zipCodePlaceholder', 'Enter your zip code')}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="city" className="text-white">
                        {t('joinUs.city', 'City')} *
                      </Label>
                      <Input
                        id="city"
                        {...register('city')}
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                        placeholder={t('joinUs.cityPlaceholder', 'Enter your city')}
                      />
                      {errors.city && (
                        <p className="text-red-400 text-sm">{errors.city.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="country" className="text-white">
                      {t('joinUs.country', 'Country')} *
                    </Label>
                    <Input
                      id="country"
                      {...register('country')}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                      placeholder={t('joinUs.countryPlaceholder', 'Enter your country')}
                    />
                    {errors.country && (
                      <p className="text-red-400 text-sm">{errors.country.message}</p>
                    )}
                  </div>
                </div>

                {/* Submit button */}
                <div className="pt-6">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-electric-blue hover:bg-electric-blue/80 text-deep-purple font-semibold py-3 text-lg"
                  >
                    {isSubmitting 
                      ? t('joinUs.submitting', 'Submitting...') 
                      : t('joinUs.submit', 'Join Elektr-Âme')
                    }
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default JoinUs;


