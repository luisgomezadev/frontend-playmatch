import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'aside-auth-component',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-primary h-full flex-1 px-5 relative">
      <div class="flex justify-center items-center h-full flex-col">
        <img
          src="../assets/logo_blanco.webp"
          alt="Logo PlayMatch"
          class="md:w-[26rem] w-56 h-auto" />
        <p class="max-w-xl text-white text-xl text-pretty text-center">
          Registra tu información para ingresar y acceder a todas las funcionalidades disponibles.
        </p>
      </div>
      <div class="absolute bottom-6 left-6 z-20">
        <a
          href="https://luisgomezdev.vercel.app/"
          target="_blank"
          class="flex items-center gap-1 text-white hover:scale-105 transition-transform duration-300">
          <img
            src="../assets/logo_personal_blanco.webp"
            alt="Logo Luis Gomez Dev"
            class="w-10 h-auto object-contain" />
          <span class="text-xl">LuisGomezDev</span>
        </a>
      </div>
      <div class="absolute bottom-6 right-6 z-20 text-white">
        <div class="flex gap-4">
          <a
            href="https://github.com/luisgomezadev"
            class="hover:scale-110 transition-transform duration-300"
            target="_blank">
            <i class="fa-brands fa-github text-3xl"></i>
          </a>
          <a
            href="https://www.linkedin.com/in/luisgomezdev/"
            class="hover:scale-110 transition-transform duration-300"
            target="_blank">
            <i class="fa-brands fa-linkedin text-3xl"></i>
          </a>
        </div>
      </div>
      <div class="absolute w-full top-0 left-0">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
          <path
            fill="rgb(4 109 58)"
            fill-opacity="1"
            d="M0,0L40,10.7C80,21,160,43,240,48C320,53,400,43,480,80C560,117,640,203,720,229.3C800,256,880,224,960,202.7C1040,181,1120,171,1200,154.7C1280,139,1360,117,1400,106.7L1440,96L1440,0L1400,0C1360,0,1280,0,1200,0C1120,0,1040,0,960,0C880,0,800,0,720,0C640,0,560,0,480,0C400,0,320,0,240,0C160,0,80,0,40,0L0,0Z"></path>
        </svg>
      </div>
      <div class="absolute w-full bottom-0 left-0">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
          <path
            fill="rgb(4 109 58)"
            fill-opacity="1"
            d="M0,0L40,10.7C80,21,160,43,240,48C320,53,400,43,480,80C560,117,640,203,720,229.3C800,256,880,224,960,202.7C1040,181,1120,171,1200,154.7C1280,139,1360,117,1400,106.7L1440,96L1440,320L1400,320C1360,320,1280,320,1200,320C1120,320,1040,320,960,320C880,320,800,320,720,320C640,320,560,320,480,320C400,320,320,320,240,320C160,320,80,320,40,320L0,320Z"></path>
        </svg>
      </div>
    </div>
  `
})
export class AsideAuthComponent {}
