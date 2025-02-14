import React, { useState } from "react";
import styles from "./movieList.module.css";
import Topbar from "../../components/topbar/Topbar";
import useSWR, { mutate } from "swr";
import Movie from "../../components/movie/Movie";
import { getIdTokenForSWR } from "../../hooks/useUserData";

export default function Movies() {
  const [page, setPage] = useState(1);
  const [pageLimit, setPageLimit] = useState(10);

  const handlePageLimitChange = (e) => {
    setPageLimit(Number(e.target.value));
    mutate();
  };

  const handlePageChange = (e) => {
    setPage(Number(e.target.firstChild?.nodeValue));
    mutate();
  };

  const handleLeftArrowClick = () => {
    if (page !== 1) {
      setPage(page - 1);
      mutate();
    }
  };

  const handleRightArrowClick = () => {
    var total = 0;
    if (data?.total !== undefined) {
      total = data.total;
    }
    if (page != Math.floor(total / pageLimit) + 1) {
      setPage(page + 1);
      mutate();
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
    const token = await getIdTokenForSWR();
    const res = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(`API ERROR: ${res.statusText}`);
    }

    return res.json();
  };

  const { data, error, isLoading, mutate } = useSWR(
    `http://localhost:5000/api/movies?page=${page}&limit=${pageLimit}`,
    fetchMovies
  );

  return (
    <>
      <Topbar />
      <div className={styles.movieListWrapper}>
        <div className={styles.limitSelector}>
          表示数:
          <select value={pageLimit} onChange={handlePageLimitChange}>
            <option key={10} value={10}>
              10
            </option>
            <option key={20} value={20}>
              20
            </option>
            <option key={50} value={50}>
              50
            </option>
            <option key={100} value={100}>
              100
            </option>
          </select>
        </div>
        {data?.movies.map((movie) => (
          <Movie movie={movie} key={movie._id} className={styles.movie}/>
        ))}
        {data?.movies.length === 0 ? (
          <h2 style={{ textAlign: "center" }}>
            映画データが登録されていません
          </h2>
        ) : null}
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
            <option key={10} value={10}>
              10
            </option>
            <option key={20} value={20}>
              20
            </option>
            <option key={50} value={50}>
              50
            </option>
            <option key={100} value={100}>
              100
            </option>
          </select>
        </div>
      </div>
    </>
  );
}
