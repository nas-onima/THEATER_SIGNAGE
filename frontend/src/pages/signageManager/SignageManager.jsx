import React, { useState } from "react";
import Topbar from "../../components/topbar/Topbar";
import styles from "./SignageManager.module.css";
import MovieRegistrationForm from "../../components/movieRegistrationForm/MovieRegistrationForm";
import SignageListItem from "../../components/signageListItem/SignageListItem";
import useSWR from "swr";
import { Dialog, Modal } from "@mui/material";
import MovieList from "../movieList/movieList";
import SignageDetailsDialog from "../../components/signageDetailsDialog/SignageDetailsDialog";

function SignageManager() {
  const [selectedSignage, setSelectedSignage] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSignageClick = (signage) => {
    setSelectedSignage(signage);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setSelectedSignage(null);
  };

  const fetchSignages = async (url) => {
    const res = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) {
      throw new Error(`API ERROR: ${res.statusText}`);
    }
    return res.json();
  };

  const { data, error, isLoading, mutate, isValidating } = useSWR(
    `http://localhost:5000/api/signages`,
    fetchSignages
  );

  return (
    <>
      <Topbar />
      <div className={styles.signageManagerWrapper}>
        <h1 className={styles.pageTitle}>サイネージ制御 (集中管理)</h1>
        <div className={styles.signageList}>
          {data?.signages.map((signage) => (
            <SignageListItem
              signage={signage}
              key={signage.theaterId}
              onSignageClick={handleSignageClick}
            />
          ))}
          {selectedSignage && (
            <SignageDetailsDialog
              signage={selectedSignage}
              open={isDialogOpen}
              onClose={closeDialog}
              mutate={mutate}
            />
          )}
        </div>
      </div>
    </>
  );
}

export default SignageManager;
