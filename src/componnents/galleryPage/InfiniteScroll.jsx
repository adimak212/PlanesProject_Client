import { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import "F:\\adi\\code\\HTML\\projects\\airplane_gallery\\airplane_gallery-client\\src\\css\\InfinityScroll.css";


function InfiniteScroll_New() {
  const [data, setData] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);



  const handleDelete = (event) => {
      try {
        const res = axios.delete("http://localhost:3000/deleteById" , {params : {id : event.target.accessKey}});
        let toDel = document.getElementById(event.target.accessKey);
        console.log(res);
        toDel.classList.add("toDel");
      } catch (error) {
        console.log(error.message);
      }
  }

  // fetch a page
  useEffect(() => {
    if (!hasMore) return;             // <-- stop if no more data

    setLoading(true);
    const controller = new AbortController();

    axios.get("http://localhost:3000/getAll", {
      params: { page: pageNumber },   // backend always gives 15
      signal: controller.signal,
    })
    .then(({ data: res }) => {
      setData(prev => [...prev, ...res.items]);
      setHasMore(res.hasMore);
    })
    .catch(err => {
      if (err.name !== "CanceledError") console.error(err);
    })
    .finally(() => setLoading(false));

    return () => controller.abort();
  }, [pageNumber]);

  // observer for last element
  const observer = useRef(null);
  const lastPlaneRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPageNumber(p => p + 1);
      }
    });

    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  return (
    <div>
      <section className="ia-list">
        {data.map((p, i) => {
          const isLast = i === data.length - 1;
          return (
              <article
                key={p.id ?? `${p.name}-${i}`}
                ref={isLast ? lastPlaneRef : null}
                id = {p.id}
                className="ia-card"
              >
                <button className ="button" accessKey = { p.id } onClick = { handleDelete }>delete</button>
                <div className="ia-meta">
                  <div className="ia-field"><span className="ia-label">Year :</span><span className="ia-value">{p.year}</span></div>
                  <div className="ia-field"><span className="ia-label">Country :</span><span className="ia-value">{p.country}</span></div>
                </div>
                <img src={p.img_url} alt={p.img_url}/>
                <h3 className="ia-name">{p.name}</h3>
              </article>
          );
        })}
      </section>

      <div style={{ textAlign:"center", padding:12 }}>
        {loading && "Loading…"}
        {!hasMore && "— End of planes —"}  {/* stop message */}
      </div>
    </div>
  );
}
export default InfiniteScroll_New;
