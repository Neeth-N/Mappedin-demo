import React, { useState, useEffect } from "react";
import { MapView, useMapData, useMap, Label } from "@mappedin/react-sdk";
import {
  Menu,
  X,
  Navigation,
  MapPin,
  Route,
  Layers,
  Trash2,
} from "lucide-react";
import "@mappedin/react-sdk/lib/esm/index.css";

function MyCustomComponent() {
  const { mapView, mapData } = useMap();
  const [labels, setLabels] = useState([]);
  const [selectedFloor, setSelectedFloor] = useState("");

  // Mobile menu state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Pathfinding state
  const [startSpace, setStartSpace] = useState(null);
  const [path, setPath] = useState(null);
  const [pathfindingEnabled, setPathfindingEnabled] = useState(false);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });

  // Input state
  const [fromInput, setFromInput] = useState("");
  const [toInput, setToInput] = useState("");

  // GPS-related state
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [nearestEntrance, setNearestEntrance] = useState(null);

  // Mobile menu toggle
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Notification helper function
  const showNotification = (message, type = "info") => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "" });
    }, 3000);
  };

  // GPS location function
  const getCurrentLocation = () => {
    setIsGettingLocation(true);
    setLocationError(null);

    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by this browser");
      setIsGettingLocation(false);
      showNotification("Geolocation not supported", "error");
      return;
    }

    const options = {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 60000, // Cache location for 1 minute
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        setUserLocation({ latitude, longitude, accuracy });
        setIsGettingLocation(false);

        showNotification(
          `Location acquired (±${Math.round(accuracy)}m accuracy)`,
          "success"
        );
        findNearestEntrance(latitude, longitude);
      },
      (error) => {
        let errorMessage = "Unable to get location";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location access denied by user";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information unavailable";
            break;
          case error.TIMEOUT:
            errorMessage = "Location request timed out";
            break;
        }
        setLocationError(errorMessage);
        setIsGettingLocation(false);
        showNotification(errorMessage, "error");
      },
      options
    );
  };

  // Calculate distance between two GPS coordinates (Haversine formula)
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371000; // Earth's radius in meters
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in meters
  };

  // Function to find nearest entrance based on GPS coordinates
  const findNearestEntrance = (userLat, userLon) => {
    if (!mapData) return;

    // Define building entrances with their GPS coordinates
    // Replace these with your actual building's entrance coordinates
    const buildingEntrances = [
      {
        name: "Main Entrance",
        latitude: 43.6532, // Replace with actual coordinates
        longitude: -79.3832,
        spaceNames: ["main entrance", "lobby", "reception"], // Possible space names
      },
      {
        name: "North Entrance",
        latitude: 43.6535,
        longitude: -79.3835,
        spaceNames: ["north entrance", "north lobby", "side entrance"],
      },
      {
        name: "South Entrance",
        latitude: 43.653,
        longitude: -79.383,
        spaceNames: ["south entrance", "south lobby", "back entrance"],
      },
    ];

    // Calculate distance to each entrance
    let nearestEntrance = null;
    let minDistance = Infinity;

    buildingEntrances.forEach((entrance) => {
      const distance = calculateDistance(
        userLat,
        userLon,
        entrance.latitude,
        entrance.longitude
      );

      if (distance < minDistance) {
        minDistance = distance;
        nearestEntrance = { ...entrance, distance };
      }
    });

    if (nearestEntrance && minDistance < 1000) {
      // Within 1km of building
      setNearestEntrance(nearestEntrance);

      // Try to find the corresponding space in map data
      const spaces = mapData.getByType("space");
      let entranceSpace = null;

      // Look for spaces that match the entrance names
      for (const spaceName of nearestEntrance.spaceNames) {
        entranceSpace = spaces.find(
          (space) =>
            space.name &&
            space.name.toLowerCase().includes(spaceName.toLowerCase())
        );
        if (entranceSpace) break;
      }

      // If no specific entrance space found, use the first space as fallback
      if (!entranceSpace && spaces.length > 0) {
        entranceSpace = spaces[0];
      }

      if (entranceSpace) {
        setStartSpace(entranceSpace);
        setFromInput(entranceSpace.name || "GPS Location");
        showNotification(
          `Starting from ${nearestEntrance.name} (${Math.round(
            minDistance
          )}m away)`,
          "success"
        );
      } else {
        showNotification(
          `Nearest entrance: ${nearestEntrance.name}, but space not found in map`,
          "warning"
        );
      }
    } else {
      showNotification(
        "You appear to be far from the building. GPS accuracy may be limited.",
        "warning"
      );
    }
  };

  const setSpacesInteractive = (interactive) => {
    if (!mapView || !mapData) return;
    const spaces = mapData.getByType("space");
    spaces.forEach((space) => {
      try {
        mapView.updateState(space, {
          interactive: interactive,
          hoverColor: interactive ? "rgba(83, 97, 228)" : undefined,
        });
      } catch (error) {
        console.warn("Could not update state for space:", space.name, error);
      }
    });
  };

  // Enhanced pathfinding function that can use GPS location
  const findPathFromCurrentLocation = () => {
    if (!toInput.trim()) {
      showNotification("Please enter a destination", "error");
      return;
    }

    if (!startSpace) {
      showNotification(
        "Please get your location first or select a starting point",
        "error"
      );
      return;
    }

    const spaces = mapData.getByType("space");
    const toSpace = spaces.find(
      (space) =>
        space.name &&
        space.name.toLowerCase().includes(toInput.toLowerCase().trim())
    );

    if (!toSpace) {
      showNotification(`Destination "${toInput}" not found`, "error");
      return;
    }

    const directions = mapData.getDirections(startSpace, toSpace);
    if (!directions) {
      showNotification("No path found between these locations", "error");
      return;
    }

    // Clear existing path
    if (path) {
      mapView.Paths.removeAll();
    }

    const newPath = mapView.Paths.add(directions.coordinates, {
      nearRadius: 0.5,
      farRadius: 0.5,
      color: "#1871fb",
    });

    setPath(newPath);
    setPathfindingEnabled(false);
    setSpacesInteractive(false);
    showNotification(
      `Path created from ${startSpace.name} to ${toSpace.name}`,
      "success"
    );

    // Close mobile menu after navigation
    setIsMobileMenuOpen(false);
  };

  // Original find path by names function
  const findPathByNames = () => {
    if (!fromInput.trim() || !toInput.trim()) {
      showNotification("Please enter both from and to locations", "error");
      return;
    }

    const spaces = mapData.getByType("space");
    const fromSpace = spaces.find(
      (space) =>
        space.name &&
        space.name.toLowerCase().includes(fromInput.toLowerCase().trim())
    );
    const toSpace = spaces.find(
      (space) =>
        space.name &&
        space.name.toLowerCase().includes(toInput.toLowerCase().trim())
    );

    if (!fromSpace) {
      showNotification(`Location "${fromInput}" not found`, "error");
      return;
    }
    if (!toSpace) {
      showNotification(`Location "${toInput}" not found`, "error");
      return;
    }

    const directions = mapData.getDirections(fromSpace, toSpace);
    if (!directions) {
      showNotification("No path found between these locations", "error");
      return;
    }

    // Clear existing path
    if (path) {
      mapView.Paths.removeAll();
    }

    const newPath = mapView.Paths.add(directions.coordinates, {
      nearRadius: 0.5,
      farRadius: 0.5,
      color: "#1871fb",
    });

    setPath(newPath);
    setStartSpace(fromSpace);
    setSpacesInteractive(false);
    showNotification(
      `Path created from ${fromSpace.name} to ${toSpace.name}`,
      "success"
    );

    // Close mobile menu after navigation
    setIsMobileMenuOpen(false);
  };

  // Clear all paths and reset state
  const clearAllPaths = () => {
    if (path) {
      mapView.Paths.removeAll();
    }
    setStartSpace(null);
    setPath(null);
    setPathfindingEnabled(false);
    setSpacesInteractive(true);
    setFromInput("");
    setToInput("");
    showNotification("All paths cleared", "info");
  };

  useEffect(() => {
    if (!mapView || !mapData) return;

    // Set the initial selected floor to the current floor
    if (mapView.currentFloor && !selectedFloor) {
      setSelectedFloor(mapView.currentFloor.id);
    }

    // Get all spaces and add markers
    const spaces = mapData.getByType("space");
    spaces.forEach((space) => {
      if (space.name) {
        try {
          mapView.Markers.add(space, space.name, { interactive: true });
        } catch (error) {
          console.warn("Could not add marker for space:", space.name, error);
        }
      }

      // Update space state for interactivity
      try {
        mapView.updateState(space, {
          interactive: true,
          hoverColor: "rgba(83, 97, 228)",
        });
      } catch (error) {
        console.warn("Could not update state for space:", space.name, error);
      }
    });

    mapView.Camera.set({
      zoomLevel: 20.5,
      pitch: 50,
    });

    // Click handler for pathfinding
    const handleClick = async (event) => {
      if (!event) return;

      if (pathfindingEnabled) {
        if (!startSpace) {
          if (event.spaces && event.spaces.length > 0) {
            setStartSpace(event.spaces[0]);
            setFromInput(event.spaces[0].name || "Selected Space");
            showNotification(
              `Start point selected: ${event.spaces[0].name}\nClick destination space`,
              "success"
            );
            console.log("Start point selected: " + event.spaces[0].name);
          }
        } else if (!path && event.spaces && event.spaces[0]) {
          const directions = mapData.getDirections(startSpace, event.spaces[0]);
          if (!directions) {
            showNotification("No path found between these spaces", "error");
            return;
          }
          const newPath = mapView.Paths.add(directions.coordinates, {
            nearRadius: 0.5,
            farRadius: 0.5,
            color: "#1871fb",
          });
          setPath(newPath);
          setSpacesInteractive(false);
          setToInput(event.spaces[0].name || "Selected Destination");
          showNotification(
            `Path created to: ${event.spaces[0].name}`,
            "success"
          );
          console.log("Path created");
        } else if (path) {
          clearAllPaths();
          console.log("Path removed");
        }
      } else {
        // Original click behavior
        if (event.spaces && event.spaces.length > 0) {
          showNotification(`Clicked: ${event.spaces[0].name}`, "info");
          console.log("Clicked on Space: " + event.spaces[0].name);
        }
      }
    };

    mapView.on("click", handleClick);

    // Cleanup function
    return () => {
      try {
        mapView.off("click", handleClick);
      } catch (error) {
        console.warn("Error removing click listener:", error);
      }
    };
  }, [mapView, mapData, startSpace, path, pathfindingEnabled]);

  const populateFloors = (floorStackId) => {
    if (!mapData) return [];

    try {
      const floorStack = mapData.getById("floor-stack", floorStackId);

      if (!floorStack || !floorStack.floors) return [];

      return floorStack.floors.sort((a, b) => b.elevation - a.elevation);
    } catch (error) {
      console.warn("Error getting floor stack:", error);
      return [];
    }
  };

  const handleFloorChange = (floorId) => {
    if (!mapView || !floorId) return;

    try {
      const floor = mapData.getById("floor", floorId);
      if (floor) {
        mapView.setFloor(floor);
        setSelectedFloor(floorId);
      }
    } catch (error) {
      console.warn("Error changing floor:", error);
    }
  };

  // Get available floor stacks
  const floorStacks = mapData ? mapData.getByType("floor-stack") : [];

  return (
    <>
      {/* Mobile Menu Toggle Button */}
      <div className="mobile-menu-toggle">
        <button
          onClick={toggleMobileMenu}
          className="toggle-btn"
          aria-label="Toggle navigation menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      

      {/* Navigation Container */}
      <div className={`nav-container ${isMobileMenuOpen ? "mobile-open" : ""}`}>
        {/* Mobile Overlay */}
        {isMobileMenuOpen && (
          <div
            className="mobile-overlay"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Navigation Content */}
        <div className="nav-content">
          {/* Header for mobile */}
          <div className="nav-header">
            <h3>🗺️ Navigation</h3>
            <button
              className="close-btn"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <X size={20} />
            </button>
          </div>

          {/* Floor Selector */}
          {floorStacks.length > 0 && (
            <div className="nav-section">
              <div className="section-title">
                <Layers size={16} />
                <span>Floor Selection</span>
              </div>
              <select
                value={selectedFloor}
                onChange={(e) => handleFloorChange(e.target.value)}
                className="nav-select"
              >
                {floorStacks[0] &&
                  populateFloors(floorStacks[0].id).map((floor) => (
                    <option key={floor.id} value={floor.id}>
                      🏢 {floor.name}
                    </option>
                  ))}
              </select>
            </div>
          )}

          {/* GPS Location Section */}
          <div className="nav-section">
            <div className="section-title">
              <MapPin size={16} />
              <span>Location</span>
            </div>
            <button
              onClick={getCurrentLocation}
              disabled={isGettingLocation}
              className={`nav-btn primary ${userLocation ? "success" : ""}`}
            >
              {isGettingLocation
                ? "Getting Location..."
                : userLocation
                ? "✓ Location Found"
                : "📍 Get My Location"}
            </button>
          </div>

          {/* Location Info Display */}
          {userLocation && (
            <div className="location-info">
              <strong>📍 GPS Location:</strong>
              <br />
              {userLocation.latitude.toFixed(6)},{" "}
              {userLocation.longitude.toFixed(6)}
              <br />
              <strong>Accuracy:</strong> ±{Math.round(userLocation.accuracy)}m
              {nearestEntrance && (
                <>
                  <br />
                  <strong>Nearest:</strong> {nearestEntrance.name}(
                  {Math.round(nearestEntrance.distance)}m away)
                </>
              )}
            </div>
          )}

          {/* Location Error */}
          {locationError && (
            <div className="error-info">
              <strong>⚠️ Location Error:</strong>
              <br />
              {locationError}
            </div>
          )}

          {/* GPS Navigation Section */}
          <div className="nav-section">
            <div className="section-title">
              <Navigation size={16} />
              <span>GPS Navigation</span>
            </div>
            <input
              type="text"
              placeholder="🎯 Where do you want to go?"
              value={toInput}
              onChange={(e) => setToInput(e.target.value)}
              className="nav-input"
            />
            <button
              onClick={findPathFromCurrentLocation}
              disabled={!userLocation && !startSpace}
              className="nav-btn secondary"
            >
              🧭 Navigate from My Location
            </button>
          </div>

          {/* Manual Path Section */}
          <div className="nav-section">
            <div className="section-title">
              <Route size={16} />
              <span>Manual Path</span>
            </div>
            <input
              type="text"
              placeholder="From location"
              value={fromInput}
              onChange={(e) => setFromInput(e.target.value)}
              className="nav-input"
            />
            <input
              type="text"
              placeholder="To location"
              value={toInput}
              onChange={(e) => setToInput(e.target.value)}
              className="nav-input"
            />
            <button onClick={findPathByNames} className="nav-btn success">
              🗺️ Find Path
            </button>
          </div>

          {/* Controls Section */}
          <div className="nav-section">
            <div className="section-title">
              <span>Controls</span>
            </div>
            <button
              onClick={() => {
                setPathfindingEnabled(!pathfindingEnabled);
                if (pathfindingEnabled && path) {
                  clearAllPaths();
                } else if (!pathfindingEnabled) {
                  showNotification(
                    "Pathfinding enabled. Click a space to start",
                    "success"
                  );
                }
              }}
              className={`nav-btn ${pathfindingEnabled ? "danger" : "primary"}`}
            >
              {pathfindingEnabled
                ? "❌ Disable Click Mode"
                : "👆 Enable Click Mode"}
            </button>

            {(path || startSpace) && (
              <button onClick={clearAllPaths} className="nav-btn warning">
                <Trash2 size={16} />
                Clear All Paths
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Notification Popup */}
      {notification.show && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}

      <style jsx>{`
        .mobile-menu-toggle {
          position: fixed;
          top: 20px;
          left: 20px;
          z-index: 1001;
          display: none;
        }

        .toggle-btn {
          background: rgba(255, 255, 255, 0.95);
          border: 1px solid #ddd;
          border-radius: 12px;
          padding: 12px;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .toggle-btn:hover {
          background: white;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
        }

        .nav-container {
          position: fixed;
          top: 20px;
          left: 20px;
          z-index: 1000;
          background: transparent;
          backdrop-filter: blur(5px);
          border-radius: 16px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          max-height: calc(100vh - 40px);
          overflow-y: auto;
          transition: all 0.3s ease;
          width: 320px;
        }

        .mobile-overlay {
          display: none;
        }

        .nav-content {
          padding: 20px;
          min-width: 280px;
        }

        .nav-header {
          display: none;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          padding-bottom: 15px;
          border-bottom: 1px solid #eee;
        }

        .nav-header h3 {
          margin: 0;
          color: #333;
          font-size: 18px;
        }

        .close-btn {
          background: none;
          border: none;
          cursor: pointer;
          padding: 5px;
          color: #666;
          border-radius: 6px;
          transition: all 0.2s ease;
        }

        .close-btn:hover {
          background: #f0f0f0;
          color: #333;
        }

        .nav-section {
          margin-bottom: 20px;
        }

        .section-title {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 12px;
          font-weight: 600;
          color: #555;
          font-size: 14px;
        }

        .nav-btn {
          width: 100%;
          padding: 12px 16px;
          border-radius: 10px;
          border: 1px solid #ddd;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.2s ease;
          margin-bottom: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .nav-btn:last-child {
          margin-bottom: 0;
        }

        .nav-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .nav-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .nav-btn.primary {
          background: #007bff;
          color: white;
          border-color: #007bff;
        }

        .nav-btn.secondary {
          background: #6c757d;
          color: white;
          border-color: #6c757d;
        }

        .nav-btn.success {
          background: #28a745;
          color: white;
          border-color: #28a745;
        }

        .nav-btn.danger {
          background: #dc3545;
          color: white;
          border-color: #dc3545;
        }

        .nav-btn.warning {
          background: #ffc107;
          color: #333;
          border-color: #ffc107;
        }

        .nav-input {
          width: 100%;
          padding: 12px 16px;
          border-radius: 10px;
          border: 1px solid #ddd;
          margin-bottom: 8px;
          font-size: 14px;
          transition: all 0.2s ease;
          background: white;
        }

        .nav-input:focus {
          outline: none;
          border-color: #007bff;
          box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
        }

        .nav-select {
          width: 100%;
          padding: 12px 16px;
          border-radius: 10px;
          border: 1px solid #ddd;
          font-size: 14px;
          background: white;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .nav-select:focus {
          outline: none;
          border-color: #007bff;
          box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
        }

        .location-info {
          background: rgba(40, 167, 69, 0.1);
          padding: 12px;
          margin-bottom: 20px;
          border-radius: 10px;
          font-size: 12px;
          color: #155724;
          border: 1px solid rgba(40, 167, 69, 0.3);
        }

        .error-info {
          background: rgba(220, 53, 69, 0.1);
          padding: 12px;
          margin-bottom: 20px;
          border-radius: 10px;
          font-size: 12px;
          color: #721c24;
          border: 1px solid rgba(220, 53, 69, 0.3);
        }

        .notification {
          position: fixed;
          top: 1vh;
          left: 50%;
          transform: translate(-50%, -50%);
          padding: 15px 20px;
          border-radius: 10px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
          z-index: 3000;
          font-size: 16px;
          font-weight: bold;
          text-align: center;
          min-width: 250px;
          max-width: 400px;
          animation: slideInOut 3s ease-in-out;
          white-space: pre-line;
        }

        .notification.error {
          background: #dc3545;
          color: white;
        }

        .notification.success {
          background: #28a745;
          color: white;
        }

        .notification.warning {
          background: #ffc107;
          color: #333;
        }

        .notification.info {
          background: #17a2b8;
          color: white;
        }

        @keyframes slideInOut {
          0% {
            opacity: 0;
            transform: translate(-50%, -60%) scale(0.8);
          }
          10% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
          90% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -40%) scale(0.8);
          }
        }

        /* Mobile Responsive Styles */
        @media (max-width: 768px) {
          .mobile-menu-toggle {
            display: block;
          }

          .nav-container {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(255, 255, 255, 0.15);
            backdrop-filter: blur(20px);
            border-radius: 0;
            box-shadow: none;
            max-height: 100vh;
            transform: translateX(-100%);
            transition: transform 0.3s ease;
          }

          .nav-container.mobile-open {
            transform: translateX(0);
          }

          .mobile-overlay {
            display: block;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(255, 255, 255, 0.5);
            z-index: -1;
          }

          .nav-content {
            padding: 20px;
            min-width: auto;
            max-width: 100%;
            height: 100%;
            overflow-y: auto;
          }

          .nav-header {
            display: flex;
          }

          .nav-btn {
            padding: 14px 16px;
            font-size: 16px;
            margin-bottom: 12px;
          }

          .nav-input {
            padding: 14px 16px;
            font-size: 16px;
            margin-bottom: 12px;
          }

          .nav-select {
            padding: 14px 16px;
            font-size: 16px;
          }

          .section-title {
            font-size: 16px;
            margin-bottom: 16px;
          }

          .nav-section {
            margin-bottom: 24px;
          }

          .location-info,
          .error-info {
            font-size: 14px;
            padding: 16px;
            margin-bottom: 24px;
          }

          .notification {
            left: 20px;
            right: 20px;
            transform: translateY(-50%);
            max-width: none;
            min-width: auto;
          }
        }

        /* Extra small screens */
        @media (max-width: 480px) {
          .nav-content {
            padding: 16px;
          }

          .nav-btn {
            padding: 16px;
            font-size: 14px;
          }

          .nav-input {
            padding: 16px;
            font-size: 14px;
          }

          .nav-select {
            padding: 16px;
            font-size: 14px;
          }
        }
      `}</style>
    </>
  );
}

export default function App() {
  // Demo API credentials - replace with your own
  const { isLoading, error, mapData } = useMapData({
    key: "mik_yeBk0Vf0nNJtpesfu560e07e5",
    secret: "mis_2g9ST8ZcSFb5R9fPnsvYhrX3RyRwPtDGbMGweCYKEq385431022",
    mapId: "64ef49e662fd90fe020bee61",
  });

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          fontSize: "18px",
          backgroundColor: "#f8f9fa",
        }}
      >
        <div
          style={{
            width: "50px",
            height: "50px",
            border: "5px solid #e3e3e3",
            borderTop: "5px solid #007bff",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
            marginBottom: "20px",
          }}
        ></div>
        <div>Loading map...</div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          color: "#dc3545",
          fontSize: "16px",
          backgroundColor: "#f8f9fa",
          padding: "20px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: "48px",
            marginBottom: "20px",
          }}
        >
          ⚠️
        </div>
        <div style={{ marginBottom: "10px", fontWeight: "bold" }}>
          Error loading map
        </div>
        <div style={{ fontSize: "14px", color: "#6c757d" }}>
          {error.message}
        </div>
      </div>
    );
  }

  return mapData ? (
    <MapView mapData={mapData} style={{ width: "100%", height: "100%" }}>
      <MyCustomComponent />
    </MapView>
  ) : null;
}
