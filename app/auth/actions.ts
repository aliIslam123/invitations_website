'use server'

import { authenticateCredentials, createSession } from '@/lib/auth'
import { prisma } from '@/lib/db'
import bcrypt from 'bcryptjs'
import { redirect } from 'next/navigation'

export async function loginWithCredentialsAction(prevState: any, formData: FormData) {
  const email = (formData.get('email') as string)?.trim().toLowerCase()
  const password = formData.get('password') as string
  const returnTo = (formData.get('returnTo') as string) || '/dashboard'

  if (!email || !password) {
    return { error: 'يرجى إدخال البريد الإلكتروني وكلمة المرور' }
  }

  const user = await authenticateCredentials(email, password)

  if (!user) {
    return { error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' }
  }

  const success = await createSession(user.id)
  if (!success) {
    return { error: 'تعذر إنشاء الجلسة، يرجى المحاولة مرة أخرى' }
  }

  const safeReturn = returnTo.startsWith('/') && !returnTo.startsWith('//') ? returnTo : '/dashboard'
  redirect(safeReturn)
}

export async function registerWithCredentialsAction(prevState: any, formData: FormData) {
  const name = (formData.get('name') as string)?.trim()
  const email = (formData.get('email') as string)?.trim().toLowerCase()
  const password = formData.get('password') as string
  const returnTo = (formData.get('returnTo') as string) || '/dashboard'

  if (!name || !email || !password) {
    return { error: 'يرجى ملء كافة الحقول المطلوبة' }
  }

  if (password.length < 6) {
    return { error: 'كلمة المرور يجب ألا تقل عن 6 خانات' }
  }

  const existing = await prisma.user.findUnique({
    where: { email },
  })

  if (existing) {
    return { error: 'هذا البريد الإلكتروني مسجل بالفعل، يرجى تسجيل الدخول' }
  }

  const passwordHash = await bcrypt.hash(password, 12)
  const newUser = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
      role: 'USER',
    },
  })

  await createSession(newUser.id)

  const safeReturn = returnTo.startsWith('/') && !returnTo.startsWith('//') ? returnTo : '/dashboard'
  redirect(safeReturn)
}

export async function demoCustomerLoginAction(returnTo = '/dashboard') {
  const demoEmail = 'guest@luxurywedding.com'
  let user = await prisma.user.findUnique({ where: { email: demoEmail } })

  if (!user) {
    const passwordHash = await bcrypt.hash('DemoPassword2026!', 10)
    user = await prisma.user.create({
      data: {
        email: demoEmail,
        name: 'عميل تجريبي • Demo Client',
        passwordHash,
        role: 'USER',
      },
    })
  }

  await createSession(user.id)
  const safeReturn = returnTo.startsWith('/') && !returnTo.startsWith('//') ? returnTo : '/dashboard'
  redirect(safeReturn)
}
