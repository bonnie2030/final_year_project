import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { PackageSearch, Phone, Car, Loader2, CheckCircle2, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/api';

export default function LostAndFound() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    itemDescription: '',
    phoneNumber: '',
    vehiclePlate: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [successData, setSuccessData] = useState<any>(null);
  const [whatsAppStatus, setWhatsAppStatus] = useState<any>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.itemDescription.trim() || !formData.phoneNumber.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    const phoneDigits = formData.phoneNumber.replace(/\D/g, '');
    if (phoneDigits.length < 10 || phoneDigits.length > 15) {
      toast.error('Enter a valid phone number (10-15 digits)');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await api.lostAndFound.createReport(formData);

      if (response.success) {
        setSuccessData(response.data);
        setWhatsAppStatus(response.whatsapp || null);
        setIsSuccess(true);

        if (response.whatsapp?.sent) {
          toast.success('Report submitted successfully! WhatsApp confirmation sent.');
        } else if (response.whatsapp?.needsJoin) {
          toast.warning('Report submitted. Join WhatsApp sandbox to receive confirmations.');
        } else {
          toast.warning('Report submitted. WhatsApp confirmation could not be sent right now.');
        }

        setFormData({
          itemDescription: '',
          phoneNumber: '',
          vehiclePlate: '',
        });
      } else {
        toast.error(response.message || 'Failed to submit report. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting report:', error);
      toast.error('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <section className="bg-gradient-to-r from-orange-600 to-amber-500 text-white py-10 sm:py-12 shadow-lg border-b-4 border-amber-300">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
                <PackageSearch className="h-3.5 w-3.5" />
                Lost Item Assistance
              </div>
              <h1 className="mt-4 text-3xl sm:text-4xl font-extrabold">Report and Recover Faster</h1>
              <p className="mt-3 text-sm sm:text-base text-amber-50/95 max-w-2xl">
                Submit your lost-item details and get immediate confirmation while our team traces matching reports.
              </p>
            </div>
          </div>
        </section>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          {/* Back Button */}
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-orange-600 hover:text-orange-700 font-semibold mb-8 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Home
          </button>

          {isSuccess ? (
            <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 shadow-lg">
              <CardContent className="pt-12 pb-12">
                <div className="flex flex-col items-center justify-center text-center">
                  <CheckCircle2 className="h-20 w-20 text-green-600 mb-6 animate-bounce" />
                  <h2 className="text-3xl font-bold text-gray-900 mb-3">Report Submitted Successfully! ✓</h2>
                  <p className="text-lg text-gray-600 mb-8 max-w-md">
                    Your lost item report (ID: #{successData?.id}) has been registered in our system. We're actively searching for your item.
                  </p>

                  <div className="bg-white rounded-lg p-6 w-full mb-8 border-l-4 border-green-600">
                    <h3 className="font-semibold text-gray-900 mb-4">📋 Your Report Details:</h3>
                    <div className="space-y-3 text-left">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Item:</span>
                        <span className="font-medium text-gray-900">{successData?.item_description}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Contact:</span>
                        <span className="font-medium text-gray-900">{successData?.phone_number}</span>
                      </div>
                      {successData?.vehicle_plate && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Matatu Plate:</span>
                          <span className="font-medium text-gray-900">{successData.vehicle_plate}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <span className="font-medium text-yellow-600">Pending</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 w-full">
                    <Button
                      onClick={() => navigate('/')}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-5 text-base"
                      size="lg"
                    >
                      <ArrowLeft className="h-5 w-5 mr-2" />
                      Return to Home
                    </Button>

                    {whatsAppStatus?.sent ? (
                      <div className="bg-green-100 border border-green-300 rounded-lg p-4">
                        <p className="text-sm text-green-800">
                          <strong>✓ WhatsApp Confirmation:</strong> A detailed confirmation has been sent to your phone. Check your WhatsApp messages.
                        </p>
                        {whatsAppStatus?.messageId && (
                          <p className="text-xs text-green-700 mt-1">
                            Reference: {whatsAppStatus.messageId}
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="bg-amber-100 border border-amber-300 rounded-lg p-4">
                        <p className="text-sm text-amber-900">
                          <strong>WhatsApp Confirmation Pending:</strong>{' '}
                          {whatsAppStatus?.needsJoin
                            ? (whatsAppStatus?.joinInstructions || 'Please join the WhatsApp sandbox first, then submit again or contact support.')
                            : (whatsAppStatus?.error || 'Could not send confirmation at this time. Our team still received your report.')}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-8 w-full">
                    <p className="text-sm text-blue-900">
                      <strong>💡 Next Steps:</strong> Our admin team will review your report and contact you if a matching item is found. You can also check our Lost & Found Management dashboard regularly for updates.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid lg:grid-cols-5 gap-6 sm:gap-8 items-start">
              <aside className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-bold text-slate-900 mb-3">How recovery works</h2>
                <div className="space-y-3 text-sm text-slate-700">
                  <div className="flex items-start gap-3 rounded-xl bg-slate-50 border border-slate-200 p-3">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-orange-600 text-xs font-bold text-white">1</span>
                    <p>Submit item details and contact phone.</p>
                  </div>
                  <div className="flex items-start gap-3 rounded-xl bg-slate-50 border border-slate-200 p-3">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-orange-600 text-xs font-bold text-white">2</span>
                    <p>Team checks active reports and route vehicle logs.</p>
                  </div>
                  <div className="flex items-start gap-3 rounded-xl bg-slate-50 border border-slate-200 p-3">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-orange-600 text-xs font-bold text-white">3</span>
                    <p>You receive updates on matching and next steps.</p>
                  </div>
                </div>

                <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-900">
                  <p className="font-semibold mb-1">For faster matching</p>
                  <p>Include color, brand, unique marks, and approximate seat/section in the vehicle.</p>
                </div>
              </aside>

              <Card className="lg:col-span-3 border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50 shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-orange-600 rounded-xl">
                    <PackageSearch className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-3xl text-gray-900">Report Lost Item</CardTitle>
                    <CardDescription className="text-base mt-1">
                      Help us find your lost belongings from a matatu ride
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-3 text-xs text-blue-900">
                    Reports with complete details are reviewed first. Required fields are marked with <span className="font-semibold">*</span>.
                  </div>

                  <div className="grid gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="itemDescription" className="text-base font-medium">
                        Item Description <span className="text-red-500">*</span>
                      </Label>
                      <Textarea
                        id="itemDescription"
                        name="itemDescription"
                        placeholder="Describe your lost item in detail (e.g., Black leather wallet with ID cards, Samsung phone with cracked screen)"
                        value={formData.itemDescription}
                        onChange={handleChange}
                        rows={4}
                        required
                        className="resize-none text-base"
                      />
                      <p className="text-sm text-gray-500">
                        Include details like color, brand, unique features, and where on the matatu you think you lost it
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phoneNumber" className="text-base font-medium flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        Your Phone Number <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="phoneNumber"
                        name="phoneNumber"
                        type="tel"
                        placeholder="0712345678 or +254712345678"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        required
                        className="text-base"
                      />
                      <p className="text-sm text-gray-500">
                        We'll use this to contact you when we find your item or send WhatsApp confirmations
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="vehiclePlate" className="text-base font-medium flex items-center gap-2">
                        <Car className="h-4 w-4" />
                        Vehicle Plate Number (Optional)
                      </Label>
                      <Input
                        id="vehiclePlate"
                        name="vehiclePlate"
                        type="text"
                        placeholder="KAA 123B"
                        value={formData.vehiclePlate}
                        onChange={handleChange}
                        className="text-base uppercase"
                      />
                      <p className="text-sm text-gray-500">
                        If you remember the matatu's plate number, it helps us locate your item faster
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 bg-orange-600 hover:bg-orange-700 text-white px-8 py-6 text-base font-semibold shadow-lg hover:shadow-xl transition-all"
                      size="lg"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <PackageSearch className="h-5 w-5 mr-2" />
                          Submit Report
                        </>
                      )}
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      onClick={() =>
                        setFormData({
                          itemDescription: '',
                          phoneNumber: '',
                          vehiclePlate: '',
                        })
                      }
                      className="px-8 py-6 text-base"
                      size="lg"
                    >
                      Clear Form
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <p className="text-sm font-semibold text-blue-900 mb-1">✓ Quick Process</p>
                      <p className="text-xs text-blue-800">Your report is submitted instantly</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <p className="text-sm font-semibold text-green-900 mb-1">💬 WhatsApp Alert</p>
                      <p className="text-xs text-green-800">Get instant confirmation</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                      <p className="text-sm font-semibold text-purple-900 mb-1">👥 Admin Review</p>
                      <p className="text-xs text-purple-800">Our team actively searches</p>
                    </div>
                  </div>

                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <p className="text-sm text-amber-900">
                      <strong>📌 Important:</strong> Ensure your phone number is correct and enabled for WhatsApp so we can send you immediate confirmation and future updates.
                    </p>
                  </div>
                </form>
              </CardContent>
            </Card>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
