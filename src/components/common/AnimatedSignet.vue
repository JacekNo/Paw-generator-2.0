<template>
  <div class="relative w-12 h-12 flex items-center justify-center">
    <div class="absolute inset-0 bg-blue-100 rounded-full blur-xl animate-pulse"></div>
    
    <svg 
      width="100%" 
      height="100%" 
      viewBox="0 0 663 681" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      class="relative z-10 w-10 h-10 drop-shadow-md"
    >
      <path 
        id="paw-path"
        d="M331.16 0V78.1103H529.282L331.16 276.753L55.1018 0H0V348.191L331.16 680.221L662.32 348.191V0H331.16ZM584.384 315.839L331.16 569.728L77.9057 315.839V133.357L331.13 387.246L584.354 133.357V315.839H584.384Z" 
        fill="#0F4496"
        class="origin-center"
      />
    </svg>
  </div>
</template>

<style scoped>
/* Animacja wejścia: Rysowanie + Wypełnienie */
#paw-path {
  animation: logo-enter 1.5s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
}

@keyframes logo-enter {
  0% {
    opacity: 0;
    transform: scale(0.8) translateY(10px);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}
</style>