'use server'

import { supabaseAdmin } from "@/infrastructure/supabase/admin";
import { ConsoleLogger } from "@/infrastructure/logging/ConsoleLogger";
import { createSupabaseServerClient } from "@/infrastructure/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createUserAction(formData: FormData){
    const logger = new ConsoleLogger();
    const supabase = await createSupabaseServerClient();
    const { data: { user} } = await supabase.auth.getUser();

    if (!user) {
        logger.warn('Percobaan Akses Create User Tanpa Login');
        redirect('/login');
    }
    
    const { data: adminProfile } = await supabase
        .from('profiles')
        .select('role, organization_id')
        .eq('id', user.id)
        .single();

    if (adminProfile?.role !== 'super_admin') {
        logger.error("Security Alert : User non-admin mencoba membuat user baru", {
            userId: user.id,
            role: adminProfile?.role
        });
        throw new Error('Hanya Super Admin Yang Dapat Membuat User Baru');
    }

    const email= formData.get('email') as string;
    const password = formData.get('password') as string;
    const fullName= formData.get('fullName') as string;
    const role = formData.get('role') as string;
    const targetOrganizationId = adminProfile.organization_id;

    const { data : newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email: email,
        password: password,
        email_confirm: true,
        user_metadata: {
            full_name: fullName
        }
    })

    if (createError) {
        logger.error("Gagal Membuat User di Auth Supabase", {
            error: createError.message
        });
        throw new Error(createError.message);
    }

    if (newUser.user) {
        const { error: updateError } = await supabaseAdmin
            .from('profiles')
            .update({
                role: role,
                organization_id: targetOrganizationId,
                full_name: fullName
            })
            .eq('id', newUser.user.id);

        if (updateError) {
            logger.error("CRITICAL ERROR: User Berhasil Dibuat Namun Gagal Update Profil", {
                userId: newUser.user.id,
                error: updateError.message
            });

            } else {
                logger.info("User Berhasil Dibuat", {
                    userId: newUser.user.id,
                    createdBy: user.id
                });
        }
        revalidatePath('/admin/users');
        redirect('/admin/users');
    }
}