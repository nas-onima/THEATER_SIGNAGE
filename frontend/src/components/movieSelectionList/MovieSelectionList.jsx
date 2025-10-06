import React, { useState, useEffect, useMemo } from "react";
import styles from "./MovieSelectionList.module.css";
import useSWR from "swr";
import { getIdTokenForSWR } from "../../hooks/useUserData";
import { createApiUrl } from "../../config/api";

const fetcher = async (url) => {
  const token = await getIdTokenForSWR();
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    throw new Error(`API ERROR: ${res.statusText}`);
  }
  return res.json();
};

export default function MovieSelectionList({ onMovieSelect, selectedMovieId }) {
  const [searchInput, setSearchInput] = useState(""); // 入力値
  const [searchQuery, setSearchQuery] = useState(""); // 実際の検索クエリ
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("releaseDate-1"); // title, title-1, releaseDate, releaseDate-1
  const [showOnlyAvailable, setShowOnlyAvailable] = useState(true); // notended フィルター
  const pageSize = 20; // ページサイズを大きめに設定

  // API URL の構築
  const apiUrl = useMemo(() => {
    const params = new URLSearchParams({
      page: currentPage.toString(),
      limit: pageSize.toString(),
      sortby: sortBy,
      search: encodeURIComponent(searchQuery), // 特殊文字をエンコード
    });

    if (showOnlyAvailable) {
      params.append("notended", "1");
    }

    return createApiUrl(`/api/movies?${params.toString()}`);
  }, [currentPage, sortBy, searchQuery, showOnlyAvailable, pageSize]);

  const { data, error, isLoading } = useSWR(apiUrl, fetcher);

  // 検索クエリが変更されたときはページを1に戻す
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, sortBy, showOnlyAvailable]);

  const handleSearchInputChange = (e) => {
    setSearchInput(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchQuery(searchInput.trim());
    setCurrentPage(1); // 検索実行時はページを1に戻す
  };

  const handleSearchClear = () => {
    setSearchInput("");
    setSearchQuery("");
    setCurrentPage(1);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const handleFilterChange = (e) => {
    setShowOnlyAvailable(e.target.checked);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  if (error) {
    return <div className={styles.error}>映画データの取得に失敗しました</div>;
  }

  if (isLoading) {
    return <div className={styles.loading}>読み込み中...</div>;
  }

  const movies = data?.movies || [];
  const totalPages = Math.ceil((data?.total || 0) / pageSize);

  return (
    <div className={styles.movieSelectionList}>
      {/* 検索・フィルター・ソートコントロール */}
      <div className={styles.controlsContainer}>
        <div className={styles.searchContainer}>
          <form onSubmit={handleSearchSubmit} className={styles.searchForm}>
            <input
              type="text"
              placeholder="映画タイトルで検索..."
              value={searchInput}
              onChange={handleSearchInputChange}
              className={styles.searchInput}
            />
            <button
              type="submit"
              className={styles.searchButton}
              disabled={isLoading}
            >
              検索
            </button>
            {searchQuery && (
              <button
                type="button"
                onClick={handleSearchClear}
                className={styles.clearButton}
                disabled={isLoading}
              >
                クリア
              </button>
            )}
          </form>
        </div>

        <div className={styles.filtersContainer}>
          <div className={styles.filterGroup}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={showOnlyAvailable}
                onChange={handleFilterChange}
                className={styles.checkbox}
              />
              上映可能な映画のみ表示
            </label>
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.selectLabel}>
              並び順:
              <select
                value={sortBy}
                onChange={handleSortChange}
                className={styles.sortSelect}
              >
                <option value="title">タイトル (昇順)</option>
                <option value="title-1">タイトル (降順)</option>
                <option value="releaseDate">公開日 (古い順)</option>
                <option value="releaseDate-1">公開日 (新しい順)</option>
              </select>
            </label>
          </div>
        </div>
      </div>

      {/* 結果表示 */}
      <div className={styles.resultsInfo}>
        {data && (
          <div>
            {searchQuery && (
              <div className={styles.searchInfo}>検索: "{searchQuery}"</div>
            )}
            <span>
              {data.total}件中 {(currentPage - 1) * pageSize + 1}-
              {Math.min(currentPage * pageSize, data.total)}件を表示
            </span>
          </div>
        )}
      </div>

      {/* 映画リスト */}
      <div className={styles.movieList}>
        {movies.length === 0 ? (
          <div className={styles.noResults}>該当する映画が見つかりません</div>
        ) : (
          movies.map((movie) => (
            <div
              key={movie._id}
              className={`${styles.movieItem} ${
                selectedMovieId === movie._id ? styles.selected : ""
              }`}
              onClick={() => onMovieSelect(movie)}
            >
              <div className={styles.moviePoster}>
                {movie.image ? (
                  <img
                    src={`data:image/png;base64,${movie.image}`}
                    alt={movie.title + "のポスター画像"}
                    className={styles.posterImage}
                  />
                ) : (
                  <div className={styles.noImage}>NO IMAGE</div>
                )}
              </div>

              <div className={styles.movieInfo}>
                <div className={styles.movieTitle}>
                  {movie.rating && (
                    <span className={styles.rating}>【{movie.rating}】</span>
                  )}
                  {movie.title}
                </div>
                <div className={styles.movieDetails}>
                  {movie.duration && (
                    <span className={styles.detail}>
                      上映時間: {movie.duration}分
                    </span>
                  )}
                  {movie.genre && (
                    <span className={styles.detail}>
                      ジャンル: {movie.genre}
                    </span>
                  )}
                  {movie.releaseDate && (
                    <span className={styles.detail}>
                      公開日:{" "}
                      {new Date(movie.releaseDate).toLocaleDateString("ja-JP")}
                    </span>
                  )}
                  {movie.endDate && (
                    <span className={styles.detail}>
                      終了日:{" "}
                      {new Date(movie.endDate).toLocaleDateString("ja-JP")}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ページネーション */}
      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={styles.paginationButton}
          >
            前へ
          </button>

          <div className={styles.pageNumbers}>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }

              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`${styles.pageNumber} ${
                    currentPage === pageNum ? styles.currentPage : ""
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={styles.paginationButton}
          >
            次へ
          </button>

          <span className={styles.pageInfo}>
            {currentPage} / {totalPages} ページ
          </span>
        </div>
      )}
    </div>
  );
}
