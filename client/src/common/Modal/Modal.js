import styles from './Modal.module.css';
import { ReactComponent as Cross } from '../../assets/images/crossIcon.svg';
import FocusTrap from 'focus-trap-react';

export const Modal = ({ addStyles, children, modal, setModal }) => {
  return (
    // modal && (
    // <FocusTrap>
    <div
      className={modal ? [styles.active, styles.container].join(' ') : styles.container}
      onClick={() => setModal(false)}
    >
      <div className={[styles.content, addStyles].join(' ')} onClick={(e) => e.stopPropagation()}>
        <div
          onClick={() => setModal(false)}
          style={{ cursor: 'pointer' }}
          className={styles.crossContainer}
        >
          <Cross className={styles.cross} />
        </div>
        {children}
      </div>
    </div>
    // </FocusTrap>
    // )
  );
};
