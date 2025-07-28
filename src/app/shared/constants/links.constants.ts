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
    link: "reservation/list",
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
    iconClass: "fa-solid fa-futbol",
    viewMovil: true,
    viewDesktop: true
  },
  {
    name: "Reservas",
    link: "reservation/list",
    role: "PLAYER",
    iconClass: "fa-solid fa-calendar",
    viewMovil: true,
    viewDesktop: true
  },
  {
    name: "Ver jugadores",
    link: "player/list",
    role: "PLAYER",
    iconClass: "fa-solid fa-user-group",
    viewMovil: true,
    viewDesktop: true
  },
  // LINKS PLAYER AND FIELD_ADMIN
  {
    name: "Ver más",
    link: "menu",
    role: "all",
    iconClass: "fa-solid fa-ellipsis",
    viewMovil: true,
    viewDesktop: false
  }
];
