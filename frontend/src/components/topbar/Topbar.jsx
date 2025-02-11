import React from "react";
import styles from "./Topbar.module.css";
import DehazeIcon from "@mui/icons-material/Dehaze";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useUserData } from "../../hooks/useUserData";
import { ProgressBar, ThreeDots } from "react-loader-spinner";

/**
 * This is the Topbar component for the Theater Signage System.
 * It displays the menu, logo, and user information.
 *
 * @returns {React.ReactElement} - The Topbar component with menu, logo, and user information.
 */
export default function Topbar() {
  const { userData, isLoading, isError, mutate } = useUserData();

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
          {/* <AccountCircleIcon className={styles.userIcon} /> */}
          {userData ? (
            <div className={styles.userName}>
              <div className={styles.userNameLabel}>{userData.name}</div>
              <div className={styles.logoutLabel}>ログアウト</div>
            </div>
          ) : isLoading ? (
            <ThreeDots
              type="Puff"
              color="#111111"
              height={50}
              width={50}
            />
          ) : (
            <div>ログイン</div>
          )}
        </div>
      </div>
    </div>
  );
}
