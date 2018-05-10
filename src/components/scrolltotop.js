import React from 'react';
import ScrollUp from 'react-scroll-up';

const ScrollToTopStyle = {
  "position": "fixed",
  "bottom": "50px",
  "right": "30px",
  "cursor": "pointer",
  "transition": "opacity 0.2s linear 0s, visibility",
  "opacity": "1",
  "visibility": "visible",
  "zIndex": "999"
}
const ScrollToTop = () => (
  <ScrollUp showUnder={160} style={ScrollToTopStyle}>
    <div className="scroll-up">
      <i className="fa-chevron-up fa"></i>
    </div>
  </ScrollUp>
)
export default ScrollToTop;
