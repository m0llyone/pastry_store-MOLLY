import styles from './Footer.module.css';
import logo from '../../assets/images/logoGrann.svg';
import { ReactComponent as Instagram } from '../../assets/images/instagram.svg';
import { ReactComponent as Telegram } from '../../assets/images/telegram.svg';
import { ReactComponent as Linkedin } from '../../assets/images/linkedin.svg';
import { Link } from 'react-router-dom';
import { memo } from 'react';
import { SOCIAL_MEDIA } from '../../data/constants';

const CONTACTS = [
  { text: 'г. Минск, ул.Партизанская 1А' },
  { text: 'Email: naydenovich@gmail.com' },
  { text: 'Тел: +375-(29)-666-66-66' },
];

const LINKS = [
  { to: '/privacy-policy', text: 'Политика конфиденциальности' },
  { to: '#', text: 'Договор оферты' },
];

const ICONS = [
  { component: Instagram, to: SOCIAL_MEDIA.INSTAGRAM, className: styles.inst },
  { component: Telegram, to: SOCIAL_MEDIA.TELEGRAM, className: styles.tg },
  { component: Linkedin, to: SOCIAL_MEDIA.LINKEDIN, className: styles.linkedin },
];

let Footer = () => {
  return (
    <footer className={styles.background}>
      <div className={styles.container}>
        <div className={styles.contacts}>
          {CONTACTS.map((contact, index) => (
            <span key={index}>{contact.text}</span>
          ))}
        </div>
        <div>
          <img className={styles.logo} width={'255px'} src={logo} alt="logo" />
        </div>
        <div className={styles.politic}>
          <div className={styles.iconsContainer}>
            {ICONS.map(({ component: Icon, to, className }, index) => (
              <Link key={index} to={to}>
                <Icon className={className} fill="#F5F7F8" width="34px" height="34px" />
              </Link>
            ))}
          </div>
          <div style={{ height: '64px' }} className={styles.contacts}>
            {LINKS.map((link, index) => (
              <Link key={index} className={styles.link} to={link.to}>
                {link.text}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer = memo(Footer);
