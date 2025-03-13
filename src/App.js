import React, { useState, useEffect } from 'react';
import './App.css';
import { Eye } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; 
import { useRef } from "react";

// Home component with a school-related image

const Home = () => {
  const [selectedSubject, setSelectedSubject] = useState("");
  const [meetingActive, setMeetingActive] = useState(false);
  const jitsiContainer = useRef(null);
  const jitsiApiRef = useRef(null);

  const subjects = ["DSA", "Competitive_Programming", "Math", "Computer_Network"];

  const startMeeting = async () => {
    if (!selectedSubject) {
      alert("Please select a subject.");
      return;
    }
  
    try {
      const response = await fetch(`https://cloudvendor-1.onrender.com/cloudvendor/create/${selectedSubject}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const url = await response.text();
      console.log("Meeting URL from backend:", url); // ✅ Log the URL for debugging
  
      if (!url.startsWith("http")) {
        throw new Error("Invalid meeting URL received from backend.");
      }
  
      // ✅ Open Jitsi meeting in a new tab instead of embedding
      window.open(url, "_blank");
    } catch (error) {
      console.error("Error starting meeting:", error);
      alert("Failed to start the meeting. Check backend server.");
    }
  };
  
  const initializeJitsi = (meetingUrl) => {
    if (typeof window.JitsiMeetExternalAPI !== "function") {
      console.error("Jitsi Meet API is not available. Check if script is loaded.");
      return;
    }
  
    const domain = "meet.jit.si";
    const roomName = new URL(meetingUrl).pathname.split("/").pop();
  
    console.log("Initializing Jitsi with room:", roomName);
  
    const options = {
      roomName: roomName,
      parentNode: jitsiContainer.current,
      width: "100%",
      height: "600px",
      interfaceConfigOverwrite: {
        SHOW_JITSI_WATERMARK: false,
        SHOW_WATERMARK_FOR_GUESTS: false,
        TOOLBAR_BUTTONS: ["microphone", "camera", "chat", "hangup"],
      },
    };
  
    jitsiApiRef.current = new window.JitsiMeetExternalAPI(domain, options);
  
    // ✅ Override the default close event to prevent redirecting
    jitsiApiRef.current.addEventListener("readyToClose", () => {
      console.log("Meeting ended. Closing Jitsi...");
      
      // ✅ Forcefully remove Jitsi iframe to prevent redirect
      if (jitsiContainer.current) {
        jitsiContainer.current.innerHTML = ""; // Remove the Jitsi iframe
      }
  
      // ✅ Destroy Jitsi API instance
      if (jitsiApiRef.current) {
        jitsiApiRef.current.dispose();
        jitsiApiRef.current = null;
      }
  
      // ✅ Hide Jitsi and return to home page
      setMeetingActive(false);
    });
  };
  

  return (
    <div className="page home">
      {!meetingActive ? (
        <>
          <h1>Welcome</h1>
          <p>Class will start in a few hours.</p>

          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            style={{
              padding: "10px",
              fontSize: "16px",
              margin: "10px",
              width: "250px",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
          >
            <option value="">Select a Subject</option>
            {subjects.map((subject) => (
              <option key={subject} value={subject}>
                {subject.replace("_", " ")}
              </option>
            ))}
          </select>

          <button
            onClick={startMeeting}
            style={{
              padding: "10px 20px",
              fontSize: "16px",
              backgroundColor: "#007bff",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Start / Join {selectedSubject || "Class"} Meeting
          </button>
        </>
      ) : (
        <div ref={jitsiContainer} style={{ width: "100%", height: "600px" }} />
      )}
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

    fetch("https://cloudvendor-1.onrender.com/cloudvendor/set", {
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

  // Function to generate a styled PDF
  const ResultShow = () => {
    const [results, setResults] = useState([]);
  
    // Fetch results from the API
    useEffect(() => {
      fetch("https://cloudvendor-1.onrender.com/cloudvendor/cloudsets", {
        headers: { "Content-Type": "application/json" },
      })
        .then((res) => res.json())
        .then((data) => setResults(data))
        .catch((error) => console.error("Error fetching results:", error));
    }, []);
  
    // Function to generate a styled PDF
    const generateStyledPDF = (result) => {
      const doc = new jsPDF();
  
      // Styled Title
      doc.setFont("helvetica", "bold");
      doc.setFontSize(22);
      doc.setTextColor(106, 17, 203); // Purple Color
      doc.text("Vendor Report", 14, 20);
  
      // Subheading
      doc.setFont("helvetica", "normal");
      doc.setFontSize(14);
      doc.setTextColor(37, 117, 252);
      doc.text("Detailed Vendor Information", 14, 30);
  
      // Vendor Details
      const details = [
        ["Vendor ID", result.vendorId],
        ["Vendor Name", result.vendorName || "N/A"],
        ["Subject", result.subject || "N/A"],
        ["Marks", result.marks || "N/A"],
      ];
  
      autoTable(doc, {
        startY: 40,
        body: details.map(([key, value]) => [key, value]),
        theme: "grid",
        styles: { fontSize: 11, cellPadding: 4 },
        columnStyles: { 0: { fontStyle: "bold", textColor: [106, 17, 203] } },
      });
  
      // Footer
      const pageHeight = doc.internal.pageSize.height;
      doc.setFont("helvetica", "italic");
      doc.setFontSize(10);
      doc.setTextColor(150, 150, 150);
      doc.text("Generated by Vendor System", 14, pageHeight - 10);
  
      // Open PDF in New Tab
      const pdfBlob = doc.output("blob");
      const pdfUrl = URL.createObjectURL(pdfBlob);
      window.open(pdfUrl, "_blank");
    };
  
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
                      onClick={() => generateStyledPDF(result)} // ✅ Correct function call
                      style={{ cursor: "pointer", color: "#2575fc", fontSize: "20px" }}
                    />
                  ) : (
                    "No PDF available"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
const FaceComponent = () => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [message, setMessage] = useState("");
    const [userName, setUserName] = useState(""); // State for student's name

    // Start Camera and Auto Capture
    const startCameraAndDetect = async () => {
        if (!userName.trim()) {
            setMessage("Please enter your name.");
            return;
        }

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            videoRef.current.srcObject = stream;

            // Wait a bit before capturing the image
            setTimeout(() => captureImage(), 2000);
        } catch (error) {
            console.error("Error accessing webcam:", error);
            setMessage("Webcam access denied.");
        }
    };

    // Capture Image and Send to API
   const FaceComponent = () => {
    const videoRef = useRef(null);
    const [message, setMessage] = useState("");
    const [userName, setUserName] = useState(""); // State for student's name

    // Start Camera and Send Name as JSON
    const startCameraAndSendName = async () => {
        if (!userName.trim()) {
            setMessage("Please enter your name.");
            return;
        }

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            videoRef.current.srcObject = stream;

            // Wait a bit before sending the JSON request
            setTimeout(() => sendNameAsJson(), 2000);
        } catch (error) {
            console.error("Error accessing webcam:", error);
            setMessage("Webcam access denied.");
        }
    };

    // Send Name as JSON to API
    const sendNameAsJson = async () => {
        const apiUrl = `https://mypythonproject.onrender.com/capture_faces`;

        try {
            const response = await fetch(apiUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: userName }),
            });

            const data = await response.json();
            setMessage(data.message || "Name sent successfully");
        } catch (error) {
            console.error("Error:", error);
            setMessage("Error processing request.");
        }
    };

    return (
        <div className="flex flex-col items-center p-4">
            <video ref={videoRef} autoPlay className="w-96 border-2 border-gray-500"></video>

            {/* Name Input Field */}
            <input
                type="text"
                placeholder="Enter your name"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="mt-4 p-2 border rounded w-80"
            />

            <button onClick={startCameraAndSendName} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
                Start Camera & Send Name
            </button>

            {message && <p className="mt-4 text-lg text-gray-700">{message}</p>}
        </div>
    );
};
// Main App component with authentication, fancy navigation, and logout
const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState('login'); // Default to login

  // Check if the user is already logged in (via localStorage) when the app loads
  useEffect(() => {
    const authStatus = JSON.parse(localStorage.getItem('isAuthenticated') || 'false'); // Ensure it's parsed as boolean
    setIsAuthenticated(authStatus);
    setCurrentPage(authStatus ? 'home' : 'login'); // Direct to the right page
  }, []);

  // Callback for successful login
  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    localStorage.setItem('isAuthenticated', JSON.stringify(true)); // Ensure consistent storage
    setCurrentPage('home');
  };

  // Logout function
  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isAuthenticated');
    setCurrentPage('login');
  };

  // Render the appropriate page
  const renderPage = () => {
    switch (currentPage) {
      case 'login':
        return <Login onLoginSuccess={handleLoginSuccess} />;
      case 'home':
        return <Home />;
      case 'registration':
        return <Registration />;
      case 'allVendors':
        return <AllVendors />;
      case 'search':
        return <SearchVendor />;
      case 'ResultAddition':
        return <ResultAddition />;
      case 'ResultShow':
        return <ResultShow />;
      case 'FaceComponent':
        return <FaceComponent />;
      default:
        return <Login onLoginSuccess={handleLoginSuccess} />;
    }
  };

  return (
    <div className="App">
      <nav className="navbar">
        <div className="nav-left">
          <h2 className="logo">My Student APP</h2>
        </div>
        <div className="nav-right">
          {isAuthenticated && (
            <>
              <button className="nav-btn" onClick={() => setCurrentPage('home')}>Home</button>
              <button className="nav-btn" onClick={() => setCurrentPage('registration')}>Registration</button>
              <button className="nav-btn" onClick={() => setCurrentPage('allVendors')}>All Vendors</button>
              <button className="nav-btn" onClick={() => setCurrentPage('search')}>Search</button>
              <button className="nav-btn" onClick={() => setCurrentPage('ResultAddition')}>Result Addition</button>
              <button className="nav-btn" onClick={() => setCurrentPage('ResultShow')}>Result Show</button>
              <button className="nav-btn" onClick={() => setCurrentPage('FaceComponent')}>FaceComponent</button>
              <button className="nav-btn logout" onClick={handleLogout}>Logout</button>
            </>
          )}
        </div>
      </nav>
      <div className="content">{renderPage()}</div>
    </div>
  );
};

export default App;
