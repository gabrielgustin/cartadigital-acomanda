'use client'

import { useActionState } from 'react'
import { login } from '@/app/backoffice/actions'
import { ErrorNote, Field, btnPrimary, inputClass } from '@/components/backoffice/ui'

export function LoginForm({ configured }: { configured: boolean }) {
  const [error, formAction, pending] = useActionState(login, null)

  return (
    <form action={formAction} className="space-y-4 rounded-lg bg-white p-6 shadow-sm">
      {!configured && <ErrorNote message="Falta definir BACKOFFICE_PASSWORD en el archivo .env.local para poder ingresar." />}
      <Field label="Usuario">
        <input data-autofocus name="username" type="text" required autoComplete="username" autoCapitalize="none" className={inputClass} />
      </Field>
      <Field label="Contraseña">
        <input name="password" type="password" required autoComplete="current-password" className={inputClass} />
      </Field>
      <ErrorNote message={error} />
      <button type="submit" disabled={pending || !configured} className={`${btnPrimary} w-full`}>
        {pending ? 'Ingresando…' : 'Ingresar'}
      </button>
    </form>
  )
}
