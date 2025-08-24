
import axios from "axios";
import { useState, useEffect } from "react";

function InsertFormNew() {
    const [message , setMessege ] = useState("")
    const [timer , setTimer] = useState(null);
    const [formData , setFormData] = useState({name : '' , year : '' , country : '' , img_url : ''});


    const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    async function handleSubmit(event) {
        event.preventDefault();
        const res = await axios.post("http://localhost:3000/post",{name: formData.name , year: Number(formData.year) , country: formData.country ,img_url: formData?.img_url?.trim() || 'src\\assests\\myPlane.jpg'});
        if (res.status == 200){setMessege("Uploaded successfully")}
        else{setMessege("Error in upload")}
        if (timer) {
          clearTimeout(timer);
        }
        const newTimer = setTimeout(() => {
            setFormData({name : '' , year : '' , country : '' , img_url: ''});
            setMessege("");
            setTimer(null);
        } , 1500);
        setTimer(newTimer);
    }
    

    useEffect(() => {
      return () => {
        if (timer) {
          clearTimeout(timer);
        }
      };
    }, [timer]);

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
        <h2 style={styles.title}>Airplane Insert</h2>
        <label style={styles.label}>
          Plane Name (required)
          <input type="text"  name="name" value={formData.name} onChange={handleChange} placeholder="example: F-16" required />
        </label>
        <label style={styles.label}>
         Year (required)
          <input type="number" value={formData.year} onChange={handleChange} name="year" min="1903" max="2100" required placeholder="YYYY" />
        </label>
        <label style={styles.label}>
          Country (required)
          <input type="text" value={formData.country} onChange={handleChange} name="country" placeholder="United States" required />
        </label>
        <label style={styles.label}>
          img URL (not required)
          <input type="text" value={formData.img_url} onChange={handleChange} name="img_url" placeholder="https://myPic" />
        </label>
        <span>{message}</span>
        <button type="submit" style={styles.btn}>Upload Plane</button>
    </form>
  )
}


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
  label: { display: "grid", gap: 6 , color: "rgba(255,255,255,1)" },
  preview: { marginTop: 4 },
  previewImg: { width: "100%", maxHeight: 260, objectFit: "cover", borderRadius: 10 },
  btn: {
    padding: "10px 14px",
    cursor: "pointer",
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,.15)",
    background: "#0b4a5a",
    color: "#eaf3ff",
  },
  msg: { marginTop: 10 },
  ok: { background: "#0a3d2f", color: "#e9fff6", padding: "8px 10px", borderRadius: 8 },
  err: { background: "#3a1c1c", color: "#ffecec", padding: "8px 10px", borderRadius: 8 },
};

export default InsertFormNew