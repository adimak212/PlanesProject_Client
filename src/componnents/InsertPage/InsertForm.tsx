// InsertFormNew.tsx
import axios from "axios";
import { useState, useEffect } from "react";
import type React from "react";

/** ------------ Types ------------ */
export type Plane = {
  id: number; // change to number if your backend uses numbers
  name: string;
  year: number;
  country: string;
  file: File | null;
};

// What the form collects before the server assigns an id
type NewPlaneInput = Omit<Plane , "id">;

/** ------------ Component ------------ */
function InsertFormNew() {
  const [message, setMessage] = useState<string>("");
  const [timer, setTimer] = useState<number | null>(null);
  const [formData, setFormData] = useState<NewPlaneInput>({
    name: "",
    year: NaN as unknown as number, // will be set from the number input
    country: "",
    file: null,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      // keep `year` as a number; other fields as strings
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const payload: NewPlaneInput = {
        name: formData.name,
        year: Number(formData.year),
        country: formData.country,
        file: formData.file,
      };

      const dataFormdata = new FormData();
      dataFormdata.append("name", payload.name);
      dataFormdata.append("year", String(payload.year));
      dataFormdata.append("country", payload.country);
      if (payload.file) {
        dataFormdata.append("file", payload.file);
      }

      const res = await axios.post("http://localhost:3000/api/post", dataFormdata);

      if (res.status === 200) setMessage("Uploaded successfully");
      else setMessage("Error in upload");
    } catch (err) {
      setMessage("Error in upload");
      console.error(err);
    }

    if (timer) clearTimeout(timer);

    const newTimer = window.setTimeout(() => {
      setFormData({
        name: "",
        year: NaN as unknown as number,
        country: "",
        file: null,
      });
      console.log(formData);
      setMessage("");
      setTimer(null);
    }, 1500);

    setTimer(newTimer);
  };

  useEffect(() => {
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [timer]);

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <h2 style={styles.title}>Airplane Insert</h2>

      <label style={styles.label}>
        Plane Name (required)
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="example: F-16"
          required
        />
      </label>

      <label style={styles.label}>
        Year (required)
        <input
          type="number"
          name="year"
          value={Number.isNaN(formData.year) ? "" : formData.year}
          onChange={handleChange}
          min={1903}
          max={2100}
          required
          placeholder="YYYY"
        />
      </label>

      <label style={styles.label}>
        Country (required)
        <input
          type="text"
          name="country"
          value={formData.country}
          onChange={handleChange}
          placeholder="United States"
          required
        />
      </label>

      <label style={styles.label}>
        Upload Image (required)
        <input
          type="file"
          name="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              setFormData((prev) => ({
                ...prev,
                file,
              }));
            }
          }}
          required
        />
      </label>
      <span style={styles.msg}>{message}</span>
      <button type="submit" style={styles.btn}>
        Upload Plane
      </button>
    </form>
  );
}

/** ------------ Styles (typed) ------------ */
const styles = {
  form: {
    background: "#121832",
    border: "1px solid rgba(255,255,255,.07)",
    borderRadius: 18,
    padding: 16,
    boxShadow: "0 8px 24px rgba(0,0,0,.35)",
    color: "#eaf3ff",
    fontFamily: "system-ui, Segoe UI, Arial",
  },
  title: { margin: "0 0 10px", fontWeight: 800 },
  fs: { display: "grid", gap: 12, border: "none", padding: 0, margin: 0 },
  label: { display: "grid", gap: 6, color: "rgba(255,255,255,1)" },
  preview: { marginTop: 4 },
  previewImg: {
    width: "100%",
    maxHeight: 260,
    objectFit: "cover",
    borderRadius: 10,
  },
  btn: {
    padding: "10px 14px",
    cursor: "pointer",
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,.15)",
    background: "#0b4a5a",
    color: "#eaf3ff",
  },
  msg: { marginTop: 10 },
  ok: {
    background: "#0a3d2f",
    color: "#e9fff6",
    padding: "8px 10px",
    borderRadius: 8,
  },
  err: {
    background: "#3a1c1c",
    color: "#ffecec",
    padding: "8px 10px",
    borderRadius: 8,
  },
} satisfies Record<string, React.CSSProperties>;

export default InsertFormNew;
