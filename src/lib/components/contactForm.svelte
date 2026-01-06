<script>
	import { onMount } from 'svelte';
	import { gsap } from 'gsap';
	import { contactFormVisible } from '$lib/stores/contactFormStore';

	let name = '';
	let company = '';
	let email = '';
	let phone = '';
	let message = '';
	let recaptchaChecked = false;
	let selectedEnquiry = 'retail';
	let formContainer;
	let isVisible = false;

	contactFormVisible.subscribe(value => {
		if (value && !isVisible) {
			showForm();
		} else if (!value && isVisible) {
			hideForm();
		}
	});

	onMount(() => {
		// Initially position the form off-screen
		gsap.set(formContainer, { x: '150%', opacity: 0 });

		// Set initial states for all animated elements
		gsap.set('.background-text', { opacity: 0 });
		gsap.set('.form-element', { opacity: 0, y: 30 });
		gsap.set('.sidebar-element', { opacity: 0, x: -30 });
	});

	function showForm() {
		isVisible = true;

		// Create a master timeline for coordinated animations
		const masterTimeline = gsap.timeline();

		// Slide in the entire form
		masterTimeline.to(formContainer, {
			x: '0%',
			opacity: 1,
			duration: 0.8,
			ease: 'power3.out'
		});

		// Animate background text (starts slightly before slide completes)
		masterTimeline.to('.background-text', {
			opacity: 0.2,
			duration: 0.6,
			ease: 'power2.out'
		}, '-=0.4');

		// Animate sidebar elements
		masterTimeline.to('.sidebar-element', {
			opacity: 1,
			x: 0,
			duration: 0.8,
			stagger: 0.1,
			ease: 'power2.out'
		}, '-=0.5');

		// Animate form elements
		masterTimeline.to('.form-element', {
			opacity: 1,
			y: 0,
			duration: 0.8,
			stagger: 0.1,
			ease: 'power2.out'
		}, '-=0.7');
	}

	function hideForm() {
		// Reset all elements to initial state
		gsap.set('.background-text', { opacity: 0 });
		gsap.set('.form-element', { opacity: 0, y: 30 });
		gsap.set('.sidebar-element', { opacity: 0, x: -30 });

		gsap.to(formContainer, {
			x: '150%',
			opacity: 0,
			duration: 0.6,
			ease: 'power3.in',
			onComplete: () => {
				isVisible = false;
			}
		});
	}

	function handleClose() {
		contactFormVisible.set(false);
	}

	function handleSubmit() {
		console.log({ name, company, email, phone, message, enquiryType: selectedEnquiry });
		// Add your form submission logic here
		// After successful submission, you might want to close the form:
		// contactFormVisible.set(false);
	}
</script>

<div
	bind:this={formContainer}
	class="fixed inset-1 md:inset-5 lg:inset-8 xl:inset-10 bg-[#E5DDD5] z-50 overflow-y-auto
    rounded-none md:rounded-3xl shadow-2xl"
	style="transform: translateX(100%);"
