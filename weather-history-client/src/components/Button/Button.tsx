import React from 'react';

import styles from "./Button.module.scss";

interface PropTypes {
    buttonTitle: string;
    buttonBgColor: string;
    isDisabled: boolean;
    buttonType: "submit" | "reset" | "button" | undefined;
    handleClick?: () => void;
}

const Button = ({ buttonType, buttonTitle, buttonBgColor, isDisabled, handleClick } :PropTypes) => {
  return (
    <button 
        className={isDisabled ? `${styles.button_container} ${styles.button_container_disabled}` : styles.button_container}
        type={buttonType}
        onClick={handleClick}
        disabled={isDisabled}
        style={{ backgroundColor: buttonBgColor }}>
        {buttonTitle}
    </button>
  )
}

export default Button
