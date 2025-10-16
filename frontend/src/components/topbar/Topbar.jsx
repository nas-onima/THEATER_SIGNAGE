import React from "react";
import styles from "./Topbar.module.css";
import DehazeIcon from "@mui/icons-material/Dehaze";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useUserData } from "../../hooks/useUserData";
import { ThreeDots } from "react-loader-spinner";
import { getAuth, signOut } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";

/**
 * This is the Topbar component for the Theater Signage System.
 * It displays the menu, logo, and user information.
 *
 * @returns {React.ReactElement} - The Topbar component with menu, logo, and user information.
 */
export default function Topbar() {
  const { userData, isLoading, isError, mutate } = useUserData();
  const nav = useNavigate();

  const handleLogout = async () => {
    try {
      const auth = getAuth();
      await signOut(auth);
      nav("/login");
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleLogin = () => {
    nav("/login");
  };

  return (
    <div className={styles.mainContainer}>
      <div className={styles.menu}>
        <div className={styles.menuButton}>
          <DehazeIcon className={styles.menuIcon} />
        </div>
      </div>
      <Link to="/home" className={styles.menuLink}>
        <div className={styles.logo}>Theater Signage System for NGGC</div>
      </Link>
      <div className={styles.user}>
        <div
          className={styles.userButton}
          onClick={!userData ? handleLogin : handleLogout}
        >
          {/* <div className={styles.userLabel}>LOGIN</div> */}
          {/* <AccountCircleIcon className={styles.userIcon} /> */}
          {userData ? (
            <div className={styles.userName}>
              <div className={styles.userNameLabel}>{userData.name}</div>
              <div className={styles.logoutLabel}>ログアウト</div>
            </div>
          ) : isLoading ? (
            <ThreeDots type="Puff" color="#111111" height={50} width={50} />
          ) : (
            <div>ログイン</div>
          )}
        </div>
      </div>
    </div>
  );
}
