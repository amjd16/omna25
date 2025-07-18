# نظام إدارة الأمناء - وزارة العدل وحقوق الإنسان اليمنية

## هيكل المشروع

```
notary-management-system/
├── backend/                 # Laravel Backend API
│   ├── app/
│   ├── config/
│   ├── database/
│   ├── routes/
│   └── ...
├── frontend/               # React Frontend
│   ├── src/
│   ├── public/
│   └── ...
├── docs/                   # التوثيق
├── install/               # ملفات التثبيت
└── README.md
```

## متطلبات النظام

- PHP 8.1+
- MySQL 8.0+
- Node.js 20+
- Composer
- npm/pnpm

## إعداد البيئة التطويرية

### 1. الواجهة الخلفية (Laravel)

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve
```

### 2. الواجهة الأمامية (React)

```bash
cd frontend
pnpm install
pnpm run dev
```

## قاعدة البيانات

- **اسم قاعدة البيانات:** notary_management_db
- **المستخدم:** notary_user
- **كلمة المرور:** notary_password_2024

## الميزات الرئيسية

- إدارة ثلاثة أدوار: مدير النظام، رئيس قلم التوثيق، الأمين الشرعي
- واجهات متجاوبة مع قوائم سفلية للجوال
- نظام صلاحيات متقدم
- تقارير وإحصائيات شاملة
- أدوات مساعدة (حاسبة المواريث، الأسئلة الشائعة)
- نظام أرشفة رقمي
- أمان متقدم مع تشفير البيانات

## التطوير

تم تطوير النظام باستخدام:
- **الواجهة الخلفية:** Laravel 10+ مع PHP 8.1
- **الواجهة الأمامية:** React 18+ مع Vite
- **قاعدة البيانات:** MySQL 8.0
- **التصميم:** Tailwind CSS مع shadcn/ui
- **الخط:** تجوال (سيتم إضافته)

## الترخيص

هذا النظام مطور خصيصاً لوزارة العدل وحقوق الإنسان اليمنية.

