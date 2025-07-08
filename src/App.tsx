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
      
      // Use the new findNearestSpace function
      findNearestSpace(latitude, longitude);
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
const findNearestSpace = (userLat, userLon) => {
  if (!mapData) {
    showNotification("Map data not available", "error");
    return;
  }

  const spaces = mapData.getByType("space");
  
  // Filter spaces that have names and valid coordinates
  const validSpaces = spaces.filter(space => 
    space.name && 
    space.name.trim() !== "" && 
    space.center && 
    space.center.latitude && 
    space.center.longitude
  );

  if (validSpaces.length === 0) {
    showNotification("No valid spaces found with coordinates", "error");
    console.log("Available spaces:", spaces.map(s => ({ name: s.name, hasCoords: !!s.center.latitude && !!s.center.longitude })));
    return;
  }

  // Calculate distance to each space
  let nearestSpace = null;
  let minDistance = Infinity;

  validSpaces.forEach((space) => {
    const distance = calculateDistance(
      userLat,
      userLon,
      space.center.latitude,
      space.center.longitude
    );

    if (distance < minDistance) {
      minDistance = distance;
      //nearestSpace = { ...space, distance };
      nearestSpace = space;
    }
  });

  if (nearestSpace) {
    setStartSpace(nearestSpace);
    setFromInput(nearestSpace.name);
    setNearestEntrance({
      name: nearestSpace.name,
      distance: minDistance
    });

    showNotification(
      `Starting from nearest space: ${nearestSpace.name} (${Math.round(minDistance)}m away)`,
      "success"
    );
    
    console.log("Nearest space found:", {
      name: nearestSpace.name,
      distance: Math.round(minDistance),
      coordinates: {
        lat: nearestSpace.center.latitude,
        lng: nearestSpace.center.longitude
      }
    });
  } else {
    showNotification("Could not find any nearby spaces", "error");
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

    // Set the Night Blue outdoor style
    // mapView.Outdoor.setStyle('https://tiles-cdn.mappedin.com/styles/midnightblue/style.json');
    mapView.Outdoor.setOpacity(0);

    

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
        if (event.spaces[0].center) {
  console.log("Clicked space center coordinates:", {
    latitude: event.spaces[0].center.latitude,
    longitude: event.spaces[0].center.longitude
  });
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
            <select
              value={toInput}
              onChange={(e) => setToInput(e.target.value)}
              className="nav-select"
            >
              <option value="">🎯 Where do you want to go?</option>
              {mapData && mapData.getByType("space")
                .filter(space => space.name && space.name.trim() !== "")
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((space) => (
                  <option key={space.id} value={space.name}>
                    🎯 {space.name}
                  </option>
                ))}
            </select>
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
            <select
              value={fromInput}
              onChange={(e) => setFromInput(e.target.value)}
              className="nav-select"
            >
              <option value="">Select starting location...</option>
              {mapData && mapData.getByType("space")
                .filter(space => space.name && space.name.trim() !== "")
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((space) => (
                  <option key={space.id} value={space.name}>
                    📍 {space.name}
                  </option>
                ))}
            </select>
            <select
              value={toInput}
              onChange={(e) => setToInput(e.target.value)}
              className="nav-select"
            >
              <option value="">Select destination...</option>
              {mapData && mapData.getByType("space")
                .filter(space => space.name && space.name.trim() !== "")
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((space) => (
                  <option key={space.id} value={space.name}>
                    🎯 {space.name}
                  </option>
                ))}
            </select>
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
          background: rgba(20, 20, 30, 0.6);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          padding: 14px;
          cursor: pointer;
          box-shadow: 
            0 8px 32px rgba(0, 0, 0, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(255, 255, 255, 0.9);
        }

        .toggle-btn:hover {
          background: rgba(30, 30, 40, 0.7);
          transform: translateY(-2px);
          box-shadow: 
            0 12px 40px rgba(0, 0, 0, 0.4),
            inset 0 1px 0 rgba(255, 255, 255, 0.15);
        }

        .nav-container {
          position: fixed;
          top: 20px;
          left: 20px;
          z-index: 1000;
          background: rgba(15, 15, 25, 0.4);
          backdrop-filter: blur(25px);
          border-radius: 24px;
          box-shadow: 
            0 8px 32px rgba(0, 0, 0, 0.4),
            inset 0 1px 0 rgba(255, 255, 255, 0.05),
            0 0 0 1px rgba(255, 255, 255, 0.03);
          max-height: calc(100vh - 40px);
          overflow-y: auto;
          overflow-x: hidden;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          width: 340px;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .nav-container::-webkit-scrollbar {
          width: 4px;
        }

        .nav-container::-webkit-scrollbar-track {
          background: transparent;
        }

        .nav-container::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.15);
          border-radius: 2px;
        }

        .nav-container::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.25);
        }

        .mobile-overlay {
          display: none;
        }

        .nav-content {
          padding: 24px;
          min-width: 280px;
        }

        .nav-header {
          display: none;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          padding-bottom: 20px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .nav-header h3 {
          margin: 0;
          color: rgba(255, 255, 255, 0.9);
          font-size: 20px;
          font-weight: 600;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .close-btn {
          background: rgba(30, 30, 40, 0.6);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          cursor: pointer;
          padding: 8px;
          color: rgba(255, 255, 255, 0.7);
          border-radius: 12px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .close-btn:hover {
          background: rgba(40, 40, 50, 0.7);
          color: rgba(255, 255, 255, 0.9);
          transform: scale(1.05);
        }

        .nav-section {
          margin-bottom: 24px;
        }

        .section-title {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 16px;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.9);
          font-size: 15px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .nav-btn {
          width: 100%;
          padding: 14px 18px;
          border-radius: 16px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          margin-bottom: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          backdrop-filter: blur(10px);
          position: relative;
          overflow: hidden;
        }

        .nav-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .nav-btn:hover::before {
          opacity: 1;
        }

        .nav-btn:last-child {
          margin-bottom: 0;
        }

        .nav-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 
            0 8px 25px rgba(0, 0, 0, 0.15),
            inset 0 1px 0 rgba(255, 255, 255, 0.2);
          border-color: rgba(255, 255, 255, 0.2);
        }

        .nav-btn:active {
          transform: translateY(0);
        }

        .nav-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }

        .nav-btn.primary {
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.6) 0%, rgba(37, 99, 235, 0.6) 100%);
          color: white;
          border-color: rgba(59, 130, 246, 0.3);
          box-shadow: 
            0 4px 15px rgba(59, 130, 246, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.2);
        }

        .nav-btn.primary:hover:not(:disabled) {
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.8) 0%, rgba(37, 99, 235, 0.8) 100%);
          box-shadow: 
            0 8px 25px rgba(59, 130, 246, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.25);
        }

        .nav-btn.secondary {
          background: linear-gradient(135deg, rgba(107, 114, 128, 0.6) 0%, rgba(75, 85, 99, 0.6) 100%);
          color: white;
          border-color: rgba(107, 114, 128, 0.3);
          box-shadow: 
            0 4px 15px rgba(107, 114, 128, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.2);
        }

        .nav-btn.success {
          background: linear-gradient(135deg, rgba(34, 197, 94, 0.6) 0%, rgba(22, 163, 74, 0.6) 100%);
          color: white;
          border-color: rgba(34, 197, 94, 0.3);
          box-shadow: 
            0 4px 15px rgba(34, 197, 94, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.2);
        }

        .nav-btn.danger {
          background: linear-gradient(135deg, rgba(239, 68, 68, 0.6) 0%, rgba(220, 38, 38, 0.6) 100%);
          color: white;
          border-color: rgba(239, 68, 68, 0.3);
          box-shadow: 
            0 4px 15px rgba(239, 68, 68, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.2);
        }

        .nav-btn.warning {
          background: linear-gradient(135deg, rgba(245, 158, 11, 0.6) 0%, rgba(217, 119, 6, 0.6) 100%);
          color: white;
          border-color: rgba(245, 158, 11, 0.3);
          box-shadow: 
            0 4px 15px rgba(245, 158, 11, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.2);
        }

        .nav-input {
          width: 100%;
          padding: 14px 18px;
          border-radius: 16px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          margin-bottom: 10px;
          font-size: 14px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          background: rgba(20, 20, 30, 0.4);
          backdrop-filter: blur(10px);
          color: rgba(255, 255, 255, 0.9);
        }

        .nav-input::placeholder {
          color: rgba(255, 255, 255, 0.4);
        }

        .nav-input:focus {
          outline: none;
          border-color: rgba(59, 130, 246, 0.4);
          box-shadow: 
            0 0 0 3px rgba(59, 130, 246, 0.08),
            0 4px 15px rgba(59, 130, 246, 0.15),
            inset 0 1px 0 rgba(255, 255, 255, 0.05);
          background: rgba(25, 25, 35, 0.5);
        }

        .nav-select {
          width: 100%;
          padding: 14px 18px;
          border-radius: 16px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          font-size: 14px;
          background: rgba(20, 20, 30, 0.4);
          backdrop-filter: blur(10px);
          color: rgba(255, 255, 255, 0.9);
          cursor: pointer;
          margin-bottom: 10px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .nav-select option {
          background: rgba(20, 20, 30, 0.95);
          color: white;
          padding: 10px;
        }

        .nav-select:focus {
          outline: none;
          border-color: rgba(59, 130, 246, 0.4);
          box-shadow: 
            0 0 0 3px rgba(59, 130, 246, 0.08),
            0 4px 15px rgba(59, 130, 246, 0.15),
            inset 0 1px 0 rgba(255, 255, 255, 0.05);
          background: rgba(25, 25, 35, 0.5);
        }

        .location-info {
          background: rgba(34, 197, 94, 0.1);
          backdrop-filter: blur(10px);
          padding: 16px;
          margin-bottom: 20px;
          border-radius: 16px;
          font-size: 13px;
          color: rgba(34, 197, 94, 0.9);
          border: 1px solid rgba(34, 197, 94, 0.2);
          box-shadow: 
            0 4px 15px rgba(34, 197, 94, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
        }

        .error-info {
          background: rgba(239, 68, 68, 0.1);
          backdrop-filter: blur(10px);
          padding: 16px;
          margin-bottom: 20px;
          border-radius: 16px;
          font-size: 13px;
          color: rgba(239, 68, 68, 0.9);
          border: 1px solid rgba(239, 68, 68, 0.2);
          box-shadow: 
            0 4px 15px rgba(239, 68, 68, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
        }

        .notification {
          position: fixed;
          top: 4vh;
          left: 50%;
          transform: translate(-50%, -50%);
          padding: 18px 24px;
          border-radius: 20px;
          backdrop-filter: blur(25px);
          box-shadow: 
            0 8px 32px rgba(0, 0, 0, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.2);
          z-index: 3000;
          font-size: 16px;
          font-weight: 600;
          text-align: center;
          min-width: 280px;
          max-width: 420px;
          animation: slideInOut 3s cubic-bezier(0.4, 0, 0.2, 1);
          white-space: pre-line;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .notification.error {
          background: rgba(239, 68, 68, 0.9);
          color: white;
          border-color: rgba(239, 68, 68, 0.3);
        }

        .notification.success {
          background: rgba(34, 197, 94, 0.9);
          color: white;
          border-color: rgba(34, 197, 94, 0.3);
        }

        .notification.warning {
          background: rgba(245, 158, 11, 0.9);
          color: white;
          border-color: rgba(245, 158, 11, 0.3);
        }

        .notification.info {
          background: rgba(59, 130, 246, 0.9);
          color: white;
          border-color: rgba(59, 130, 246, 0.3);
        }

        @keyframes slideInOut {
          0% {
            opacity: 0;
            transform: translate(-50%, -60%) scale(0.8);
            filter: blur(10px);
          }
          10% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
            filter: blur(0px);
          }
          90% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
            filter: blur(0px);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -40%) scale(0.8);
            filter: blur(10px);
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
            background: rgba(10, 10, 20, 0.6);
            backdrop-filter: blur(25px);
            border-radius: 0;
            box-shadow: none;
            max-height: 100vh;
            transform: translateX(-100%);
            transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            border: none;
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
            background: rgba(0, 0, 0, 0.6);
            backdrop-filter: blur(8px);
            z-index: -1;
          }

          .nav-content {
            padding: 24px;
            min-width: auto;
            max-width: 100%;
            height: 100%;
            overflow-y: auto;
          }

          .nav-header {
            display: flex;
          }

          .nav-btn {
            padding: 16px 20px;
            font-size: 16px;
            margin-bottom: 12px;
            border-radius: 18px;
          }

          .nav-input {
            padding: 16px 20px;
            font-size: 16px;
            margin-bottom: 12px;
            border-radius: 18px;
          }

          .nav-select {
            padding: 16px 20px;
            font-size: 16px;
            border-radius: 18px;
          }

          .section-title {
            font-size: 16px;
            margin-bottom: 18px;
          }

          .nav-section {
            margin-bottom: 28px;
          }

          .location-info,
          .error-info {
            font-size: 14px;
            padding: 18px;
            margin-bottom: 24px;
            border-radius: 18px;
          }

          .notification {
            left: 50%;
            top: 6%;
            transform: translateY(-50%);
            max-width: none;
            min-width: auto;
            border-radius: 18px;
          }
        }

        /* Extra small screens */
        @media (max-width: 480px) {
          .nav-content {
            padding: 20px;
          }

          .nav-btn {
            padding: 18px;
            font-size: 15px;
          }

          .nav-input {
            padding: 18px;
            font-size: 15px;
          }

          .nav-select {
            padding: 18px;
            font-size: 15px;
          }

          .toggle-btn {
            padding: 12px;
            border-radius: 16px;
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
    //viewId: "jFiu",
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
    <MapView 
  mapData={mapData} 
  style={{ width: "100%", height: "100%" }}
  options={{
    outdoorView: {
      style: 'https://tiles-cdn.mappedin.com/styles/midnightblue/style.json',
    },
  }}
>
  <MyCustomComponent />
</MapView>
  ) : null;
}
