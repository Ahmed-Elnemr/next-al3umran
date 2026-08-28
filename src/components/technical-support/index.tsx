"use client";

import Link from "next/link";
import { useLocale } from "next-intl";
import { useState } from "react";
import { toast } from "react-toastify";
import {
  ArrowLeft,
  ArrowRight,
  Phone,
  Mail,
  Clock,
  HelpCircle,
  CheckCircle,
  ChevronDown,
  Send,
  Headphones,
  User,
  AtSign,
  MapPin,
  MessageCircle,
  Share2,
} from "lucide-react";
import { postContactMessage } from "../../lib/api/client";

interface TechnicalSupportProps {
  faqs?: Array<{ id: number; question: string; answer: string }>;
  contact?: {
    facebook_link?: string | null;
    x_link?: string | null;
    instagram_link?: string | null;
    snapchat_link?: string | null;
    tiktok_link?: string | null;
    youtube_link?: string | null;
    telegram_link?: string | null;
    whatsapp_number?: string | null;
    contact_numbers?: string[];
    email?: string | null;
    address_ar?: string | null;
    address_en?: string | null;
    address?: string | null;
    footer_text_ar?: string | null;
    footer_text_en?: string | null;
    copyright_ar?: string | null;
    copyright_en?: string | null;
  };
}

