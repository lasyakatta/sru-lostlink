import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [user, setUser] = useState(null);
  const [items, setItems] = useState([]);

  const [isRegister, setIsRegister] = useState(false);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const [messages, setMessages] = useState([]);
  const [showMessages, setShowMessages] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    type: "",
    contact: ""
  });

  const [auth, setAuth] = useState({
    name: "",
    email: "",
    password: ""
  });

  const fetchItems = () => {
    axios.get("https://sru-lostlink.onrender.com/items")
      .then(res => setItems(res.data));
  };

  useEffect(() => {
    if (user) fetchItems();
  }, [user]);

  const fetchMessages = () => {
    axios.get(`https://sru-lostlink.onrender.com/messages/${user.email}`)
      .then(res => {
        setMessages(res.data);
        setShowMessages(true);
      });
  };

  // ✅ DELETE MESSAGE FUNCTION
  const deleteMessage = (id) => {
    if (!window.confirm("Delete this message?")) return;

    axios.delete(`https://sru-lostlink.onrender.com/message/${id}`)
      .then(() => {
        setMessages(messages.filter(msg => msg._id !== id));
      })
      .catch(() => alert("Error deleting message"));
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAuthChange = (e) => {
    setAuth({ ...auth, [e.target.name]: e.target.value });
  };

  // ADD ITEM
  const addItem = (e) => {
    e.preventDefault();

    if (!form.title || !form.description || !form.location || !form.type || !form.contact) {
      alert("Please fill all fields");
      return;
    }

    axios.post("https://sru-lostlink.onrender.com/items", {
      ...form,
      userEmail: user.email
    })
      .then(() => {
        fetchItems();
        setForm({
          title: "",
          description: "",
          location: "",
          type: "",
          contact: ""
        });
      });
  };

  // DELETE ITEM
  const deleteItem = (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;

    axios.delete(`https://sru-lostlink.onrender.com/items/${id}`, {
      data: { userEmail: user.email }
    })
      .then(() => fetchItems())
      .catch(() => alert("Not allowed"));
  };

  // SEND MESSAGE
  const sendMessage = (item) => {
    const defaultMessage =
      item.type === "lost"
        ? "Hi, I think I found your item."
        : "Hi, this item belongs to me.";

    const text = prompt("Enter your message", defaultMessage);
    if (!text) return;

    const contactNumber = prompt("Enter your contact number");
    if (!contactNumber) return;

    axios.post("https://sru-lostlink.onrender.com/message", {
      itemId: item._id,
      senderEmail: user.email,
      receiverEmail: item.userEmail,
      message: text,
      contact: contactNumber
    })
      .then(() => alert("Message sent"))
      .catch(() => alert("Error sending message"));
  };

  // REGISTER
  const register = () => {
    if (!auth.name || !auth.email || !auth.password) {
      alert("Please fill all fields");
      return;
    }

    axios.post("https://sru-lostlink.onrender.com/register", auth)
      .then(() => {
        alert("Registered successfully");
        setIsRegister(false);
      })
      .catch(() => alert("Error registering"));
  };

  // LOGIN
  const login = () => {
    if (!auth.email || !auth.password) {
      alert("Please enter email and password");
      return;
    }

    axios.post("https://sru-lostlink.onrender.com/login", auth)
      .then(res => setUser(res.data))
      .catch(() => alert("Invalid credentials"));
  };

  const logout = () => {
    setUser(null);
  };

  const filteredItems = items.filter(item =>
    item.title.toLowerCase().includes(search.toLowerCase()) &&
    (filter === "all" || item.type === filter)
  );

  // LOGIN / REGISTER
  if (!user) {
    return (
      <div className="center-box">
        <div className="card" style={{ width: "300px" }}>
          <div style={{ textAlign: "center", marginBottom: "15px" }}>
            <h1 style={{ margin: 0, color: "#0d5297" }}>SRU LostLink</h1>
            <p style={{ fontSize: "12px", color: "#272626" }}>
              Find what you lost. Return what you found.
            </p>
          </div>

          <h2 style={{ textAlign: "center" }}>
            {isRegister ? "Register" : "Login"}
          </h2>

          {isRegister && (
            <input className="input" name="name" placeholder="Name" onChange={handleAuthChange} />
          )}

          <input className="input" name="email" placeholder="Email" onChange={handleAuthChange} />
          <div style={{ position: "relative" }}>
  <input
    className="input"
    type={showPassword ? "text" : "password"}
    name="password"
    placeholder="Password"
    onChange={handleAuthChange}
  />

  <span
    onClick={() => setShowPassword(!showPassword)}
    style={{
      position: "absolute",
      right: "10px",
      top: "50%",
      transform: "translateY(-50%)",
      cursor: "pointer",
      fontSize: "12px",
      color: "#555"
    }}
  >
    {showPassword ? "Hide" : "Show"}
  </span>
</div>

          {isRegister ? (
            <>
              <button className="button btn-blue" onClick={register}>Register</button>
              <p style={{ textAlign: "center", marginTop: "10px" }}>
                Already have account?{" "}
                <span style={{ color: "blue", cursor: "pointer" }} onClick={() => setIsRegister(false)}>
                  Login
                </span>
              </p>
            </>
          ) : (
            <>
              <button className="button btn-green" onClick={login}>Login</button>
              <p style={{ textAlign: "center", marginTop: "10px" }}>
                No account?{" "}
                <span style={{ color: "blue", cursor: "pointer" }} onClick={() => setIsRegister(true)}>
                  Register
                </span>
              </p>
            </>
          )}
        </div>
      </div>
    );
  }

  // DASHBOARD
  return (
    <div className="container">

      <div className="header">
        <h1 className="logo">SRU LostLink</h1>
        <p className="tagline">Find what you lost. Return what you found.</p>
        <h3>Welcome {user.name} 🎉</h3>

        <div style={{ display: "flex", gap: "10px" }}>
          <button className="button btn-blue" onClick={fetchMessages}>
            View Requests
          </button>

          <button className="button btn-red" onClick={logout}>
            Logout
          </button>
        </div>
      </div>

      {/* MESSAGES */}
      {showMessages && (
        <div className="card" style={{ marginBottom: "20px" }}>
          <h3>Requests</h3>

          {messages.length === 0 ? (
            <p>No messages yet</p>
          ) : (
            messages.map((msg, index) => (
              <div key={index} style={{
                border: "1px solid #ccc",
                padding: "10px",
                marginBottom: "10px",
                borderRadius: "8px"
              }}>
                <p><b>From:</b> {msg.senderEmail}</p>
                <p>{msg.message}</p>
                <p><b>Contact:</b> {msg.contact}</p>

                {/* ✅ SMALL DELETE BUTTON */}
                <button
                  onClick={() => deleteMessage(msg._id)}
                  style={{
                    background: "#e74c3c",
                    color: "white",
                    border: "none",
                    padding: "5px 10px",
                    borderRadius: "6px",
                    fontSize: "12px",
                    cursor: "pointer",
                    marginTop: "6px"
                  }}
                >
                  Delete
                </button>
              </div>
            ))
          )}

          <button className="button btn-red" onClick={() => setShowMessages(false)}>
            Close
          </button>
        </div>
      )}

      <div className="dashboard">

        <div className="card">
          <h3>Add Item</h3>

          <form onSubmit={addItem}>
            <input className="input" name="title" placeholder="Title" value={form.title} onChange={handleChange} />
            <input className="input" name="description" placeholder="Description" value={form.description} onChange={handleChange} />
            <input className="input" name="location" placeholder="Location" value={form.location} onChange={handleChange} />

            <select className="input" name="type" value={form.type} onChange={handleChange}>
              <option value="">Select Type</option>
              <option value="lost">Lost</option>
              <option value="found">Found</option>
            </select>

            <input className="input" name="contact" placeholder="Contact" value={form.contact} onChange={handleChange} />

            <button className="button btn-blue">Add Item</button>
          </form>
        </div>

        <div style={{ flex: 1 }}>
          <div className="search-bar">
            <input className="input" placeholder="Search items..." onChange={(e) => setSearch(e.target.value)} />

            <select className="input" onChange={(e) => setFilter(e.target.value)}>
              <option value="all">All</option>
              <option value="lost">Lost</option>
              <option value="found">Found</option>
            </select>
          </div>

          <div className="grid">
            {filteredItems.map(item => (
              <div key={item._id} className="card">
                <h4>{item.title}</h4>
                <p>{item.description}</p>
                <p><b>Location:</b> {item.location}</p>
                <p><b>Type:</b> {item.type}</p>
                <p><b>Contact:</b> {item.contact}</p>

                {item.userEmail === user.email && (
                  <button className="button btn-red" onClick={() => deleteItem(item._id)}>
                    Delete
                  </button>
                )}

                {item.userEmail !== user.email && (
                  <button
                    className="button btn-green"
                    style={{ marginTop: "10px" }}
                    onClick={() => sendMessage(item)}
                  >
                    {item.type === "lost" ? "I Found This" : "This is Mine"}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

export default App;
