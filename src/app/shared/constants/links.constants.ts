export const LINKS_DASHBOARD = [
  // LINKS FIELD_ADMIN
  {
    name: "Inicio",
    link: "home-admin",
    role: "FIELD_ADMIN",
    iconClass: "fa-solid fa-house w-6"
  },
  {
    name: "Mi cancha",
    link: "field",
    role: "FIELD_ADMIN",
    iconClass: "fa-solid fa-futbol w-6"
  },
  {
    name: "Reservas",
    link: "reservation/list/field",
    role: "FIELD_ADMIN",
    iconClass: "fa-solid fa-calendar-check w-6"
  },
  // LINKS PLAYER
  {
    name: "Inicio",
    link: "home-player",
    role: "PLAYER",
    requiredTeam: false,
    iconClass: "fa-solid fa-house w-6"
  },
  {
    name: "Mi equipo",
    link: "team",
    role: "PLAYER",
    requiredTeam: false,
    iconClass: "fa-solid fa-users w-6"
  },
  {
    name: "Reservas",
    link: "reservation/list/team",
    role: "PLAYER",
    requiredTeam: true,
    iconClass: "fa-solid fa-calendar w-6"
  },
  {
    name: "Ver jugadores",
    link: "player/list",
    role: "PLAYER",
    requiredTeam: true,
    iconClass: "fa-solid fa-user-group w-6"
  },
  {
    name: "Agregar jugadores",
    link: "add/player",
    role: "PLAYER",
    requiredTeam: true,
    iconClass: "fa-solid fa-user-plus w-6"
  },
  {
    name: "Solicitudes",
    link: "requests",
    role: "PLAYER",
    requiredTeam: false,
    iconClass: "fa-solid fa-inbox w-6"
  },
  // LINKS PLAYER AND FIELD_ADMIN
  {
    name: "Perfil",
    link: "profile",
    role: "all",
    iconClass: "fa-solid fa-user w-6"
  }
];