>
	<button
		on:click={handleClose}
		class="absolute top-6 right-6 md:top-8 md:right-8 z-20 w-10 h-10 flex items-center justify-center hover:rotate-90 transition-transform duration-300"
		aria-label="Close contact form"
	>
		<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
			<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
		</svg>
	</button>

	<div class="background-text absolute inset-0 flex items-center justify-center pointer-events-none opacity-0">
		<h1 class="text-[12rem] md:text-[16rem] lg:text-[20rem] xl:text-[24rem] font-bold text-white leading-none tracking-tight">
			Contact
		</h1>
	</div>

	<div class="relative z-10 max-w-7xl mx-auto pt-20 md:pt-24 px-4 md:px-8 lg:px-12 pb-12">
		<div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">

			<div class="lg:col-span-4 space-y-8">
				<div class="space-y-3 sidebar-element">
					<button
						type="button"
						on:click={() => selectedEnquiry = 'retail'}
						class="flex items-center gap-3 px-6 py-3 rounded-full transition-all {selectedEnquiry === 'retail' ? 'bg-black text-white' : 'bg-transparent border-2 border-black text-black'}"
					>
						<div
							class="w-5 h-5 rounded-full border-2 {selectedEnquiry === 'retail' ? 'border-white bg-white' : 'border-black'} flex items-center justify-center">
							{#if selectedEnquiry === 'retail'}
								<div class="w-2 h-2 bg-black rounded-full"></div>
							{/if}
						</div>
						<span class="font-medium">Retail Enquiries</span>
					</button>

					<button
						type="button"
						on:click={() => selectedEnquiry = 'mailing'}
						class="flex items-center gap-3 px-6 py-3 rounded-full transition-all {selectedEnquiry === 'mailing' ? 'bg-black text-white' : 'bg-transparent border-2 border-black text-black'}"
					>
						<div
							class="w-5 h-5 rounded-full border-2 {selectedEnquiry === 'mailing' ? 'border-white bg-white' : 'border-black'} flex items-center justify-center">
							{#if selectedEnquiry === 'mailing'}
								<div class="w-2 h-2 bg-black rounded-full"></div>
							{/if}
						</div>
						<span class="font-medium">Join Mailing List</span>
					</button>
				</div>

				<div class="space-y-6 text-black sidebar-element pt-4 text-sm">

					<div>
						<h3 class="font-bold uppercase mb-1">General Enquiry</h3>
						<a href="mailto:enquiry@asiswatches.com" class="hover:underline text-base">enquiry@asiswatches.com</a>
					</div>

					<div>
						<h3 class="font-bold uppercase mb-2 mt-4">Manufacturer</h3>

						<div class="mb-3">
							<p class="font-bold text-xs text-gray-600 mb-0.5">HONG KONG</p>
							<p>THEA INTERNATIONAL HK LTD</p>
							<a href="mailto:sales@theainternationalhkltd.com" class="block hover:underline">sales@theainternationalhkltd.com</a>
							<a href="tel:+85231010321" class="block hover:underline">+852 3101 0321</a>
						</div>
					</div>

					<div>
						<h3 class="font-bold uppercase mb-3 mt-4">Authorised Resellers & Service Centers</h3>

						<div class="space-y-4">
							<div>
								<p class="font-bold text-xs text-gray-600 mb-0.5">UNITED STATES OF AMERICA</p>
								<p>ZAYN JEWELS</p>
								<a href="mailto:info@zaynjewels.com" class="block hover:underline">info@zaynjewels.com</a>
								<a href="tel:+19499006910" class="block hover:underline">+1 (949) 900 6910</a>
							</div>

							<div>
								<p class="font-bold text-xs text-gray-600 mb-0.5">INDIA</p>
								<p>ADL SERVICES</p>
								<a href="mailto:info.adlservices@gmail.com" class="block hover:underline">info.adlservices@gmail.com</a>
								<a href="tel:+911414015544" class="block hover:underline">+91 141 4015544</a>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div class="lg:col-span-8">
				<form on:submit|preventDefault={handleSubmit} class="space-y-8">
					<div class="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
						<div class="form-element">
							<label for="name" class="block text-sm font-medium text-black mb-2">Name</label>
							<input
								type="text"
								id="name"
								bind:value={name}
								class="w-full bg-transparent border-0 border-b-2 border-black pb-2 text-black placeholder-gray-500 focus:outline-none focus:border-black transition-colors"
								required
							/>
						</div>

						<div class="form-element">
							<label for="company" class="block text-sm font-medium text-black mb-2">Company</label>
							<input
								type="text"
								id="company"
								bind:value={company}
								class="w-full bg-transparent border-0 border-b-2 border-black pb-2 text-black placeholder-gray-500 focus:outline-none focus:border-black transition-colors"
							/>
						</div>
					</div>

					<div class="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
						<div class="form-element">
							<label for="email" class="block text-sm font-medium text-black mb-2">Email</label>
							<input
								type="email"
								id="email"
								bind:value={email}
								class="w-full bg-transparent border-0 border-b-2 border-black pb-2 text-black placeholder-gray-500 focus:outline-none focus:border-black transition-colors"
								required
							/>
						</div>

						<div class="form-element">
							<label for="phone" class="block text-sm font-medium text-black mb-2">Phone</label>
							<input
								type="tel"
								id="phone"
								bind:value={phone}
								class="w-full bg-transparent border-0 border-b-2 border-black pb-2 text-black placeholder-gray-500 focus:outline-none focus:border-black transition-colors"
							/>
						</div>
					</div>

					<div class="form-element">
						<label for="message" class="block text-base font-medium text-black mb-4">
							Want to know more? Drop us a line!
						</label>
						<textarea
							id="message"
							bind:value={message}
							rows="6"
							class="w-full bg-transparent border-0 border-b-2 border-black pb-2 text-black placeholder-gray-500 focus:outline-none focus:border-black transition-colors resize-none"
							required
						></textarea>
					</div>

					<div
						class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 form-element">
						<div class="flex items-center gap-3">
							<input
								type="checkbox"
								id="recaptcha"
								bind:checked={recaptchaChecked}
								class="w-6 h-6 border-2 border-gray-400 rounded cursor-pointer"
								required
							/>
							<label for="recaptcha" class="text-sm text-gray-600">
								I'm not a robot
							</label>
							<img src="https://www.gstatic.com/recaptcha/api2/logo_48.png" alt="reCAPTCHA"
								 class="w-8 h-8" />
						</div>

						<button
							type="submit"
							class="flex items-center gap-3 bg-black text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition-colors"
						>
							<div class="w-5 h-5 rounded-full bg-white flex items-center justify-center">
								<svg class="w-3 h-3 text-black" fill="currentColor" viewBox="0 0 24 24">
									<path d="M8 5v14l11-7z" />
								</svg>
							</div>
							Send
						</button>
					</div>
				</form>
			</div>
		</div>
	</div>
</div>

<style>
	/* Custom styles */
	input:-webkit-autofill,
	input:-webkit-autofill:hover,
	input:-webkit-autofill:focus,
	textarea:-webkit-autofill,
	textarea:-webkit-autofill:hover,
	textarea:-webkit-autofill:focus {
		-webkit-box-shadow: 0 0 0px 1000px #E5DDD5 inset;
		-webkit-text-fill-color: black;
	}
</style>