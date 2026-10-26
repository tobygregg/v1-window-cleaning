/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./*.html', './assets/js/*.js'],
  theme: {
    extend: {
      colors: {
        // ---- Brand palette (from the V1 logo + van cover photo) ----
        ink:   { DEFAULT: '#0b1630', 800: '#10204a', 700: '#18306b' }, // deep navy — darkened from the logo grey-navy #353a4c
        brand: { DEFAULT: '#1569fb', 700: '#0f4fc4', 600: '#1259e0', 100: '#dbe9ff', 50: '#eef5ff' }, // logo blue #1569fb
        aqua:  { DEFAULT: '#2dd4f0', 300: '#7be3f7', 100: '#d3f6fd' }, // highlight inside the logo water drop
        foam:  '#f4f8fe',   // cool off-white for light sections
        sand:  { DEFAULT: '#f3ede4', 300: '#d6c9b9' }, // render/plaster tone — logo background #d6c9b9
        squeegee: { DEFAULT: '#d7222d', 700: '#b80000' }, // red from the van cover banner #b80000
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', 'system-ui', 'sans-serif'],
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 10px 30px -12px rgba(11,22,48,.25)',
        lift: '0 24px 50px -20px rgba(21,105,251,.45)',
      },
    },
  },
  plugins: [],
};
