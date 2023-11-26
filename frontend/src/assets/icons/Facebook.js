export default function Facebook(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      viewBox="0,0,256,256"
      width="64px"
      height="64px"
      {...props}
    >
      <defs>
        <linearGradient
          x1="9.993"
          y1="9.993"
          x2="40.615"
          y2="40.615"
          gradientUnits="userSpaceOnUse"
          id="color-1"
        >
          <stop
            offset={0}
            stopColor="#1877f2"
          />
          <stop
            offset={1}
            stopColor="#007ad9"
          />
        </linearGradient>
      </defs>
      <g
        fill="none"
        fillRule="nonzero"
        stroke="none"
        strokeWidth={1}
        strokeLinecap="butt"
        strokeLinejoin="miter"
        strokeMiterlimit={10}
        strokeDasharray=""
        strokeDashoffset={0}
        fontFamily="none"
        fontWeight="none"
        fontSize="none"
        textAnchor="none"
        style={{ mixBlendMode: 'normal' }}
      >
        <g transform="scale(5.33333,5.33333)">
          <path
            d="M24,4c-11.046,0 -20,8.954 -20,20c0,11.046 8.954,20 20,20c11.046,0 20,-8.954 20,-20c0,-11.046 -8.954,-20 -20,-20z"
            fill="url(#color-1)"
          />
          <path
            d="M26.707,29.301h5.176l0.813,-5.258h-5.989v-2.874c0,-2.184 0.714,-4.121 2.757,-4.121h3.283v-4.588c-0.577,-0.078 -1.797,-0.248 -4.102,-0.248c-4.814,0 -7.636,2.542 -7.636,8.334v3.498h-4.949v5.258h4.948v14.452c0.98,0.146 1.973,0.246 2.992,0.246c0.921,0 1.82,-0.084 2.707,-0.204z"
            fill="#ffffff"
          />
        </g>
      </g>
    </svg>
  );
}
