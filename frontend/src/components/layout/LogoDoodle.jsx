import React from 'react';

const LogoDoodle = ({ text = 'BajetKita', fontSize = '2rem' }) => {
  return (
    <div style={{ width: '100%', height: '40px', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'flex-start', overflow: 'hidden', marginLeft: '-36px' }}>
      <css-doodle click-to-update>
        {`
          :doodle {
            @grid: 5x1 / 100% 100%;
          }
          @content: ${text};
          @place: center left;
          @size: 100% 0;
          color: @pn(var(--logo-c1), var(--logo-c2), var(--logo-c3), var(--logo-c4), var(--logo-c5));
          z-index: @I(-@i);
          font-weight: 800;
          font-size: ${fontSize};
          font-family: system-ui, -apple-system, sans-serif;
          line-height: 0;
          text-shadow: 
            -1.5px -1.5px 0 var(--logo-stroke),
            1.5px -1.5px 0 var(--logo-stroke),
            -1.5px 1.5px 0 var(--logo-stroke),
            1.5px 1.5px 0 var(--logo-stroke);
          transition: @i(*.05s);
          scale: calc(1 - .02 * @i);
          rotate: calc(2deg * @dx(-2));
          translate: calc(2px * @dx(-2)) calc(3px * @dx(-2));
        `}
      </css-doodle>
    </div>
  );
};

export default LogoDoodle;
