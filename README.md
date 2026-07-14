# بازار متخصصان صنعتی

پلتفرم اتصال متخصصان فنی به کارخانه‌ها برای پروژه‌های صنعتی.

## راه‌اندازی

```bash
npm install
npm run dev:full
```

این دستور هم‌زمان فرانت‌اند (Vite) روی پورت `5173` و بک‌اند (json-server) روی پورت `3001` را اجرا می‌کند.

## اسکریپت‌ها

| دستور | توضیح |
|-------|-------|
| `npm run dev` | اجرای فقط فرانت‌اند |
| `npm run server` | اجرای فقط json-server |
| `npm run dev:full` | اجرای هم‌زمان فرانت‌اند و بک‌اند |
| `npm run build` | بیلد پروژه |
| `npm run lint` | بررسی کیفیت کد |

## ساختار پروژه

- `db.json` — پایگاه داده json-server با داده‌های اولیه
- `src/services/api/apiClient.ts` — کلاینت API برای ارتباط با json-server
- `src/services/storage/storageService.ts` — لایه دسترسی به داده (REST API)
- `src/services/` — سرویس‌های تجاری (auth, specialist, factory, etc.)
- `src/hooks/` — هوک‌های React (useAuth, useSpecialist, useFactory)

## حساب‌های آزمایشی

### کارخانه
- `fabrique@sanat.com` / `123456`
- `petrochem@sanat.com` / `123456`
- `cement@sanat.com` / `123456`
- `foodind@sanat.com` / `123456`
- `partsaz@sanat.com` / `123456`

### متخصص
- `ahmadi@mail.com` / `123456`
- `moradi@mail.com` / `123456`
- `rezayi@mail.com` / `123456`
- `jalali@mail.com` / `123456`
- `karimi@mail.com` / `123456`
- `nouri@mail.com` / `123456`
