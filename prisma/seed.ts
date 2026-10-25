import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // 1. Create default administrator
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@luxurywedding.com'
  const adminPassword = process.env.ADMIN_PASSWORD || 'AdminPassword2024!'
  const passwordHash = await bcrypt.hash(adminPassword, 12)

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      passwordHash,
    },
    create: {
      email: adminEmail,
      name: 'System Administrator',
      passwordHash,
      role: 'ADMIN',
    },
  })
  console.log(`✅ Administrator ready: ${admin.email}`)

  // 2. Create sample invitation: "ahmed-and-sara" (أحمد وسارة)
  const weddingDate = new Date('2026-12-18T19:30:00+03:00')

  const invitation = await prisma.weddingInvitation.upsert({
    where: { slug: 'ahmed-and-sara' },
    update: {},
    create: {
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
      seoImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
      whatsappMessage: 'يسعدنا ويشرفنا دعوتكم لحضور حفل زفافنا ومشاركتنا فرحتنا الكبرى ❤️\n\nتفاصيل الحفل والموقع من خلال الرابط:\n[INVITATION_URL]',
      musicEnabled: true,
      musicTitle: 'Canon in D - Romantic Acoustic',
      musicUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=romantic-wedding-piano-112191.mp3',
      musicAutoplay: false,
      musicPosition: 'bottom-right',
      rsvpEnabled: true,
      rsvpDeadline: new Date('2026-12-10T23:59:59+03:00'),
      rsvpMaxGuests: 4,
      rsvpAllowPlusOne: true,
      rsvpRequireContact: false,
      rsvpConfirmMsg: 'تم تأكيد حضوركم بكل سرور، ننتظركم بفارغ الصبر لنحتفل سوياً!',
      rsvpDeclineMsg: 'نشكركم على إشعارنا وسنفتقد وجودكم معنا، دعواتكم لنا بالتوفيق.',
      
      // Couple info
      couple: {
        create: {
          brideFirstName: 'سارة',
          brideLastName: 'العتيبي',
          brideFullName: 'سارة العتيبي',
          brideFather: 'سليمان بن عبد الله العتيبي',
          brideMother: 'هند بنت محمد',
          brideFamily: 'آل عتيبي',
          brideBio: 'مهندسة برمجيات وشغوفة بالفنون والتصميم',
          bridePhoto: 'https://images.unsplash.com/photo-1594552072238-b8a33785b261?auto=format&fit=crop&w=800&q=80',

          groomFirstName: 'أحمد',
          groomLastName: 'الغامدي',
          groomFullName: 'أحمد الغامدي',
          groomFather: 'عبد الرحمن بن خالد الغامدي',
          groomMother: 'نورة بنت صالح',
          groomFamily: 'آل غامدي',
          groomBio: 'رائد أعمال ومهتم بالتقنية والسفر',
          groomPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',

          couplePhoto: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80',
          monogram: 'A & S',
          weddingDate,
          weddingTime: '08:00 مساءً',
          timezone: 'Asia/Riyadh',

          heroLayout: 'cinematic',
          heroImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1920&q=80',
          heroImageMobile: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',

          messageHeading: 'بسم الله الرحمن الرحيم',
          messageBody: 'بكل مشاعر الود والامتنان، نتشرف بدعوتكم لمشاركتنا فرحتنا الغامرة في ليلة من أجمل ليالي العمر، لتكتمل سعادتنا بحضوركم الكريم ودعواتكم الصادقة لبداية رحلتنا معاً.',
          invitationText: 'دعوة لحضور حفل الزفاف المبارك',
          invitationSubtext: 'وبحضوركم يكتمل الفرح وتتوج أجمل اللحظات',

          familyNamesEnabled: true,
          familyNamesContent: 'يتشرف عبد الرحمن بن خالد الغامدي وسليمان بن عبد الله العتيبي بدعوتكم لحضور حفل زفاف نجليهما',

          dressCodeEnabled: true,
          dressCodeContent: 'الزي الرسمي الفاخر / عباءة السهرة الأنيقة',

          giftInfoEnabled: true,
          giftInfoContent: 'حضوركم هو أثمن هدية وأجمل تعبير عن محبتكم وتقديركم لنا.',

          contactEnabled: true,
          contactPhone: '+966500000000',
          contactWhatsapp: '+966500000000',

          wishesEnabled: true,
          postEventEnabled: false,
          postEventMessage: 'شكراً لكل من شرفنا وشاركنا فرحتنا، دمتم في حفظ الله ورعايته.',
        },
      },

      // Events
      events: {
        create: [
          {
            title: 'عقد القران والترحيب (Katb Ketab & Reception)',
            date: weddingDate,
            startTime: '07:30 م',
            endTime: '08:30 م',
            venueName: 'قاعة اللؤلؤة الكبرى - فندق الريتز كارلتون',
            address: 'طريق مكة المكرمة، الرياض، المملكة العربية السعودية',
            mapsUrl: 'https://maps.google.com/?q=The+Ritz-Carlton+Riyadh',
            latitude: 24.6658,
            longitude: 46.6264,
            venueImage: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1000&q=80',
            description: 'استقبال الضيوف الكرام وبداية مراسم عقد القران وتقديم الضيافة الفاخرة.',
            dressCode: 'الزي السعودي الرسمي / فساتين السهرة الراقية',
            displayOrder: 1,
            isVisible: true,
          },
          {
            title: 'حفل الزفاف والعشاء الملكي (Wedding Dinner & Celebration)',
            date: weddingDate,
            startTime: '09:00 م',
            endTime: '01:00 ص',
            venueName: 'القاعة الملكية للاحتفالات',
            address: 'طريق الملك فهد، الرياض، المملكة العربية السعودية',
            mapsUrl: 'https://maps.google.com/?q=Riyadh+Grand+Celebration+Hall',
            latitude: 24.7136,
            longitude: 46.6753,
            venueImage: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1000&q=80',
            description: 'زفة العروسين، تقديم مأدبة العشاء الفاخرة، والأهازيج الاحتفالية المبهجة.',
            displayOrder: 2,
            isVisible: true,
          },
        ],
      },

      // Gallery Images
      gallery: {
        create: [
          {
            url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
            caption: 'بداية الحكاية ونبض المحبة',
            altText: 'العروسان في جلسة التصوير الأولى',
            displayOrder: 1,
            isVisible: true,
          },
          {
            url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80',
            caption: 'تفاصيل الخواتم والعهد الأبدي',
            altText: 'خواتم الزفاف الذهبية',
            displayOrder: 2,
            isVisible: true,
          },
          {
            url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80',
            caption: 'لحظات من الدفء والامتنان',
            altText: 'صورة رومانسية للعروسين',
            displayOrder: 3,
            isVisible: true,
          },
          {
            url: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=1200&q=80',
            caption: 'الزهور والترتيبات الأنيقة',
            altText: 'باقة زهور العروس الفاخرة',
            displayOrder: 4,
            isVisible: true,
          },
          {
            url: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1200&q=80',
            caption: 'معاً نحو غدٍ مفعم بالأمل والجمال',
            altText: 'لقطة غروب الشمس الساحرة',
            displayOrder: 5,
            isVisible: true,
          },
          {
            url: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1200&q=80',
            caption: 'فرحة الأحباب وابتسامة العمر',
            altText: 'ابتسامات الاحتفال',
            displayOrder: 6,
            isVisible: true,
          },
        ],
      },

      // Timeline items
      timeline: {
        create: [
          {
            time: '07:30 م',
            title: 'توافد الضيوف الكرام والاستقبال',
            description: 'الترحيب بالضيوف وتقديم القهوة السعودية الفاخرة والبخور والطيب',
            icon: 'coffee',
            displayOrder: 1,
            isVisible: true,
          },
          {
            time: '08:15 م',
            title: 'عقد القران ومباركة الأهل',
            description: 'توثيق العقد ومباركة الأهل والأصدقاء في أجواء روحانية مفعمة بالمودة',
            icon: 'heart',
            displayOrder: 2,
            isVisible: true,
          },
          {
            time: '09:30 م',
            title: 'زفة العروسين الملكية',
            description: 'دخول العروسين مع المؤثرات الضوئية والأهازيج الطربية',
            icon: 'sparkles',
            displayOrder: 3,
            isVisible: true,
          },
          {
            time: '10:30 م',
            title: 'مأدبة العشاء الفاخرة',
            description: 'بوفيه عشاء ملكي مع تشكيلة من أشهى المأكولات العالمية والشرقية والحلويات',
            icon: 'utensils',
            displayOrder: 4,
            isVisible: true,
          },
          {
            time: '11:45 م',
            title: 'تقطيع قالب الحلوى والاحتفال',
            description: 'مراسم تقطيع كعكة الزفاف والتقاط الصور التذكارية الختامية',
            icon: 'cake',
            displayOrder: 5,
            isVisible: true,
          },
        ],
      },

      // Section order & visibility
      sections: {
        create: [
          { sectionKey: 'hero', displayOrder: 1, isVisible: true },
          { sectionKey: 'message', displayOrder: 2, isVisible: true },
          { sectionKey: 'countdown', displayOrder: 3, isVisible: true },
          { sectionKey: 'events', displayOrder: 4, isVisible: true },
          { sectionKey: 'timeline', displayOrder: 5, isVisible: true },
          { sectionKey: 'gallery', displayOrder: 6, isVisible: true },
          { sectionKey: 'rsvp', displayOrder: 7, isVisible: true },
          { sectionKey: 'dresscode', displayOrder: 8, isVisible: true },
          { sectionKey: 'wishes', displayOrder: 9, isVisible: true },
        ],
      },

      // Sample RSVP responses for testing admin dashboard
      rsvpResponses: {
        create: [
          {
            guestName: 'محمد بن عبد العزيز الفهد',
            attendance: 'yes',
            guestCount: 2,
            phone: '+966551234567',
            email: 'mohammed@example.com',
            message: 'ألف مبروك لأجمل عروسين، نسأل الله لكما حياة سعيدة ملؤها الهناء!',
          },
          {
            guestName: 'سعود بن نايف الشمري',
            attendance: 'yes',
            guestCount: 3,
            phone: '+966559876543',
            email: 'saud@example.com',
            message: 'بارك الله لكما وبارك عليكما وجمع بينكما في خير.',
          },
          {
            guestName: 'د. فيصل بن خالد السديري',
            attendance: 'no',
            guestCount: 0,
            phone: '+966554443322',
            message: 'نعتذر عن عدم الحضور لظروف السفر خارج المملكة، مع خالص دعواتنا بالبركة والتوفيق.',
          },
        ],
      },
    },
  })

  // 3. Create second sample invitation: "noah-and-emma" (Minimal English Invitation)
  const weddingDate2 = new Date('2027-04-25T17:00:00+03:00')
  await prisma.weddingInvitation.upsert({
    where: { slug: 'noah-and-emma' },
    update: {},
    create: {
      userId: admin.id,
      slug: 'noah-and-emma',
      status: 'PUBLISHED',
      title: 'Noah & Emma | Wedding Celebration',
      language: 'en',
      direction: 'ltr',
      coverEnabled: true,
      coverType: 'minimal',
      coverImage: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1920&q=80',
      coverOverlayColor: '#FAFAFA',
      coverOverlayOpacity: 0.3,
      coverMonogram: 'N & E',
      themeId: 'minimal-ivory',
      animationPreset: 'subtle',
      seoTitle: 'Noah & Emma Wedding Invitation',
      seoDescription: 'Join us to celebrate the wedding of Noah and Emma.',
      musicEnabled: false,
      rsvpEnabled: true,
      rsvpDeadline: new Date('2027-04-01T23:59:59+03:00'),
      rsvpMaxGuests: 2,
      rsvpAllowPlusOne: true,
      couple: {
        create: {
          brideFirstName: 'Emma',
          brideLastName: 'Laurent',
          brideFullName: 'Emma Laurent',
          groomFirstName: 'Noah',
          groomLastName: 'Sinclair',
          groomFullName: 'Noah Sinclair',
          weddingDate: weddingDate2,
          weddingTime: '05:00 PM',
          timezone: 'Europe/Paris',
          heroLayout: 'minimal',
          heroImage: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1920&q=80',
          messageHeading: 'Together With Their Families',
          messageBody: 'We invite you to share in our joy and celebrate our marriage as we begin our new life together.',
          invitationText: 'Wedding Ceremony & Reception',
          dressCodeEnabled: true,
          dressCodeContent: 'Black Tie Optional',
        },
      },
      events: {
        create: [
          {
            title: 'Exchange of Vows',
            date: weddingDate2,
            startTime: '05:00 PM',
            endTime: '06:00 PM',
            venueName: 'The Glasshouse Pavilion',
            address: '14 Vineyard Valley Way, Provence',
            mapsUrl: 'https://maps.google.com',
            displayOrder: 1,
            isVisible: true,
          },
        ],
      },
      sections: {
        create: [
          { sectionKey: 'hero', displayOrder: 1, isVisible: true },
          { sectionKey: 'message', displayOrder: 2, isVisible: true },
          { sectionKey: 'countdown', displayOrder: 3, isVisible: true },
          { sectionKey: 'events', displayOrder: 4, isVisible: true },
          { sectionKey: 'rsvp', displayOrder: 5, isVisible: true },
        ],
      },
    },
  })

  console.log(`✅ Sample invitations seeded successfully!`)
  console.log(`   - http://localhost:3000/wedding/ahmed-and-sara`)
  console.log(`   - http://localhost:3000/wedding/noah-and-emma`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
