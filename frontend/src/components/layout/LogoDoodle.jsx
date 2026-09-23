import React from 'react';

const LogoDoodle = ({ text = 'BajetKita', fontSize = '2rem', align = 'left', height = '40px', forceTheme }) => {
  const isCenter = align === 'center';
  
  let stroke = 'var(--logo-stroke)';
  let c1 = 'var(--logo-c1)';
  let c2 = 'var(--logo-c2)';
  let c3 = 'var(--logo-c3)';
  let c4 = 'var(--logo-c4)';
  let c5 = 'var(--logo-c5)';

  if (forceTheme === 'light') {
    stroke = '#ffffff';
    c1 = '#2f2f2f';
    c2 = '#5a5ca8';
    c3 = '#df5584';
    c4 = '#fe6842';
    c5 = '#feb944';
  } else if (forceTheme === 'dark') {
    stroke = '#2f2f2f';
    c1 = '#fff8ec';
    c2 = '#feb944';
    c3 = '#fe6842';
    c4 = '#df5584';
    c5 = '#5a5ca8';
  }

  return (
    <div style={{ width: '100%', height, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: isCenter ? 'center' : 'flex-start', overflow: 'visible', marginLeft: isCenter ? '0' : '-36px' }}>
      <css-doodle click-to-update>
        {`
          :doodle {
            @grid: 5x1 / 100% 100%;
          }
          @content: ${text};
          @place: ${isCenter ? 'center' : 'center left'};
          @size: 100% 0;
          color: @pn(${c1}, ${c2}, ${c3}, ${c4}, ${c5});
          z-index: @I(-@i);
          font-weight: 800;
          font-size: ${fontSize};
          font-family: system-ui, -apple-system, sans-serif;
          line-height: 0;
          text-shadow: 
            -1.5px -1.5px 0 ${stroke},
            1.5px -1.5px 0 ${stroke},
            -1.5px 1.5px 0 ${stroke},
            1.5px 1.5px 0 ${stroke};
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
