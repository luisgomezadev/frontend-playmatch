export const LINKS_DASHBOARD = [
  // LINKS ADMIN
  {
    name: "Inicio",
    link: "home-admin",
    role: "ADMIN",
    iconClass: "fa-solid fa-house w-6"
  },
  {
    name: "Mi cancha",
    link: "field",
    role: "ADMIN",
    iconClass: "fa-solid fa-futbol w-6"
  },
  {
    name: "Reservas",
    link: "reservation/list/field",
    role: "ADMIN",
    iconClass: "fa-solid fa-calendar-check w-6"
  },
  // LINKS PLAYER
  {
    name: "Inicio",
    link: "home-player",
    role: "PLAYER",
    iconClass: "fa-solid fa-house w-6"
  },
  {
    name: "Mi equipo",
    link: "team",
    role: "PLAYER",
    iconClass: "fa-solid fa-users w-6"
  },
  {
    name: "Reservas",
    link: "reservation/list/team",
    role: "PLAYER",
    iconClass: "fa-solid fa-calendar w-6"
  },
  {
    name: "Ver jugadores",
    link: "player/list",
    role: "PLAYER",
    iconClass: "fa-solid fa-user-group w-6"
  },
  {
    name: "Agregar jugadores",
    link: "team/add/player",
    role: "PLAYER",
    iconClass: "fa-solid fa-user-plus w-6"
  },
  // LINKS PLAYER AND ADMIN
  {
    name: "Perfil",
    link: "profile",
    role: "all",
    iconClass: "fa-solid fa-user w-6"
  }
];
