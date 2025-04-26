<script>
	import { onMount } from 'svelte';
	import { gsap } from 'gsap/dist/gsap';
	import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
	import { TextPlugin } from 'gsap/dist/TextPlugin';

	const watchImages = import.meta.glob('$lib/assets/images/watchFaces/*.webp', { eager: true });
	let watchImageArray = Object.values(watchImages).map(module => module.default);
	let leftColumnImages = watchImageArray.slice(0, 9);
	let rightColumnImages = watchImageArray.slice(9, 18);


	let textList = [
		{
			title: 'Retail Partner',
			para: 'Mauris felis urna, convallis ac metus sit amet, mattis mollis est. Aliquam ac aliquet odio, vitae tristique orci. Nunc ornare ligula lectus, vel vestibulum turpis euismod et. Curabitur vehicula, orci nec pretium tincidunt, justo lectus aliquet ex, vitae bibendum augue urna in enim. Suspendisse urna ante, ultricies sed elementum nec, molestie ut justo. Fusce nisi est, blandit vel pretium quis, blandit in magna. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Nam in velit nunc. Phasellus vel lobortis neque, a viverra erat.'
		},
		{
			title: 'Brand Collaboration',
			para: 'In dolor arcu, varius et rhoncus non, convallis eu enim. Nam turpis dolor, ullamcorper vel sodales quis, mollis ac mi. Mauris ut fringilla sapien. Donec vitae quam congue, hendrerit enim non, dapibus leo. Praesent imperdiet justo et odio aliquet lobortis. Sed dictum sem in nisi gravida tincidunt. Mauris dignissim vel nulla rhoncus tempor. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Mauris sit amet ex massa. Vivamus turpis augue, tincidunt non iaculis at, elementum vehicula elit. Vivamus volutpat nisi non metus sollicitudin sagittis.'
		},
		{
			title: 'Exclusive Design',
			para: 'Pellentesque purus odio, malesuada ut laoreet non, bibendum non ex. Morbi venenatis egestas condimentum. Duis vestibulum vitae sem at sollicitudin. Quisque interdum sodales dictum. Fusce venenatis tempus hendrerit. Duis ut laoreet orci, at dapibus massa. Ut vitae metus nisl. Vestibulum tempor venenatis tortor, ac malesuada nunc sagittis sed. Aliquam id felis nunc.'
		}
	];

	onMount(() => {
		gsap.registerPlugin(ScrollTrigger, TextPlugin);

		gsap.fromTo('.left-watch-column .watch-item',
			{
				y: (i) => i * 100 + 200,
				opacity: 0
			},
			{
				y: 0,
				opacity: 1,
				stagger: 0.2,
				duration: 1,
				ease: 'power2.out',
				scrollTrigger: {
					trigger: '.collection-section',
					start: 'top 30%',
					end: 'center center',
					scrub: 0.5
				}
			}
		);

		gsap.fromTo('.right-watch-column .watch-item',
			{
				y: (i) => i * 100 + 200,
				opacity: 0
			},
			{
				y: 0,
				opacity: 1,
				stagger: 0.2,
				duration: 1,
				ease: 'power2.out',
				scrollTrigger: {
					trigger: '.collection-section',
					start: 'top 30%',
					end: 'center center',
					scrub: 0.5
				}
			}
		);

		gsap.fromTo('.collection-center-text',
			{
				opacity: 0,
				y: 30
			},
			{
				opacity: 1,
				y: 0,
				duration: 1,
				ease: 'power2.out',
				scrollTrigger: {
					trigger: '.collection-section',
					start: 'top 60%'
				}
			}
		);

		const titleElem = document.querySelector('.changingTextElemTitle');
		const paraElem = document.querySelector('.changingTextElemPara');

		gsap.set(titleElem, { opacity: 1, y: 0 });
		gsap.set(paraElem, { opacity: 1, y: 0 });
		titleElem.textContent = textList[0].title;
		paraElem.textContent = textList[0].para;

		let currentIndex = 0;
		const updateTextContent = (index) => {
			if (index === currentIndex) return;

			const direction = index > currentIndex ? 1 : -1;
			currentIndex = index;

			const titleTL = gsap.timeline();
			const paraTL = gsap.timeline();

			titleTL.to(titleElem, {
				y: -20 * direction,
				opacity: 0,
				duration: 0.5,
				ease: 'power2.inOut'
			});

			paraTL.to(paraElem, {
				y: -20 * direction,
				opacity: 0,
				duration: 0.5,
				ease: 'power2.inOut',
				delay: 0.1
			});

			titleTL.add(() => {
				titleElem.textContent = textList[index].title;
				gsap.set(titleElem, { y: 20 * direction });
			});

			paraTL.add(() => {
				paraElem.textContent = textList[index].para;
				gsap.set(paraElem, { y: 20 * direction });
			});

			titleTL.to(titleElem, {
				y: 0,
				opacity: 1,
				duration: 0.5,
				ease: 'power2.out'
			});

			paraTL.to(paraElem, {
				y: 0,
				opacity: 1,
				duration: 0.5,
				ease: 'power2.out',
				delay: 0.1
			});
		};

		const sectionHeight = document.querySelector('.collection-section').offsetHeight;
		const triggerPoints = textList.length;
		const triggerStep = (sectionHeight / triggerPoints) - 200;

		for (let i = 1; i < textList.length; i++) {
			const triggerPosition = triggerStep * i;
			// console.log(triggerPosition);
			// console.log(sectionHeight);

			ScrollTrigger.create({
				trigger: '.collection-section',
				start: `top+=${triggerPosition} top`,
				onEnter: () => updateTextContent(i),
				onLeaveBack: () => updateTextContent(i - 1)
			});
		}
	});
