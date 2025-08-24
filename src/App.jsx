import { Suspense } from "react";
import { Link, NavLink, Route, Routes, useNavigate } from "react-router-dom";
import "../src/css/index.css"
import AircraftTimeline from "../src/pages/galleryPage"
import AddAircraftForm from "../src/pages/InsertPage"


function Layout({ children }) {
  return (
    <div>
      <header className="center">
        <nav style={styles.nav}>
          <NavLink to="/gallery" className={({isActive}) => isActive ? "active link" : "link"}>
            Gallery
          </NavLink>
          {<NavLink to="/add" className={({isActive}) => isActive ? "active link" : "link"}>
             Add Airplane
          </NavLink>}
        </nav>
      </header>
      <main style={styles.main}>{children}</main>
    </div>
  );
}

// עמוד הטופס – אחרי שמירה נווט לגלריה
function AddAircraftPage() {
  const navigate = useNavigate();
  return (
    <div style={{ maxWidth: 900, margin: "0 auto" }}>
      <AddAircraftForm onSaved={() => navigate("/gallery")} actionUrl="http://localhost:5173/api/aircraft"/>
    </div>
  );
}

function GalleryPage() {
  return <AircraftTimeline pageSize={8} endpoint="http://localhost:5173/api/aircraft"/>;
}

export default function App() {
  return (
    <Layout>
      <Suspense fallback={<div style={{ padding: 20 }}>טוען…</div>}>
        {<Routes>
          <Route path="/" element={<GalleryPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/add" element={<AddAircraftPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes> }
      </Suspense>
    </Layout>
  );
}

function NotFound() {
  return (
    <div style={{ padding: 20 }}>
      <h2>לא נמצא</h2>
      <p>
        העמוד שביקשת לא קיים. חזור אל <Link to="/gallery">הגלריה</Link>.
      </p>
    </div>
  );
}

const styles = {
  header: { position: "sticky", top: 0, zIndex: 10, background: "#0b1020", borderBottom: "1px solid rgba(255,255,255,.08)" },
  nav: { display: "flex", gap: 16, padding: "12px 16px", justifyContent: "flex-end" },
  link: { color: "#eaf3ff" },
  main: { padding: "12px 12px 0" },
};
