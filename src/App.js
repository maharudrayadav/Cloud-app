import React, { useState, useEffect } from 'react';
import './App.css';

// Home component with a school-related image
const Home = () => {
  return (
    <div className="page home">
      <h1>Welcome Home</h1>
      <div className="home-image-container">
        {/* Use an alternative image URL for the school campus */}
        <img
          src="https://picsum.photos/600/300?random=1"
          alt="School Campus"
          className="home-img"
        />
      </div>
      <p>
        This is the Home page. Use the navigation menu to register vendors, view all vendors, or search for a vendor.
      </p>
    </div>
  );
};

// Login component with a school-related image above the login form.
// It validates that the email ends with "@gmail.com" and that the password is at least 5 characters.
const Login = ({ onLoginSuccess }) => {
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Frontend validation for email and password:
    if (!loginData.email.trim().toLowerCase().endsWith('@gmail.com')) {
      alert('Please enter a valid Gmail address.');
      return;
    }
    if (loginData.password.length < 5) {
      alert('Password must be at least 5 characters long.');
      return;
    }
    // Directly accept login for demonstration purposes.
    alert('Login successful!');
    localStorage.setItem('isAuthenticated', 'true');  // Save auth state to localStorage
    onLoginSuccess();
  };

  return (
    <div className="page login">
      <h1>Login</h1>
      <div className="login-image-container">
        {/* Alternative image URL for a school photo */}
        <img
          src="https://picsum.photos/300/200?random=2"
          alt="School"
          className="login-img"
        />
      </div>
      <form onSubmit={handleSubmit} className="form-container">
        <input
          type="email"
          name="email"
          placeholder="Gmail Address"
          value={loginData.email}
          onChange={handleChange}
          required
          className="input-field"
        />
        <input
          type="password"
          name="password"
          placeholder="Password (min 5 characters)"
          value={loginData.password}
          onChange={handleChange}
          required
          className="input-field"
        />
        <button type="submit" className="btn primary">Login</button>
      </form>
    </div>
  );
};

// Registration component for adding a new vendor
const Registration = () => {
  const [vendorData, setVendorData] = useState({
    vendorId: '',
    vendorName: '',
    vendorAddress: '',
    vendorPhoneNumber: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVendorData({ ...vendorData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('extensive-marguerite-yaharudrayadav-3e2385cd.koyeb.app/cloudvendor', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(vendorData)
    })
      .then((res) => {
        if (res.ok) {
          alert('Vendor registered successfully');
          setVendorData({
            vendorId: '',
            vendorName: '',
            vendorAddress: '',
            vendorPhoneNumber: ''
          });
        } else {
          alert('Error registering vendor');
        }
      })
      .catch((error) => console.error('Error:', error));
  };

  return (
    <div className="page registration">
      <h1>Vendor Registration</h1>
      <form onSubmit={handleSubmit} className="form-container">
        <input
          type="text"
          name="vendorId"
          placeholder="Vendor ID"
          value={vendorData.vendorId}
          onChange={handleChange}
          required
          className="input-field"
        />
        <input
          type="text"
          name="vendorName"
          placeholder="Vendor Name"
          value={vendorData.vendorName}
          onChange={handleChange}
          required
          className="input-field"
        />
        <input
          type="text"
          name="vendorAddress"
          placeholder="Vendor Address"
          value={vendorData.vendorAddress}
          onChange={handleChange}
          className="input-field"
        />
        <input
          type="text"
          name="vendorPhoneNumber"
          placeholder="Vendor Phone Number"
          value={vendorData.vendorPhoneNumber}
          onChange={handleChange}
          className="input-field"
        />
        <button type="submit" className="btn primary">Register</button>
      </form>
    </div>
  );
};

// AllVendors component to list all registered vendors
const AllVendors = () => {
  const [vendors, setVendors] = useState([]);

  const fetchVendors = () => {
    fetch('extensive-marguerite-yaharudrayadav-3e2385cd.koyeb.app//cloudvendor', {
      headers: { 'Content-Type': 'application/json' }
    })
      .then((res) => res.json())
      .then((data) => setVendors(data))
      .catch((error) => console.error('Error fetching vendors:', error));
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  return (
    <div className="page all-vendors">
      <h1>All Vendors</h1>
      <table className="styled-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Address</th>
            <th>Phone</th>
          </tr>
        </thead>
        <tbody>
          {vendors.map((vendor, index) => (
            <tr key={index}>
              <td>{vendor.vendorId}</td>
              <td>{vendor.vendorName}</td>
              <td>{vendor.vendorAddress}</td>
              <td>{vendor.vendorPhoneNumber}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// SearchVendor component to search a vendor by ID
const SearchVendor = () => {
  const [searchId, setSearchId] = useState('');
  const [searchResult, setSearchResult] = useState(null);

  const handleSearch = (e) => {
    e.preventDefault();
    fetch('https://cloudvendor-1.onrender.com/cloudvendor/id', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: searchId })
    })
      .then((res) => res.json())
      .then((data) => setSearchResult(data))
      .catch((error) => console.error('Search error:', error));
  };

  return (
    <div className="page search">
      <h1>Search Vendor</h1>
      <form onSubmit={handleSearch} className="form-container">
        <input
          type="text"
          placeholder="Enter Vendor ID"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          required
          className="input-field"
        />
        <button type="submit" className="btn secondary">Search</button>
      </form>
      {searchResult && (
        <div className="search-result">
          <h3>Search Result:</h3>
          <table className="styled-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Address</th>
                <th>Phone</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{searchResult.vendorId}</td>
                <td>{searchResult.vendorName}</td>
                <td>{searchResult.vendorAddress}</td>
                <td>{searchResult.vendorPhoneNumber}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// Main App component with authentication, fancy navigation, and logout
const App = () => {
  const [currentPage, setCurrentPage] = useState('login'); // Show login first
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if the user is already logged in (via localStorage) when the app loads
  useEffect(() => {
    const authStatus = localStorage.getItem('isAuthenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
      setCurrentPage('home');
    }
  }, []);

  // Callback for successful login
  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setCurrentPage('home');
  };

  // Logout function clears authentication and localStorage
  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isAuthenticated');
    setCurrentPage('login');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home />;
      case 'registration':
        return <Registration />;
      case 'allVendors':
        return <AllVendors />;
      case 'search':
        return <SearchVendor />;
      case 'login':
        return <Login onLoginSuccess={handleLoginSuccess} />;
      default:
        return <Home />;
    }
  };

  return (
    <div className="App">
      <nav className="navbar">
        <div className="nav-left">
          <h2 className="logo">My Student APP</h2>
        </div>
        <div className="nav-right">
          <button className="nav-btn" onClick={() => setCurrentPage('home')}>Home</button>
          <button className="nav-btn" onClick={() => setCurrentPage('registration')}>Registration</button>
          <button className="nav-btn" onClick={() => setCurrentPage('allVendors')}>All Vendors</button>
          <button className="nav-btn" onClick={() => setCurrentPage('search')}>Search</button>
          {isAuthenticated && <button className="nav-btn logout" onClick={handleLogout}>Logout</button>}
        </div>
      </nav>
      <div className="content">{renderPage()}</div>
    </div>
  );
};

export default App;
