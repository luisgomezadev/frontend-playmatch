export const LINKS_DASHBOARD = [
  // LINKS ADMIN
  {
    name: "Inicio",
    link: "home-admin",
    role: "admin"
  },
  {
    name: "Mi cancha",
    link: "field",
    role: "admin"
  },
  {
    name: "Reservas",
    link: "reservation/list/field",
    role: "admin"
  },
  // LINKS PLAYER
  {
    name: "Inicio",
    link: "home-player",
    role: "player"
  },
  {
    name: "Mi equipo",
    link: "team",
    role: "player"
  },
  {
    name: "Reservas",
    link: "reservation/list/team",
    role: "player"
  },
  {
    name: "Ver jugadores",
    link: "player/list",
    role: "player"
  },
  {
    name: "Agregar jugadores",
    link: "team/add/player",
    role: "player"
  },
  // {
  //   name: "Hacer reserva",
  //   link: "field/list",
  //   role: "player"
  // },
  // LINKS PLAYER AND ADMIN
  {
    name: "Perfil",
    link: "profile",
    role: "all"
  }
]