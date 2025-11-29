const ShinyText = ({ text, disabled = false, speed = 5, className = '', baseColor = '#673c2e', shineColor = '#d5c6b9ff' }) => {
    const animationDuration = `${speed}s`;

    return (
        <div
            className={`bg-clip-text inline-block ${disabled ? '' : 'animate-shine'} ${className}`}
            style={{
                backgroundImage: `linear-gradient(120deg, ${baseColor} 40%, ${shineColor} 100%, ${baseColor} 60%)`,
                backgroundSize: '200% 100%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                animationDuration: animationDuration
            }}
        >
            {text}
        </div>
    );
};

export default ShinyText;

// tailwind.config.js
// module.exports = {
//   theme: {
//     extend: {
//       keyframes: {
//         shine: {
//           '0%': { 'background-position': '100%' },
//           '100%': { 'background-position': '-100%' },
//         },
//       },
//       animation: {
//         shine: 'shine 5s linear infinite',
//       },
//     },
//   },
//   plugins: [],
// };
