import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import bcrypt from 'bcryptjs'

const INIT_SQL = `
CREATE TABLE IF NOT EXISTS "users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "email" TEXT NOT NULL UNIQUE,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "passwordHash" TEXT,
    "role" TEXT NOT NULL DEFAULT 'ADMIN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "wedding_invitations" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL UNIQUE,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "userId" TEXT NOT NULL REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    "title" TEXT NOT NULL DEFAULT '',
    "language" TEXT NOT NULL DEFAULT 'ar',
    "direction" TEXT NOT NULL DEFAULT 'rtl',
    "coverEnabled" BOOLEAN NOT NULL DEFAULT true,
    "coverType" TEXT NOT NULL DEFAULT 'elegant',
    "coverImage" TEXT,
    "coverOverlayColor" TEXT NOT NULL DEFAULT '#332A25',
    "coverOverlayOpacity" DOUBLE PRECISION NOT NULL DEFAULT 0.5,
    "coverMonogram" TEXT,
    "themeId" TEXT NOT NULL DEFAULT 'royal-champagne',
    "themeCustom" TEXT,
    "animationPreset" TEXT NOT NULL DEFAULT 'elegant',
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "seoImage" TEXT,
    "whatsappMessage" TEXT,
    "musicEnabled" BOOLEAN NOT NULL DEFAULT false,
    "musicUrl" TEXT,
    "musicTitle" TEXT,
    "musicAutoplay" BOOLEAN NOT NULL DEFAULT false,
    "musicPosition" TEXT NOT NULL DEFAULT 'bottom-right',
    "rsvpEnabled" BOOLEAN NOT NULL DEFAULT false,
    "rsvpDeadline" TIMESTAMP(3),
    "rsvpMaxGuests" INTEGER,
    "rsvpAllowPlusOne" BOOLEAN NOT NULL DEFAULT true,
    "rsvpRequireContact" BOOLEAN NOT NULL DEFAULT false,
    "rsvpConfirmMsg" TEXT,
    "rsvpDeclineMsg" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "couple_information" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "invitationId" TEXT NOT NULL UNIQUE REFERENCES "wedding_invitations"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    "brideFirstName" TEXT NOT NULL DEFAULT '',
    "brideLastName" TEXT NOT NULL DEFAULT '',
    "brideFullName" TEXT NOT NULL DEFAULT '',
    "brideFather" TEXT,
    "brideMother" TEXT,
    "brideFamily" TEXT,
    "brideBio" TEXT,
    "bridePhoto" TEXT,
    "groomFirstName" TEXT NOT NULL DEFAULT '',
    "groomLastName" TEXT NOT NULL DEFAULT '',
    "groomFullName" TEXT NOT NULL DEFAULT '',
    "groomFather" TEXT,
    "groomMother" TEXT,
    "groomFamily" TEXT,
    "groomBio" TEXT,
    "groomPhoto" TEXT,
    "couplePhoto" TEXT,
    "monogram" TEXT,
    "weddingDate" TIMESTAMP(3),
    "weddingTime" TEXT,
    "timezone" TEXT NOT NULL DEFAULT 'Asia/Riyadh',
    "messageHeading" TEXT,
    "messageBody" TEXT,
    "messageFontFamily" TEXT,
    "heroLayout" TEXT NOT NULL DEFAULT 'cinematic',
    "heroImage" TEXT,
    "heroImageMobile" TEXT,
    "heroVideo" TEXT,
    "invitationText" TEXT,
    "invitationSubtext" TEXT,
    "familyNamesEnabled" BOOLEAN NOT NULL DEFAULT false,
    "familyNamesContent" TEXT,
    "dressCodeEnabled" BOOLEAN NOT NULL DEFAULT false,
    "dressCodeContent" TEXT,
    "giftInfoEnabled" BOOLEAN NOT NULL DEFAULT false,
    "giftInfoContent" TEXT,
    "contactEnabled" BOOLEAN NOT NULL DEFAULT false,
    "contactPhone" TEXT,
    "contactWhatsapp" TEXT,
    "contactEmail" TEXT,
    "socialEnabled" BOOLEAN NOT NULL DEFAULT false,
    "socialLinks" TEXT,
    "customSections" TEXT,
    "wishesEnabled" BOOLEAN NOT NULL DEFAULT false,
    "postEventEnabled" BOOLEAN NOT NULL DEFAULT false,
    "postEventMessage" TEXT,
    "postEventImage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "wedding_events" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "invitationId" TEXT NOT NULL REFERENCES "wedding_invitations"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    "title" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "startTime" TEXT,
    "endTime" TEXT,
    "timezone" TEXT NOT NULL DEFAULT 'Asia/Riyadh',
    "venueName" TEXT,
    "address" TEXT,
    "mapsUrl" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "venueImage" TEXT,
    "description" TEXT,
    "dressCode" TEXT,
    "notes" TEXT,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "gallery_images" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "invitationId" TEXT NOT NULL REFERENCES "wedding_invitations"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    "url" TEXT NOT NULL,
    "thumbnailUrl" TEXT,
    "caption" TEXT,
    "altText" TEXT,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "width" INTEGER,
    "height" INTEGER,
    "fileSize" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "invitation_sections" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "invitationId" TEXT NOT NULL REFERENCES "wedding_invitations"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    "sectionKey" TEXT NOT NULL,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "layout" TEXT,
    "settings" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "timeline_items" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "invitationId" TEXT NOT NULL REFERENCES "wedding_invitations"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    "time" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "rsvp_responses" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "invitationId" TEXT NOT NULL REFERENCES "wedding_invitations"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    "guestName" TEXT NOT NULL,
    "attendance" TEXT NOT NULL,
    "guestCount" INTEGER NOT NULL DEFAULT 1,
    "phone" TEXT,
    "email" TEXT,
    "message" TEXT,
    "dietary" TEXT,
    "ipAddress" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "media_assets" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "invitationId" TEXT REFERENCES "wedding_invitations"("id") ON DELETE SET NULL ON UPDATE CASCADE,
    "filename" TEXT NOT NULL,
    "originalName" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "storageKey" TEXT NOT NULL UNIQUE,
    "mediaType" TEXT NOT NULL,
    "width" INTEGER,
    "height" INTEGER,
    "duration" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "accounts" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "sessions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionToken" TEXT NOT NULL UNIQUE,
    "userId" TEXT NOT NULL REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    "expires" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
`

