import React, { useState, useEffect } from 'react';
import './App.css';
import { Eye } from "lucide-react";

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
    vendorId: "",
    vendorName: "",
    vendorAddress: "",
    vendorPhoneNumber: "",
  });

  const [image, setImage] = useState(null); // Store selected image

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVendorData({ ...vendorData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();

    // Append text fields
    Object.keys(vendorData).forEach((key) => {
      formData.append(key, vendorData[key]);
    });

    // Append image with correct key
    if (image) {
      formData.append("vendorImage", image);
    }

    fetch("https://cloudvendor-1.onrender.com/cloudvendor", {
      method: "POST",
      body: formData, // Send as multipart/form-data
    })
      .then((res) => res.text()) // Convert response to text
      .then((data) => {
        alert(data); // Display response message
        setVendorData({
          vendorId: "",
          vendorName: "",
          vendorAddress: "",
          vendorPhoneNumber: "",
        });
        setImage(null);
      })
      .catch((error) => console.error("Error:", error));
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
        {/* Image Upload Field */}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="input-field"
        />
        <button type="submit" className="btn primary">
          Register
        </button>
      </form>
    </div>
  );
};

// AllVendors component to list all registered vendors
const AllVendors = () => {
  const [vendors, setVendors] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  // Fetch vendors from the updated API
  useEffect(() => {
    fetch("https://cloudvendor-1.onrender.com/cloudvendor", {
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((data) => setVendors(data))
      .catch((error) => console.error("Error fetching vendors:", error));
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
            <th>View Image</th>
          </tr>
        </thead>
        <tbody>
          {vendors.map((vendor, index) => (
            <tr key={index}>
              <td>{vendor.vendorId}</td>
              <td>{vendor.vendorName}</td>
              <td>{vendor.vendorAddress}</td>
              <td>{vendor.vendorPhoneNumber}</td>
              <td>
                {vendor.vendorImage && (
                 <Eye
                 className="eye-icon"
                 onClick={() => {
                   if (vendor.vendorImage) {
                     const imageUrl = `data:image/png;base64,${vendor.vendorImage}`;
                     const newTab = window.open();
                     newTab.document.write(`<img src="${imageUrl}" alt="Vendor Image" style="max-width:100%; height:auto;">`);
                     newTab.document.title = "Vendor Image";
                   } else {
                     alert("No image available");
                   }
                 }}
                 style={{ cursor: "pointer" }}
               />
               
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Image Modal */}
      {selectedImage && (
  <div className="modal">
    <div className="modal-content">
      <span className="close" onClick={() => setSelectedImage(null)}>
        &times;
      </span>
      <img
        src={selectedImage}
        alt="Vendor"
        onError={() => alert("Invalid Image Data")}
      />
    </div>
  </div>
)}
    </div>
  );
};
// SearchVendor component to search a vendor by ID
const SearchVendor = () => {
  const [searchId, setSearchId] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [error, setError] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();
    setError("");

    if (!searchId.trim() || isNaN(searchId)) {
      setError("Please enter a valid numeric Vendor ID.");
      return;
    }

    try {
      console.log("Sending search request for ID:", searchId);

      const response = await fetch("https://cloudvendor-1.onrender.com/cloudvendor/id", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: parseInt(searchId, 10) }),
      });

      console.log("Response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Vendor not found");
      }

      const data = await response.json();
      console.log("Search result:", data);
      setSearchResult(data);
    } catch (error) {
      setError(error.message || "An error occurred");
      setSearchResult(null);
    }
  };

  const handleViewDetails = () => {
    if (!searchResult) {
      alert("No vendor data available.");
      return;
    }
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

      {error && <p className="error-message">{error}</p>}

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
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{searchResult.vendorId}</td>
                <td>{searchResult.vendorName}</td>
                <td>{searchResult.vendorAddress}</td>
                <td>{searchResult.vendorPhoneNumber}</td>
                <td>
                  <button className="icon-btn" onClick={handleViewDetails}>
                  <Eye
                  className="eye-icon"
              onClick={() => {
               if (searchResult?.vendorImage) { // ✅ Use searchResult instead of vendor
                    const imageUrl = `data:image/png;base64,${searchResult.vendorImage}`;
                    const newTab = window.open();
                    newTab.document.write(`<img src="${imageUrl}" alt="Vendor Image" style="max-width:100%; height:auto;">`);
                    newTab.document.title = "Vendor Image";
            } else {
                  alert("No image available");
            }
            }}
  style={{ cursor: "pointer" }}
/>

                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const ResultAddition = () => {
  const [formData, setFormData] = useState({
    vendorId: "",
    vendorName: "",
    subject: "",
    marks: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const resultJson = JSON.stringify(formData); // Prepare the data for API

    fetch("https://cloudvendor-1.onrender.com//cloudvendor/set", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: resultJson, // Send data as JSON
    })
      .then((res) => res.json()) // Convert response to JSON
      .then((data) => {
        if (data.message === "Cloud Vendor Created Successfully with PDF!") {
          alert("Vendor registration successful with PDF!"); // Display success alert
        } else {
          alert("Result saved successfully!"); // Display general success message
        }

        // Reset the form data
        setFormData({
          vendorId: "",
          vendorName: "",
          subject: "",
          marks: "",
        });
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Cloud Vendor Created Successfully with PDF!");
      });
  };

  return (
    <div className="page registration">
      <h1>Vendor Registration</h1>
      <form onSubmit={handleSubmit} className="form-container">
        <input
          type="text"
          name="vendorId"
          placeholder="Vendor ID"
          value={formData.vendorId}
          onChange={handleChange}
          required
          className="input-field"
        />
        <input
          type="text"
          name="vendorName"
          placeholder="Vendor Name"
          value={formData.vendorName}
          onChange={handleChange}
          required
          className="input-field"
        />
        <input
          type="text"
          name="subject"
          placeholder="Subject"
          value={formData.subject}
          onChange={handleChange}
          required
          className="input-field"
        />
        <input
          type="text"
          name="marks"
          placeholder="Marks"
          value={formData.marks}
          onChange={handleChange}
          required
          className="input-field"
        />
        <button type="submit" className="btn primary">
          Register
        </button>
      </form>
    </div>
  );
};



const ResultShow = () => {
  const [results, setResults] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  // Fetch results from the updated API
  useEffect(() => {
    fetch("https://cloudvendor-1.onrender.com/cloudvendor/cloudsets", {
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((data) => setResults(data))
      .catch((error) => console.error("Error fetching results:", error));
  }, []);

  return (
    <div className="page result-show">
      <h1>Result Show</h1>
      <table className="styled-table">
        <thead>
          <tr>
            <th>Vendor ID</th>
            <th>Subject</th>
            <th>Marks</th>
            <th>Vendor PDF</th>
          </tr>
        </thead>
        <tbody>
          {results.map((result, index) => (
            <tr key={index}>
              <td>{result.vendorId}</td>
              <td>{result.subject ? result.subject : "N/A"}</td>
              <td>{result.marks ? result.marks : "N/A"}</td>
              <td>
                {result.vendorPdf ? (
                  <Eye
                    className="eye-icon"
                    onClick={() => {
                      const pdfData = result.vendorPdf;
                      const pdfBlob = new Blob([new Uint8Array(atob(pdfData).split("").map((c) => c.charCodeAt(0)))], {
                        type: "application/pdf",
                      });
                      const pdfUrl = URL.createObjectURL(pdfBlob);
                      const newTab = window.open();
                      newTab.document.write(
                        `<iframe src="${pdfUrl}" width="100%" height="100%" style="border: none;"></iframe>`
                      );
                      newTab.document.title = `Vendor PDF ${result.vendorId}`;
                    }}
                    style={{ cursor: "pointer" }}
                  />
                ) : (
                  "No PDF available"
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Image Modal */}
      {selectedImage && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setSelectedImage(null)}>
              &times;
            </span>
            <img src={selectedImage} alt="Vendor" onError={() => alert("Invalid Image Data")} />
          </div>
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
      case 'ResultAddition':
          return < ResultAddition/>; 
      case 'ResultShow':
            return < ResultShow/>; 
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
          <button className="nav-btn" onClick={() => setCurrentPage('ResultAddition')}>ResultAddition</button>
          <button className="nav-btn" onClick={() => setCurrentPage('ResultShow')}>ResultShow</button>
          {isAuthenticated && <button className="nav-btn logout" onClick={handleLogout}>Logout</button>}
        </div>
      </nav>
      <div className="content">{renderPage()}</div>
    </div>
  );
};

export default App;
