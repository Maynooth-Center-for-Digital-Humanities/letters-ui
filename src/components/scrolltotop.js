import React from 'react';
import ScrollUp from 'react-scroll-up';

const ScrollToTop = () => (
  <ScrollUp showUnder={160}>
    <div className="scroll-up">
      <i className="fa-chevron-up fa"></i>
    </div>
  </ScrollUp>
)
export default ScrollToTop;
