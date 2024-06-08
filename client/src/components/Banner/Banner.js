import styles from './Banner.module.css';
import bisquit from '../../assets/images/bisquitHeader.png';
import { Button } from '../../common/Button/Button';
import { ReactComponent as Telegram } from '../../assets/images/telegram.svg';
import { ReactComponent as Instagram } from '../../assets/images/instagram.svg';
import { ReactComponent as Github } from '../../assets/images/github.svg';
import { Link, useNavigate } from 'react-router-dom';
import { SOCIAL_MEDIA } from '../../data/constants';

const ICONS = [
  { Component: Telegram, className: styles.tg, link: SOCIAL_MEDIA.TELEGRAM },
  { Component: Github, className: styles.github, link: SOCIAL_MEDIA.GITHUB },
  { Component: Instagram, className: styles.inst, link: SOCIAL_MEDIA.INSTAGRAM },
];

export const Banner = () => {
  const navigate = useNavigate();
  return (
    <section className={styles.banner}>
      <div className={styles.mainPicture}>
        <img className={styles.bisquitImg} src={bisquit} alt="bisquit" />
      </div>
      <div className={styles.bannerContainer}>
        <div className={styles.titleContainer}>
          <h1 className={styles.title}>MOLLY</h1>
          <p className={styles.underTitle}>Авторский десерт</p>
        </div>
        <Button onClick={() => navigate('/catalog/all')} addStyles={styles.button}>
          К каталогу
        </Button>
        <div className={styles.socialMedia}>
          {ICONS.map((item, index) => (
            <Link key={index} to={item.link}>
              <item.Component className={item.className} fill="#705A66" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
