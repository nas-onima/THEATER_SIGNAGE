import React, { useState, useEffect } from "react";
import styles from "./movieList.module.css";
import Topbar from "../../components/topbar/Topbar";
import useSWR from "swr";
import MovieListItem from "../../components/movie/MovieListItem";
import MovieRegistrationForm from "../../components/movieRegistrationForm/MovieRegistrationForm";
import MovieDetailsDialog from "../../components/movieDetailsDialog/MovieDetailsDialog"; // ダイアログコンポーネントをインポート
import Dialog from "@mui/material/Dialog"; // MUIのDialogコンポーネントをインポート

export default function MovieList({ movieListMode = "management" }) {
  const [page, setPage] = useState(1);
  const [pageLimit, setPageLimit] = useState(10);
  const [displayMode, setDisplayMode] = useState("list");
  const [sortBy, setSortBy] = useState("releaseDate-1");
  const [onlyNotEnded, setOnlyNotEnded] = useState(0);
  const [searchQuery, setSearchQuery] = useState(""); // 検索クエリの状態を追加
  const [searchInput, setSearchInput] = useState(""); // 検索入力の状態を追加
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // ページ読み込み時にローカルストレージから設定項目を読み込む
  useEffect(() => {
    const savedPageLimit = localStorage.getItem("pageLimit");
    const savedDisplayMode = localStorage.getItem("displayMode");
    const savedSortBy = localStorage.getItem("sortBy");
    const savedOnlyNotEnded = localStorage.getItem("onlyNotEnded");

    if (savedPageLimit) setPageLimit(Number(savedPageLimit));
    if (savedDisplayMode) setDisplayMode(savedDisplayMode);
    if (savedSortBy) setSortBy(savedSortBy);
    if (savedOnlyNotEnded) setOnlyNotEnded(Number(savedOnlyNotEnded));
  }, []);

  const handleMovieClick = (movie) => {
    setSelectedMovie(movie);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setSelectedMovie(null);
  };

  const handleDisplayModeChange = (e) => {
    const value = e.target.value;
    setDisplayMode(value);
    localStorage.setItem("displayMode", value); // ローカルストレージに保存
    setPageLimit(value === "list" ? 10 : 9);
    setPage(1);
  };

  const handlePageLimitChange = (e) => {
    const value = Number(e.target.value);
    setPageLimit(value);
    localStorage.setItem("pageLimit", value); // ローカルストレージに保存
    setPage(1);
  };

  const handleSortByChange = (e) => {
    const value = e.target.value;
    setSortBy(value);
    localStorage.setItem("sortBy", value); // ローカルストレージに保存
  };

  const handleOnlyNotEndedChange = (e) => {
    const value = Number(e.target.value);
    setOnlyNotEnded(value);
    localStorage.setItem("onlyNotEnded", value); // ローカルストレージに保存
  };

  const handleSearchInputChange = (e) => {
    setSearchInput(e.target.value);
  };

  const handleSearch = () => {
    setSearchQuery(searchInput);
  };

  const handlePageChange = (e) => {
    setPage(Number(e.target.firstChild?.nodeValue));
  };

  const handleLeftArrowClick = () => {
    if (page !== 1) {
      setPage(page - 1);
    }
  };

  const handleRightArrowClick = () => {
    var total = 0;
    if (data?.total !== undefined) {
      total = data.total;
    }
    if (page != Math.floor(total / pageLimit) + 1) {
      setPage(page + 1);
    }
  };

  const generatePageSelector = () => {
    var total = 0;
    if (data?.total !== undefined) {
      total = data.total;
    }
    const totalPages = Math.floor(total / pageLimit) + 1;
    const visiblePages = [];

    if (totalPages <= 10) {
      for (let i = 1; i <= totalPages; i++) {
        visiblePages.push(i);
      }
    } else if (page <= 4) {
      // 現在のページ位置が先頭に近い時
      for (let i = 1; i <= 6; i++) {
        visiblePages.push(i);
      }
      visiblePages.push(totalPages - 1, totalPages);
    } else if (page >= totalPages - 3) {
      // 現在のページ位置が末尾に近い時
      visiblePages.push(1, 2);
      for (let i = totalPages - 5; i <= totalPages; i++) {
        visiblePages.push(i);
      }
    } else {
      // In between start and end
      visiblePages.push(
        1,
        2,
        page - 2,
        page - 1,
        page,
        page + 1,
        page + 2,
        totalPages - 1,
        totalPages
      );
    }

    return (
      <div className={styles.pageSelector}>
        {visiblePages.map((pagesValue, index) => {
          if (index > 0 && visiblePages[index] - visiblePages[index - 1] > 1) {
            return (
              <React.Fragment key={"ellipsis" + index}>
                <div className={styles.pageEllipsis}>ー</div>
                <div
                  className={styles.pageNumber}
                  onClick={handlePageChange}
                  key={pagesValue}
                  style={
                    page === pagesValue ? { backgroundColor: "#a9c9c3" } : {}
                  }
                >
                  {pagesValue}
                </div>
              </React.Fragment>
            );
          }
          return (
            <div
              className={styles.pageNumber}
              onClick={handlePageChange}
              key={pagesValue}
              style={page === pagesValue ? { backgroundColor: "#a9c9c3" } : {}}
            >
              {pagesValue}
            </div>
          );
        })}
      </div>
    );
  };

  const fetchMovies = async (url) => {
    //const token = await getIdTokenForSWR();
    const res = await fetch(url, {
      method: "GET",
      headers: {
        //Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(`API ERROR: ${res.statusText}`);
    }

    return res.json();
  };

  const { data, error, isLoading, mutate } = useSWR(
    `http://localhost:5000/api/movies?page=${page}&limit=${pageLimit}&sortby=${sortBy}&notended=${onlyNotEnded}&search=${searchQuery}`,
    fetchMovies
  );

  if (movieListMode === "management") {
    return (
      <>
        <Topbar />
        <div className={styles.movieListWrapper}>
          <h1 className={styles.pageTitle}>作品管理</h1>
          <MovieRegistrationForm />
          <h3>画面表示設定</h3>
          <div className={styles.listSettings}>
            <div className={styles.listSettingsItem}>
              表示数:
              <select value={pageLimit} onChange={handlePageLimitChange}>
                {displayMode === "list" ? (
                  <>
                    <option key={1} value={10}>
                      10
                    </option>
                    <option key={2} value={20}>
                      20
                    </option>
                    <option key={3} value={50}>
                      50
                    </option>
                    <option key={4} value={100}>
                      100
                    </option>
                  </>
                ) : (
                  <>
                    <option key={1} value={9}>
                      9
                    </option>
                    <option key={2} value={18}>
                      18
                    </option>
                    <option key={3} value={45}>
                      45
                    </option>
                    <option key={4} value={99}>
                      99
                    </option>
                  </>
                )}
              </select>
            </div>
            <div className={styles.listSettingsItem}>
              表示モード:
              <select value={displayMode} onChange={handleDisplayModeChange}>
                <option key={1} value={"list"}>
                  リスト
                </option>
                <option key={2} value={"poster"}>
                  ポスター
                </option>
              </select>
            </div>
            <div className={styles.listSettingsItem}>
              表示順:
              <select value={sortBy} onChange={handleSortByChange}>
                <option key={1} value={"releaseDate-1"}>
                  公開日（降順）
                </option>
                <option key={2} value={"releaseDate"}>
                  公開日（昇順）
                </option>
                <option key={3} value={"title-1"}>
                  タイトル（降順）
                </option>
                <option key={4} value={"title"}>
                  タイトル（昇順）
                </option>
              </select>
            </div>
            <div className={styles.listSettingsItem}>
              上映終了作品:
              <select value={onlyNotEnded} onChange={handleOnlyNotEndedChange}>
                <option key={1} value={0}>
                  表示する
                </option>
                <option key={2} value={1}>
                  表示しない
                </option>
              </select>
            </div>
            <div className={styles.searchArea}>
              検索:
              <input
                type="text"
                value={searchInput}
                onChange={handleSearchInputChange}
                placeholder="タイトルで検索"
              />
              <button onClick={handleSearch} className={styles.searchButton}>
                検索
              </button>
            </div>
          </div>
          <div className={styles.pageSelector}>
            <div className={styles.leftArrow} onClick={handleLeftArrowClick}>
              &#9664;
            </div>
            <div className={styles.pageSelectorNums}>
              {generatePageSelector()}
            </div>
            <div className={styles.rightArrow} onClick={handleRightArrowClick}>
              &#9654;
            </div>
          </div>
          <div
            className={styles.listItemArea}
            style={
              displayMode === "list"
                ? {
                    flexDirection: "column",
                  }
                : displayMode === "poster"
                ? {
                    flexDirection: "row",
                  }
                : {
                    display: "none",
                  }
            }
          >
            {data?.movies.map((movie) => (
              <MovieListItem
                movie={movie}
                displayMode={displayMode}
                key={movie._id}
                className={styles.movie}
                onMovieClick={handleMovieClick}
              />
            ))}
            {selectedMovie && (
              <Dialog
                open={isDialogOpen}
                onClose={closeDialog}
                fullWidth={true}
              >
                <MovieDetailsDialog
                  movie={selectedMovie}
                  onClose={closeDialog}
                  mutate={mutate}
                />
              </Dialog>
            )}
            {data?.movies.length === 0 ? (
              <h2 style={{ textAlign: "center" }}>
                映画データが登録されていません
              </h2>
            ) : data ? (
              <h3 style={{ textAlign: "center" }}>
                {data.movies.length + data.pageSize * (data.page - 1)}作品/
                {data.total}作品中
              </h3>
            ) : isLoading ? (
              <h2 style={{ textAlign: "center" }}>読み込み中・・・</h2>
            ) : (
              <h2 style={{ textAlign: "center" }}>
                映画データの取得に失敗しました
              </h2>
            )}
          </div>
          <div className={styles.pageSelector}>
            <div className={styles.leftArrow} onClick={handleLeftArrowClick}>
              &#9664;
            </div>
            <div className={styles.pageSelectorNums}>
              {generatePageSelector()}
            </div>
            <div className={styles.rightArrow} onClick={handleRightArrowClick}>
              &#9654;
            </div>
          </div>
          <div className={styles.limitSelector}>
            表示数:
            <select value={pageLimit} onChange={handlePageLimitChange}>
              {displayMode === "list" ? (
                <>
                  <option key={1} value={10}>
                    10
                  </option>
                  <option key={2} value={20}>
                    20
                  </option>
                  <option key={3} value={50}>
                    50
                  </option>
                  <option key={4} value={100}>
                    100
                  </option>
                </>
              ) : (
                <>
                  <option key={1} value={9}>
                    9
                  </option>
                  <option key={2} value={18}>
                    18
                  </option>
                  <option key={3} value={45}>
                    45
                  </option>
                  <option key={4} value={99}>
                    99
                  </option>
                </>
              )}
            </select>
          </div>
        </div>
      </>
    );
  } else if (movieListMode === "selection") {
    return (
      <div className={styles.movieListWrapper}>
        <h1 className={styles.pageTitle}>作品選択</h1>
        <h3>画面表示設定</h3>
        <div className={styles.listSettings}>
          <div className={styles.listSettingsItem}>
            表示数:
            <select value={pageLimit} onChange={handlePageLimitChange}>
              {displayMode === "list" ? (
                <>
                  <option key={1} value={10}>
                    10
                  </option>
                  <option key={2} value={20}>
                    20
                  </option>
                  <option key={3} value={50}>
                    50
                  </option>
                  <option key={4} value={100}>
                    100
                  </option>
                </>
              ) : (
                <>
                  <option key={1} value={9}>
                    9
                  </option>
                  <option key={2} value={18}>
                    18
                  </option>
                  <option key={3} value={45}>
                    45
                  </option>
                  <option key={4} value={99}>
                    99
                  </option>
                </>
              )}
            </select>
          </div>
          <div className={styles.listSettingsItem}>
            表示モード:
            <select value={displayMode} onChange={handleDisplayModeChange}>
              <option key={1} value={"list"}>
                リスト
              </option>
              <option key={2} value={"poster"}>
                ポスター
              </option>
            </select>
          </div>
          <div className={styles.listSettingsItem}>
            表示順:
            <select value={sortBy} onChange={handleSortByChange}>
              <option key={1} value={"releaseDate-1"}>
                公開日（降順）
              </option>
              <option key={2} value={"releaseDate"}>
                公開日（昇順）
              </option>
              <option key={3} value={"title-1"}>
                タイトル（降順）
              </option>
              <option key={4} value={"title"}>
                タイトル（昇順）
              </option>
            </select>
          </div>
          <div className={styles.listSettingsItem}>
            上映終了作品:
            <select value={onlyNotEnded} onChange={handleOnlyNotEndedChange}>
              <option key={1} value={0}>
                表示する
              </option>
              <option key={2} value={1}>
                表示しない
              </option>
            </select>
          </div>
          <div className={styles.searchArea}>
            検索:
            <input
              type="text"
              value={searchInput}
              onChange={handleSearchInputChange}
              placeholder="タイトルで検索"
            />
            <button onClick={handleSearch} className={styles.searchButton}>
              検索
            </button>
          </div>
        </div>
        <div className={styles.pageSelector}>
          <div className={styles.leftArrow} onClick={handleLeftArrowClick}>
            &#9664;
          </div>
          <div className={styles.pageSelectorNums}>
            {generatePageSelector()}
          </div>
          <div className={styles.rightArrow} onClick={handleRightArrowClick}>
            &#9654;
          </div>
        </div>
        <div
          className={styles.listItemArea}
          style={
            displayMode === "list"
              ? {
                  flexDirection: "column",
                }
              : displayMode === "poster"
              ? {
                  flexDirection: "row",
                }
              : {
                  display: "none",
                }
          }
        >
          {data?.movies.map((movie) => (
            <MovieListItem
              movie={movie}
              displayMode={displayMode}
              key={movie._id}
              className={styles.movie}
              onMovieClick={handleMovieClick}
            />
          ))}
          {selectedMovie && (
            <Dialog open={isDialogOpen} onClose={closeDialog} fullWidth={true}>
              <MovieDetailsDialog
                movie={selectedMovie}
                onClose={closeDialog}
                mutate={mutate}
              />
            </Dialog>
          )}
          {data?.movies.length === 0 ? (
            <h2 style={{ textAlign: "center" }}>
              映画データが登録されていません
            </h2>
          ) : data ? (
            <h3 style={{ textAlign: "center" }}>
              {data.movies.length + data.pageSize * (data.page - 1)}作品/
              {data.total}作品中
            </h3>
          ) : isLoading ? (
            <h2 style={{ textAlign: "center" }}>読み込み中・・・</h2>
          ) : (
            <h2 style={{ textAlign: "center" }}>
              映画データの取得に失敗しました
            </h2>
          )}
        </div>
        <div className={styles.pageSelector}>
          <div className={styles.leftArrow} onClick={handleLeftArrowClick}>
            &#9664;
          </div>
          <div className={styles.pageSelectorNums}>
            {generatePageSelector()}
          </div>
          <div className={styles.rightArrow} onClick={handleRightArrowClick}>
            &#9654;
          </div>
        </div>
        <div className={styles.limitSelector}>
          表示数:
          <select value={pageLimit} onChange={handlePageLimitChange}>
            {displayMode === "list" ? (
              <>
                <option key={1} value={10}>
                  10
                </option>
                <option key={2} value={20}>
                  20
                </option>
                <option key={3} value={50}>
                  50
                </option>
                <option key={4} value={100}>
                  100
                </option>
              </>
            ) : (
              <>
                <option key={1} value={9}>
                  9
                </option>
                <option key={2} value={18}>
                  18
                </option>
                <option key={3} value={45}>
                  45
                </option>
                <option key={4} value={99}>
                  99
                </option>
              </>
            )}
          </select>
        </div>
      </div>
    );
  }
}
