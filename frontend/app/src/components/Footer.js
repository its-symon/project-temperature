import React from 'react';
import '../components/style.css';

const Footer = () => {
    return (
        <footer style={styles.footer}>
            <p style={styles.text}>© {new Date().getFullYear()} Symon Barua</p>
            <div style={styles.icons}>
                <a href="https://linkedin.com/in/SymonBarua" target="_blank" rel="noopener noreferrer" style={styles.link}>
                    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linkedin/linkedin-original.svg" alt="LinkedIn" style={styles.icon} />
                </a>
                <a href="https://github.com/its-symon" target="_blank" rel="noopener noreferrer" style={styles.link}>
                    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" alt="GitHub" style={styles.icon} />
                </a>
            </div>
        </footer>
    );
};

const styles = {
    footer: {
        backgroundColor: '#f5f5f5',
        padding: '1rem',
        textAlign: 'center',
        borderTop: '1px solid #ddd',
        marginTop: 'auto',
    },
    text: {
        margin: 0,
        fontSize: '0.9rem',
    },
    icons: {
        marginTop: '0.5rem',
    },
    icon: {
        width: '24px',
        height: '24px',
        margin: '0 0.5rem',
        verticalAlign: 'middle',
    },
    link: {
        textDecoration: 'none',
    }
};

export default Footer;
