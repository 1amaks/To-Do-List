import React from 'react';
import './footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
          <span className='foot-span'>&copy;Ayush Kumar Sahu, 2023</span>
          <span className='foot-span'><a className='foot-link' href="mailto:mail.ayushksahu@gmail.com">mail.ayushksahu@gmail.com</a></span>
          <span className='foot-span'><a className='foot-link' href="tel:+91 6372626662">+91 6372 626662</a></span>
      </div>
    </footer>
  );
}

export default Footer;