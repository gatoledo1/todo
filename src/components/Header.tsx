import React, { ReactNode } from "react";
import styles from "./Header.module.css";
import todoLogo from "../assets/todoLogo.svg";

interface Btn {
  children: ReactNode, 
}

export function Header({children}: Btn) {
  return (
    <header className={styles.header}>
      <img src={todoLogo} style={{marginTop: -8}} alt="WebSite Logo" />
      {children}
    </header>
  );
}
