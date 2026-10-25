'use server'

import { authenticateCredentials, createSession } from '@/lib/auth'
import { redirect } from 'next/navigation'

export async function loginAction(prevState: any, formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

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

  redirect('/dashboard')
}
