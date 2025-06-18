import React from 'react';
import '../App.css';

const Footer = () => {
    return (
        <footer className="footer">
            <p className="footer-text">© {new Date().getFullYear()} Symon Barua</p>
            <div className="footer-icons">
                <a href="https://linkedin.com/in/SymonBarua" target="_blank" rel="noopener noreferrer" className="footer-link">
                    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linkedin/linkedin-original.svg" alt="LinkedIn" className="footer-icon" />
                </a>
                <a href="https://github.com/its-symon" target="_blank" rel="noopener noreferrer" className="footer-link">
                    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" alt="GitHub" className="footer-icon" />
                </a>
            </div>
        </footer>
    );
};

export default Footer;
