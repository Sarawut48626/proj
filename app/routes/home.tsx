import { useEffect, useState } from "react";

function App() {
  const [menuList, setMenuList] = useState([]);
  const [newMenu, setNewMenu] = useState({ name: "", price: "", category: "", image: "" });
  const [editMenuId, setEditMenuId] = useState(null);
  const [editMenuData, setEditMenuData] = useState({ name: "", price: "", category: "", image: "" });

  const API_URL = "http://localhost:3000/api";

  const fetchMenu = async () => {
    const res = await fetch(`${API_URL}/getMenu`);
    const data = await res.json();
    setMenuList(data);
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  const addMenu = async () => {
    if (!newMenu.name || !newMenu.price || !newMenu.category) return alert("กรอกข้อมูลให้ครบ!");
    await fetch(`${API_URL}/addMenu`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newMenu),
    });
    setNewMenu({ name: "", price: "", category: "", image: "" });
    fetchMenu();
  };

  const startEdit = (menu) => {
    setEditMenuId(menu.id);
    setEditMenuData(menu);
  };

  const saveEdit = async () => {
    await fetch(`${API_URL}/updateMenu`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ menuId: editMenuId, ...editMenuData }),
    });
    setEditMenuId(null);
    fetchMenu();
  };

  const deleteMenu = async (id) => {
    if (!window.confirm("ต้องการลบเมนูนี้หรือไม่?")) return;
    await fetch(`${API_URL}/deleteMenu/${id}`, { method: "DELETE" });
    fetchMenu();
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "Poppins, sans-serif", maxWidth: "1200px", margin: "0 auto" }}>
      <h1 style={{ textAlign: "center", marginBottom: "2rem", color: "#ff5722" }}>🍲 ร้านอาหารของเรา</h1>

      {/* ฟอร์มเพิ่มเมนู */}
      <div
        style={{
          display: "flex",
          gap: "1rem",
          flexWrap: "wrap",
          marginBottom: "2rem",
          backgroundColor: "#fafafaff",
          padding: "1rem",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
      >
        <input
          style={{ flex: 1, padding: "0.5rem", borderRadius: "8px", border: "1px solid #000000ff", color: "#000000ff" }}
          placeholder="ชื่อลูกค้า"
          value={newMenu.name}
          onChange={(e) => setNewMenu({ ...newMenu, name: e.target.value })}
        />
        <input
          type="number"
          style={{ width: "300px", padding: "0.5rem", borderRadius: "8px", border: "1px solid #000000ff", color: "#000000ff" }}
          placeholder="ราคา"
          value={newMenu.price}
          onChange={(e) => setNewMenu({ ...newMenu, price: e.target.value })}
        />
        <input
          style={{ width: "250px", padding: "0.5rem", borderRadius: "8px", border: "1px solid #000000ff", color: "#000000ff" }}
          placeholder="ชื้อเมนูอาหาร"
          value={newMenu.category}
          onChange={(e) => setNewMenu({ ...newMenu, category: e.target.value })}
        />
        {/* <input
          style={{ flex: 1, padding: "0.5rem", borderRadius: "8px", border: "1px solid #000000ff", color: "#000000ff" }}
          placeholder="URL รูปเมนู (optional)"
          value={newMenu.image}
          onChange={(e) => setNewMenu({ ...newMenu, image: e.target.value })}
        /> */}
        <button
          onClick={addMenu}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "#ff5722",
            color: "#ffffffff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          เพิ่มเมนู
        </button>
      </div>

      {/* แสดงเมนูแบบ Card Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "1.5rem",
        }}
      >
        {menuList.map((menu) => (
          <div
            key={menu.id}
            style={{
              backgroundColor: "#f7f6f6ff",
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              transition: "transform 0.2s",
            }}
          >
            {menu.image && (
              <img
                src={menu.image}
                alt={menu.name}
                style={{ width: "100%", height: "140px", objectFit: "cover" }}
              />
            )}
            <div style={{ padding: "1rem", flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              {editMenuId === menu.id ? (
                <>
                  <input
                    style={{ marginBottom: "0.5rem", padding: "0.5rem", borderRadius: "8px", border: "1px solid #000000ff", color: "#000000ff" }}
                    value={editMenuData.name}
                    onChange={(e) => setEditMenuData({ ...editMenuData, name: e.target.value })}
                  />
                  <input
                    type="number"
                    style={{ marginBottom: "0.5rem", padding: "0.5rem", borderRadius: "8px", border: "1px solid #010000ff", color: "#000000ff" }}
                    value={editMenuData.price}
                    onChange={(e) => setEditMenuData({ ...editMenuData, price: e.target.value })}
                  />
                  <input
                    style={{ marginBottom: "0.5rem", padding: "0.5rem", borderRadius: "8px", border: "1px solid #000000ff", color: "#000000ff" }}
                    value={editMenuData.category}
                    onChange={(e) => setEditMenuData({ ...editMenuData, category: e.target.value })}
                  />
                  {/* <input
                    style={{ marginBottom: "0.5rem", padding: "0.5rem", borderRadius: "8px", border: "1px solid #020000ff", color: "#000000ff" }}
                    value={editMenuData.status}
                    onChange={(e) => setEditMenuData({ ...editMenuData, status: e.target.value })}
                  /> */}
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button
                      onClick={saveEdit}
                      style={{ flex: 1, padding: "0.5rem", backgroundColor: "#ff9800", color: "#fff", border: "none", borderRadius: "8px" }}
                    >
                      บันทึก
                    </button>
                    <button
                      onClick={() => setEditMenuId(null)}
                      style={{ flex: 1, padding: "0.5rem", backgroundColor: "#9e9e9e", color: "#fff", border: "none", borderRadius: "8px" }}
                    >
                      ยกเลิก
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h3 style={{ margin: "0 0 0.5rem 0", color: "#ff5722" }}>{menu.name}</h3>
                  <p style={{ margin: "0.25rem 0", color: "#000000ff" }}>💰 {menu.price} บาท</p>
                  <p style={{ margin: "0.25rem 0", color: "#000000ff" }}>🥗 {menu.category}</p>
                  <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
                    <button
                      onClick={() => startEdit(menu)}
                      style={{ flex: 1, padding: "0.5rem", backgroundColor: "#ff9800", color: "#fff", border: "none", borderRadius: "8px" }}
                    >
                      แก้ไข
                    </button>
                    <button
                      onClick={() => deleteMenu(menu.id)}
                      style={{ flex: 1, padding: "0.5rem", backgroundColor: "#f44336", color: "#fff", border: "none", borderRadius: "8px" }}
                    >
                      ลบ
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
