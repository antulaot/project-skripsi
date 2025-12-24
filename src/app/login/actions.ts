'use server'

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createSupabaseServerClient } from "@/infrastructure/supabase/server"

export async function login( formData: FormData ) {
    const supabase = await createSupabaseServerClient()

    const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    }

    const { error } = await supabase.auth.signInWithPassword(data)

    if (error) {
        redirect('/login?message=Gagal login: silahkan cek email dan password')
    }

    revalidatePath('/', 'layout')
    redirect('/inventory')
}
