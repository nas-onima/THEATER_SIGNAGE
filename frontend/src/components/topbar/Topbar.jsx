import React from "react";
import styles from "./Topbar.module.css";
import DehazeIcon from "@mui/icons-material/Dehaze";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

/**
 * This is the Topbar component for the Theater Signage System.
 * It displays the menu, logo, and user information.
 *
 * @returns {React.ReactElement} - The Topbar component with menu, logo, and user information.
 */
export default function Topbar() {
  return (
    <div className={styles.mainContainer}>
      <div className={styles.menu}>
        <div className={styles.menuButton}>
          <DehazeIcon className={styles.menuIcon} />
        </div>
      </div>
      <div className={styles.logo}>Theater Signage System for NGGC</div>
      <div className={styles.user}>
        <div className={styles.userButton}>
          {/* <div className={styles.userLabel}>LOGIN</div> */}
          <AccountCircleIcon className={styles.userIcon} />
        </div>
      </div>

    </div>
  );
}