const TechnicalSupport = ({
  faqs = [],
  contact = {},
}: TechnicalSupportProps) => {
  const locale = useLocale();
  const isAr = locale === "ar";

  const [activeFaqId, setActiveFaqId] = useState<number | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    country_code: "+971",
    phone: "",
    message_type: "technical_support",
    message: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const fallbackFaqs = [
    {
      id: 1,
      question: isAr
        ? "كيف يمكنني إنشاء حساب جديد على المنصة؟"
        : "How do I create a new account on the platform?",
      answer: isAr
        ? "يمكنك إنشاء حساب جديد من خلال الضغط على زر 'تسجيل الدخول' في أعلى الصفحة، ثم اختيار 'إنشاء حساب جديد'. قم بإدخال بياناتك الأساسية مثل الاسم والبريد الإلكتروني ورقم الهاتف، ثم اتبع التعليمات لإكمال عملية التسجيل."
        : "You can create a new account by clicking 'Login' at the top of the page, then selecting 'Create Account'. Enter your basic info such as name, email, and phone number.",
    },
    {
      id: 2,
      question: isAr
        ? "كيف يمكنني إضافة عقار جديد للبيع أو الإيجار؟"
        : "How can I add a new property for sale or rent?",
      answer: isAr
        ? "لإضافة عقار جديد، قم بتسجيل الدخول إلى حساب الشركة الخاص بك، ثم انتقل إلى صفحة 'أضف عقارك'. املأ جميع البيانات المطلوبة كالموقع، السعر، الصور والوصف قبل النشر."
        : "To add a property, log in to your company account and go to 'Add Your Property'. Fill in required details like location, price, images and description.",
    },
    {
      id: 3,
      question: isAr
        ? "كم تستغرق عملية مراجعة العقار قبل نشره؟"
        : "How long does the property review process take?",
      answer: isAr
        ? "تستغرق عملية مراجعة العقار عادةً بين 24 إلى 48 ساعة عمل للتأكد من صحة المعلومات والتفاصيل."
        : "Review process usually takes 24 to 48 working hours to ensure info accuracy.",
    },
    {
      id: 4,
      question: isAr
        ? "هل توجد رسوم على استخدام المنصة؟"
        : "Are there any fees for using the platform?",
      answer: isAr
        ? "تتيح منصة العمران استعراض العقارات والخدمات مجاناً دون أي عمولات خفية."
        : "Al Omran Platform lets you browse properties and services free of hidden fees.",
    },
  ];

  const faqItems = faqs.length
    ? faqs.map((item) => ({
        id: item.id,
        question: item.question,
        answer: item.answer,
      }))
    : fallbackFaqs;

  const phoneDisplay = contact.contact_numbers?.[0] || contact.whatsapp_number || "+971 52 731 5488";
  const emailDisplay = contact.email || "info@alomran.com";
  const addressDisplay = isAr
    ? contact.address_ar || contact.address || "الأمارات - عجمان"
    : contact.address_en || contact.address || "Ajman, UAE";

  const supportChannels = [
    {
      icon: MessageCircle,
      title: isAr ? "واتساب المباشر" : "Direct WhatsApp",
      desc: isAr ? "تواصل فوراً عبر تطبيق الواتساب" : "Chat instantly on WhatsApp",
      action: contact.whatsapp_number || "+971 52 731 5488",
      link: `https://wa.me/${(contact.whatsapp_number || "+971527315488").replace(/[^0-9]/g, "")}`,
      color: "from-[#0E6B58] to-[#101820]",
    },
    {
      icon: Mail,
      title: isAr ? "البريد الإلكتروني" : "Email Support",
      desc: isAr ? "أرسل استفسارك وسنرد خلال 24 ساعة" : "Send an email and we reply within 24 hours",
      action: emailDisplay,
      link: `mailto:${emailDisplay}`,
      color: "from-[#8A5A2B] to-[#C89B3C]",
    },
    {
      icon: Phone,
      title: isAr ? "الاتصال الهاتفي" : "Phone Call",
      desc: isAr ? "اتصل بنا خلال ساعات العمل" : "Call us during business hours",
      action: phoneDisplay,
      link: `tel:${phoneDisplay.replace(/[^0-9+]/g, "")}`,
      color: "from-[#315C3F] to-[#89A86B]",
    },
  ];

  const socialLinks = [
    { name: "Facebook", link: contact.facebook_link },
    { name: "Instagram", link: contact.instagram_link },
    { name: "X", link: contact.x_link },
    { name: "Telegram", link: contact.telegram_link },
    { name: "YouTube", link: contact.youtube_link },
    { name: "Snapchat", link: contact.snapchat_link },
    { name: "TikTok", link: contact.tiktok_link },
  ].filter((s) => Boolean(s.link));

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) {
      newErrors.name = isAr ? "يرجى إدخال الاسم الكامل" : "Please enter your full name";
    }
    if (!formData.email.trim()) {
      newErrors.email = isAr ? "يرجى إدخال البريد الإلكتروني" : "Please enter your email";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = isAr ? "بريد إلكتروني غير صالح" : "Invalid email address";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = isAr ? "يرجى إدخال رقم الهاتف" : "Please enter your phone number";
    }
    if (!formData.message.trim()) {
      newErrors.message = isAr ? "يرجى إدخال نص الرسالة" : "Please enter your message";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error(isAr ? "يرجى تصحيح الأخطاء قبل الإرسال" : "Please fix form errors before submitting");
      return;
    }

    setIsSubmitting(true);

    try {
      const cleanPhone = formData.phone.replace(/^0+/, "").trim();
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        country_code: formData.country_code,
        phone: cleanPhone,
        message_type: formData.message_type,
        message: formData.message.trim(),
      };

      const res = await postContactMessage(locale, payload);
      // Read message directly from API response
      const apiMessage = res?.message || res?.data?.message;

      if (res?.message === "success" || res?.status_code === "1000" || res?.data || apiMessage) {
        toast.success(
          apiMessage && apiMessage !== "success"
            ? apiMessage
            : (isAr
                ? "تم إرسال استفسارك بنجاح. وسيتواصل معك فريق الدعم قريباً!"
                : "Your inquiry has been sent successfully!")
        );
        setIsSubmitted(true);
        setFormData({
          name: "",
          email: "",
          country_code: "+971",
          phone: "",
          message_type: "technical_support",
          message: "",
        });
        setTimeout(() => setIsSubmitted(false), 6000);
      } else {
        toast.error(apiMessage || (isAr ? "حدث خطأ أثناء الإرسال" : "Submission error"));
      }
    } catch (err: any) {
      const errMsg = err?.response?.data?.message || err?.data?.message || err?.message;
      toast.error(errMsg || (isAr ? "تعذر الاتصال بالسيرفر. يرجى المحاولة لاحقاً." : "Network error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleFaq = (id: number) => {
    setActiveFaqId(activeFaqId === id ? null : id);
  };

  return (
    <section dir={isAr ? "rtl" : "ltr"} className="py-16 lg:py-24 bg-[#F6F4EE]">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-14">
          <span className="inline-flex rounded-full bg-[#EEF6F3] text-[#0E6B58] border border-[#DCE6E2] px-4 py-2 text-xs font-black mb-4">
            <Headphones size={14} className={isAr ? "ml-2" : "mr-2"} />
            {isAr ? "الدعم الفني والاتصال" : "Technical Support & Contact"}
          </span>

          <h1 className="text-3xl lg:text-5xl font-black text-[#101820] leading-[1.2]">
            {isAr
              ? "كيف يمكننا مساعدتك اليوم؟"
              : "How can we help you today?"}
          </h1>

          <p className="mt-4 text-[#63756F] leading-7 max-w-2xl mx-auto">
            {isAr
              ? "فريق الدعم الفني لدينا جاهز للإجابة على جميع استفساراتك وحل أي مشكلة قد تواجهها. اختر الطريقة المناسبة للتواصل معنا."
              : "Our technical support team is ready to answer all your inquiries and resolve any issues you may encounter."}
          </p>
        </div>

        {/* Support Channels */}
        <div className="grid md:grid-cols-3 gap-5 mb-14">
          {supportChannels.map((channel) => {
            const Icon = channel.icon;

            return (
              <a
                key={channel.title}
                href={channel.link}
                target={channel.link.startsWith("http") ? "_blank" : undefined}
                rel={channel.link.startsWith("http") ? "noopener noreferrer" : undefined}
                className="group rounded-[28px] bg-white border border-[#E7E1D6] p-6 text-center shadow-sm hover:shadow-[0_16px_50px_rgba(16,24,32,0.08)] transition hover:-translate-y-1 block"
              >
                <div
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${channel.color} text-white flex items-center justify-center mx-auto mb-4 transition duration-300 group-hover:scale-110`}
                >
                  <Icon size={28} />
                </div>

                <h3 className="text-xl font-black text-[#101820]">
                  {channel.title}
                </h3>

                <p className="text-sm text-[#63756F] leading-6 mt-2">
                  {channel.desc}
                </p>

                <div className="mt-4 inline-flex h-10 rounded-full bg-[#F6F4EE] text-[#101820] px-5 items-center text-sm font-black group-hover:bg-[#0E6B58] group-hover:text-white transition">
                  {channel.action}
                </div>
              </a>
            );
          })}
        </div>

        {/* FAQ Section */}
        <div className="mb-14">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-8">
            <div className={isAr ? "text-right" : "text-left"}>
              <span className="text-sm font-black text-[#0E6B58] tracking-widest uppercase flex items-center gap-2">
                <HelpCircle size={14} />
                {isAr ? "الأسئلة الشائعة" : "FAQ"}
              </span>
              <h2 className="text-2xl lg:text-3xl font-black text-[#101820] mt-2">
                {isAr
                  ? "إجابات لأكثر الأسئلة شيوعاً"
                  : "Answers to the most common questions"}
              </h2>
            </div>
          </div>

          <div className="grid gap-4">
            {faqItems.map((faq) => {
              const isOpen = activeFaqId === faq.id;

              return (
                <div
                  key={faq.id}
                  className="bg-white rounded-[20px] border border-[#E7E1D6] overflow-hidden shadow-sm hover:shadow-[0_8px_30px_rgba(16,24,32,0.06)] transition"
                >
                  <button
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full flex items-start gap-4 p-5 text-left"
                  >
                    <span
                      className={`text-base font-black text-[#101820] flex-1 ${
                        isAr ? "text-right" : "text-left"
                      }`}
                    >
                      {faq.question}
                    </span>
                    <span
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition ${
                        isOpen
                          ? "bg-[#0E6B58] text-white"
                          : "bg-[#EEF6F3] text-[#0E6B58]"
                      }`}
                    >
                      <ChevronDown
                        size={18}
                        className={`transition-transform duration-300 ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </span>
                  </button>

                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      isOpen ? "max-h-96" : "max-h-0"
                    }`}
                  >
                    <div
                      className={`px-5 pb-5 pt-1 text-[#63756F] leading-7 text-sm border-t border-[#F0EDE8] ${
                        isAr ? "text-right" : "text-left"
                      }`}
                    >
                      {faq.answer}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Contact Form & Side Info */}
        <div className="rounded-[32px] bg-white border border-[#E7E1D6] p-8 lg:p-12 shadow-sm overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#EEF6F3] rounded-full blur-3xl opacity-50 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#F8F3EA] rounded-full blur-3xl opacity-50 pointer-events-none" />

          <div className="relative z-10 grid lg:grid-cols-5 gap-10">
            {/* Form Column */}
            <div className="lg:col-span-3">
              <h2 className="text-2xl lg:text-3xl font-black text-[#101820]">
                {isAr
                  ? "أرسل استفسارك وسيتواصل معك فريقنا"
                  : "Send your inquiry and our team will get back to you"}
              </h2>
              <p className="text-[#63756F] leading-7 mt-2">
                {isAr
                  ? "املأ النموذج التالي وسنقوم بالرد على استفسارك في أقرب وقت ممكن."
                  : "Fill out the form below and we will respond to your message promptly."}
              </p>

              {isSubmitted ? (
                <div className="mt-6 bg-[#EEF6F3] border border-[#0E6B58]/20 rounded-[20px] p-6 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#0E6B58] text-white flex items-center justify-center shrink-0">
                    <CheckCircle size={24} />
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-[#101820]">
                      {isAr
                        ? "تم إرسال استفسارك بنجاح!"
                        : "Your inquiry was sent successfully!"}
                    </h4>
                    <p className="text-sm text-[#63756F] mt-1">
                      {isAr
                        ? "سيتواصل معك فريق الدعم الفني خلال أقرب وقت."
                        : "Our support team will reach out to you shortly."}
                    </p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                  {/* Name & Email */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="name"
                        className={`text-sm font-bold text-[#101820] block mb-1.5 ${
                          isAr ? "text-right" : "text-left"
                        }`}
                      >
                        {isAr ? "الاسم الكامل *" : "Full Name *"}
                      </label>
                      <div className="relative">
                        <User
                          className={`absolute top-1/2 -translate-y-1/2 text-[#63756F] size-4 ${
                            isAr ? "right-3.5" : "left-3.5"
                          }`}
                        />
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder={isAr ? "أدخل اسمك" : "Enter your name"}
                          className={`w-full rounded-xl border ${
                            errors.name ? "border-red-500" : "border-[#E7E1D6]"
                          } bg-[#F9F8F6] py-3.5 text-[#101820] placeholder:text-[#B0AEA6] focus:border-[#0E6B58] focus:outline-none focus:ring-2 focus:ring-[#0E6B58]/20 transition ${
                            isAr ? "pr-11 pl-4 text-right" : "pl-11 pr-4 text-left"
                          }`}
                        />
                      </div>
                      {errors.name && (
                        <p className="mt-1 text-xs font-bold text-red-500">{errors.name}</p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className={`text-sm font-bold text-[#101820] block mb-1.5 ${
                          isAr ? "text-right" : "text-left"
                        }`}
                      >
                        {isAr ? "البريد الإلكتروني *" : "Email Address *"}
                      </label>
                      <div className="relative">
                        <AtSign
                          className={`absolute top-1/2 -translate-y-1/2 text-[#63756F] size-4 ${
                            isAr ? "right-3.5" : "left-3.5"
                          }`}
                        />
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder={
                            isAr ? "أدخل بريدك الإلكتروني" : "Enter your email"
                          }
                          className={`w-full rounded-xl border ${
                            errors.email ? "border-red-500" : "border-[#E7E1D6]"
                          } bg-[#F9F8F6] py-3.5 text-[#101820] placeholder:text-[#B0AEA6] focus:border-[#0E6B58] focus:outline-none focus:ring-2 focus:ring-[#0E6B58]/20 transition ${
                            isAr ? "pr-11 pl-4 text-right" : "pl-11 pr-4 text-left"
                          }`}
                        />
                      </div>
                      {errors.email && (
                        <p className="mt-1 text-xs font-bold text-red-500">{errors.email}</p>
                      )}
                    </div>
                  </div>

                  {/* Phone & Country Code */}
                  <div className="grid sm:grid-cols-3 gap-4">
                    <div>
                      <label
                        htmlFor="country_code"
                        className={`text-sm font-bold text-[#101820] block mb-1.5 ${
                          isAr ? "text-right" : "text-left"
                        }`}
                      >
                        {isAr ? "رمز الدولة" : "Country Code"}
                      </label>
                      {/* Styled select with proper arrow padding */}
                      <div className="relative">
                        <select
                          id="country_code"
                          name="country_code"
                          value={formData.country_code}
                          onChange={handleInputChange}
                          className={`w-full appearance-none rounded-xl border border-[#E7E1D6] bg-[#F9F8F6] py-3.5 text-[#101820] font-bold outline-none focus:border-[#0E6B58] focus:ring-2 focus:ring-[#0E6B58]/20 transition cursor-pointer ${
                            isAr ? "pr-4 pl-10 text-right" : "pl-4 pr-10 text-left"
                          }`}
                        >
                          <option value="+971">🇦🇪 +971 (الإمارات)</option>
                          <option value="+963">🇸🇾 +963 (سوريا)</option>
                          <option value="+964">🇮🇶 +964 (العراق)</option>
                        </select>
                        <ChevronDown
                          size={18}
                          className={`pointer-events-none absolute top-1/2 -translate-y-1/2 text-[#71807B] ${
                            isAr ? "left-3" : "right-3"
                          }`}
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label
                        htmlFor="phone"
                        className={`text-sm font-bold text-[#101820] block mb-1.5 ${
                          isAr ? "text-right" : "text-left"
                        }`}
                      >
                        {isAr ? "رقم الهاتف *" : "Phone Number *"}
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder={isAr ? "0527315488" : "0527315488"}
                        className={`w-full rounded-xl border ${
                          errors.phone ? "border-red-500" : "border-[#E7E1D6]"
                        } bg-[#F9F8F6] px-4 py-3.5 text-[#101820] placeholder:text-[#B0AEA6] focus:border-[#0E6B58] focus:outline-none focus:ring-2 focus:ring-[#0E6B58]/20 ${
                          isAr ? "text-right" : "text-left"
                        }`}
                      />
                      {errors.phone && (
                        <p className="mt-1 text-xs font-bold text-red-500">{errors.phone}</p>
                      )}
                    </div>
                  </div>

                  {/* Message Type Dropdown */}
                  <div>
                    <label
                      htmlFor="message_type"
                      className={`text-sm font-bold text-[#101820] block mb-1.5 ${
                        isAr ? "text-right" : "text-left"
                      }`}
                    >
                      {isAr ? "نوع الرسالة / الاستفسار" : "Message Type"}
                    </label>
                    {/* Styled select with proper arrow padding */}
                    <div className="relative">
                      <select
                        id="message_type"
                        name="message_type"
                        value={formData.message_type}
                        onChange={handleInputChange}
                        className={`w-full appearance-none rounded-xl border border-[#E7E1D6] bg-[#F9F8F6] py-3.5 text-[#101820] font-bold outline-none focus:border-[#0E6B58] focus:ring-2 focus:ring-[#0E6B58]/20 transition cursor-pointer ${
                          isAr ? "pr-4 pl-10 text-right" : "pl-4 pr-10 text-left"
                        }`}
                      >
                        <option value="technical_support">
                          {isAr ? "دعم فني وتطني" : "Technical Support"}
                        </option>
                        <option value="inquiry">
                          {isAr ? "استفسار عام" : "General Inquiry"}
                        </option>
                        <option value="complaint">
                          {isAr ? "تقديم شكوى" : "Complaint"}
                        </option>
                        <option value="suggestion">
                          {isAr ? "اقتراح وتطوير" : "Suggestion"}
                        </option>
                      </select>
                      <ChevronDown
                        size={18}
                        className={`pointer-events-none absolute top-1/2 -translate-y-1/2 text-[#71807B] ${
                          isAr ? "left-3" : "right-3"
                        }`}
                      />
                    </div>
                  </div>

                  {/* Message Textarea */}
                  <div>
                    <label
                      htmlFor="message"
                      className={`text-sm font-bold text-[#101820] block mb-1.5 ${
                        isAr ? "text-right" : "text-left"
                      }`}
                    >
                      {isAr ? "نص الرسالة *" : "Message *"}
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={4}
                      placeholder={
                        isAr ? "اكتب تفاصيل استفسارك أو مشكلتك هنا..." : "Write details of your message here..."
                      }
                      className={`w-full rounded-xl border ${
                        errors.message ? "border-red-500" : "border-[#E7E1D6]"
                      } bg-[#F9F8F6] px-4 py-3.5 text-[#101820] placeholder:text-[#B0AEA6] focus:border-[#0E6B58] focus:outline-none focus:ring-2 focus:ring-[#0E6B58]/20 transition resize-none ${
                        isAr ? "text-right" : "text-left"
                      }`}
                    />
                    {errors.message && (
                      <p className="mt-1 text-xs font-bold text-red-500">{errors.message}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="h-14 rounded-full bg-[#101820] text-white px-9 font-black hover:bg-[#0E6B58] transition flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed w-full sm:w-auto shadow-md"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                        {isAr ? "جاري الإرسال..." : "Sending..."}
                      </>
                    ) : (
                      <>
                        {isAr ? "إرسال الرسالة" : "Send Message"}
                        <Send size={18} />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* Side Contact Details & Working Hours */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-[#F9F8F6] rounded-[24px] p-6 border border-[#E7E1D6]">
                <h3 className="text-lg font-black text-[#101820] flex items-center gap-2 mb-4">
                  <MapPin size={20} className="text-[#0E6B58]" />
                  {isAr ? "معلومات التواصل" : "Contact Details"}
                </h3>

                <div className="space-y-4 text-sm">
                  <div className="flex items-start gap-3">
                    <MapPin size={18} className="text-[#C89B3C] shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-[#63756F]">
                        {isAr ? "العنوان" : "Address"}
                      </p>
                      <p className="font-bold text-[#101820] mt-0.5">{addressDisplay}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone size={18} className="text-[#0E6B58] shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-[#63756F]">
                        {isAr ? "أرقام التواصل" : "Phone"}
                      </p>
                      <p className="font-bold text-[#101820] mt-0.5" dir="ltr">{phoneDisplay}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Mail size={18} className="text-[#0E6B58] shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-[#63756F]">
                        {isAr ? "البريد الإلكتروني" : "Email"}
                      </p>
                      <p className="font-bold text-[#101820] mt-0.5">{emailDisplay}</p>
                    </div>
                  </div>
                </div>

                <hr className="my-5 border-[#E7E1D6]" />

                <h3 className="text-lg font-black text-[#101820] flex items-center gap-2 mb-3">
                  <Clock size={20} className="text-[#0E6B58]" />
                  {isAr ? "ساعات العمل الرسمية" : "Working Hours"}
                </h3>

                <div className="space-y-2.5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#63756F]">
                      {isAr ? "الأحد - الخميس" : "Sunday - Thursday"}
                    </span>
                    <span className="font-bold text-[#101820]">
                      9:00 AM - 6:00 PM
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#63756F]">
                      {isAr ? "الجمعة" : "Friday"}
                    </span>
                    <span className="font-bold text-[#101820]">
                      {isAr ? "مغلق" : "Closed"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#63756F]">
                      {isAr ? "السبت" : "Saturday"}
                    </span>
                    <span className="font-bold text-[#101820]">
                      10:00 AM - 2:00 PM
                    </span>
                  </div>
                </div>

                {socialLinks.length > 0 && (
                  <>
                    <hr className="my-5 border-[#E7E1D6]" />

                    <h3 className="text-sm font-black text-[#101820] flex items-center gap-2 mb-3">
                      <Share2 size={16} className="text-[#0E6B58]" />
                      {isAr ? "تابعنا على التواصل الاجتماعي" : "Follow Us"}
                    </h3>

                    {/* Render Social Media as ICON Buttons instead of text */}
                    <div className="flex flex-wrap gap-2.5 items-center">
                      {socialLinks.map((item) => (
                        <a
                          key={item.name}
                          href={item.link!}
                          target="_blank"
                          rel="noopener noreferrer"
                          title={item.name}
                          aria-label={item.name}
                          className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#E7E1D6] bg-white text-[#101820] shadow-sm transition-all duration-300 hover:scale-110 hover:border-[#0E6B58] hover:bg-[#0E6B58] hover:text-white"
                        >
                          <SocialIcon name={item.name} />
                        </a>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Custom SVG Icons for Social Media Platforms
const SocialIcon = ({ name }: { name: string }) => {
  switch (name.toLowerCase()) {
    case "facebook":
      return (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      );
    case "instagram":
      return (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
      );
    case "x":
    case "twitter":
      return (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      );
    case "telegram":
      return (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm5.562 8.161c-.18.717-.962 4.084-1.362 5.752-.169.706-.432.942-.684.965-.548.05-.964-.361-1.496-.709-.832-.546-1.301-.885-2.109-1.417-.934-.615-.329-.953.204-1.506.139-.145 2.56-2.348 2.607-2.548.006-.025.011-.118-.044-.167-.055-.049-.136-.032-.195-.019-.084.019-1.424.906-4.02 2.658-.38.261-.724.389-1.032.382-.341-.008-.997-.193-1.485-.352-.599-.194-1.075-.298-1.033-.629.022-.172.261-.348.717-.529 2.809-1.223 4.683-2.03 5.621-2.421 2.673-1.114 3.228-1.308 3.59-1.314.079-.001.257.018.373.113.098.08.125.189.138.265.013.076.028.249.016.386z"/>
        </svg>
      );
    case "youtube":
      return (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      );
    case "snapchat":
      return (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M12.046 2.015c-3.666 0-5.882 2.518-5.882 5.093 0 1.258.468 2.502 1.096 3.328.14.184.18.326.068.514-.078.13-.244.382-.472.744-.06.096-.134.148-.242.148-.07 0-.154-.022-.266-.076-.804-.384-1.63-.586-2.456-.586-.426 0-.8.058-1.122.176-.328.12-.524.316-.576.582-.06.31.082.632.414.94.384.356.914.654 1.576.884 1.542.534 2.87 1.344 3.004 2.22.016.104-.008.204-.07.294-.378.544-1.282 1.488-2.61 1.704-.266.044-.45.196-.45.394 0 .166.126.318.374.452.796.432 1.748.882 2.76 1.306 2.658 1.114 5.378.882 7.776-.662.336-.216.716-.328 1.132-.328.528 0 1.066.184 1.6.548.21.144.4.216.57.216.222 0 .386-.124.386-.304 0-.174-.158-.332-.476-.474-1.328-.59-2.022-1.464-2.062-2.602-.008-.224.088-.418.286-.576.244-.194.55-.42.912-.676.87-.614 1.206-1.202 1.002-1.748-.124-.336-.452-.524-.962-.562-.486-.036-1.042.064-1.656.296-.112.042-.206.058-.284.058-.112 0-.192-.054-.252-.16-.208-.364-.378-.616-.514-.754-.108-.11-.082-.238.072-.416.782-.906 1.238-2.146 1.238-3.486 0-2.574-2.216-5.092-5.882-5.092z"/>
        </svg>
      );
    case "tiktok":
      return (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.96-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.82.56-1.36 1.48-1.43 2.47-.11 1.37.56 2.76 1.7 3.4 1.1.61 2.49.57 3.54-.1.97-.61 1.57-1.68 1.63-2.81.07-3.85.03-7.71.04-11.56z"/>
        </svg>
      );
    default:
      return <Share2 className="w-5 h-5" />;
  }
};

export default TechnicalSupport;