import type { Locale } from "@/lib/types";

export const DEFAULT_LOCALE: Locale = "fr";
export const LOCALES: Locale[] = ["fr", "ar"];

export const t = (locale: Locale) => {
  const isAr = locale === "ar";
  return {
    localeLabel: isAr ? "العربية" : "Français",
    shopName: "Rora’s Delights",
    nav: {
      home: isAr ? "الرئيسية" : "Accueil",
      products: isAr ? "المنتجات" : "Produits",
      cart: isAr ? "السلة" : "Panier",
      admin: isAr ? "الإدارة" : "Admin",
    },
    actions: {
      addToCart: isAr ? "أضف للسلة" : "Ajouter",
      added: isAr ? "تمت الإضافة" : "Ajouté",
      wishlist: isAr ? "المفضلة" : "Favoris",
      view: isAr ? "عرض" : "Voir",
      checkout: isAr ? "الدفع" : "Commander",
      continueShopping: isAr ? "متابعة التسوق" : "Continuer",
      remove: isAr ? "حذف" : "Supprimer",
      clear: isAr ? "تفريغ" : "Vider",
      payOnDelivery: isAr ? "الدفع عند الاستلام" : "Paiement à la livraison",
      openWhatsApp: isAr ? "افتح واتساب" : "Ouvrir WhatsApp",
      back: isAr ? "رجوع" : "Retour",
      save: isAr ? "حفظ" : "Enregistrer",
      create: isAr ? "إنشاء" : "Créer",
      logout: isAr ? "تسجيل الخروج" : "Déconnexion",
    },
    home: {
      heroTitle: isAr ? "كوكيز وحلويات منزلية" : "Cookies & douceurs artisanales",
      heroSubtitle: isAr
        ? "اطلب بسهولة — وسنرسل لك ملخّص الطلب على واتساب."
        : "Commandez en quelques clics — et recevez votre récapitulatif sur WhatsApp.",
      featured: isAr ? "مختاراتنا" : "Nos favoris",
    },
    products: {
      title: isAr ? "المنتجات" : "Produits",
      empty: isAr ? "لا توجد منتجات." : "Aucun produit.",
    },
    cart: {
      title: isAr ? "السلة" : "Panier",
      empty: isAr ? "سلتك فارغة." : "Votre panier est vide.",
      subtotal: isAr ? "المجموع" : "Sous-total",
      total: isAr ? "الإجمالي" : "Total",
    },
    checkout: {
      title: isAr ? "الدفع" : "Commande",
      customer: isAr ? "معلومات الزبون" : "Vos informations",
      name: isAr ? "الاسم" : "Nom",
      phone: isAr ? "الهاتف" : "Téléphone",
      address: isAr ? "العنوان" : "Adresse",
      notes: isAr ? "ملاحظات (اختياري)" : "Notes (optionnel)",
      placeOrder: isAr ? "تأكيد الطلب" : "Valider la commande",
    },
    success: {
      title: isAr ? "تم استلام الطلب" : "Commande reçue",
      subtitle: isAr
        ? "شكراً! افتح واتساب لإرسال الطلب إلى المتجر."
        : "Merci ! Ouvrez WhatsApp pour envoyer votre commande à la boutique.",
    },
    admin: {
      title: isAr ? "لوحة الإدارة" : "Admin",
      login: isAr ? "تسجيل الدخول" : "Connexion",
      email: isAr ? "البريد الإلكتروني" : "Email",
      password: isAr ? "كلمة المرور" : "Mot de passe",
      products: isAr ? "المنتجات" : "Produits",
      orders: isAr ? "الطلبات" : "Commandes",
      status: isAr ? "الحالة" : "Statut",
    },
  };
};

