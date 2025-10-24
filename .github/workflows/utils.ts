export const formatPhoneNumber = (phone: string): string => {
  if (!phone) return '';
  // إزالة جميع الأحرف غير الرقمية
  let cleaned = phone.replace(/\D/g, '');
  
  // التعامل مع الأرقام السعودية: إذا بدأت بـ 05، استبدل الصفر البادئ بـ 966
  if (cleaned.startsWith('05')) {
    cleaned = '966' + cleaned.substring(1);
  }
  // قد يكون رقمًا كاملاً مثل 9665... وهذا جيد
  // قد يكون +966... سيتم إزالة + ويصبح 966... وهذا جيد.

  return cleaned;
};
