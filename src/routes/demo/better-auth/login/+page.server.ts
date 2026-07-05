import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import type { PageServerLoad } from './$types';

import { APIError } from 'better-auth/api';

export const load: PageServerLoad = (event) => {
	if (event.locals.user) {
		return redirect(302, '/demo/better-auth');
	}
	return {};
};

function parseAuthForm(formData: FormData) {
	return {
		email: formData.get('email')?.toString() ?? '',
		password: formData.get('password')?.toString() ?? '',
		name: formData.get('name')?.toString() ?? ''
	};
}

function handleAuthError(error: unknown) {
	if (error instanceof APIError) {
		return fail(400, { message: error.message || 'Auth failed' });
	}
	return fail(500, { message: 'Unexpected error' });
}

export const actions: Actions = {
	signInEmail: async (event) => {
		const { auth } = event.locals;
		const { email, password } = parseAuthForm(await event.request.formData());

		try {
			await auth.api.signInEmail({
				body: { email, password, callbackURL: '/auth/verification-success' }
			});
		} catch (error) {
			return handleAuthError(error);
		}

		return redirect(302, '/demo/better-auth');
	},
	signUpEmail: async (event) => {
		const { auth } = event.locals;
		const { email, password, name } = parseAuthForm(await event.request.formData());

		try {
			await auth.api.signUpEmail({
				body: { email, password, name, callbackURL: '/auth/verification-success' }
			});
		} catch (error) {
			return handleAuthError(error);
		}

		return redirect(302, '/demo/better-auth');
	}
};
