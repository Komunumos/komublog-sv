<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { currentUser, pb } from './pocketbase';

	let redirect = () => {};

	$: {
		if ($currentUser) {
			redirect();
		}
	}

	// goto is set under onmount to avoid server redirects
	onMount(() => {
		redirect = () => {
			goto('/');
		};
	});

	let validationErrors: { field: String; error: String }[] = [];
	let email = '';
	$: invalidEmail =
		!email || (!!validationErrors.length && validationErrors.some((e) => e.field === 'email'));
	let username = '';
	$: invalidUsername =
		!isSignUp ||
		(!!validationErrors.length && validationErrors.some((e) => e.field === 'username'));
	let password = '';
	$: invalidPassword =
		!!validationErrors.length && validationErrors.some((e) => e.field === 'password');
	let passwordConfirm = '';
	$: invalidPasswordConfirm =
		!isSignUp ||
		(!!validationErrors.length && validationErrors.some((e) => e.field === 'passwordConfirm'));

	$: invalidForm = invalidEmail && invalidUsername && invalidPassword && invalidPasswordConfirm;

	function clearError(field: String) {
		validationErrors.filter((e) => e.field !== field);
	}

	export let isSignUp: Boolean;

	async function signIn() {
		try {
			const user = await pb.collection('users').authWithPassword(email, password);
		} catch (err: any) {
			validationErrors = [{ field: '', error: 'Invalid username or password.' }];
		}
	}

	async function signUp() {
		try {
			const data = {
				email,
				username,
				password,
				passwordConfirm
			};
			await pb.collection('users').create(data);
			await signIn();
		} catch (err: any) {
			extractErrorMessages(err.response);
		}
	}

	function extractErrorMessages(err: any) {
		validationErrors = [];
		if (err) {
			for (const [fieldName, error] of Object.entries(err.data)) {
				const message = (error as any).message;
				validationErrors.push({
					field: fieldName,
					error: message
				});
			}
		}
		validationErrors = validationErrors;
	}

	async function handleSubmit(event: Event) {
		event.preventDefault();

		isSignUp ? await signUp() : await signIn();
	}
</script>

<article class="grid">
	<div>
		<hgroup>
			{#if isSignUp}
				<h1>Sign up to Komublog</h1>
				<h2>Already have an account? <a href="/sign-in">Sign in</a> instead.</h2>
			{:else}
				<h1>Sign in to Komublog</h1>
				<h2>Already have an account? <a href="/sign-up">Sign up</a> instead.</h2>
			{/if}
		</hgroup>
		<form>
			<input
				type="text"
				name="email"
				placeholder="Email"
				aria-label="email"
				autocomplete="email"
				required
				bind:value={email}
				on:change={() => clearError('email')}
				aria-invalid={invalidEmail}
			/>
			{#if isSignUp}
				<input
					type="text"
					name="username"
					placeholder="Username"
					aria-label="Username"
					autocomplete="nickname"
					required
					bind:value={username}
					on:change={() => clearError('username')}
					aria-invalid={invalidUsername}
				/>
			{/if}
			<input
				type="password"
				name="password"
				placeholder="Password"
				aria-label="Password"
				autocomplete="current-password"
				required
				bind:value={password}
				on:change={() => clearError('password')}
				aria-invalid={invalidPassword}
			/>
			{#if isSignUp}
				<input
					type="password"
					name="confirm-password"
					placeholder="Confirm password"
					aria-label="Confirm Password"
					autocomplete="current-password"
					required
					bind:value={passwordConfirm}
					on:change={() => clearError('passwordConfirm')}
				/>
			{/if}
			<!-- <fieldset>
        <label for="remember">
          <input type="checkbox" role="switch" id="remember" name="remember">
          Remember me
        </label>
      </fieldset> -->
			<div class="error">
				{#each validationErrors as { field, error }, i}
					<span><b>{field}</b>{field ? ':' : ''} {error}</span><br />
				{/each}
			</div>
			<button type="submit" class="contrast" disabled={invalidForm} on:click={handleSubmit}
				>{isSignUp ? 'Sign Up' : 'Sign in'}</button
			>
		</form>
	</div>
</article>

<style>
	article {
		padding: 0;
		margin-left: 20%;
		margin-right: 20%;
		overflow: hidden;
	}

	article div {
		padding: 1rem;
	}

	@media (min-width: 576px) {
		article div {
			padding: 1.25rem;
		}
	}

	@media (min-width: 768px) {
		article div {
			padding: 1.5rem;
		}
	}

	@media (min-width: 992px) {
		article div {
			padding: 1.75rem;
		}
	}

	@media (min-width: 1200px) {
		article div {
			padding: 2rem;
		}
	}

	/* Nav */
	summary[role='link'].secondary:is([aria-current], :hover, :active, :focus) {
		background-color: transparent;
		color: var(--secondary-hover);
	}

	/* Hero Image */
	article div:nth-of-type(2) {
		display: none;
		background-color: #374956;
		background-image: url('assets/alessio-soggetti-8jeWeKdygfk-unsplash-1000x1200.jpg');
		background-position: center;
		background-size: cover;
	}

	@media (min-width: 992px) {
		.grid > div:nth-of-type(2) {
			display: block;
		}
	}

	.error {
		color: red;
	}
</style>
