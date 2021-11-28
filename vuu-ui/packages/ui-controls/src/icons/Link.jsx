import React from 'react';
import SvgIcon, { neverRerender } from './svg-icon';

const svgLink = `
<path d="M15.85,2.15a3.588,3.588,0,0,0-5.074,0c-.1925.193-2.132,2.111-2.6755,2.6545A4.15349,4.15349,0,0,1,9.972,5.108c.2595-.26,1.784-1.763,1.8915-1.8705a2.05061,2.05061,0,1,1,2.9,2.9L11.204,9.695a2.30853,2.30853,0,0,1-1.686.65,1.97648,1.97648,0,0,1-1.35-.5545,2.07708,2.07708,0,0,1-.6205-.813,1.03342,1.03342,0,0,0-.214.159l-.8175.856a3.57187,3.57187,0,0,0,.613.8365,3.92429,3.92429,0,0,0,5.3385-.219L15.85,7.226a3.587,3.587,0,0,0,.00322-5.07278Z" />
<path d="M7.963,12.912c-.26.26-1.75,1.7735-1.8565,1.881a2.05061,2.05061,0,0,1-2.9-2.9L6.8,8.3a2.29,2.29,0,0,1,1.683-.646,2.1,2.1,0,0,1,1.892,1.391,1.03342,1.03342,0,0,0,.214-.159l.867-.8605a3.58269,3.58269,0,0,0-.613-.8365,3.6555,3.6555,0,0,0-5.13.024L2.1195,10.806a3.588,3.588,0,1,0,5.074,5.0745c.193-.193,2.097-2.1215,2.6405-2.665A4.15006,4.15006,0,0,1,7.963,12.912Z" />
`;

export const Link = React.memo(() => <SvgIcon svgPath={svgLink} />, neverRerender);
Link.displayName = 'Link';
