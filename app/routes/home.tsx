import { useState, useEffect } from "react";

const foodOptions = [
  // เมนูไทย
  {
    name: "ข้าวผัดกุ้ง",
    price: 45,
    category: "thai",
    image: "250425-Shrimp-Fried-Rice-cover.webp",
  },
  {
    name: "ผัดกะเพรา",
    price: 50,
    category: "thai",
    image: "download.jpg",
  },
  {
    name: "ต้มยำกุ้ง",
    price: 80,
    category: "thai",
    image: "5608757681874e1ea5df1aa41d5b2e3d_How_To_Make_Tom_Yam_Kung_The_Epitome_Of_Delicious_And_Nutritious_Thai_Cuisine3.jpg",
  },
  {
    name: "ข้าวมันไก่",
    price: 40,
    category: "thai",
    image: "rice-steamed-with-chicken-breast-2-1024x609.jpg",
  },
  {
    name: "ส้มตำ",
    price: 55,
    category: "thai",
    image: "download (1).jpg",
  },
  {
    name: "แกงเขียวหวาน",
    price: 75,
    category: "thai",
    image: "download (2).jpg",
  },
  {
    name: "ไข่เจียว",
    price: 30,
    category: "thai",
    image: "download (3).jpg",
  },

  // เมนูอิตาเลียน
  {
    name: "สปาเก็ตตี้",
    price: 90,
    category: "italian",
    image: "download (4).jpg",
  },
  {
    name: "พิซซ่า",
    price: 120,
    category: "italian",
    image: "11.-พิซซ่าหน้ารวมชีส-1024x683.webp",
  },
  {
    name: "ลาซานญ่า",
    price: 110,
    category: "italian",
    image: "download (5).jpg",
  },
  {
    name: "ริซอตโต้",
    price: 95,
    category: "italian",
    image: "fcb26a89be054540a4f6f32e9ec7f97f.webp",
  },

  // เมนูญี่ปุ่น
  {
    name: "ซูชิ",
    price: 110,
    category: "japanese",
    image: "download (6).jpg",
  },
  {
    name: "ราเมน",
    price: 85,
    category: "japanese",
    image: "download (7).jpg",
  },
  {
    name: "เทมปุระ",
    price: 90,
    category: "japanese",
    image: "download (8).jpg",
  },
];

const categories = [
  { key: "all", label: "ทั้งหมด" },
  { key: "thai", label: "ไทย" },
  { key: "italian", label: "อิตาเลียน" },
  { key: "japanese", label: "ญี่ปุ่น" },
];

