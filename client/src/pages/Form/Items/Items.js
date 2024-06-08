import styles from '../OrderForm.module.css';

export const Input = ({ id, name, type, value, onChange, label, addStyles, error, style }) => (
  <div>
    <div className={styles.inputGroup}>
      <input
        id={id}
        placeholder=" "
        className={addStyles ? [addStyles, styles.formInput].join(' ') : styles.formInput}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
      />
      <label className={styles.label} htmlFor={id}>
        {label}
      </label>
    </div>
    <span style={style} className={styles.error}>
      {error}
    </span>
  </div>
);

export const Radio = ({ id, name, value, checked, onChange, label, onClick }) => (
  <div className={styles.radio}>
    <input
      id={id}
      type="radio"
      name={name}
      value={value}
      checked={checked}
      onChange={onChange}
      onClick={onClick}
    />
    <span></span>
    <label className={styles.radioText} htmlFor={id}>
      {label}
    </label>
  </div>
);
