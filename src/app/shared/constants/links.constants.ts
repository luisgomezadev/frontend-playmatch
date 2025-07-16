export const LINKS_DASHBOARD = [
  // LINKS FIELD_ADMIN
  {
    name: "Inicio",
    link: "home-admin",
    role: "FIELD_ADMIN",
    iconClass: "fa-solid fa-house",
    viewMovil: true,
    viewDesktop: true
  },
  {
    name: "Mi cancha",
    link: "field",
    role: "FIELD_ADMIN",
    iconClass: "fa-solid fa-futbol",
    viewMovil: true,
    viewDesktop: true
  },
  {
    name: "Reservas",
    link: "reservation/list/field",
    role: "FIELD_ADMIN",
    iconClass: "fa-solid fa-calendar-check",
    viewMovil: true,
    viewDesktop: true
  },
  // LINKS PLAYER
  {
    name: "Canchas",
    link: "home-player",
    role: "PLAYER",
    requiredTeam: false,
    iconClass: "fa-solid fa-futbol",
    viewMovil: true,
    viewDesktop: true
  },
  {
    name: "Mi equipo",
    link: "team",
    role: "PLAYER",
    requiredTeam: false,
    iconClass: "fa-solid fa-shield-halved",
    viewMovil: true,
    viewDesktop: true
  },
  {
    name: "Reservas",
    link: "reservation/list/team",
    role: "PLAYER",
    requiredTeam: true,
    iconClass: "fa-solid fa-calendar",
    viewMovil: true,
    viewDesktop: true
  },
  {
    name: "Ver jugadores",
    link: "player/list",
    role: "PLAYER",
    requiredTeam: true,
    iconClass: "fa-solid fa-user-group",
    viewMovil: false,
    viewDesktop: true
  },
  {
    name: "Agregar jugadores",
    link: "add/player",
    role: "PLAYER",
    requiredTeam: true,
    iconClass: "fa-solid fa-user-plus",
    viewMovil: false,
    viewDesktop: true
  },
  {
    name: "Solicitudes",
    link: "requests",
    role: "PLAYER",
    requiredTeam: false,
    iconClass: "fa-solid fa-inbox",
    viewMovil: false,
    viewDesktop: true
  },
  // LINKS PLAYER AND FIELD_ADMIN
  {
    name: "Perfil",
    link: "profile",
    role: "all",
    iconClass: "fa-solid fa-user",
    viewMovil: true,
    viewDesktop: true
  },
  {
    name: "Ver más",
    link: "menu",
    role: "all",
    iconClass: "fa-solid fa-ellipsis",
    viewMovil: true,
    viewDesktop: false
  }
];