function App() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [menuList, setMenuList] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [editQty, setEditQty] = useState(1);
  const [customerName, setCustomerName] = useState("");
  const [isPayOpen, setIsPayOpen] = useState(false);

  // โหลดข้อมูลจาก localStorage
  useEffect(() => {
    const storedMenu = localStorage.getItem("menuList");
    if (storedMenu) setMenuList(JSON.parse(storedMenu));

    const storedName = localStorage.getItem("customerName");
    if (storedName) setCustomerName(storedName);
  }, []);

  // บันทึกข้อมูลลง localStorage
  useEffect(() => {
    localStorage.setItem("menuList", JSON.stringify(menuList));
  }, [menuList]);

  useEffect(() => {
    localStorage.setItem("customerName", customerName);
  }, [customerName]);

  // ฟิลเตอร์เมนูตามหมวดหมู่
  const filteredFoodOptions =
    selectedCategory === "all"
      ? foodOptions
      : foodOptions.filter((f) => f.category === selectedCategory);
  // เพิ่มเมนูลงในรายการ
  const addMenu = (food) => {
    const existing = menuList.find((item) => item.name === food.name);
    if (existing) {
      const updated = menuList.map((item) =>
        item.name === food.name ? { ...item, qty: item.qty + 1 } : item
      );
      setMenuList(updated);
    } else {
      setMenuList([...menuList, { ...food, qty: 1 }]);
    }
  };

  // เริ่มแก้ไขจำนวนจาน
  const startEdit = (index) => {
    setEditIndex(index);
    setEditQty(menuList[index].qty);
  };

  // บันทึกจำนวนจาน
  const saveEdit = () => {
    const updatedList = [...menuList];
    updatedList[editIndex].qty = Number(editQty);
    setMenuList(updatedList);
    setEditIndex(null);
  };

  // ยกเลิกแก้ไข
  const cancelEdit = () => {
    setEditIndex(null);
    setEditQty(1);
  };

  // ลบเมนู
  const deleteMenu = (index) => {
    if (window.confirm("ต้องการลบเมนูนี้หรือไม่?")) {
      setMenuList(menuList.filter((_, i) => i !== index));
    }
  };

  // คำนวณราคารวม
  const totalPrice = menuList.reduce((sum, item) => sum + item.price * item.qty, 0);

  // เริ่มชำระเงิน
  const handlePayment = () => {
    if (!customerName) {
      alert("กรุณากรอกชื่อลูกค้าก่อนชำระเงิน");
      return;
    }
    if (menuList.length === 0) {
      alert("ยังไม่มีรายการอาหารในตะกร้า");
      return;
    }
    setIsPayOpen(true);
  };

  const confirmPayment = () => {
    alert(`✅ ชำระเงินเรียบร้อย\n👤 ลูกค้า: ${customerName}\n💰 ราคารวม: ${totalPrice} บาท\nขอบคุณที่ใช้บริการ!`);
    setMenuList([]);
    setCustomerName("");
    setIsPayOpen(false);
  };
  return (
    <div className="min-h-screen bg-[#0e0e10] text-white p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-orange-400">🍽️ ร้านอาหาร My IT</h1>

      {/* ใส่ชื่อลูกค้า */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="ชื่อลูกค้า"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          className="w-full max-w-sm px-4 py-3 rounded-xl bg-[#1a1a1d] border border-gray-600 focus:outline-none focus:border-orange-400"
        />
      </div>

      {/* ปุ่มเลือกประเภทอาหาร */}
      <div className="mb-6 flex gap-4 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setSelectedCategory(cat.key)}
            className={`px-4 py-2 rounded-full font-semibold ${
              selectedCategory === cat.key
                ? "bg-orange-500 text-white"
                : "bg-[#1a1a1d] text-gray-400 hover:bg-[#2a2a2f]"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* เมนูอาหารให้เลือก (รูปภาพ) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-10">
        {filteredFoodOptions.map((food, i) => (
          <div
            key={i}
            onClick={() => addMenu(food)}
            className="cursor-pointer bg-[#1a1a1d] rounded-xl overflow-hidden shadow hover:shadow-lg transition"
          >
            <img src={food.image} alt={food.name} className="w-full h-32 object-cover" />
            <div className="p-3">
              <p className="font-semibold">{food.name}</p>
              <p className="text-orange-400">{food.price} ฿</p>
            </div>
          </div>
        ))}
      </div>
      {/* รายการเมนูที่เลือก */}
      <h2 className="text-xl mb-4 text-orange-300">📝 รายการเมนู</h2>
      {menuList.length === 0 && (
        <p className="text-gray-400 mb-6">ยังไม่มีเมนูในรายการ</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {menuList.map((menu, index) => (
          <div
            key={index}
            className="bg-[#1a1a1d] rounded-xl shadow p-4 flex flex-col"
          >
            <img
              src={menu.image}
              alt={menu.name}
              className="w-full h-32 object-cover rounded mb-3"
            />
            <h3 className="font-semibold">{menu.name}</h3>
            <p className="text-orange-400">{menu.price} ฿</p>
            <p className="text-gray-400 mb-2 capitalize">หมวด: {menu.category}</p>

            {editIndex === index ? (
              <>
                <input
                  type="number"
                  min="1"
                  value={editQty}
                  onChange={(e) => setEditQty(e.target.value)}
                  className="mb-3 px-2 py-1 rounded bg-[#333] border border-gray-600 text-white w-full"
                />
                <div className="mt-auto flex gap-2">
                  <button
                    onClick={saveEdit}
                    className="bg-green-500 hover:bg-green-400 px-3 py-1 rounded"
                  >
                    บันทึก
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="bg-gray-500 hover:bg-gray-400 px-3 py-1 rounded"
                  >
                    ยกเลิก
                  </button>
                </div>
              </>
            ) : (
              <>
                <p className="text-white mb-3">จำนวน: {menu.qty} จาน</p>
                <div className="mt-auto flex gap-2">
                  <button
                    onClick={() => startEdit(index)}
                    className="bg-blue-500 hover:bg-blue-400 px-3 py-1 rounded"
                  >
                    แก้ไข
                  </button>
                  <button
                    onClick={() => deleteMenu(index)}
                    className="bg-red-500 hover:bg-red-400 px-3 py-1 rounded"
                  >
                    ลบ
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* ราคารวม */}
      <div className="mt-10 p-4 bg-[#1a1a1d] rounded-xl text-right text-orange-400 font-bold text-lg">
        ราคารวม: {totalPrice} ฿
      </div>

      {/* ปุ่มชำระเงิน */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={handlePayment}
          className="bg-green-600 hover:bg-green-500 px-6 py-3 rounded font-semibold shadow"
        >
          ชำระเงิน
        </button>
      </div>
      {/* popup ยืนยันการชำระเงิน */}
      {isPayOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-[#1a1a1d] p-6 rounded-xl max-w-md w-full">
            <h2 className="text-2xl font-bold text-orange-400 mb-4">
              ยืนยันการชำระเงิน
            </h2>
            <p className="mb-2">
              👤 ลูกค้า: <span className="font-semibold">{customerName}</span>
            </p>
            <p className="mb-2">📋 รายการอาหาร:</p>
            <ul className="mb-4 max-h-40 overflow-auto">
              {menuList.map((menu, i) => (
                <li
                  key={i}
                  className="border-b border-gray-700 py-1 flex justify-between"
                >
                  <span>
                    {menu.name} × {menu.qty}
                  </span>
                  <span>{menu.price * menu.qty} ฿</span>
                </li>
              ))}
            </ul>
            <p className="text-lg font-semibold mb-4 text-right">
              💰 ราคารวม: {totalPrice} บาท
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsPayOpen(false)}
                className="bg-gray-600 hover:bg-gray-500 px-4 py-2 rounded"
              >
                ยกเลิก
              </button>
              <button
                onClick={confirmPayment}
                className="bg-green-600 hover:bg-green-500 px-4 py-2 rounded"
              >
                ยืนยันชำระเงิน
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
