import React, { useState, useEffect } from "react";
import Topbar from "../../components/topbar/Topbar";
import styles from "./SignageManager.module.css";
import MovieRegistrationForm from "../../components/movieRegistrationForm/MovieRegistrationForm";
import SignageListItem from "../../components/signageListItem/SignageListItem";
import useSWR from "swr";
import { Dialog, Modal } from "@mui/material";
import MovieList from "../movieList/movieList";
import SignageDetailsDialog from "../../components/signageDetailsDialog/SignageDetailsDialog";
import { createApiUrl, SOCKET_URL } from "../../config/api";
import { io } from "socket.io-client";

function SignageManager() {
  const [selectedSignage, setSelectedSignage] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [managerSocket, setManagerSocket] = useState(null);

  // 管理画面用のSocket.IO接続を設定
  useEffect(() => {
    const socket = io({
      // 再接続設定
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      maxReconnectionAttempts: Infinity,
      // タイムアウト設定
      timeout: 20000,
      // Ping設定（接続維持）
      pingTimeout: 60000,
      pingInterval: 25000,
      // 接続を強制的に維持
      forceNew: false,
      transports: ["websocket", "polling"],
    });
    setManagerSocket(socket);

    // グローバルに設定（SignageDetailsDialogから使用するため）
    window.signageSocket = socket;

    socket.on("connect", () => {
      console.log("管理画面がSocket.IOに接続しました:", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("管理画面がSocket.IOから切断されました");
    });

    return () => {
      socket.disconnect();
      if (window.signageSocket === socket) {
        window.signageSocket = null;
      }
    };
  }, []);

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
    createApiUrl("/api/signages"),
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
