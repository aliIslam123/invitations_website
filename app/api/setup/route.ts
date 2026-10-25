import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function GET() {
  try {
    // 1. Check database connectivity
    const userCount = await prisma.user.count()

    let seeded = false
    let adminEmail = process.env.ADMIN_EMAIL || 'admin@luxurywedding.com'

    // 2. If no users exist, automatically seed admin & sample invitation
    if (userCount === 0) {
      const adminPassword = process.env.ADMIN_PASSWORD || 'AdminPassword2024!'
      const passwordHash = await bcrypt.hash(adminPassword, 12)

      const admin = await prisma.user.create({
        data: {
          email: adminEmail,
          name: 'System Administrator',
          passwordHash,
          role: 'ADMIN',
        },
      })

      const weddingDate = new Date('2026-12-18T19:30:00+03:00')
      await prisma.weddingInvitation.create({
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
                venueName: 'قاعة اللؤلؤة الكبرى',
                address: 'الرياض، المملكة العربية السعودية',
                mapsUrl: 'https://maps.google.com',
                displayOrder: 1,
                isVisible: true,
              },
            ],
          },
        },
      })

      seeded = true
    }

    return NextResponse.json({
      status: 'ok',
      message: seeded ? 'Database was empty. Admin and sample invitation seeded successfully!' : 'Database connected and already seeded.',
      usersCount: seeded ? 1 : userCount,
      adminLoginUrl: '/auth/login',
      adminDefaultEmail: adminEmail,
      sampleInvitationUrl: '/wedding/ahmed-and-sara',
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        status: 'error',
        message: 'Database connection failed. Please ensure DATABASE_URL is set in Vercel environment variables.',
        details: error?.message || 'Unknown database error',
      },
      { status: 500 }
    )
  }
}
