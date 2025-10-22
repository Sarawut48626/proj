import express from 'express';
import cors from 'cors';
import admin from 'firebase-admin';
import serviceAccount from './firebase/palm-1006-5-firebase-adminsdk-fbsvc-c7100f3a20.json' with { type: 'json' };


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();


const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());


async function fetchMenu() {
  const result = [];
  const menuRef = db.collection('palm1');
  const menuSnap = await menuRef.get();
  menuSnap.forEach(doc => {
    result.push({
      id: doc.id,
      ...doc.data()
    });
  });
  return result;
}




app.get('/', (req, res) => {
  res.send('🍽️ Hello from Firebase Restaurant API!');
});


// URL: http://localhost:3000/api/getMenu
app.get('/api/getMenu', (req, res) => {
  res.set('Content-type', 'application/json');
  fetchMenu()
    .then((jsonData) => res.status(200).json(jsonData))
    .catch((error) => res.status(500).json({ success: false, message: error.message }));
});


// URL: http://localhost:3000/api/addMenu
async function addMenu(newMenu) {
  const newMenuRef = db.collection('palm1').doc();
  await newMenuRef.set(newMenu);
  console.log('✅ Menu added to Firestore!');
}

app.post('/api/addMenu', async (req, res) => {
  try {
    const { name, price, category, status } = req.body;
    if (!name || !price || !category) {
      return res.status(400).json({ success: false, message: 'กรุณากรอกข้อมูลให้ครบถ้วน' });
    }

    const newMenu = { name, price, category, status: status || 'available' };
    await addMenu(newMenu);
    res.status(201).json({ success: true, message: '🍴 เพิ่มเมนูสำเร็จ!' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});


// URL: http://localhost:3000/api/getMenu/:menuId
async function fetchOneMenu(menuId) {
  const doc = await db.collection('palm1').doc(menuId).get();
  if (!doc.exists) throw new Error('ไม่พบเมนูที่ต้องการ');
  return { id: doc.id, ...doc.data() };
}

app.get('/api/getMenu/:menuId', async (req, res) => {
  const { menuId } = req.params;
  try {
    const data = await fetchOneMenu(menuId);
    res.status(200).json(data);
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
});


// URL: http://localhost:3000/api/updateMenu
async function updateMenu(menuId, menuData) {
  const docRef = db.collection('palm1').doc(menuId);
  await docRef.update(menuData);
}

app.post('/api/updateMenu', async (req, res) => {
  try {
    const { menuId, name, price, category, status } = req.body;
    if (!menuId) {
      return res.status(400).json({ success: false, message: 'กรุณาระบุ menuId' });
    }

    await updateMenu(menuId, { name, price, category, status });
    res.status(200).json({ success: true, message: '✏️ อัปเดตเมนูสำเร็จ!' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});


// URL: http://localhost:3000/api/deleteMenu/:menuId
async function deleteMenu(menuId) {
  const docRef = db.collection('palm1').doc(menuId);
  await docRef.delete();
}

app.delete('/api/deleteMenu/:menuId', async (req, res) => {
  const { menuId } = req.params;
  try {
    await deleteMenu(menuId);
    res.status(200).json({ success: true, message: '🗑️ ลบเมนูสำเร็จ!' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});


app.listen(port, () => {
  console.log(`🚀 Server running on: http://localhost:${port}`);
});
