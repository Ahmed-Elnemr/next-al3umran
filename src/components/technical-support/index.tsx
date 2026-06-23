"use client";

import Link from "next/link";
import { useLocale } from "next-intl";
import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  MessageSquare,
  Phone,
  Mail,
  Clock,
  HelpCircle,
  FileText,
  AlertCircle,
  CheckCircle,
  ChevronDown,
  Send,
  Headphones,
  User,
  AtSign,
} from "lucide-react";

const TechnicalSupport = () => {
  const locale = useLocale();
  const isAr = locale === "ar";
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

  // استخدام useState مع رقم id لكل سؤال على حدة
  const [activeFaqId, setActiveFaqId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const faqs = [
    {
      id: 1,
      question: isAr
        ? "كيف يمكنني إنشاء حساب جديد على المنصة؟"
        : "How do I create a new account on the platform?",
      answer: isAr
        ? "يمكنك إنشاء حساب جديد من خلال الضغط على زر 'تسجيل الدخول' في أعلى الصفحة، ثم اختيار 'إنشاء حساب جديد'. قم بإدخال بياناتك الأساسية مثل الاسم والبريد الإلكتروني ورقم الهاتف، ثم اتبع التعليمات لإكمال عملية التسجيل. ستصلك رسالة تأكيد على بريدك الإلكتروني لتفعيل الحساب."
        : "You can create a new account by clicking the 'Login' button at the top of the page, then selecting 'Create New Account'. Enter your basic information such as name, email, and phone number, then follow the instructions to complete the registration. You will receive a confirmation email to activate your account.",
    },
    {
      id: 2,
      question: isAr
        ? "كيف يمكنني إضافة عقار جديد للبيع أو الإيجار؟"
        : "How can I add a new property for sale or rent?",
      answer: isAr
        ? "لإضافة عقار جديد، قم بتسجيل الدخول إلى حسابك، ثم انتقل إلى صفحة 'أضف عقارك'. املأ جميع البيانات المطلوبة مثل نوع العقار، الموقع، المساحة، السعر، الصور، ووصف العقار. تأكد من صحة جميع المعلومات قبل الضغط على زر 'نشر'. سيتم مراجعة العقار من قبل فريقنا قبل نشره على المنصة."
        : "To add a new property, log in to your account, then go to the 'Add Your Property' page. Fill in all required information such as property type, location, area, price, images, and property description. Make sure all information is correct before clicking 'Publish'. Your property will be reviewed by our team before being published on the platform.",
    },
    {
      id: 3,
      question: isAr
        ? "كم تستغرق عملية مراجعة العقار قبل نشره؟"
        : "How long does the property review process take?",
      answer: isAr
        ? "تستغرق عملية مراجعة العقار عادةً بين 24 إلى 48 ساعة عمل. نحرص على التأكد من صحة جميع المعلومات والصور قبل الموافقة على النشر. في حالة وجود أي نقص في البيانات، سيتواصل معك فريق الدعم لاستكمال المعلومات المطلوبة."
        : "The property review process typically takes between 24 to 48 business hours. We ensure all information and images are correct before approving publication. If any data is missing, our support team will contact you to complete the required information.",
    },
    {
      id: 4,
      question: isAr
        ? "كيف يمكنني تعديل أو حذف عقار تم نشره؟"
        : "How can I edit or delete a published property?",
      answer: isAr
        ? "يمكنك تعديل أو حذف عقارك من خلال لوحة التحكم الخاصة بحسابك. انتقل إلى قسم 'عقاراتي'، ثم اختر العقار المطلوب. ستجد خيارات 'تعديل' و 'حذف'. في حالة الحذف، سيتم إزالة العقار فوراً من المنصة. أما التعديل فسيتم مراجعته مرة أخرى من قبل فريقنا."
        : "You can edit or delete your property from your account dashboard. Go to 'My Properties', then select the desired property. You will find 'Edit' and 'Delete' options. In case of deletion, the property will be immediately removed from the platform. Edits will be reviewed again by our team.",
    },
    {
      id: 5,
      question: isAr
        ? "هل توجد رسوم على استخدام المنصة؟"
        : "Are there any fees for using the platform?",
      answer: isAr
        ? "تتيح منصة العمران للمستخدمين إضافة عقاراتهم مجاناً. بالنسبة للعمولات، لا توجد أي رسوم خفية أو عمولات إضافية. نحن نؤمن بتقديم خدمة شفافة وميسرة للجميع. في حالة وجود أي خدمات إضافية مدفوعة، سيتم إعلامك بوضوح قبل الاشتراك فيها."
        : "Al Omran Platform allows users to add their properties for free. Regarding commissions, there are no hidden fees or additional commissions. We believe in providing a transparent and accessible service for everyone. If there are any additional paid services, you will be clearly informed before subscribing.",
    },
    {
      id: 6,
      question: isAr
        ? "كيف يمكنني التواصل مع المالك أو الوسيط العقاري؟"
        : "How can I contact the owner or real estate agent?",
      answer: isAr
        ? "يمكنك التواصل مع المالك أو الوسيط مباشرة من خلال صفحة تفاصيل العقار. ستجد زر 'تواصل' أو 'طلب اتصال'، اضغط عليه واملأ البيانات المطلوبة. سيتم إرسال رسالتك إلى المالك الذي سيتواصل معك في أقرب وقت. يتم حماية بيانات التواصل الخاصة بك وعدم مشاركتها مع أي طرف آخر."
        : "You can contact the owner or agent directly from the property details page. You will find a 'Contact' or 'Request Call' button, click it and fill in the required information. Your message will be sent to the owner who will contact you as soon as possible. Your contact data is protected and not shared with any other party.",
    },
    {
      id: 7,
      question: isAr
        ? "ماذا أفعل إذا واجهت مشكلة تقنية أثناء استخدام المنصة؟"
        : "What should I do if I encounter a technical issue while using the platform?",
      answer: isAr
        ? "إذا واجهتك أي مشكلة تقنية، يمكنك التواصل مع فريق الدعم الفني من خلال نموذج التواصل الموجود في هذه الصفحة، أو عبر البريد الإلكتروني أو الهاتف. يرجى تزويدنا بأكبر قدر من التفاصيل حول المشكلة التي تواجهها، مع إرفاق لقطات شاشة إن أمكن، لمساعدتنا في حل المشكلة بأسرع وقت."
        : "If you encounter any technical issue, you can contact our technical support team through the contact form on this page, or via email or phone. Please provide us with as many details as possible about the issue you're facing, along with screenshots if possible, to help us resolve the issue as quickly as possible.",
    },
  ];

  const supportChannels = [
    {
      icon: MessageSquare,
      title: isAr ? "دردشة مباشرة" : "Live Chat",
      desc: isAr
        ? "تحدث مع فريق الدعم فوراً"
        : "Chat with our support team instantly",
      action: isAr ? "ابدأ الدردشة" : "Start Chat",
      color: "from-[#0E6B58] to-[#101820]",
    },
    {
      icon: Mail,
      title: isAr ? "البريد الإلكتروني" : "Email",
      desc: isAr
        ? "أرسل استفسارك وسنرد عليك خلال 24 ساعة"
        : "Send your inquiry and we'll reply within 24 hours",
      action: "support@alomran.com",
      color: "from-[#8A5A2B] to-[#C89B3C]",
    },
    {
      icon: Phone,
      title: isAr ? "الهاتف" : "Phone",
      desc: isAr
        ? "اتصل بنا خلال أوقات العمل الرسمية"
        : "Call us during official working hours",
      action: "+20 123 456 789",
      color: "from-[#315C3F] to-[#89A86B]",
    },
  ];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
      setTimeout(() => setIsSubmitted(false), 5000);
    }, 1500);
  };

  // دالة لتبديل حالة السؤال - كل سؤال له id مميز
  const toggleFaq = (id: number) => {
    // لو السؤال ده مفتوح، قفله. ولو مقفول، افتحه
    setActiveFaqId(activeFaqId === id ? null : id);
  };

  return (
    <section dir={isAr ? "rtl" : "ltr"} className="py-16 lg:py-24 bg-[#F6F4EE]">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-14">
          <span className="inline-flex rounded-full bg-[#EEF6F3] text-[#0E6B58] border border-[#DCE6E2] px-4 py-2 text-xs font-black mb-4">
            <Headphones size={14} className={isAr ? "ml-2" : "mr-2"} />
            {isAr ? "الدعم الفني" : "Technical Support"}
          </span>

          <h1 className="text-3xl lg:text-5xl font-black text-[#101820] leading-[1.2]">
            {isAr
              ? "كيف يمكننا مساعدتك اليوم؟"
              : "How can we help you today?"}
          </h1>

          <p className="mt-4 text-[#63756F] leading-7 max-w-2xl mx-auto">
            {isAr
              ? "فريق الدعم الفني لدينا جاهز للإجابة على جميع استفساراتك وحل أي مشكلة قد تواجهها. اختر الطريقة المناسبة للتواصل معنا."
              : "Our technical support team is ready to answer all your inquiries and resolve any issues you may encounter. Choose the appropriate way to contact us."}
          </p>
        </div>

        {/* Support Channels */}
        <div className="grid md:grid-cols-3 gap-5 mb-14">
          {supportChannels.map((channel) => {
            const Icon = channel.icon;

            return (
              <div
                key={channel.title}
                className="rounded-[28px] bg-white border border-[#E7E1D6] p-6 text-center shadow-sm hover:shadow-[0_16px_50px_rgba(16,24,32,0.08)] transition hover:-translate-y-1"
              >
                <div
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${channel.color} text-white flex items-center justify-center mx-auto mb-4`}
                >
                  <Icon size={28} />
                </div>

                <h3 className="text-xl font-black text-[#101820]">
                  {channel.title}
                </h3>

                <p className="text-sm text-[#63756F] leading-6 mt-2">
                  {channel.desc}
                </p>

                <button className="mt-4 h-10 rounded-full bg-[#F6F4EE] text-[#101820] px-5 text-sm font-black hover:bg-[#0E6B58] hover:text-white transition">
                  {channel.action}
                </button>
              </div>
            );
          })}
        </div>

        {/* FAQ Section - كل سؤال مستقل بذاته */}
        <div className="mb-14">
          <div className={`flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-8`}>
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
            {faqs.map((faq) => {
              // كل سؤال له حالة مستقلة بناءً على id الخاص بيه
              const isOpen = activeFaqId === faq.id;
              
              return (
                <div
                  key={faq.id}
                  className="bg-white rounded-[20px] border border-[#E7E1D6] overflow-hidden shadow-sm hover:shadow-[0_8px_30px_rgba(16,24,32,0.06)] transition"
                >
                  <button
                    onClick={() => toggleFaq(faq.id)}
                    className={`w-full flex items-start gap-4 p-5 text-left ${
                      isAr ? "flex-row" : "flex-row"
                    }`}
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

        {/* Contact Form */}
        <div className="rounded-[32px] bg-white border border-[#E7E1D6] p-8 lg:p-12 shadow-sm overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#EEF6F3] rounded-full blur-3xl opacity-50" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#F8F3EA] rounded-full blur-3xl opacity-50" />

          <div className="relative z-10 grid lg:grid-cols-5 gap-10">
            <div className="lg:col-span-3">
              <h2 className="text-2xl lg:text-3xl font-black text-[#101820]">
                {isAr
                  ? "أرسل استفسارك وفريقنا سيرد عليك"
                  : "Send your inquiry and our team will get back to you"}
              </h2>
              <p className="text-[#63756F] leading-7 mt-2">
                {isAr
                  ? "املأ النموذج التالي وسنقوم بالرد على استفسارك في أقرب وقت ممكن"
                  : "Fill out the form below and we will respond to your inquiry as soon as possible"}
              </p>

              {isSubmitted ? (
                <div className="mt-6 bg-[#EEF6F3] border border-[#0E6B58]/20 rounded-[20px] p-6 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#0E6B58] text-white flex items-center justify-center">
                    <CheckCircle size={24} />
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-[#101820]">
                      {isAr
                        ? "تم إرسال استفسارك بنجاح"
                        : "Your inquiry was sent successfully"}
                    </h4>
                    <p className="text-sm text-[#63756F]">
                      {isAr
                        ? "سيتواصل معك فريق الدعم خلال 24 ساعة"
                        : "Our support team will contact you within 24 hours"}
                    </p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="name"
                        className={`text-sm font-bold text-[#101820] block mb-1.5 ${
                          isAr ? "text-right" : "text-left"
                        }`}
                      >
                        {isAr ? "الاسم الكامل" : "Full Name"}
                      </label>
                      <div className="relative">
                        <User
                          className={`absolute top-1/2 -translate-y-1/2 text-[#63756F] size-4 ${
                            isAr ? "right-3" : "left-3"
                          }`}
                        />
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder={isAr ? "أدخل اسمك" : "Enter your name"}
                          required
                          className={`w-full rounded-xl border border-[#E7E1D6] bg-[#F9F8F6] py-3 text-[#101820] placeholder:text-[#B0AEA6] focus:border-[#0E6B58] focus:outline-none focus:ring-2 focus:ring-[#0E6B58]/20 transition ${
                            isAr ? "pr-10 pl-4 text-right" : "pl-10 pr-4 text-left"
                          }`}
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className={`text-sm font-bold text-[#101820] block mb-1.5 ${
                          isAr ? "text-right" : "text-left"
                        }`}
                      >
                        {isAr ? "البريد الإلكتروني" : "Email Address"}
                      </label>
                      <div className="relative">
                        <AtSign
                          className={`absolute top-1/2 -translate-y-1/2 text-[#63756F] size-4 ${
                            isAr ? "right-3" : "left-3"
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
                          required
                          className={`w-full rounded-xl border border-[#E7E1D6] bg-[#F9F8F6] py-3 text-[#101820] placeholder:text-[#B0AEA6] focus:border-[#0E6B58] focus:outline-none focus:ring-2 focus:ring-[#0E6B58]/20 transition ${
                            isAr ? "pr-10 pl-4 text-right" : "pl-10 pr-4 text-left"
                          }`}
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="subject"
                      className={`text-sm font-bold text-[#101820] block mb-1.5 ${
                        isAr ? "text-right" : "text-left"
                      }`}
                    >
                      {isAr ? "عنوان الاستفسار" : "Subject"}
                    </label>
                    <div className="relative">
                      <FileText
                        className={`absolute top-1/2 -translate-y-1/2 text-[#63756F] size-4 ${
                          isAr ? "right-3" : "left-3"
                        }`}
                      />
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        placeholder={
                          isAr ? "موضوع استفسارك" : "Your inquiry subject"
                        }
                        required
                        className={`w-full rounded-xl border border-[#E7E1D6] bg-[#F9F8F6] py-3 text-[#101820] placeholder:text-[#B0AEA6] focus:border-[#0E6B58] focus:outline-none focus:ring-2 focus:ring-[#0E6B58]/20 transition ${
                          isAr ? "pr-10 pl-4 text-right" : "pl-10 pr-4 text-left"
                        }`}
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className={`text-sm font-bold text-[#101820] block mb-1.5 ${
                        isAr ? "text-right" : "text-left"
                      }`}
                    >
                      {isAr ? "الرسالة" : "Message"}
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={4}
                      placeholder={
                        isAr ? "اكتب رسالتك هنا..." : "Write your message here..."
                      }
                      required
                      className={`w-full rounded-xl border border-[#E7E1D6] bg-[#F9F8F6] px-4 py-3 text-[#101820] placeholder:text-[#B0AEA6] focus:border-[#0E6B58] focus:outline-none focus:ring-2 focus:ring-[#0E6B58]/20 transition resize-none ${
                        isAr ? "text-right" : "text-left"
                      }`}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`h-12 rounded-full bg-[#101820] text-white px-8 font-black hover:bg-[#0E6B58] transition flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed ${
                      isAr ? "flex-row" : "flex-row"
                    }`}
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

            <div className="lg:col-span-2">
              <div className="bg-[#F9F8F6] rounded-[24px] p-6 border border-[#E7E1D6]">
                <h3 className={`text-lg font-black text-[#101820] flex items-center gap-2 ${
                  isAr ? "" : ""
                }`}>
                  <Clock size={20} className="text-[#0E6B58]" />
                  {isAr ? "ساعات العمل" : "Working Hours"}
                </h3>

                <div className="mt-4 space-y-3">
                  <div className={`flex justify-between text-sm ${
                    isAr ? "flex-row" : "flex-row"
                  }`}>
                    <span className="text-[#63756F]">
                      {isAr ? "الأحد - الخميس" : "Sunday - Thursday"}
                    </span>
                    <span className="font-bold text-[#101820]">
                      9:00 AM - 6:00 PM
                    </span>
                  </div>
                  <div className={`flex justify-between text-sm ${
                    isAr ? "flex-row" : "flex-row"
                  }`}>
                    <span className="text-[#63756F]">
                      {isAr ? "الجمعة" : "Friday"}
                    </span>
                    <span className="font-bold text-[#101820]">
                      {isAr ? "مغلق" : "Closed"}
                    </span>
                  </div>
                  <div className={`flex justify-between text-sm ${
                    isAr ? "flex-row" : "flex-row"
                  }`}>
                    <span className="text-[#63756F]">
                      {isAr ? "السبت" : "Saturday"}
                    </span>
                    <span className="font-bold text-[#101820]">
                      10:00 AM - 2:00 PM
                    </span>
                  </div>
                </div>

                <hr className="my-4 border-[#E7E1D6]" />

                <h3 className={`text-lg font-black text-[#101820] flex items-center gap-2 ${
                  isAr ? "" : "flex-row"
                }`}>
                  <AlertCircle size={20} className="text-[#C89B3C]" />
                  {isAr ? "وقت الاستجابة" : "Response Time"}
                </h3>

                <div className="mt-4 space-y-3 text-sm">
                  <div className={`flex justify-between ${
                    isAr ? "" : "flex-row"
                  }`}>
                    <span className="text-[#63756F]">
                      {isAr ? "الدردشة المباشرة" : "Live Chat"}
                    </span>
                    <span className="font-bold text-[#0E6B58]">
                      {isAr ? "دقائق" : "Minutes"}
                    </span>
                  </div>
                  <div className={`flex justify-between ${
                    isAr ? "flex-row" : "flex-row"
                  }`}>
                    <span className="text-[#63756F]">
                      {isAr ? "البريد الإلكتروني" : "Email"}
                    </span>
                    <span className="font-bold text-[#0E6B58]">
                      {isAr ? "24 ساعة" : "24 Hours"}
                    </span>
                  </div>
                  <div className={`flex justify-between ${
                    isAr ? "flex-row" : "flex-row"
                  }`}>
                    <span className="text-[#63756F]">
                      {isAr ? "الهاتف" : "Phone"}
                    </span>
                    <span className="font-bold text-[#0E6B58]">
                      {isAr ? "فوري" : "Immediate"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TechnicalSupport;