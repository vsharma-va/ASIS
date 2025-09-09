<script>
import FirstWatchImage from '$lib/assets/images/FirstwatchImage.webp';
import WatchDetailImage from '$lib/assets/images/FirstWatchImageCloseUP.webp';
import WatchDetailImage2 from '$lib/assets/images/FirstWatchImageCloseUP.webp';
</script>

<div class="h-screen"></div>


<div class="AfterLandingSection h-screen w-full relative flex justify-center items-center bg-gradient overflow-hidden">
	<div class="w-full h-full flex flex-col lg:flex-row items-center justify-center relative px-4 lg:px-0">
		<div class="watch-container relative h-full lg:h-full w-full lg:w-3/4 flex justify-center items-center overflow-hidden">
			<img src="{FirstWatchImage}" alt="ASIS Luxury Watch"
				 class="watch-image w-full h-full object-cover lg:object-contain"
				 loading="eager">

			<!-- Mobile details - First Set -->
			<div class="lg:hidden absolute top-4 left-4 right-4 flex flex-col gap-4 detail-set-1">
				<div class="detail-text bg-white/10 backdrop-blur-sm rounded-lg p-4 text-black">
					<div class="text-xs uppercase font-bold secondary-font">Case Design</div>
					<div class="text-sm uppercase secondary-font">Stainless Steel</div>
				</div>
				<div class="detail-text bg-white/10 backdrop-blur-sm rounded-lg p-4 text-black">
					<div class="text-xs uppercase font-bold secondary-font">Movement</div>
					<div class="text-sm uppercase secondary-font">Swiss Automatic</div>
				</div>
				<div class="detail-text bg-white/10 backdrop-blur-sm rounded-lg p-4 text-black">
					<div class="text-xs uppercase font-bold secondary-font">Metal</div>
					<div class="text-sm uppercase secondary-font">High Grade Steel</div>
				</div>
			</div>

			<!-- Mobile details - Second Set -->
			<div class="lg:hidden absolute top-4 left-4 right-4 flex flex-col gap-4 detail-set-2">
				<div class="detail-text-second bg-white/10 backdrop-blur-sm rounded-lg p-4 text-black">
					<div class="text-xs uppercase font-bold secondary-font">STRAP</div>
					<div class="text-sm uppercase secondary-font">Genuine Alligator Leather / Vegan Leather	</div>
				</div>
				<div class="detail-text-second bg-white/10 backdrop-blur-sm rounded-lg p-4 text-black">
					<div class="text-xs uppercase font-bold secondary-font">GLASS</div>
					<div class="text-sm uppercase secondary-font">Sapphire Glass</div>
				</div>
				<div class="detail-text-second bg-white/10 backdrop-blur-sm rounded-lg p-4 text-black">
					<div class="text-xs uppercase font-bold secondary-font">WARRANTY</div>
					<div class="text-sm uppercase secondary-font">2 Year International Warranty	</div>
				</div>
			</div>

			<!-- Desktop details - First Set -->
			<div class="hidden lg:block absolute w-[250px] xl:w-[300px] left-1/5 top-1/4 transform -translate-1/2 detail-set-1">
				<div class="flex items-center justify-center">
					<div class="detail-text mr-2 text-right w-3/4 tracking-tight">
						<div class="text-xs uppercase font-bold secondary-font">GEMSTONES</div>
						<div class="text-sm uppercase secondary-font">Natural Diamonds & Colorstones</div>
						<div class="mt-2 flex justify-end items-center border-2">
							<img src="{WatchDetailImage}" alt="Watch case detail"
								 class="detail-image w-full h-full object-cover"
								 loading="eager">
						</div>
					</div>
					<div class="detail-line h-px bg-black origin-left w-12"></div>
				</div>
			</div>

			<div class="hidden lg:flex absolute w-[250px] xl:w-[300px] right-[12.5%] top-1/3 items-center detail-set-1">
				<div class="detail-line h-px bg-black origin-right w-12"></div>
				<div class="detail-text ml-2 w-1/2 secondary-font">
					<div class="text-xs uppercase font-bold">Movement</div>
					<div class="text-sm uppercase">Swiss Automatic</div>
				</div>
			</div>
			<div class="hidden lg:flex absolute w-[250px] xl:w-[300px] right-[12.5%] top-2/3 items-center detail-set-1">
				<div class="detail-line h-px bg-black origin-right w-12"></div>
				<div class="detail-text ml-2 w-1/2 secondary-font">
					<div class="text-xs uppercase font-bold">METAL</div>
					<div class="text-sm uppercase">High Grade Steel</div>
				</div>
			</div>

			<!-- Desktop details - Second Set -->
			<div class="hidden lg:block absolute w-[250px] xl:w-[300px] left-1/5 top-1/4 transform -translate-1/2 detail-set-2">
				<div class="flex items-center justify-center">
					<div class="detail-text-second mr-2 text-right w-3/4 tracking-tight">
						<div class="text-xs uppercase font-bold secondary-font">STRAP</div>
						<div class="text-sm uppercase secondary-font">Genuine Alligator Leather / Vegan Leather	</div>
						<div class="mt-2 flex justify-end items-center border-2">
							<img src="{WatchDetailImage2}" alt="Watch craftsmanship detail"
								 class="detail-image-second w-full h-full object-cover"
								 loading="eager">
						</div>
					</div>
					<div class="detail-line-second h-px bg-black origin-left w-12"></div>
				</div>
			</div>

			<div class="hidden lg:flex absolute w-[250px] xl:w-[300px] right-[12.5%] top-1/3 items-center detail-set-2">
				<div class="detail-line-second h-px bg-black origin-right w-12"></div>
				<div class="detail-text-second ml-2 w-1/2 secondary-font">
					<div class="text-xs uppercase font-bold">GLASS</div>
					<div class="text-sm uppercase">Sapphire Crystal	</div>
				</div>
			</div>
			<div class="hidden lg:flex absolute w-[250px] xl:w-[300px] right-[12.5%] top-2/3 items-center detail-set-2">
				<div class="detail-line-second h-px bg-black origin-right w-12"></div>
				<div class="detail-text-second ml-2 w-1/2 secondary-font">
					<div class="text-xs uppercase font-bold">WARRANTY</div>
					<div class="text-sm uppercase">2 Year International Warranty	</div>
				</div>
			</div>
		</div>
	</div>
</div>