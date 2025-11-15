"use client";

import { useState, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from "react-leaflet";
import { LatLngExpression, divIcon } from "leaflet";
import "leaflet/dist/leaflet.css";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Database } from "@/lib/database.types";

type Location = Database["public"]["Tables"]["tournament_map_locations"]["Row"];
type Edge = Database["public"]["Tables"]["tournament_map_edges"]["Row"];

interface TournamentMapProps {
  locations: Location[];
  edges: Edge[];
}

const SCENARIO_OPTIONS = [
  { value: "group", label: "Group Stage" },
  { value: "1", label: "1st Place Finish" },
  { value: "2", label: "2nd Place Finish" },
  { value: "3", label: "3rd Place Finish" },
];

const STAGE_COLORS: Record<string, string> = {
  group: "#10b981",
  round_of_32: "#3b82f6",
  round_of_16: "#8b5cf6",
  quarterfinal: "#ec4899",
  semi_final: "#f59e0b",
  final: "#ef4444",
};

function MapUpdater({ center, zoom }: { center: LatLngExpression; zoom: number }) {
  const map = useMap();
  map.setView(center, zoom);
  return null;
}

export function TournamentMap({ locations, edges }: TournamentMapProps) {
  const [selectedScenario, setSelectedScenario] = useState<string>("group");

  const filteredData = useMemo(() => {
    const filteredLocations = locations.filter(
      (loc) => loc.scenario_key === "group" || loc.scenario_key === selectedScenario
    );

    const filteredEdges = edges.filter(
      (edge) => edge.scenario_key === "group" || edge.scenario_key === selectedScenario
    );

    return { filteredLocations, filteredEdges };
  }, [locations, edges, selectedScenario]);

  const edgesWithCoordinates = useMemo(() => {
    return filteredData.filteredEdges.map((edge) => {
      const fromLoc = filteredData.filteredLocations.find((l) => l.id === edge.from_location_id);
      const toLoc = filteredData.filteredLocations.find((l) => l.id === edge.to_location_id);

      if (!fromLoc || !toLoc) return null;

      return {
        edge,
        fromCoords: [fromLoc.latitude, fromLoc.longitude] as LatLngExpression,
        toCoords: [toLoc.latitude, toLoc.longitude] as LatLngExpression,
        color: STAGE_COLORS[toLoc.stage_type] || "#64748b",
      };
    }).filter(Boolean);
  }, [filteredData]);

  const center: LatLngExpression = [39.8283, -98.5795];
  const zoom = 4;

  const createCustomIcon = (location: Location) => {
    const color = STAGE_COLORS[location.stage_type] || "#64748b";
    const isPotential = location.is_potential;

    return divIcon({
      html: `
        <div style="
          width: 24px;
          height: 24px;
          background-color: ${color};
          border: 3px solid white;
          border-radius: 50%;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          opacity: ${isPotential ? 0.6 : 1};
        "></div>
      `,
      className: "",
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });
  };

  return (
    <Card className="p-6">
      <div className="mb-6 flex flex-wrap gap-2">
        {SCENARIO_OPTIONS.map((option) => (
          <Button
            key={option.value}
            variant={selectedScenario === option.value ? "default" : "outline"}
            onClick={() => setSelectedScenario(option.value)}
            className="transition-all"
          >
            {option.label}
          </Button>
        ))}
      </div>

      <div className="mb-4 flex flex-wrap gap-4 text-sm">
        {Object.entries(STAGE_COLORS).map(([stage, color]) => (
          <div key={stage} className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded-full border-2 border-white shadow"
              style={{ backgroundColor: color }}
            />
            <span className="capitalize text-slate-600 dark:text-slate-400">
              {stage.replace(/_/g, " ")}
            </span>
          </div>
        ))}
      </div>

      <div className="w-full h-[600px] rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
        <MapContainer
          center={center}
          zoom={zoom}
          scrollWheelZoom={true}
          style={{ height: "100%", width: "100%" }}
        >
          <MapUpdater center={center} zoom={zoom} />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {edgesWithCoordinates.map((edgeData, idx) => {
            if (!edgeData) return null;
            return (
              <Polyline
                key={idx}
                positions={[edgeData.fromCoords, edgeData.toCoords]}
                color={edgeData.color}
                weight={3}
                opacity={edgeData.edge.is_potential ? 0.4 : 0.7}
                dashArray={edgeData.edge.is_potential ? "10, 10" : undefined}
              />
            );
          })}

          {filteredData.filteredLocations.map((location) => (
            <Marker
              key={location.id}
              position={[location.latitude, location.longitude]}
              icon={createCustomIcon(location)}
            >
              <Popup>
                <div className="text-sm">
                  <h3 className="font-bold text-base mb-1">{location.label}</h3>
                  <p className="text-slate-600">
                    {location.city}
                    {location.state && `, ${location.state}`}
                  </p>
                  <p className="text-slate-600">{location.stadium_name}</p>
                  <p className="mt-2 text-xs">
                    <span className="font-semibold capitalize">
                      {location.stage_type.replace(/_/g, " ")}
                    </span>
                  </p>
                  {location.group_label && (
                    <p className="text-xs text-slate-500">{location.group_label}</p>
                  )}
                  {location.matchday && (
                    <p className="text-xs text-slate-500">Matchday {location.matchday}</p>
                  )}
                  {location.is_potential && (
                    <p className="text-xs text-amber-600 mt-1">Potential Location</p>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </Card>
  );
}
