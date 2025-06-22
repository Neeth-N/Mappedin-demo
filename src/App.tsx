import React, { useState, useEffect } from "react";
import { MapView, useMapData, useMap, Label } from "@mappedin/react-sdk";
import "@mappedin/react-sdk/lib/esm/index.css";

function MyCustomComponent() {
  const { mapView, mapData } = useMap();
  const [labels, setLabels] = useState([]);
  const [selectedFloor, setSelectedFloor] = useState("");

  // Add minimal state for pathfinding
  const [startSpace, setStartSpace] = useState(null);
  const [path, setPath] = useState(null);
  const [pathfindingEnabled, setPathfindingEnabled] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });

  // Add notification helper function
  const showNotification = (message, type = "info") => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "" });
    }, 2000);
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

    // Replace the original click handler with your pathfinding logic
    const handleClick = async (event) => {
      if (!event) return;
      
      if (pathfindingEnabled) {
        if (!startSpace) {
          if (event.spaces && event.spaces.length > 0) {
            setStartSpace(event.spaces[0]);
            showNotification(`Start point selected: ${event.spaces[0].name},\n Click Destination Space`, "success");
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
          showNotification(`Path created to: ${event.spaces[0].name}`, "success");
          console.log("Path created");
        } else if (path) {
          mapView.Paths.removeAll();
          setStartSpace(null);
          setPath(null);
          setSpacesInteractive(true);
          showNotification("Path cleared. Click a space to start new path", "info");
          console.log("Path removed");
        }
      } else {
        // Original click behavior
        if (event.spaces && event.spaces.length > 0) {
          showNotification(`Clicked: ${event.spaces[0].name}`, "info");
          console.log("Clicked on Space: " + event.spaces[0].name);
          // You can add more click handling logic here
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

  // Get available floor stacks for demonstration
  const floorStacks = mapData ? mapData.getByType("floor-stack") : [];

  return (
    <div style={{ position: "absolute", top: "1vh", left: "10px", zIndex: 1000 }}>
      {/* Pathfinding Toggle */}
      <div style={{ 
        background: "transparent", 
        padding: "10px", 
        marginBottom: "5px"
      }}>
        <button
          onClick={() => {
            setPathfindingEnabled(!pathfindingEnabled);
            // Reset pathfinding state when disabling
            if (pathfindingEnabled && path) {
              mapView.Paths.removeAll();
              setStartSpace(null);
              setPath(null);
              setSpacesInteractive(true);
              showNotification("Pathfinding disabled and paths cleared", "info");
            } else if (!pathfindingEnabled) {
              showNotification("Pathfinding enabled. Click a space to start", "success");
            }
          }}
          style={{ 
            width: "200px", 
            height: '3vh', 
            padding: "5px", 
            borderRadius: "10px", 
            border: "1px solid #ccc", 
            backgroundColor: pathfindingEnabled ? "#1871fb" : "rgba(255, 255, 255, 0.8)", 
            color: pathfindingEnabled ? "white" : "#333",
            cursor: "pointer",
            fontSize: "14px"
          }}
        >
          {pathfindingEnabled ? "Disable Pathfinding" : "Enable Pathfinding"}
        </button>
      </div>

      {floorStacks.length > 0 && (
        <div style={{ 
          background: "transparent", 
          padding: "10px", 
        }}>
          <select
            id="floor-selector"
            value={selectedFloor}
            onChange={(e) => handleFloorChange(e.target.value)}
            style={{ width: "200px",height: '3vh', padding: "5px", borderRadius: "10px", border: "1px solid #ccc", backgroundColor: "rgba(255, 255, 255, 0.8)", color: "#333" }}
          >
            {floorStacks[0] && populateFloors(floorStacks[0].id).map((floor) => (
              <option key={floor.id} value={floor.id}>
                {floor.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Notification Popup */}
      {notification.show && (
        <div style={{
          position: "absolute",
          top: "50%",
          left: "150%",
          transform: "translate(-50%, -50%)",
          backgroundColor: notification.type === "error" ? "#ff4444" : 
                          notification.type === "success" ? "#4488ff" : "#4488ff",
          color: "white",
          padding: "15px 20px",
          borderRadius: "10px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
          zIndex: 2000,
          fontSize: "16px",
          fontWeight: "bold",
          textAlign: "center",
          minWidth: "200px",
          animation: "fadeInOut 2s ease-in-out"
        }}>
          {notification.message}
        </div>
      )}

      <style>{`
        @keyframes fadeInOut {
          0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
          15% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
          85% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
          100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
        }
      `}</style>
    </div>
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
      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        height: "100vh",
        fontSize: "18px"
      }}>
        Loading map...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        height: "100vh",
        color: "red",
        fontSize: "16px"
      }}>
        Error loading map: {error.message}
      </div>
    );
  }

  return mapData ? (
     <MapView mapData={mapData} style={{ width: "100%", height: "100%" }}>
          <MyCustomComponent />
        </MapView>
  ) : null;
}