</script>

<div class="collection-section h-fit w-full relative flex justify-between items-center bg-gradient min-h-[200vh] pb-10">
	<div class="left-watch-column w-1/4 h-full flex flex-col justify-between py-8 gap-8">
		{#each leftColumnImages as imgSrc, i (imgSrc)}
			<div class="watch-item w-full p-4">
				<img src="{imgSrc}" alt="ASIS Watch Model {i+1}" class="w-full aspect-square object-cover">
			</div>
		{/each}
	</div>

	<div class="collection-center-text w-2/4 h-full flex flex-col justify-center items-center self-start mt-32
							sticky top-[3%] text-white text-center mb-32">
		<div class="mb-16 relative text-center">
			<h1 class="text-6xl mb-4 primary-font">The Jewelry Watch</h1>
			<div
				class="text-[10px] absolute right-0 top-1/2 transform -translate-y-[80%] secondary-font tracking-tighter text-center">
				BY:
				<span class="text-base primary-font -ml-1">
					ASIS
				</span></div>
			<p class="text-sm tracking-tight mb-12 secondary-font -mr-2">The watch is a timeless luxury piece</p>
		</div>
		<div class="changingTextContainer">
			<div class="title-wrapper overflow-hidden">
				<h1 class="primary-font text-7xl mb-4 changingTextElemTitle">Retail Partner</h1>
			</div>
			<div class="para-wrapper overflow-hidden">
				<p class="text-lg tracking-tight secondary-font changingTextElemPara">
					Lorem ipsum dolor sit amet consectetur adipisicing elit. Eligendi
					repellat et, possimus blanditiis harum nam laudantium consectetur, accusamus maiores rerum explicabo omnis?
					Quia
					culpa veniam laudantium recusandae tempora repellendus delectus.
				</p>
			</div>
		</div>
	</div>

	<div class="right-watch-column w-1/4 h-full flex flex-col justify-between py-8 gap-8">
		{#each rightColumnImages as imgSrc, i (imgSrc)}
			<div class="watch-item w-full p-4">
				<img src="{imgSrc}" alt="ASIS Watch Model {i+10}" class="w-full aspect-square object-cover -scale-x-[1]">
			</div>
		{/each}
	</div>
</div>


<style>
    .title-wrapper,
    .para-wrapper {
        position: relative;
        width: 100%;
    }

    .changingTextElemTitle,
    .changingTextElemPara,
    .watch-item,
		.collection-center-text {
        will-change: transform, opacity;
    }
</style>