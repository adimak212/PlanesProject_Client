// InfiniteScroll_New.tsx
import { useEffect, useState, useRef, useCallback, RefCallback } from "react";
import axios, { CanceledError } from "axios";
import "../../css/infinityScroll.css";

/** -------- Types -------- */
export type Plane = {
  id: string;         // adjust to number if your backend returns a number
  name: string;
  year: number;
  country: string;
  img_url: string;
};

type GetAllResponse<T> = {
  items: T[];
  hasMore: boolean;
};

/** Example constant using Plane */
const plane: Plane = {
  id: "demo-id",
  name: "f-16",
  year: 2025,
  country: "israel",
  img_url: "no img",
};

function InfiniteScroll_New() {
  const [data, setData] = useState<Plane[]>([]);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const handleDelete = useCallback(
    async (event: React.MouseEvent<HTMLButtonElement>) => {
      try {
        const id = (event.currentTarget as HTMLButtonElement).accessKey;
        const res = await axios.delete("http://localhost:3000/api/deleteById", {
          params: { id },
        });

        // Mark the element as "toDel" if it exists
        const toDel = document.getElementById(id);
        console.log(res);
        toDel?.classList.add("toDel");
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.log(error.message);
        } else {
          console.log(error);
        }
      }
    },
    []
  );

  // fetch a page
  useEffect(() => {
    if (!hasMore) return; // stop if no more data
    setLoading(true);

    const controller = new AbortController();

    axios.get<GetAllResponse<Plane>>("http://localhost:3000/api/getAll", {
        params: { page: pageNumber }, // backend always gives 15
        signal: controller.signal,
      })
      .then(({ data: res }) => {
        console.log(res.items);
        setData((prev) => [...prev, ...res.items]);
        setHasMore(res.hasMore);
      })
      .catch((err: unknown) => {
        if (!(err instanceof CanceledError)) {
          console.error(err);
        }
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [pageNumber, hasMore]);

  // observer for last element
  const observer = useRef<IntersectionObserver | null>(null);

  const lastPlaneRef: RefCallback<HTMLElement> = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPageNumber((p) => p + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  return (
    <div>
      <section className="ia-list">
        {data.map((p, i) => {
          const isLast = i === data.length - 1;
          return (
            <article
              key={p.id ?? `${p.name}-${i}`}
              ref={isLast ? lastPlaneRef : null}
              id={p.id}
              className="ia-card"
            >
              <button
                className="button"
                accessKey={p.id}
                onClick={handleDelete}
              >
                delete
              </button>

              <div className="ia-meta">
                <div className="ia-field">
                  <span className="ia-label">Year :</span>
                  <span className="ia-value">{p.year}</span>
                </div>
                <div className="ia-field">
                  <span className="ia-label">Country :</span>
                  <span className="ia-value">{p.country}</span>
                </div>
              </div>

              <img src={`http://localhost:3000/uploads/${p.img_url}`} alt={p.name} />
              <h3 className="ia-name">{p.name}</h3>
            </article>
          );
        })}
      </section>

      <div style={{ textAlign: "center", padding: 12 }}>
        {loading && "Loading…"}
        {!hasMore && "— End of planes —"}
      </div>
    </div>
  );
}

export default InfiniteScroll_New;
