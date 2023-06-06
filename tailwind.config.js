/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./views/landing-page/landingpage.html",
    "./views/dashboard/dashboard.html",
    "./views/favorites/favorites.html",
    "./views/login/login.html",
    "./views/saved/index.html",
    "./views/sign-up/index.html",
    "./views/add/add.html",
    "./views/update/update.html",
    "./src/js/script.js",
  ],
  theme: {
    // container: {
    //   center: true,
    //   padding: "16px",
    // },
    screens: {
      screen: "1280px",
      laptop: "1024px",
      tabletlg: "840px",
      tablet: "640px",
      mobile: "480px",
    },
    extend: {
      colors: {
        main: "#4F46E5",
        dark: "#27272A",
        dimmed: "#E1E1E1",
        danger: "#FF5151",
        dangerLight: "#F9C3C3",
      },
      fontFamily: {
        inter: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