export async function GET() {
  try {
    // 1. Ensure all database tables exist
    const statements = INIT_SQL.split(';')
      .map((s) => s.trim())
      .filter((s) => s.length > 0)

    for (const sql of statements) {
      try {
        await prisma.$executeRawUnsafe(sql)
      } catch (sqlErr: any) {
        // Skip minor warnings if already created
        console.warn('SQL execution notice:', sqlErr?.message)
      }
    }

    // 2. Check if admin user exists, create if missing
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@luxurywedding.com'
    const adminPassword = process.env.ADMIN_PASSWORD || 'AdminPassword2024!'
    const passwordHash = await bcrypt.hash(adminPassword, 12)

    let admin = await prisma.user.findUnique({
      where: { email: adminEmail },
    })

    if (!admin) {
      admin = await prisma.user.create({
        data: {
          email: adminEmail,
          name: 'Wedding Admin',
          passwordHash,
          role: 'ADMIN',
        },
      })
    }

    // 3. Check if sample invitation "ahmed-and-sara" exists, create if missing
    let invitation = await prisma.weddingInvitation.findUnique({
      where: { slug: 'ahmed-and-sara' },
    })

    if (!invitation) {
      const weddingDate = new Date('2026-12-18T19:30:00+03:00')
      invitation = await prisma.weddingInvitation.create({
        data: {
          userId: admin.id,
          slug: 'ahmed-and-sara',
          status: 'PUBLISHED',
          title: 'دعوة زفاف أحمد وسارة | Ahmed & Sara Wedding',
          language: 'both',
          direction: 'rtl',
          coverEnabled: true,
          coverType: 'cinematic',
          coverImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1920&q=80',
          coverOverlayColor: '#1A1410',
          coverOverlayOpacity: 0.55,
          coverMonogram: 'A & S',
          themeId: 'royal-champagne',
          animationPreset: 'cinematic',
          seoTitle: 'دعوة زفاف أحمد وسارة - فرحة العمر',
          seoDescription: 'نتشرف بدعوتكم لحضور حفل زفاف أحمد وسارة ومشاركتنا أجمل اللحظات',
          whatsappMessage: 'يسعدنا ويشرفنا دعوتكم لحضور حفل زفافنا ومشاركتنا فرحتنا الكبرى ❤️\n[INVITATION_URL]',
          musicEnabled: true,
          musicTitle: 'Canon in D - Romantic Acoustic',
          musicUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=romantic-wedding-piano-112191.mp3',
          rsvpEnabled: true,
          rsvpDeadline: new Date('2026-12-10T23:59:59+03:00'),
          rsvpMaxGuests: 4,
          couple: {
            create: {
              brideFirstName: 'سارة',
              brideLastName: 'العتيبي',
              brideFullName: 'سارة العتيبي',
              groomFirstName: 'أحمد',
              groomLastName: 'الغامدي',
              groomFullName: 'أحمد الغامدي',
              weddingDate,
              weddingTime: '08:00 مساءً',
              timezone: 'Asia/Riyadh',
              heroLayout: 'cinematic',
              heroImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1920&q=80',
              messageHeading: 'بسم الله الرحمن الرحيم',
              messageBody: 'بكل مشاعر الود والامتنان، نتشرف بدعوتكم لمشاركتنا فرحتنا الغامرة في ليلة من أجمل ليالي العمر.',
              invitationText: 'دعوة لحضور حفل الزفاف المبارك',
              invitationSubtext: 'وبحضوركم يكتمل الفرح وتتوج أجمل اللحظات',
            },
          },
          events: {
            create: [
              {
                title: 'حفل الزفاف والاستقبال',
                date: weddingDate,
                startTime: '08:00 م',
                venueName: 'قاعة اللؤلؤة الكبرى - فندق الريتز كارلتون',
                address: 'الرياض، المملكة العربية السعودية',
                mapsUrl: 'https://maps.google.com',
                displayOrder: 1,
                isVisible: true,
              },
            ],
          },
        },
      })
    }

    // 4. Create invitation for Mohamed & Asmaa (محمد وأسماء)
    const weddingDateMohamed = new Date('2026-11-16T19:00:00+02:00')
    let invitationMohamed = await prisma.weddingInvitation.findUnique({
      where: { slug: 'mohamed-and-asmaa' },
    })

    if (!invitationMohamed) {
      invitationMohamed = await prisma.weddingInvitation.create({
        data: {
          userId: admin.id,
          slug: 'mohamed-and-asmaa',
          status: 'PUBLISHED',
          title: 'دعوة زفاف محمد وأسماء | Mohamed & Asmaa Wedding',
          language: 'both',
          direction: 'rtl',
          coverEnabled: true,
          coverType: 'cinematic',
          coverImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1920&q=80',
          coverOverlayColor: '#1A1410',
          coverOverlayOpacity: 0.55,
          coverMonogram: 'M & A',
          themeId: 'royal-champagne',
          animationPreset: 'cinematic',
          seoTitle: 'دعوة زفاف محمد وأسماء - فرحة العمر',
          seoDescription: 'نتشرف بدعوتكم لحضور حفل زفاف محمد وأسماء يوم الاثنين 16/11/2026 في قاعة ليلتي بنادي اتحاد الشرطة',
          whatsappMessage: 'يسعدنا ويشرفنا دعوتكم لحضور حفل زفافنا ومشاركتنا فرحتنا الكبرى ❤️\n\nيوم الاثنين 16/11/2026 - الساعة 7:00 مساءً\nنادي اتحاد الشرطة صلاح سالم خلف مسجد الشرطة (قاعة ليلتي)\n\nتفاصيل الحفل والموقع من خلال الرابط:\n[INVITATION_URL]',
          musicEnabled: true,
          musicTitle: 'Canon in D - Romantic Acoustic',
          musicUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=romantic-wedding-piano-112191.mp3',
          rsvpEnabled: true,
          rsvpDeadline: new Date('2026-11-14T23:59:59+02:00'),
          rsvpMaxGuests: 4,
          rsvpAllowPlusOne: true,
          rsvpConfirmMsg: 'تم تأكيد حضوركم بكل سرور، ننتظركم لنحتفل سوياً!',
          rsvpDeclineMsg: 'نشكركم على إشعارنا وسنفتقد وجودكم معنا، دعواتكم لنا بالتوفيق.',
          couple: {
            create: {
              brideFirstName: 'أسماء',
              brideLastName: '',
              brideFullName: 'أسماء',
              groomFirstName: 'محمد',
              groomLastName: '',
              groomFullName: 'محمد',
              monogram: 'M & A',
              weddingDate: weddingDateMohamed,
              weddingTime: '07:00 مساءً',
              timezone: 'Africa/Cairo',
              heroLayout: 'cinematic',
              heroImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1920&q=80',
              messageHeading: 'بسم الله الرحمن الرحيم',
              messageBody: 'بكل مشاعر الود والامتنان، نتشرف بدعوتكم لمشاركتنا فرحتنا الغامرة في ليلة من أجمل ليالي العمر، لتكتمل سعادتنا بحضوركم الكريم ودعواتكم الصادقة لبداية رحلتنا معاً.',
              invitationText: 'دعوة لحضور حفل الزفاف المبارك',
              invitationSubtext: 'وبحضوركم يكتمل الفرح وتتوج أجمل اللحظات',
              dressCodeEnabled: true,
              dressCodeContent: 'الزي الرسمي الفاخر / ملابس السهرة الأنيقة',
              giftInfoEnabled: true,
              giftInfoContent: 'حضوركم ومشاركتكم فرحتنا هي أجمل وأثمن هدية لنا.',
              wishesEnabled: true,
            },
          },
          events: {
            create: [
              {
                title: 'حفل الزفاف والاستقبال (Wedding Ceremony & Reception)',
                date: weddingDateMohamed,
                startTime: '07:00 م',
                endTime: '11:30 م',
                venueName: 'قاعة ليلتي - نادي اتحاد الشرطة',
                address: 'شارع صلاح سالم، خلف مسجد الشرطة، القاهرة',
                mapsUrl: 'https://maps.app.goo.gl/mmPPrcYeGhn95doW9',
                description: 'استقبال الضيوف الكرام وبداية مراسم حفل الزفاف وتقديم الضيافة والاحتفال بحضوركم الكريم.',
                dressCode: 'الزي الرسمي الفاخر / فساتين السهرة',
                displayOrder: 1,
                isVisible: true,
              },
            ],
          },
          timeline: {
            create: [
              {
                time: '07:00 م',
                title: 'استقبال الضيوف الكرام',
                description: 'الترحيب بالضيوف وتقديم الضيافة الافتتاحية',
                icon: 'heart',
                displayOrder: 1,
                isVisible: true,
              },
              {
                time: '08:00 م',
                title: 'زفة العروسين وبداية الحفل',
                description: 'دخول العروسين وبداية الفقرات الاحتفالية',
                icon: 'sparkles',
                displayOrder: 2,
                isVisible: true,
              },
              {
                time: '09:30 م',
                title: 'بوفيه العشاء الفاخر',
                description: 'تقديم العشاء الملكي لضيوفنا الكرام',
                icon: 'glass',
                displayOrder: 3,
                isVisible: true,
              },
              {
                time: '10:30 م',
                title: 'تقطيع التورتة والصور التذكارية',
                description: 'مشاركة أجمل اللحظات والتقاط الصور مع العروسين',
                icon: 'camera',
                displayOrder: 4,
                isVisible: false,
              },
            ],
          },
          sections: {
            create: [
              { sectionKey: 'hero', displayOrder: 1, isVisible: true },
              { sectionKey: 'message', displayOrder: 2, isVisible: true },
              { sectionKey: 'countdown', displayOrder: 3, isVisible: true },
              { sectionKey: 'events', displayOrder: 4, isVisible: true },
              { sectionKey: 'timeline', displayOrder: 5, isVisible: false },
              { sectionKey: 'rsvp', displayOrder: 6, isVisible: true },
            ],
          },
        },
      })
    }

    // Ensure timeline is disabled and hidden for Mohamed & Asmaa per user request
    const existingMohamedInv = await prisma.weddingInvitation.findUnique({
      where: { slug: 'mohamed-and-asmaa' },
    })
    if (existingMohamedInv) {
      await prisma.invitationSection.updateMany({
        where: { invitationId: existingMohamedInv.id, sectionKey: 'timeline' },
        data: { isVisible: false },
      })
      await prisma.timelineItem.updateMany({
        where: { invitationId: existingMohamedInv.id },
        data: { isVisible: false },
      })
    }

    return new Response(
      `<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>تمت تهيئة قاعدة البيانات بنجاح</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; background: #FAF7F0; color: #332A25; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 20px; box-sizing: border-box; }
    .card { background: #fff; border: 1px solid #EAE1D3; border-radius: 12px; padding: 36px; max-width: 500px; width: 100%; text-align: center; box-shadow: 0 10px 25px rgba(0,0,0,0.05); }
    .icon { width: 64px; height: 64px; border-radius: 50%; background: #FAF7F0; border: 2px solid #C8A96B; color: #C8A96B; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; font-size: 28px; }
    h1 { margin: 0 0 10px; font-size: 22px; color: #332A25; }
    p { font-size: 14px; color: #73675C; line-height: 1.6; margin: 0 0 24px; }
    .btn { display: inline-block; background: #C8A96B; color: #fff; text-decoration: none; padding: 12px 28px; border-radius: 8px; font-weight: 600; font-size: 14px; margin: 6px; transition: background 0.2s; }
    .btn:hover { background: #A68648; }
    .btn-secondary { background: #FAF7F0; color: #332A25; border: 1px solid #EAE1D3; }
    .btn-secondary:hover { background: #EAE1D3; }
    .creds { background: #FAF7F0; border: 1px solid #EAE1D3; border-radius: 8px; padding: 12px; text-align: right; font-size: 13px; margin-bottom: 20px; }
    .creds div { margin-bottom: 4px; }
  </style>
</head>
<body>
  <div class="card">
    <div class="icon">✨</div>
    <h1>تمت تهيئة قاعدة البيانات بنجاح!</h1>
    <p>تم إنشاء جميع الجداول، وتجهيز حساب الإدارة، وزرع دعوة الزفاف النموذجية بنجاح تام.</p>
    
    <div class="creds">
      <div><strong>البريد:</strong> ${adminEmail}</div>
      <div><strong>كلمة المرور:</strong> ${adminPassword}</div>
    </div>

    <div>
      <a href="/wedding/mohamed-and-asmaa" class="btn">عرض دعوة محمد وأسماء 💍</a>
      <a href="/wedding/ahmed-and-sara" class="btn btn-secondary">دعوة أحمد وسارة</a>
      <a href="/dashboard" class="btn btn-secondary">لوحة التحكم ⚙️</a>
    </div>
  </div>
</body>
</html>`,
      {
        status: 200,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
        },
      }
    )
  } catch (error: any) {
    return NextResponse.json(
      {
        status: 'error',
        message: 'حدث خطأ أثناء محاولة الاتصال بقاعدة البيانات. تأكد من ضبط متغير DATABASE_URL.',
        details: error?.message || 'Unknown database error',
      },
      { status: 500 }
    )
  }
}
