import React, { useState, useEffect } from "react";
import { MapView, useMapData, useMap, Label } from "@mappedin/react-sdk";
import "@mappedin/react-sdk/lib/esm/index.css";

function MyCustomComponent() {
  const { mapView, mapData } = useMap();
  const [labels, setLabels] = useState([]);
  const [selectedFloor, setSelectedFloor] = useState("");

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
    

    // Add click event listener
    const handleClick = (e) => {
      if (e.spaces && e.spaces.length > 0) {
        console.log("Clicked on Space: " + e.spaces[0].name);
        // You can add more click handling logic here
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
  }, [mapView, mapData]);

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