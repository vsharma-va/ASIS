<script>
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
</script>

<svelte:head>
	<title>Error {$page.status}</title>
</svelte:head>

<div
	class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-6">
	<div class="text-center max-w-2xl mx-auto">
		<!-- Error Code -->
		<div class="relative mb-8">
			<h1 class="text-8xl md:text-9xl font-bold bg-gradient-to-r from-white/20 to-white/5 bg-clip-text text-transparent">
				{$page.status}
			</h1>
			<div class="absolute inset-0 flex items-center justify-center">
				<div class="w-24 h-24 border-2 border-white/20 rounded-full animate-pulse"></div>
			</div>
		</div>

		<!-- Error Message -->
		<h2 class="text-3xl md:text-4xl font-bold text-white mb-6">
			{#if $page.status === 404}
				Watch Not Found
			{:else if $page.status === 500}
				Something Went Wrong
			{:else}
				Error {$page.status}
			{/if}
		</h2>

		<p class="text-xl text-white/70 mb-8 leading-relaxed">
			{#if $page.status === 404}
				The timepiece you're looking for doesn't exist in our collection. It might have been moved or the link
				is incorrect.
			{:else if $page.status === 500}
				Our servers are experiencing some technical difficulties. Please try again in a moment.
			{:else}
				{$page.error?.message || 'An unexpected error occurred.'}
			{/if}
		</p>

		<!-- Action Buttons -->
		<div class="flex flex-col sm:flex-row gap-4 justify-center">
			<button
				on:click={() => history.back()}
				class="group relative overflow-hidden bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-semibold py-3 px-6 rounded-full border border-white/20 transition-all duration-300 transform hover:scale-105"
			>
				<span class="relative z-10 flex items-center justify-center gap-2">
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2"
						 stroke="currentColor" class="w-5 h-5">
						<path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
					</svg>
					Go Back
				</span>
			</button>

			<button
				on:click={() => goto('/')}
				class="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 text-white font-semibold py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-blue-500/25"
			>
				<span class="relative z-10 flex items-center justify-center gap-2">
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2"
						 stroke="currentColor" class="w-5 h-5">
						<path stroke-linecap="round" stroke-linejoin="round"
							  d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
					</svg>
					Home
				</span>
				<div
					class="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
			</button>
		</div>

		<!-- Decorative Elements -->
		<div
			class="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-xl animate-pulse"></div>
		<div
			class="absolute bottom-1/4 right-1/4 w-24 h-24 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-full blur-xl animate-pulse delay-1000"></div>
	</div>
</div>