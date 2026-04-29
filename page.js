// frontend/app/page.js - DEAL ERP النظام الكامل
"use client";

import { useState, useEffect } from "react";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler
);

// ============================================
// مكونات مساعدة
// ============================================

function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0,0,0,0.5)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          background: "white",
          borderRadius: "24px",
          padding: "24px",
          width: "90%",
          maxWidth: "500px",
          direction: "rtl",
        }}
      >
        <h3 style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "20px" }}>{title}</h3>
        {children}
        <button
          onClick={onClose}
          style={{
            marginTop: "20px",
            padding: "8px 20px",
            background: "#64748b",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          إلغاء
        </button>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color }) {
  return (
    <div
      style={{
        background: "white",
        borderRadius: "20px",
        padding: "20px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        border: "1px solid #e2e8f0",
        transition: "0.3s",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = "0 10px 25px -5px rgba(0,0,0,0.1)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.05)";
      }}
    >
      <div style={{ fontSize: "32px", marginBottom: "8px" }}>{icon}</div>
      <div style={{ fontSize: "28px", fontWeight: "bold", color: color || "#1e293b" }}>{value}</div>
      <div style={{ fontSize: "13px", color: "#64748b", marginTop: "8px" }}>{label}</div>
    </div>
  );
}

function DataTable({ columns, data, onDelete }) {
  if (!data || data.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>
        لا توجد بيانات
      </div>
    );
  }
  return (
    <div style={{ overflowX: "auto", background: "white", borderRadius: "16px", border: "1px solid #e2e8f0" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#f8fafc", borderBottom: "2px solid #e2e8f0" }}>
            {columns.map((col, idx) => (
              <th key={idx} style={{ padding: "12px", textAlign: "right", fontWeight: "600", color: "#475569" }}>
                {col.label}
              </th>
            ))}
            {onDelete && <th style={{ padding: "12px", textAlign: "center", width: "60px" }}></th>}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id} style={{ borderBottom: "1px solid #e2e8f0" }}>
              {columns.map((col, idx) => (
                <td key={idx} style={{ padding: "12px" }}>{row[col.key] || "-"}</td>
              ))}
              {onDelete && (
                <td style={{ textAlign: "center" }}>
                  <button
                    onClick={() => onDelete(row.id)}
                    style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer" }}
                  >
                    🗑️
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ============================================
// التطبيق الرئيسي
// ============================================

export default function DealERP() {
  const [darkMode, setDarkMode] = useState(false);
  const [selectedSystem, setSelectedSystem] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const users = [
    { id: 1, name: "أحمد محمد", email: "ahmed@construction.com", password: "123456", system: "construction", role: "admin" },
    { id: 2, name: "محمد علي", email: "mohamed@manufacturing.com", password: "123456", system: "manufacturing", role: "admin" },
  ];

  if (!selectedSystem) {
    return (
      <div style={{ minHeight: "100vh", background: darkMode ? "#0f172a" : "#f1f5f9", padding: "50px", textAlign: "center" }}>
        <h1 style={{ fontSize: "50px" }}>🏢 DEALERP</h1>
        <p>bring future today</p>
        <button onClick={() => setDarkMode(!darkMode)} style={{ margin: "20px", padding: "10px 20px", cursor: "pointer" }}>
          {darkMode ? "☀️" : "🌙"}
        </button>
        <div style={{ display: "flex", gap: "30px", justifyContent: "center", flexWrap: "wrap", marginTop: "50px" }}>
          <div
            onClick={() => setSelectedSystem("construction")}
            style={{ background: darkMode ? "#1e293b" : "white", padding: "40px", borderRadius: "20px", cursor: "pointer", width: "250px" }}
          >
            <div style={{ fontSize: "60px" }}>🏗️</div>
            <h2>نظام المقاولات</h2>
          </div>
          <div
            onClick={() => setSelectedSystem("manufacturing")}
            style={{ background: darkMode ? "#1e293b" : "white", padding: "40px", borderRadius: "20px", cursor: "pointer", width: "250px" }}
          >
            <div style={{ fontSize: "60px" }}>🏭</div>
            <h2>نظام التصنيع</h2>
          </div>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    const systemNames = { construction: "المقاولات", manufacturing: "التصنيع" };
    const systemColors = { construction: "#2563eb", manufacturing: "#10b981" };
    return (
      <div style={{ minHeight: "100vh", background: darkMode ? "#0f172a" : "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ background: darkMode ? "#1e293b" : "white", borderRadius: "24px", padding: "40px", width: "380px" }}>
          <h2 style={{ textAlign: "center", marginBottom: "20px" }}>نظام {systemNames[selectedSystem]}</h2>
          {error && <div style={{ color: "red", marginBottom: "10px", textAlign: "center" }}>{error}</div>}
          <input
            type="email"
            placeholder="البريد"
            value={loginData.email}
            onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
            style={{ width: "100%", padding: "10px", margin: "10px 0", border: "1px solid #e2e8f0", borderRadius: "8px" }}
          />
          <input
            type="password"
            placeholder="كلمة المرور"
            value={loginData.password}
            onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
            style={{ width: "100%", padding: "10px", margin: "10px 0", border: "1px solid #e2e8f0", borderRadius: "8px" }}
          />
          <button
            onClick={() => {
              const user = users.find(
                (u) => u.email === loginData.email && u.password === loginData.password && u.system === selectedSystem
              );
              if (user) {
                setCurrentUser(user);
                setIsLoggedIn(true);
                setError("");
              } else {
                setError("بيانات الدخول غير صحيحة");
              }
            }}
            style={{ width: "100%", padding: "10px", background: systemColors[selectedSystem], color: "white", border: "none", borderRadius: "8px", cursor: "pointer" }}
          >
            تسجيل الدخول
          </button>
          <button
            onClick={() => setSelectedSystem(null)}
            style={{ width: "100%", marginTop: "10px", background: "none", border: "none", cursor: "pointer", color: "#64748b" }}
          >
            ← العودة للرئيسية
          </button>
          <div style={{ marginTop: "20px", padding: "10px", background: "#f1f5f9", borderRadius: "8px", textAlign: "center", fontSize: "12px" }}>
            بيانات تجريبية: {selectedSystem === "construction" ? "ahmed@construction.com" : "mohamed@manufacturing.com"} / 123456
          </div>
        </div>
      </div>
    );
  }

  if (selectedSystem === "construction") {
    return (
      <ConstructionApp
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onLogout={() => {
          setIsLoggedIn(false);
          setSelectedSystem(null);
          setCurrentUser(null);
        }}
        currentUser={currentUser}
      />
    );
  }

  return (
    <ManufacturingApp
      darkMode={darkMode}
      setDarkMode={setDarkMode}
      onLogout={() => {
        setIsLoggedIn(false);
        setSelectedSystem(null);
        setCurrentUser(null);
      }}
      currentUser={currentUser}
    />
  );
}

// ============================================
// نظام المقاولات الكامل
// ============================================

function ConstructionApp({ darkMode, setDarkMode, onLogout, currentUser }) {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Modal states
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showWorkerModal, setShowWorkerModal] = useState(false);
  const [showMaterialModal, setShowMaterialModal] = useState(false);
  const [showSupplierModal, setShowSupplierModal] = useState(false);
  const [showEquipmentModal, setShowEquipmentModal] = useState(false);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [showWarehouseModal, setShowWarehouseModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  
  // Form states
  const [newProject, setNewProject] = useState({ name: "", location: "", budget: "" });
  const [newExpense, setNewExpense] = useState({ projectId: "", type: "material", amount: "", description: "" });
  const [newWorker, setNewWorker] = useState({ name: "", role: "", salary: "" });
  const [newMaterial, setNewMaterial] = useState({ name: "", unit: "طن", price: "" });
  const [newSupplier, setNewSupplier] = useState({ name: "", phone: "", address: "" });
  const [newEquipment, setNewEquipment] = useState({ name: "", cost: "", status: "operational" });
  const [newPurchase, setNewPurchase] = useState({ supplierId: "", notes: "" });
  const [newWarehouse, setNewWarehouse] = useState({ name: "", code: "", location: "", type: "main" });
  const [newTransfer, setNewTransfer] = useState({ fromWarehouseId: "", toWarehouseId: "", materialId: "", quantity: "", notes: "" });
  
  // Data states
  const [projects, setProjects] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [transfers, setTransfers] = useState([]);
  const [stock, setStock] = useState([]);
  const [activityLogs, setActivityLogs] = useState([]);

  // جلب البيانات
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [p, e, w, m, s, eq, po, wh, tr, st, al] = await Promise.all([
        fetch("/api/projects").then((r) => (r.ok ? r.json() : [])).catch(() => []),
        fetch("/api/expenses").then((r) => (r.ok ? r.json() : [])).catch(() => []),
        fetch("/api/workers").then((r) => (r.ok ? r.json() : [])).catch(() => []),
        fetch("/api/materials").then((r) => (r.ok ? r.json() : [])).catch(() => []),
        fetch("/api/suppliers").then((r) => (r.ok ? r.json() : [])).catch(() => []),
        fetch("/api/equipment").then((r) => (r.ok ? r.json() : [])).catch(() => []),
        fetch("/api/purchase-orders").then((r) => (r.ok ? r.json() : [])).catch(() => []),
        fetch("/api/warehouses").then((r) => (r.ok ? r.json() : [])).catch(() => []),
        fetch("/api/transfers").then((r) => (r.ok ? r.json() : [])).catch(() => []),
        fetch("/api/stock").then((r) => (r.ok ? r.json() : [])).catch(() => []),
        fetch("/api/activity-logs").then((r) => (r.ok ? r.json() : [])).catch(() => []),
      ]);
      setProjects(p);
      setExpenses(e);
      setWorkers(w);
      setMaterials(m);
      setSuppliers(s);
      setEquipment(eq);
      setPurchaseOrders(po);
      setWarehouses(wh);
      setTransfers(tr);
      setStock(st);
      setActivityLogs(al);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  // حساب الإحصائيات المالية
  const totalBudget = projects.reduce((s, p) => s + (p.budget || 0), 0);
  const totalExpensesAmount = expenses.reduce((s, e) => s + (e.amount || 0), 0);
  const remaining = totalBudget - totalExpensesAmount;
  const totalStockValue = stock.reduce((s, st) => s + ((st.quantity || 0) * (materials.find((m) => m.id === st.material_id)?.price || 0)), 0);
  const progressPercentage = totalBudget > 0 ? ((totalExpensesAmount / totalBudget) * 100).toFixed(1) : 0;

  const expensesByType = {
    material: expenses.filter((e) => e.type === "material").reduce((s, e) => s + (e.amount || 0), 0),
    labor: expenses.filter((e) => e.type === "labor").reduce((s, e) => s + (e.amount || 0), 0),
    equipment: expenses.filter((e) => e.type === "equipment").reduce((s, e) => s + (e.amount || 0), 0),
    other: expenses.filter((e) => e.type === "other").reduce((s, e) => s + (e.amount || 0), 0),
  };

  const monthlyExpenses = {};
  expenses.forEach((exp) => {
    const month = exp.date?.substring(0, 7) || "2024-01";
    monthlyExpenses[month] = (monthlyExpenses[month] || 0) + (exp.amount || 0);
  });

  // بيانات الرسوم البيانية
  const budgetChartData = {
    labels: ["الميزانية", "المصروفات", "المتبقي"],
    datasets: [
      {
        label: "القيمة (ج.م)",
        data: [totalBudget, totalExpensesAmount, remaining],
        backgroundColor: ["#3b82f6", "#ef4444", "#10b981"],
        borderRadius: 10,
      },
    ],
  };

  const expensesChartData = {
    labels: ["مواد", "عمالة", "معدات", "أخرى"],
    datasets: [
      {
        data: [expensesByType.material, expensesByType.labor, expensesByType.equipment, expensesByType.other],
        backgroundColor: ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6"],
        borderWidth: 0,
      },
    ],
  };

  const monthlyExpensesChartData = {
    labels: Object.keys(monthlyExpenses).sort(),
    datasets: [
      {
        label: "المصروفات الشهرية (ج.م)",
        data: Object.keys(monthlyExpenses)
          .sort()
          .map((m) => monthlyExpenses[m]),
        backgroundColor: "#3b82f6",
        borderColor: "#2563eb",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  // دوال الإضافة
  const addLog = async (action, details) => {
    await fetch("/api/activity-logs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user: currentUser?.name, action, details }),
    });
    fetchData();
  };

  const addProject = async () => {
    if (!newProject.name) return alert("الرجاء إدخال اسم المشروع");
    const res = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: newProject.name,
        location: newProject.location,
        budget: parseFloat(newProject.budget) || 0,
      }),
    });
    if (res.ok) {
      fetchData();
      setShowProjectModal(false);
      setNewProject({ name: "", location: "", budget: "" });
      addLog("إضافة مشروع", newProject.name);
      alert("✅ تم إضافة المشروع");
    }
  };

  const addExpense = async () => {
    if (!newExpense.amount) return alert("الرجاء إدخال المبلغ");
    const res = await fetch("/api/expenses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        projectId: newExpense.projectId || null,
        type: newExpense.type,
        amount: parseFloat(newExpense.amount),
        description: newExpense.description,
      }),
    });
    if (res.ok) {
      fetchData();
      setShowExpenseModal(false);
      setNewExpense({ projectId: "", type: "material", amount: "", description: "" });
      addLog("إضافة مصروف", newExpense.amount + " ج.م");
      alert("✅ تم إضافة المصروف");
    }
  };

  const addWorker = async () => {
    if (!newWorker.name) return alert("الرجاء إدخال اسم العامل");
    const res = await fetch("/api/workers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: newWorker.name,
        role: newWorker.role,
        salary: parseFloat(newWorker.salary) || 5000,
      }),
    });
    if (res.ok) {
      fetchData();
      setShowWorkerModal(false);
      setNewWorker({ name: "", role: "", salary: "" });
      addLog("إضافة عامل", newWorker.name);
      alert("✅ تم إضافة العامل");
    }
  };

  const addMaterial = async () => {
    if (!newMaterial.name) return alert("الرجاء إدخال اسم المادة");
    const res = await fetch("/api/materials", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: newMaterial.name,
        unit: newMaterial.unit,
        price: parseFloat(newMaterial.price) || 0,
      }),
    });
    if (res.ok) {
      fetchData();
      setShowMaterialModal(false);
      setNewMaterial({ name: "", unit: "طن", price: "" });
      addLog("إضافة مادة", newMaterial.name);
      alert("✅ تم إضافة المادة");
    }
  };

  const addSupplier = async () => {
    if (!newSupplier.name) return alert("الرجاء إدخال اسم المورد");
    const res = await fetch("/api/suppliers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: newSupplier.name,
        phone: newSupplier.phone,
        address: newSupplier.address,
      }),
    });
    if (res.ok) {
      fetchData();
      setShowSupplierModal(false);
      setNewSupplier({ name: "", phone: "", address: "" });
      addLog("إضافة مورد", newSupplier.name);
      alert("✅ تم إضافة المورد");
    }
  };

  const addEquipment = async () => {
    if (!newEquipment.name) return alert("الرجاء إدخال اسم المعدة");
    const res = await fetch("/api/equipment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: newEquipment.name,
        cost: parseFloat(newEquipment.cost) || 0,
        status: newEquipment.status,
      }),
    });
    if (res.ok) {
      fetchData();
      setShowEquipmentModal(false);
      setNewEquipment({ name: "", cost: "", status: "operational" });
      addLog("إضافة معدة", newEquipment.name);
      alert("✅ تم إضافة المعدة");
    }
  };

  const addPurchaseOrder = async () => {
    if (!newPurchase.supplierId) return alert("الرجاء اختيار المورد");
    const res = await fetch("/api/purchase-orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        supplierId: newPurchase.supplierId,
        notes: newPurchase.notes,
      }),
    });
    if (res.ok) {
      fetchData();
      setShowPurchaseModal(false);
      setNewPurchase({ supplierId: "", notes: "" });
      addLog("أمر شراء", "تم إضافة أمر شراء جديد");
      alert("✅ تم إضافة أمر الشراء");
    }
  };

  const addWarehouse = async () => {
    if (!newWarehouse.name) return alert("الرجاء إدخال اسم المخزن");
    const res = await fetch("/api/warehouses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newWarehouse),
    });
    if (res.ok) {
      fetchData();
      setShowWarehouseModal(false);
      setNewWarehouse({ name: "", code: "", location: "", type: "main" });
      addLog("إضافة مخزن", newWarehouse.name);
      alert("✅ تم إضافة المخزن");
    }
  };

  const addTransfer = async () => {
    if (!newTransfer.fromWarehouseId || !newTransfer.toWarehouseId || !newTransfer.materialId || !newTransfer.quantity) {
      return alert("الرجاء إدخال جميع البيانات");
    }
    const res = await fetch("/api/transfers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTransfer),
    });
    if (res.ok) {
      fetchData();
      setShowTransferModal(false);
      setNewTransfer({ fromWarehouseId: "", toWarehouseId: "", materialId: "", quantity: "", notes: "" });
      addLog("تحويل مواد", newTransfer.quantity + " وحدة");
      alert("✅ تم إضافة طلب التحويل");
    }
  };

  const deleteItem = async (api, id, name) => {
    if (confirm(`هل تريد حذف ${name}؟`)) {
      await fetch(`${api}?id=${id}`, { method: "DELETE" });
      fetchData();
      addLog("حذف", name);
      alert("✅ تم الحذف");
    }
  };

  const getFilteredData = (data) => {
    if (!searchTerm) return data;
    return data.filter((item) =>
      Object.values(item).some((val) => val && val.toString().toLowerCase().includes(searchTerm.toLowerCase()))
    );
  };

  if (loading) return <div style={{ textAlign: "center", padding: "50px" }}>جاري التحميل...</div>;

  return (
    <div style={{ minHeight: "100vh", background: darkMode ? "#0f172a" : "#f1f5f9", fontFamily: "sans-serif" }}>
      {/* Navbar */}
      <nav
        style={{
          background: darkMode ? "#1e293b" : "white",
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
          borderBottom: darkMode ? "1px solid #334155" : "1px solid #e2e8f0",
          position: "sticky",
          top: 0,
          zIndex: 50,
        }}
      >
        <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "12px 24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "12px",
                  background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span style={{ fontSize: "22px" }}>🏗️</span>
              </div>
              <div>
                <h1 style={{ fontSize: "18px", fontWeight: "bold", color: darkMode ? "white" : "#1e293b" }}>DEAL ERP</h1>
                <p style={{ fontSize: "11px", color: darkMode ? "#94a3b8" : "#64748b" }}>نظام المقاولات</p>
              </div>
            </div>

            <div style={{ position: "relative", width: "260px" }}>
              <input
                type="text"
                placeholder="🔍 بحث..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 16px",
                  borderRadius: "40px",
                  border: darkMode ? "1px solid #334155" : "1px solid #e2e8f0",
                  background: darkMode ? "#334155" : "white",
                  color: darkMode ? "white" : "#1e293b",
                  fontSize: "13px",
                  outline: "none",
                }}
              />
            </div>

            <div
              style={{
                display: "flex",
                gap: "6px",
                flexWrap: "wrap",
                background: darkMode ? "#334155" : "#f8fafc",
                padding: "4px 8px",
                borderRadius: "40px",
              }}
            >
              {["dashboard", "projects", "expenses", "workers", "materials", "suppliers", "equipment", "purchases", "warehouses", "transfers", "stock", "logs", "financial"].map(
                (tab) => {
                  const tabNames = {
                    dashboard: "📊 الرئيسية",
                    projects: "📋 المشاريع",
                    expenses: "💰 المصروفات",
                    workers: "👷 العمال",
                    materials: "📦 المواد",
                    suppliers: "🏭 الموردين",
                    equipment: "🚜 المعدات",
                    purchases: "📋 المشتريات",
                    warehouses: "🏚️ المخازن",
                    transfers: "🔄 التحويلات",
                    stock: "📊 المخزون",
                    logs: "📜 السجل",
                    financial: "💰 التقارير",
                  };
                  return (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      style={{
                        padding: "6px 16px",
                        borderRadius: "30px",
                        fontSize: "13px",
                        fontWeight: "500",
                        background: activeTab === tab ? "#2563eb" : "transparent",
                        color: activeTab === tab ? "white" : darkMode ? "#e2e8f0" : "#475569",
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      {tabNames[tab]}
                    </button>
                  );
                }
              )}
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  background: "#2563eb",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontSize: "14px",
                  fontWeight: "bold",
                }}
              >
                {currentUser?.name?.charAt(0)}
              </div>
              <button
                onClick={() => setDarkMode(!darkMode)}
                style={{
                  background: darkMode ? "#334155" : "#f1f5f9",
                  border: "none",
                  padding: "8px",
                  borderRadius: "10px",
                  cursor: "pointer",
                  fontSize: "16px",
                  width: "36px",
                  height: "36px",
                }}
              >
                {darkMode ? "☀️" : "🌙"}
              </button>
              <button
                onClick={onLogout}
                style={{
                  background: "#ef4444",
                  color: "white",
                  border: "none",
                  padding: "6px 18px",
                  borderRadius: "30px",
                  fontSize: "12px",
                  cursor: "pointer",
                }}
              >
                🚪 خروج
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "28px 24px" }}>
        {/* Dashboard */}
        {activeTab === "dashboard" && (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "20px", marginBottom: "32px" }}>
              <StatCard icon="📋" label="المشاريع" value={projects.length} color="#2563eb" />
              <StatCard icon="👷" label="العمال" value={workers.length} color="#10b981" />
              <StatCard icon="💰" label="الميزانية" value={`${(totalBudget / 1000000).toFixed(1)}M`} color="#3b82f6" />
              <StatCard icon="💸" label="المصروفات" value={`${(totalExpensesAmount / 1000000).toFixed(1)}M`} color="#ef4444" />
              <StatCard icon="📈" label="المتبقي" value={`${(remaining / 1000000).toFixed(1)}M`} color="#10b981" />
              <StatCard icon="📦" label="المواد" value={materials.length} color="#f59e0b" />
            </div>

            <div style={{ background: "white", borderRadius: "20px", padding: "20px", marginBottom: "32px", border: "1px solid #e2e8f0" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                <span style={{ fontSize: "14px", fontWeight: "500" }}>نسبة إنجاز الميزانية</span>
                <span style={{ fontSize: "14px", fontWeight: "600", color: "#2563eb" }}>{progressPercentage}%</span>
              </div>
              <div style={{ height: "8px", background: "#e2e8f0", borderRadius: "10px", overflow: "hidden" }}>
                <div style={{ width: `${progressPercentage}%`, height: "100%", background: "linear-gradient(90deg, #2563eb, #3b82f6)", borderRadius: "10px" }}></div>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(450px, 1fr))", gap: "24px", marginBottom: "32px" }}>
              <div style={{ background: "white", borderRadius: "20px", padding: "20px", border: "1px solid #e2e8f0" }}>
                <h3 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "20px" }}>📊 الميزانية العمومية</h3>
                <Bar data={budgetChartData} options={{ responsive: true, maintainAspectRatio: true }} />
              </div>
              <div style={{ background: "white", borderRadius: "20px", padding: "20px", border: "1px solid #e2e8f0" }}>
                <h3 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "20px" }}>🥧 توزيع المصروفات</h3>
                <Doughnut data={expensesChartData} options={{ responsive: true, maintainAspectRatio: true }} />
              </div>
            </div>

            <div style={{ background: "white", borderRadius: "20px", padding: "20px", border: "1px solid #e2e8f0" }}>
              <h3 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "20px" }}>📈 المصروفات الشهرية</h3>
              <Line data={monthlyExpensesChartData} options={{ responsive: true, maintainAspectRatio: true }} />
            </div>
          </div>
        )}

        {/* Projects */}
        {activeTab === "projects" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <h2 style={{ fontSize: "20px", fontWeight: "600" }}>📋 المشاريع</h2>
              <button
                onClick={() => setShowProjectModal(true)}
                style={{ background: "#2563eb", color: "white", border: "none", padding: "8px 20px", borderRadius: "40px", fontSize: "13px", cursor: "pointer" }}
              >
                ➕ مشروع جديد
              </button>
            </div>
            <DataTable
              columns={[
                { key: "name", label: "المشروع" },
                { key: "location", label: "الموقع" },
                { key: "budget", label: "الميزانية" },
              ]}
              data={getFilteredData(projects)}
              onDelete={(id) => deleteItem("/api/projects", id, "المشروع")}
            />
          </div>
        )}

        {/* Expenses */}
        {activeTab === "expenses" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <h2 style={{ fontSize: "20px", fontWeight: "600" }}>💰 المصروفات</h2>
              <button
                onClick={() => setShowExpenseModal(true)}
                style={{ background: "#2563eb", color: "white", border: "none", padding: "8px 20px", borderRadius: "40px", fontSize: "13px", cursor: "pointer" }}
              >
                ➕ مصروف جديد
              </button>
            </div>
            <DataTable
              columns={[
                { key: "amount", label: "المبلغ" },
                { key: "type", label: "النوع" },
                { key: "description", label: "الوصف" },
                { key: "date", label: "التاريخ" },
              ]}
              data={getFilteredData(expenses)}
              onDelete={(id) => deleteItem("/api/expenses", id, "المصروف")}
            />
          </div>
        )}

        {/* Workers */}
        {activeTab === "workers" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <h2 style={{ fontSize: "20px", fontWeight: "600" }}>👷 العمال</h2>
              <button
                onClick={() => setShowWorkerModal(true)}
                style={{ background: "#2563eb", color: "white", border: "none", padding: "8px 20px", borderRadius: "40px", cursor: "pointer" }}
              >
                ➕ عامل جديد
              </button>
            </div>
            <DataTable
              columns={[
                { key: "name", label: "الاسم" },
                { key: "role", label: "المهنة" },
                { key: "salary", label: "الراتب" },
              ]}
              data={getFilteredData(workers)}
              onDelete={(id) => deleteItem("/api/workers", id, "العامل")}
            />
          </div>
        )}

        {/* Materials */}
        {activeTab === "materials" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <h2 style={{ fontSize: "20px", fontWeight: "600" }}>📦 المواد</h2>
              <button
                onClick={() => setShowMaterialModal(true)}
                style={{ background: "#2563eb", color: "white", border: "none", padding: "8px 20px", borderRadius: "40px", cursor: "pointer" }}
              >
                ➕ مادة جديدة
              </button>
            </div>
            <DataTable
              columns={[
                { key: "name", label: "المادة" },
                { key: "unit", label: "الوحدة" },
                { key: "price", label: "السعر" },
              ]}
              data={getFilteredData(materials)}
              onDelete={(id) => deleteItem("/api/materials", id, "المادة")}
            />
          </div>
        )}

        {/* Suppliers */}
        {activeTab === "suppliers" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <h2 style={{ fontSize: "20px", fontWeight: "600" }}>🏭 الموردين</h2>
              <button
                onClick={() => setShowSupplierModal(true)}
                style={{ background: "#2563eb", color: "white", border: "none", padding: "8px 20px", borderRadius: "40px", cursor: "pointer" }}
              >
                ➕ مورد جديد
              </button>
            </div>
            <DataTable
              columns={[
                { key: "name", label: "المورد" },
                { key: "phone", label: "الهاتف" },
                { key: "address", label: "العنوان" },
              ]}
              data={getFilteredData(suppliers)}
              onDelete={(id) => deleteItem("/api/suppliers", id, "المورد")}
            />
          </div>
        )}

        {/* Equipment */}
        {activeTab === "equipment" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <h2 style={{ fontSize: "20px", fontWeight: "600" }}>🚜 المعدات</h2>
              <button
                onClick={() => setShowEquipmentModal(true)}
                style={{ background: "#2563eb", color: "white", border: "none", padding: "8px 20px", borderRadius: "40px", cursor: "pointer" }}
              >
                ➕ معدة جديدة
              </button>
            </div>
            <DataTable
              columns={[
                { key: "name", label: "المعدة" },
                { key: "status", label: "الحالة" },
                { key: "cost", label: "التكلفة" },
              ]}
              data={getFilteredData(equipment)}
              onDelete={(id) => deleteItem("/api/equipment", id, "المعدة")}
            />
          </div>
        )}

        {/* Purchases */}
        {activeTab === "purchases" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <h2 style={{ fontSize: "20px", fontWeight: "600" }}>📋 المشتريات</h2>
              <button
                onClick={() => setShowPurchaseModal(true)}
                style={{ background: "#2563eb", color: "white", border: "none", padding: "8px 20px", borderRadius: "40px", cursor: "pointer" }}
              >
                ➕ أمر شراء
              </button>
            </div>
            <DataTable
              columns={[
                { key: "order_number", label: "الرقم" },
                { key: "supplier_id", label: "المورد" },
                { key: "status", label: "الحالة" },
              ]}
              data={getFilteredData(purchaseOrders)}
            />
          </div>
        )}

        {/* Warehouses */}
        {activeTab === "warehouses" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <h2 style={{ fontSize: "20px", fontWeight: "600" }}>🏚️ المخازن</h2>
              <button
                onClick={() => setShowWarehouseModal(true)}
                style={{ background: "#2563eb", color: "white", border: "none", padding: "8px 20px", borderRadius: "40px", cursor: "pointer" }}
              >
                ➕ مخزن جديد
              </button>
            </div>
            <DataTable
              columns={[
                { key: "name", label: "المخزن" },
                { key: "code", label: "الكود" },
                { key: "location", label: "الموقع" },
              ]}
              data={getFilteredData(warehouses)}
              onDelete={(id) => deleteItem("/api/warehouses", id, "المخزن")}
            />
          </div>
        )}

        {/* Transfers */}
        {activeTab === "transfers" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <h2 style={{ fontSize: "20px", fontWeight: "600" }}>🔄 التحويلات</h2>
              <button
                onClick={() => setShowTransferModal(true)}
                style={{ background: "#2563eb", color: "white", border: "none", padding: "8px 20px", borderRadius: "40px", cursor: "pointer" }}
              >
                ➕ تحويل جديد
              </button>
            </div>
            <DataTable
              columns={[
                { key: "material_id", label: "المادة" },
                { key: "quantity", label: "الكمية" },
                { key: "status", label: "الحالة" },
              ]}
              data={getFilteredData(transfers)}
            />
          </div>
        )}

        {/* Stock */}
        {activeTab === "stock" && (
          <div>
            <div style={{ marginBottom: "24px" }}>
              <h2 style={{ fontSize: "20px", fontWeight: "600" }}>📊 المخزون</h2>
            </div>
            <DataTable
              columns={[
                { key: "material_id", label: "المادة" },
                { key: "quantity", label: "الكمية" },
                { key: "warehouse_id", label: "المخزن" },
              ]}
              data={getFilteredData(stock)}
            />
          </div>
        )}

        {/* Logs */}
        {activeTab === "logs" && (
          <div>
            <div style={{ marginBottom: "24px" }}>
              <h2 style={{ fontSize: "20px", fontWeight: "600" }}>📜 سجل العمليات</h2>
            </div>
            <DataTable
              columns={[
                { key: "user", label: "المستخدم" },
                { key: "action", label: "العملية" },
                { key: "details", label: "التفاصيل" },
                { key: "timestamp", label: "التاريخ" },
              ]}
              data={getFilteredData(activityLogs)}
            />
          </div>
        )}

        {/* Financial Reports */}
        {activeTab === "financial" && (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px", marginBottom: "32px" }}>
              <div style={{ background: "linear-gradient(135deg, #2563eb, #1d4ed8)", borderRadius: "20px", padding: "20px", color: "white", textAlign: "center" }}>
                💰<div style={{ fontSize: "24px", fontWeight: "bold" }}>{(totalBudget / 1000000).toFixed(2)}M</div>
                <div>إجمالي الميزانية</div>
              </div>
              <div style={{ background: "linear-gradient(135deg, #ef4444, #dc2626)", borderRadius: "20px", padding: "20px", color: "white", textAlign: "center" }}>
                💸<div style={{ fontSize: "24px", fontWeight: "bold" }}>{(totalExpensesAmount / 1000000).toFixed(2)}M</div>
                <div>إجمالي المصروفات</div>
              </div>
              <div style={{ background: "linear-gradient(135deg, #10b981, #059669)", borderRadius: "20px", padding: "20px", color: "white", textAlign: "center" }}>
                📈<div style={{ fontSize: "24px", fontWeight: "bold" }}>{(remaining / 1000000).toFixed(2)}M</div>
                <div>المتبقي</div>
              </div>
              <div style={{ background: "linear-gradient(135deg, #f59e0b, #d97706)", borderRadius: "20px", padding: "20px", color: "white", textAlign: "center" }}>
                📦<div style={{ fontSize: "24px", fontWeight: "bold" }}>{(totalStockValue / 1000).toFixed(0)}K</div>
                <div>قيمة المخزون</div>
              </div>
            </div>

            <div style={{ background: "white", borderRadius: "20px", padding: "24px", marginBottom: "24px", border: "1px solid #e2e8f0" }}>
              <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "20px", borderRight: "4px solid #2563eb", paddingRight: "12px" }}>📋 قائمة الدخل</h3>
              <table style={{ width: "100%" }}>
                <tbody>
                  <tr style={{ borderBottom: "1px solid #e2e8f0" }}>
                    <td style={{ padding: "12px", fontWeight: "600" }}>الإيرادات المتوقعة</td>
                    <td>{totalBudget.toLocaleString()} ج.م</td>
                    <td style={{ color: "#10b981" }}>{(totalBudget / 1000000).toFixed(2)}M</td>
                  </tr>
                  <tr style={{ borderBottom: "1px solid #e2e8f0", background: "#f8fafc" }}>
                    <td style={{ padding: "12px", fontWeight: "600" }}>(-) إجمالي المصروفات</td>
                    <td style={{ color: "#dc2626" }}>{totalExpensesAmount.toLocaleString()} ج.م</td>
                    <td style={{ color: "#dc2626" }}>{(totalExpensesAmount / 1000000).toFixed(2)}M</td>
                  </tr>
                  <tr>
                    <td style={{ padding: "12px", fontWeight: "600" }}>صافي الربح/الخسارة</td>
                    <td style={{ fontWeight: "bold", color: remaining >= 0 ? "#10b981" : "#dc2626" }}>{remaining.toLocaleString()} ج.م</td>
                    <td style={{ fontWeight: "bold", color: remaining >= 0 ? "#10b981" : "#dc2626" }}>{(remaining / 1000000).toFixed(2)}M</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div style={{ background: "white", borderRadius: "20px", padding: "24px", border: "1px solid #e2e8f0" }}>
              <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "20px", borderRight: "4px solid #2563eb", paddingRight: "12px" }}>📊 توزيع المصروفات</h3>
              {[
                { name: "مواد", amount: expensesByType.material, color: "#3b82f6" },
                { name: "عمالة", amount: expensesByType.labor, color: "#10b981" },
                { name: "معدات", amount: expensesByType.equipment, color: "#f59e0b" },
                { name: "أخرى", amount: expensesByType.other, color: "#8b5cf6" },
              ].map((item) => {
                const percentage = totalExpensesAmount > 0 ? ((item.amount / totalExpensesAmount) * 100).toFixed(1) : 0;
                return (
                  <div key={item.name} style={{ marginBottom: "16px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                      <span>{item.name}</span>
                      <span>
                        {item.amount.toLocaleString()} ج.م ({percentage}%)
                      </span>
                    </div>
                    <div style={{ height: "8px", background: "#e2e8f0", borderRadius: "10px", overflow: "hidden" }}>
                      <div style={{ width: `${percentage}%`, height: "100%", background: item.color, borderRadius: "10px" }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <Modal isOpen={showProjectModal} onClose={() => setShowProjectModal(false)} title="➕ إضافة مشروع">
        <input
          type="text"
          placeholder="اسم المشروع"
          value={newProject.name}
          onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
          style={{ width: "100%", padding: "12px", marginBottom: "12px", border: "1px solid #e2e8f0", borderRadius: "8px" }}
        />
        <input
          type="text"
          placeholder="الموقع"
          value={newProject.location}
          onChange={(e) => setNewProject({ ...newProject, location: e.target.value })}
          style={{ width: "100%", padding: "12px", marginBottom: "12px", border: "1px solid #e2e8f0", borderRadius: "8px" }}
        />
        <input
          type="number"
          placeholder="الميزانية"
          value={newProject.budget}
          onChange={(e) => setNewProject({ ...newProject, budget: e.target.value })}
          style={{ width: "100%", padding: "12px", marginBottom: "12px", border: "1px solid #e2e8f0", borderRadius: "8px" }}
        />
        <button
          onClick={addProject}
          style={{ width: "100%", padding: "12px", background: "#2563eb", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", marginTop: "8px" }}
        >
          إضافة
        </button>
      </Modal>

      <Modal isOpen={showExpenseModal} onClose={() => setShowExpenseModal(false)} title="💰 إضافة مصروف">
        <select
          value={newExpense.type}
          onChange={(e) => setNewExpense({ ...newExpense, type: e.target.value })}
          style={{ width: "100%", padding: "12px", marginBottom: "12px", border: "1px solid #e2e8f0", borderRadius: "8px" }}
        >
          <option value="material">مواد</option>
          <option value="labor">عمالة</option>
          <option value="equipment">معدات</option>
          <option value="other">أخرى</option>
        </select>
        <select
          value={newExpense.projectId}
          onChange={(e) => setNewExpense({ ...newExpense, projectId: e.target.value })}
          style={{ width: "100%", padding: "12px", marginBottom: "12px", border: "1px solid #e2e8f0", borderRadius: "8px" }}
        >
          <option value="">بدون مشروع</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
        <input
          type="number"
          placeholder="المبلغ"
          value={newExpense.amount}
          onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
          style={{ width: "100%", padding: "12px", marginBottom: "12px", border: "1px solid #e2e8f0", borderRadius: "8px" }}
        />
        <input
          type="text"
          placeholder="الوصف"
          value={newExpense.description}
          onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
          style={{ width: "100%", padding: "12px", marginBottom: "12px", border: "1px solid #e2e8f0", borderRadius: "8px" }}
        />
        <button
          onClick={addExpense}
          style={{ width: "100%", padding: "12px", background: "#2563eb", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", marginTop: "8px" }}
        >
          إضافة
        </button>
      </Modal>

      <Modal isOpen={showWorkerModal} onClose={() => setShowWorkerModal(false)} title="👷 إضافة عامل">
        <input
          type="text"
          placeholder="الاسم"
          value={newWorker.name}
          onChange={(e) => setNewWorker({ ...newWorker, name: e.target.value })}
          style={{ width: "100%", padding: "12px", marginBottom: "12px", border: "1px solid #e2e8f0", borderRadius: "8px" }}
        />
        <input
          type="text"
          placeholder="المهنة"
          value={newWorker.role}
          onChange={(e) => setNewWorker({ ...newWorker, role: e.target.value })}
          style={{ width: "100%", padding: "12px", marginBottom: "12px", border: "1px solid #e2e8f0", borderRadius: "8px" }}
        />
        <input
          type="number"
          placeholder="الراتب"
          value={newWorker.salary}
          onChange={(e) => setNewWorker({ ...newWorker, salary: e.target.value })}
          style={{ width: "100%", padding: "12px", marginBottom: "12px", border: "1px solid #e2e8f0", borderRadius: "8px" }}
        />
        <button
          onClick={addWorker}
          style={{ width: "100%", padding: "12px", background: "#2563eb", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", marginTop: "8px" }}
        >
          إضافة
        </button>
      </Modal>

      <Modal isOpen={showMaterialModal} onClose={() => setShowMaterialModal(false)} title="📦 إضافة مادة">
        <input
          type="text"
          placeholder="اسم المادة"
          value={newMaterial.name}
          onChange={(e) => setNewMaterial({ ...newMaterial, name: e.target.value })}
          style={{ width: "100%", padding: "12px", marginBottom: "12px", border: "1px solid #e2e8f0", borderRadius: "8px" }}
        />
        <input
          type="number"
          placeholder="سعر الوحدة"
          value={newMaterial.price}
          onChange={(e) => setNewMaterial({ ...newMaterial, price: e.target.value })}
          style={{ width: "100%", padding: "12px", marginBottom: "12px", border: "1px solid #e2e8f0", borderRadius: "8px" }}
        />
        <button
          onClick={addMaterial}
          style={{ width: "100%", padding: "12px", background: "#2563eb", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", marginTop: "8px" }}
        >
          إضافة
        </button>
      </Modal>

      <Modal isOpen={showSupplierModal} onClose={() => setShowSupplierModal(false)} title="🏭 إضافة مورد">
        <input
          type="text"
          placeholder="اسم المورد"
          value={newSupplier.name}
          onChange={(e) => setNewSupplier({ ...newSupplier, name: e.target.value })}
          style={{ width: "100%", padding: "12px", marginBottom: "12px", border: "1px solid #e2e8f0", borderRadius: "8px" }}
        />
        <input
          type="text"
          placeholder="الهاتف"
          value={newSupplier.phone}
          onChange={(e) => setNewSupplier({ ...newSupplier, phone: e.target.value })}
          style={{ width: "100%", padding: "12px", marginBottom: "12px", border: "1px solid #e2e8f0", borderRadius: "8px" }}
        />
        <input
          type="text"
          placeholder="العنوان"
          value={newSupplier.address}
          onChange={(e) => setNewSupplier({ ...newSupplier, address: e.target.value })}
          style={{ width: "100%", padding: "12px", marginBottom: "12px", border: "1px solid #e2e8f0", borderRadius: "8px" }}
        />
        <button
          onClick={addSupplier}
          style={{ width: "100%", padding: "12px", background: "#2563eb", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", marginTop: "8px" }}
        >
          إضافة
        </button>
      </Modal>

      <Modal isOpen={showEquipmentModal} onClose={() => setShowEquipmentModal(false)} title="🚜 إضافة معدة">
        <input
          type="text"
          placeholder="اسم المعدة"
          value={newEquipment.name}
          onChange={(e) => setNewEquipment({ ...newEquipment, name: e.target.value })}
          style={{ width: "100%", padding: "12px", marginBottom: "12px", border: "1px solid #e2e8f0", borderRadius: "8px" }}
        />
        <input
          type="number"
          placeholder="التكلفة"
          value={newEquipment.cost}
          onChange={(e) => setNewEquipment({ ...newEquipment, cost: e.target.value })}
          style={{ width: "100%", padding: "12px", marginBottom: "12px", border: "1px solid #e2e8f0", borderRadius: "8px" }}
        />
        <select
          value={newEquipment.status}
          onChange={(e) => setNewEquipment({ ...newEquipment, status: e.target.value })}
          style={{ width: "100%", padding: "12px", marginBottom: "12px", border: "1px solid #e2e8f0", borderRadius: "8px" }}
        >
          <option value="operational">🟢 تعمل</option>
          <option value="maintenance">🟡 صيانة</option>
        </select>
        <button
          onClick={addEquipment}
          style={{ width: "100%", padding: "12px", background: "#2563eb", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", marginTop: "8px" }}
        >
          إضافة
        </button>
      </Modal>

      <Modal isOpen={showPurchaseModal} onClose={() => setShowPurchaseModal(false)} title="📋 أمر شراء">
        <select
          value={newPurchase.supplierId}
          onChange={(e) => setNewPurchase({ ...newPurchase, supplierId: e.target.value })}
          style={{ width: "100%", padding: "12px", marginBottom: "12px", border: "1px solid #e2e8f0", borderRadius: "8px" }}
        >
          <option value="">اختر المورد</option>
          {suppliers.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
        <textarea
          placeholder="ملاحظات"
          value={newPurchase.notes}
          onChange={(e) => setNewPurchase({ ...newPurchase, notes: e.target.value })}
          rows="2"
          style={{ width: "100%", padding: "12px", marginBottom: "12px", border: "1px solid #e2e8f0", borderRadius: "8px" }}
        />
        <button
          onClick={addPurchaseOrder}
          style={{ width: "100%", padding: "12px", background: "#2563eb", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", marginTop: "8px" }}
        >
          إضافة
        </button>
      </Modal>

      <Modal isOpen={showWarehouseModal} onClose={() => setShowWarehouseModal(false)} title="🏚️ إضافة مخزن">
        <input
          type="text"
          placeholder="اسم المخزن"
          value={newWarehouse.name}
          onChange={(e) => setNewWarehouse({ ...newWarehouse, name: e.target.value })}
          style={{ width: "100%", padding: "12px", marginBottom: "12px", border: "1px solid #e2e8f0", borderRadius: "8px" }}
        />
        <input
          type="text"
          placeholder="الكود"
          value={newWarehouse.code}
          onChange={(e) => setNewWarehouse({ ...newWarehouse, code: e.target.value })}
          style={{ width: "100%", padding: "12px", marginBottom: "12px", border: "1px solid #e2e8f0", borderRadius: "8px" }}
        />
        <input
          type="text"
          placeholder="الموقع"
          value={newWarehouse.location}
          onChange={(e) => setNewWarehouse({ ...newWarehouse, location: e.target.value })}
          style={{ width: "100%", padding: "12px", marginBottom: "12px", border: "1px solid #e2e8f0", borderRadius: "8px" }}
        />
        <button
          onClick={addWarehouse}
          style={{ width: "100%", padding: "12px", background: "#2563eb", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", marginTop: "8px" }}
        >
          إضافة
        </button>
      </Modal>

      <Modal isOpen={showTransferModal} onClose={() => setShowTransferModal(false)} title="🔄 تحويل مواد">
        <select
          value={newTransfer.fromWarehouseId}
          onChange={(e) => setNewTransfer({ ...newTransfer, fromWarehouseId: e.target.value })}
          style={{ width: "100%", padding: "12px", marginBottom: "12px", border: "1px solid #e2e8f0", borderRadius: "8px" }}
        >
          <option value="">من مخزن</option>
          {warehouses.map((w) => (
            <option key={w.id} value={w.id}>
              {w.name}
            </option>
          ))}
        </select>
        <select
          value={newTransfer.toWarehouseId}
          onChange={(e) => setNewTransfer({ ...newTransfer, toWarehouseId: e.target.value })}
          style={{ width: "100%", padding: "12px", marginBottom: "12px", border: "1px solid #e2e8f0", borderRadius: "8px" }}
        >
          <option value="">إلى مخزن</option>
          {warehouses.map((w) => (
            <option key={w.id} value={w.id}>
              {w.name}
            </option>
          ))}
        </select>
        <select
          value={newTransfer.materialId}
          onChange={(e) => setNewTransfer({ ...newTransfer, materialId: e.target.value })}
          style={{ width: "100%", padding: "12px", marginBottom: "12px", border: "1px solid #e2e8f0", borderRadius: "8px" }}
        >
          <option value="">المادة</option>
          {materials.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name}
            </option>
          ))}
        </select>
        <input
          type="number"
          placeholder="الكمية"
          value={newTransfer.quantity}
          onChange={(e) => setNewTransfer({ ...newTransfer, quantity: e.target.value })}
          style={{ width: "100%", padding: "12px", marginBottom: "12px", border: "1px solid #e2e8f0", borderRadius: "8px" }}
        />
        <button
          onClick={addTransfer}
          style={{ width: "100%", padding: "12px", background: "#2563eb", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", marginTop: "8px" }}
        >
          إضافة
        </button>
      </Modal>
    </div>
  );
}

// ============================================
// نظام التصنيع الكامل
// ============================================

function ManufacturingApp({ darkMode, setDarkMode, onLogout, currentUser }) {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Modal states
  const [showMaterialModal, setShowMaterialModal] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showWorkOrderModal, setShowWorkOrderModal] = useState(false);
  const [showSupplierModal, setShowSupplierModal] = useState(false);
  const [showStepModal, setShowStepModal] = useState(false);
  
  // Form states
  const [newMaterial, setNewMaterial] = useState({ name: "", unit: "كجم", cost: "", stock: "" });
  const [newProduct, setNewProduct] = useState({ name: "", price: "" });
  const [newWorkOrder, setNewWorkOrder] = useState({ productId: "", quantity: "" });
  const [newSupplier, setNewSupplier] = useState({ name: "", phone: "", address: "" });
  const [newStep, setNewStep] = useState({ name: "", hourlyRate: "", hours: "" });
  
  // Data states
  const [rawMaterials, setRawMaterials] = useState([]);
  const [products, setProducts] = useState([]);
  const [workOrders, setWorkOrders] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [productionSteps, setProductionSteps] = useState([]);

  // جلب البيانات
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [rm, p, wo, sup, ps] = await Promise.all([
        fetch("/api/raw-materials").then((r) => (r.ok ? r.json() : [])).catch(() => []),
        fetch("/api/products").then((r) => (r.ok ? r.json() : [])).catch(() => []),
        fetch("/api/work-orders").then((r) => (r.ok ? r.json() : [])).catch(() => []),
        fetch("/api/mfg-suppliers").then((r) => (r.ok ? r.json() : [])).catch(() => []),
        fetch("/api/production-steps").then((r) => (r.ok ? r.json() : [])).catch(() => []),
      ]);
      setRawMaterials(rm);
      setProducts(p);
      setWorkOrders(wo);
      setSuppliers(sup);
      setProductionSteps(ps);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  // الإحصائيات
  const totalStockValue = rawMaterials.reduce((s, m) => s + ((m.stock || 0) * (m.cost || 0)), 0);
  const pendingOrders = workOrders.filter((o) => o.status !== "completed").length;

  // دوال الإضافة
  const addRawMaterial = async () => {
    if (!newMaterial.name) return alert("⚠️ الرجاء إدخال اسم المادة");
    const res = await fetch("/api/raw-materials", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: newMaterial.name,
        unit: newMaterial.unit,
        cost: parseFloat(newMaterial.cost) || 0,
        stock: parseFloat(newMaterial.stock) || 0,
      }),
    });
    if (res.ok) {
      await fetchData();
      setShowMaterialModal(false);
      setNewMaterial({ name: "", unit: "كجم", cost: "", stock: "" });
      alert("✅ تم إضافة المادة");
    } else {
      alert("❌ فشل في الإضافة");
    }
  };

  const addProduct = async () => {
    if (!newProduct.name) return alert("⚠️ الرجاء إدخال اسم المنتج");
    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: newProduct.name,
        price: parseFloat(newProduct.price) || 0,
      }),
    });
    if (res.ok) {
      await fetchData();
      setShowProductModal(false);
      setNewProduct({ name: "", price: "" });
      alert("✅ تم إضافة المنتج");
    } else {
      alert("❌ فشل في الإضافة");
    }
  };

  const addWorkOrder = async () => {
    if (!newWorkOrder.productId || !newWorkOrder.quantity) return alert("⚠️ الرجاء إدخال جميع البيانات");
    const product = products.find((p) => p.id === parseInt(newWorkOrder.productId));
    if (!product) return alert("⚠️ المنتج غير موجود");
    const res = await fetch("/api/work-orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productId: parseInt(newWorkOrder.productId),
        productName: product.name,
        quantity: parseFloat(newWorkOrder.quantity),
      }),
    });
    if (res.ok) {
      await fetchData();
      setShowWorkOrderModal(false);
      setNewWorkOrder({ productId: "", quantity: "" });
      alert("✅ تم إضافة أمر التصنيع");
    } else {
      alert("❌ فشل في الإضافة");
    }
  };

  const addSupplier = async () => {
    if (!newSupplier.name) return alert("⚠️ الرجاء إدخال اسم المورد");
    const res = await fetch("/api/mfg-suppliers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: newSupplier.name,
        phone: newSupplier.phone,
        address: newSupplier.address,
      }),
    });
    if (res.ok) {
      await fetchData();
      setShowSupplierModal(false);
      setNewSupplier({ name: "", phone: "", address: "" });
      alert("✅ تم إضافة المورد");
    } else {
      alert("❌ فشل في الإضافة");
    }
  };

  const addProductionStep = async () => {
    if (!newStep.name) return alert("⚠️ الرجاء إدخال اسم المرحلة");
    const res = await fetch("/api/production-steps", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: newStep.name,
        hourlyRate: parseFloat(newStep.hourlyRate) || 0,
        hours: parseFloat(newStep.hours) || 0.5,
      }),
    });
    if (res.ok) {
      await fetchData();
      setShowStepModal(false);
      setNewStep({ name: "", hourlyRate: "", hours: "" });
      alert("✅ تم إضافة مرحلة الإنتاج");
    } else {
      alert("❌ فشل في الإضافة");
    }
  };

  const startProduction = async (id) => {
    await fetch(`/api/work-orders?id=${id}&action=start`, { method: "PUT" });
    await fetchData();
    alert("✅ بدء التصنيع");
  };

  const completeProduction = async (id) => {
    await fetch(`/api/work-orders?id=${id}&action=complete`, { method: "PUT" });
    await fetchData();
    alert("✅ تم إكمال التصنيع");
  };

  const deleteItem = async (api, id, name) => {
    if (confirm(`هل تريد حذف ${name}؟`)) {
      await fetch(`${api}?id=${id}`, { method: "DELETE" });
      await fetchData();
      alert("✅ تم الحذف");
    }
  };

  const getFilteredData = (data) => {
    if (!searchTerm) return data;
    return data.filter((item) =>
      Object.values(item).some((val) => val && val.toString().toLowerCase().includes(searchTerm.toLowerCase()))
    );
  };

  if (loading) return <div style={{ textAlign: "center", padding: "50px" }}>جاري التحميل...</div>;

  return (
    <div style={{ minHeight: "100vh", background: darkMode ? "#0f172a" : "#f1f5f9", fontFamily: "sans-serif" }}>
      {/* Navbar */}
      <nav
        style={{
          background: darkMode ? "#1e293b" : "white",
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
          borderBottom: darkMode ? "1px solid #334155" : "1px solid #e2e8f0",
          position: "sticky",
          top: 0,
          zIndex: 50,
        }}
      >
        <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "12px 24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
            {/* Logo */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "12px",
                  background: "linear-gradient(135deg, #10b981, #059669)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span style={{ fontSize: "22px" }}>🏭</span>
              </div>
              <div>
                <h1 style={{ fontSize: "18px", fontWeight: "bold", color: darkMode ? "white" : "#1e293b" }}>DEAL ERP</h1>
                <p style={{ fontSize: "11px", color: darkMode ? "#94a3b8" : "#64748b" }}>نظام التصنيع</p>
              </div>
            </div>

            {/* Search */}
            <div style={{ position: "relative", width: "260px" }}>
              <input
                type="text"
                placeholder="🔍 بحث..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 16px",
                  borderRadius: "40px",
                  border: darkMode ? "1px solid #334155" : "1px solid #e2e8f0",
                  background: darkMode ? "#334155" : "white",
                  color: darkMode ? "white" : "#1e293b",
                  fontSize: "13px",
                  outline: "none",
                }}
              />
            </div>

            {/* Tabs */}
            <div
              style={{
                display: "flex",
                gap: "6px",
                flexWrap: "wrap",
                background: darkMode ? "#334155" : "#f8fafc",
                padding: "4px 8px",
                borderRadius: "40px",
              }}
            >
              {["dashboard", "materials", "products", "suppliers", "steps", "production"].map((tab) => {
                const tabNames = {
                  dashboard: "📊 الرئيسية",
                  materials: "🧱 المواد",
                  products: "📦 المنتجات",
                  suppliers: "🏭 الموردين",
                  steps: "⚙️ المراحل",
                  production: "📝 التصنيع",
                };
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    style={{
                      padding: "6px 16px",
                      borderRadius: "30px",
                      fontSize: "13px",
                      fontWeight: "500",
                      background: activeTab === tab ? "#10b981" : "transparent",
                      color: activeTab === tab ? "white" : darkMode ? "#e2e8f0" : "#475569",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    {tabNames[tab]}
                  </button>
                );
              })}
            </div>

            {/* User Menu */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  background: "#10b981",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontSize: "14px",
                  fontWeight: "bold",
                }}
              >
                {currentUser?.name?.charAt(0)}
              </div>
              <button
                onClick={() => setDarkMode(!darkMode)}
                style={{
                  background: darkMode ? "#334155" : "#f1f5f9",
                  border: "none",
                  padding: "8px",
                  borderRadius: "10px",
                  cursor: "pointer",
                  fontSize: "16px",
                  width: "36px",
                  height: "36px",
                }}
              >
                {darkMode ? "☀️" : "🌙"}
              </button>
              <button
                onClick={onLogout}
                style={{
                  background: "#ef4444",
                  color: "white",
                  border: "none",
                  padding: "6px 18px",
                  borderRadius: "30px",
                  fontSize: "12px",
                  cursor: "pointer",
                }}
              >
                🚪 خروج
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "28px 24px" }}>
        {/* Dashboard */}
        {activeTab === "dashboard" && (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px", marginBottom: "32px" }}>
              <StatCard icon="🧱" label="المواد الخام" value={rawMaterials.length} color="#10b981" />
              <StatCard icon="📦" label="المنتجات" value={products.length} color="#10b981" />
              <StatCard icon="💰" label="قيمة المخزون" value={`${(totalStockValue / 1000).toFixed(0)}K`} color="#10b981" />
              <StatCard icon="🏭" label="الموردين" value={suppliers.length} color="#10b981" />
              <StatCard icon="⚙️" label="مراحل الإنتاج" value={productionSteps.length} color="#10b981" />
              <StatCard icon="📝" label="أوامر معلقة" value={pendingOrders} color="#f59e0b" />
            </div>
          </div>
        )}

        {/* Materials */}
        {activeTab === "materials" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <h2 style={{ fontSize: "20px", fontWeight: "600" }}>🧱 المواد الخام</h2>
              <button
                onClick={() => setShowMaterialModal(true)}
                style={{ background: "#10b981", color: "white", border: "none", padding: "8px 20px", borderRadius: "40px", cursor: "pointer" }}
              >
                ➕ إضافة مادة
              </button>
            </div>
            <DataTable
              columns={[
                { key: "name", label: "المادة" },
                { key: "unit", label: "الوحدة" },
                { key: "stock", label: "المخزون" },
                { key: "cost", label: "السعر" },
              ]}
              data={getFilteredData(rawMaterials)}
              onDelete={(id) => deleteItem("/api/raw-materials", id, "المادة")}
            />
          </div>
        )}

        {/* Products */}
        {activeTab === "products" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <h2 style={{ fontSize: "20px", fontWeight: "600" }}>📦 المنتجات</h2>
              <button
                onClick={() => setShowProductModal(true)}
                style={{ background: "#10b981", color: "white", border: "none", padding: "8px 20px", borderRadius: "40px", cursor: "pointer" }}
              >
                ➕ إضافة منتج
              </button>
            </div>
            <DataTable
              columns={[
                { key: "name", label: "المنتج" },
                { key: "price", label: "سعر البيع" },
              ]}
              data={getFilteredData(products)}
              onDelete={(id) => deleteItem("/api/products", id, "المنتج")}
            />
          </div>
        )}

        {/* Suppliers */}
        {activeTab === "suppliers" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <h2 style={{ fontSize: "20px", fontWeight: "600" }}>🏭 الموردين</h2>
              <button
                onClick={() => setShowSupplierModal(true)}
                style={{ background: "#10b981", color: "white", border: "none", padding: "8px 20px", borderRadius: "40px", cursor: "pointer" }}
              >
                ➕ إضافة مورد
              </button>
            </div>
            <DataTable
              columns={[
                { key: "name", label: "المورد" },
                { key: "phone", label: "الهاتف" },
                { key: "address", label: "العنوان" },
              ]}
              data={getFilteredData(suppliers)}
              onDelete={(id) => deleteItem("/api/mfg-suppliers", id, "المورد")}
            />
          </div>
        )}

        {/* Production Steps */}
        {activeTab === "steps" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <h2 style={{ fontSize: "20px", fontWeight: "600" }}>⚙️ مراحل الإنتاج</h2>
              <button
                onClick={() => setShowStepModal(true)}
                style={{ background: "#10b981", color: "white", border: "none", padding: "8px 20px", borderRadius: "40px", cursor: "pointer" }}
              >
                ➕ إضافة مرحلة
              </button>
            </div>
            <DataTable
              columns={[
                { key: "name", label: "المرحلة" },
                { key: "hourly_rate", label: "سعر الساعة" },
                { key: "hours", label: "ساعات/وحدة" },
              ]}
              data={getFilteredData(productionSteps)}
              onDelete={(id) => deleteItem("/api/production-steps", id, "المرحلة")}
            />
          </div>
        )}

        {/* Production Orders */}
        {activeTab === "production" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <h2 style={{ fontSize: "20px", fontWeight: "600" }}>📝 أوامر التصنيع</h2>
              <button
                onClick={() => setShowWorkOrderModal(true)}
                style={{ background: "#10b981", color: "white", border: "none", padding: "8px 20px", borderRadius: "40px", cursor: "pointer" }}
              >
                ➕ أمر تصنيع
              </button>
            </div>
            {workOrders.map((order) => (
              <div
                key={order.id}
                style={{
                  background: darkMode ? "#1e293b" : "white",
                  padding: "20px",
                  marginBottom: "16px",
                  borderRadius: "16px",
                  border: darkMode ? "1px solid #334155" : "1px solid #e2e8f0",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
                  <div>
                    <strong style={{ fontSize: "16px" }}>{order.product_name}</strong> - الكمية: {order.quantity} - الحالة:{" "}
                    {order.status === "pending" ? "⏳ معلق" : order.status === "in-progress" ? "🔄 جاري" : "✅ مكتمل"}
                  </div>
                  <div>
                    {order.status === "pending" && (
                      <button
                        onClick={() => startProduction(order.id)}
                        style={{
                          background: "#10b981",
                          color: "white",
                          border: "none",
                          padding: "6px 16px",
                          borderRadius: "20px",
                          marginLeft: "8px",
                          cursor: "pointer",
                        }}
                      >
                        ▶️ بدء
                      </button>
                    )}
                    {order.status === "in-progress" && (
                      <button
                        onClick={() => completeProduction(order.id)}
                        style={{
                          background: "#10b981",
                          color: "white",
                          border: "none",
                          padding: "6px 16px",
                          borderRadius: "20px",
                          cursor: "pointer",
                        }}
                      >
                        ✅ إكمال
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {workOrders.length === 0 && (
              <div style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>لا توجد أوامر تصنيع</div>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      <Modal isOpen={showMaterialModal} onClose={() => setShowMaterialModal(false)} title="🧱 إضافة مادة خام">
        <input
          type="text"
          placeholder="اسم المادة"
          value={newMaterial.name}
          onChange={(e) => setNewMaterial({ ...newMaterial, name: e.target.value })}
          style={{ width: "100%", padding: "12px", marginBottom: "12px", border: "1px solid #e2e8f0", borderRadius: "8px" }}
        />
        <input
          type="number"
          placeholder="سعر الوحدة"
          value={newMaterial.cost}
          onChange={(e) => setNewMaterial({ ...newMaterial, cost: e.target.value })}
          style={{ width: "100%", padding: "12px", marginBottom: "12px", border: "1px solid #e2e8f0", borderRadius: "8px" }}
        />
        <input
          type="number"
          placeholder="الكمية"
          value={newMaterial.stock}
          onChange={(e) => setNewMaterial({ ...newMaterial, stock: e.target.value })}
          style={{ width: "100%", padding: "12px", marginBottom: "12px", border: "1px solid #e2e8f0", borderRadius: "8px" }}
        />
        <button
          onClick={addRawMaterial}
          style={{ width: "100%", padding: "12px", background: "#10b981", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", marginTop: "8px" }}
        >
          إضافة
        </button>
      </Modal>

      <Modal isOpen={showProductModal} onClose={() => setShowProductModal(false)} title="📦 إضافة منتج">
        <input
          type="text"
          placeholder="اسم المنتج"
          value={newProduct.name}
          onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
          style={{ width: "100%", padding: "12px", marginBottom: "12px", border: "1px solid #e2e8f0", borderRadius: "8px" }}
        />
        <input
          type="number"
          placeholder="سعر البيع"
          value={newProduct.price}
          onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
          style={{ width: "100%", padding: "12px", marginBottom: "12px", border: "1px solid #e2e8f0", borderRadius: "8px" }}
        />
        <button
          onClick={addProduct}
          style={{ width: "100%", padding: "12px", background: "#10b981", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", marginTop: "8px" }}
        >
          إضافة
        </button>
      </Modal>

      <Modal isOpen={showWorkOrderModal} onClose={() => setShowWorkOrderModal(false)} title="📝 أمر تصنيع جديد">
        <select
          value={newWorkOrder.productId}
          onChange={(e) => setNewWorkOrder({ ...newWorkOrder, productId: e.target.value })}
          style={{ width: "100%", padding: "12px", marginBottom: "12px", border: "1px solid #e2e8f0", borderRadius: "8px" }}
        >
          <option value="">اختر المنتج</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
        <input
          type="number"
          placeholder="الكمية"
          value={newWorkOrder.quantity}
          onChange={(e) => setNewWorkOrder({ ...newWorkOrder, quantity: e.target.value })}
          style={{ width: "100%", padding: "12px", marginBottom: "12px", border: "1px solid #e2e8f0", borderRadius: "8px" }}
        />
        <button
          onClick={addWorkOrder}
          style={{ width: "100%", padding: "12px", background: "#10b981", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", marginTop: "8px" }}
        >
          إضافة
        </button>
      </Modal>

      <Modal isOpen={showSupplierModal} onClose={() => setShowSupplierModal(false)} title="🏭 إضافة مورد">
        <input
          type="text"
          placeholder="اسم المورد"
          value={newSupplier.name}
          onChange={(e) => setNewSupplier({ ...newSupplier, name: e.target.value })}
          style={{ width: "100%", padding: "12px", marginBottom: "12px", border: "1px solid #e2e8f0", borderRadius: "8px" }}
        />
        <input
          type="text"
          placeholder="الهاتف"
          value={newSupplier.phone}
          onChange={(e) => setNewSupplier({ ...newSupplier, phone: e.target.value })}
          style={{ width: "100%", padding: "12px", marginBottom: "12px", border: "1px solid #e2e8f0", borderRadius: "8px" }}
        />
        <input
          type="text"
          placeholder="العنوان"
          value={newSupplier.address}
          onChange={(e) => setNewSupplier({ ...newSupplier, address: e.target.value })}
          style={{ width: "100%", padding: "12px", marginBottom: "12px", border: "1px solid #e2e8f0", borderRadius: "8px" }}
        />
        <button
          onClick={addSupplier}
          style={{ width: "100%", padding: "12px", background: "#10b981", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", marginTop: "8px" }}
        >
          إضافة
        </button>
      </Modal>

      <Modal isOpen={showStepModal} onClose={() => setShowStepModal(false)} title="⚙️ إضافة مرحلة إنتاج">
        <input
          type="text"
          placeholder="اسم المرحلة"
          value={newStep.name}
          onChange={(e) => setNewStep({ ...newStep, name: e.target.value })}
          style={{ width: "100%", padding: "12px", marginBottom: "12px", border: "1px solid #e2e8f0", borderRadius: "8px" }}
        />
        <input
          type="number"
          placeholder="سعر الساعة"
          value={newStep.hourlyRate}
          onChange={(e) => setNewStep({ ...newStep, hourlyRate: e.target.value })}
          style={{ width: "100%", padding: "12px", marginBottom: "12px", border: "1px solid #e2e8f0", borderRadius: "8px" }}
        />
        <input
          type="number"
          placeholder="ساعات/وحدة"
          value={newStep.hours}
          onChange={(e) => setNewStep({ ...newStep, hours: e.target.value })}
          style={{ width: "100%", padding: "12px", marginBottom: "12px", border: "1px solid #e2e8f0", borderRadius: "8px" }}
        />
        <button
          onClick={addProductionStep}
          style={{ width: "100%", padding: "12px", background: "#10b981", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", marginTop: "8px" }}
        >
          إضافة
        </button>
      </Modal>
    </div>
  );
}
