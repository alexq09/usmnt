"use client";

import { useState, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from "react-leaflet";
import { LatLngExpression, divIcon, LatLng } from "leaflet";
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

interface LocationGroup {
  key: string;
  latitude: number;
  longitude: number;
  locations: Location[];
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

  const groupedLocations = useMemo(() => {
    const groups: { [key: string]: LocationGroup } = {};

    filteredData.filteredLocations.forEach((location) => {
      const key = `${location.latitude.toFixed(4)},${location.longitude.toFixed(4)}`;

      if (!groups[key]) {
        groups[key] = {
          key,
          latitude: location.latitude,
          longitude: location.longitude,
          locations: [],
        };
      }

      groups[key].locations.push(location);
    });

    Object.values(groups).forEach(group => {
      group.locations.sort((a, b) => {
        const stageOrder = ["group", "round_of_32", "round_of_16", "quarterfinal", "semi_final", "final"];
        return stageOrder.indexOf(a.stage_type) - stageOrder.indexOf(b.stage_type);
      });
    });

    return Object.values(groups);
  }, [filteredData.filteredLocations]);

  const edgesWithCoordinates = useMemo(() => {
    return filteredData.filteredEdges.map((edge) => {
      const fromLoc = filteredData.filteredLocations.find((l) => l.id === edge.from_location_id);
      const toLoc = filteredData.filteredLocations.find((l) => l.id === edge.to_location_id);

      if (!fromLoc || !toLoc) return null;

      const fromCoords = new LatLng(fromLoc.latitude, fromLoc.longitude);
      const toCoords = new LatLng(toLoc.latitude, toLoc.longitude);

      const bearing = Math.atan2(
        toCoords.lng - fromCoords.lng,
        toCoords.lat - fromCoords.lat
      ) * (180 / Math.PI);

      const midLat = (fromLoc.latitude + toLoc.latitude) / 2;
      const midLng = (fromLoc.longitude + toLoc.longitude) / 2;

      return {
        edge,
        fromCoords: [fromLoc.latitude, fromLoc.longitude] as LatLngExpression,
        toCoords: [toLoc.latitude, toLoc.longitude] as LatLngExpression,
        midCoords: [midLat, midLng] as LatLngExpression,
        bearing,
        color: STAGE_COLORS[toLoc.stage_type] || "#64748b",
        fromLocation: fromLoc,
        toLocation: toLoc,
      };
    }).filter(Boolean);
  }, [filteredData]);

  const center: LatLngExpression = [39.8283, -98.5795];
  const zoom = 4;

  const createArrowIcon = (bearing: number, color: string) => {
    return divIcon({
      html: `
        <div style="
          width: 0;
          height: 0;
          border-left: 8px solid transparent;
          border-right: 8px solid transparent;
          border-bottom: 16px solid ${color};
          transform: rotate(${bearing}deg);
          filter: drop-shadow(0 1px 3px rgba(0,0,0,0.3));
        "></div>
      `,
      className: "",
      iconSize: [16, 16],
      iconAnchor: [8, 8],
    });
  };

  const createCustomIcon = (group: LocationGroup) => {
    const hasMultiple = group.locations.length > 1;

    if (hasMultiple) {
      const colors = group.locations.map(loc => STAGE_COLORS[loc.stage_type] || "#64748b");
      const uniqueColors = [...new Set(colors)];

      return divIcon({
        html: `
          <div style="
            width: 32px;
            height: 32px;
            background: conic-gradient(${uniqueColors.map((color, i) =>
              `${color} ${(i / uniqueColors.length) * 360}deg ${((i + 1) / uniqueColors.length) * 360}deg`
            ).join(", ")});
            border: 3px solid white;
            border-radius: 50%;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            font-size: 12px;
            color: white;
            text-shadow: 0 1px 2px rgba(0,0,0,0.8);
          ">
            ${group.locations.length}
          </div>
        `,
        className: "",
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });
    }

    const location = group.locations[0];
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
              <div key={`edge-group-${idx}`}>
                <Polyline
                  positions={[edgeData.fromCoords, edgeData.toCoords]}
                  color={edgeData.color}
                  weight={3}
                  opacity={edgeData.edge.is_potential ? 0.4 : 0.7}
                  dashArray={edgeData.edge.is_potential ? "10, 10" : undefined}
                  eventHandlers={{
                    click: () => {},
                  }}
                >
                  <Popup>
                    <div className="text-sm">
                      <p className="font-bold mb-1">Tournament Path</p>
                      <p className="text-xs text-slate-600">
                        <span className="font-semibold">From:</span> {edgeData.fromLocation.city}
                        {edgeData.fromLocation.state && `, ${edgeData.fromLocation.state}`}
                      </p>
                      <p className="text-xs text-slate-600 mb-2">
                        <span className="font-semibold">To:</span> {edgeData.toLocation.city}
                        {edgeData.toLocation.state && `, ${edgeData.toLocation.state}`}
                      </p>
                      <p className="text-xs">
                        <span
                          className="inline-block w-3 h-3 rounded-full mr-1"
                          style={{ backgroundColor: edgeData.color }}
                        ></span>
                        <span className="font-semibold capitalize">
                          {edgeData.toLocation.stage_type.replace(/_/g, " ")}
                        </span>
                      </p>
                      {edgeData.edge.is_potential && (
                        <p className="text-xs text-amber-600 mt-1">Potential Path</p>
                      )}
                    </div>
                  </Popup>
                </Polyline>
                <Marker
                  position={edgeData.midCoords}
                  icon={createArrowIcon(edgeData.bearing, edgeData.color)}
                  opacity={edgeData.edge.is_potential ? 0.4 : 0.7}
                />
              </div>
            );
          })}

          {groupedLocations.map((group) => (
            <Marker
              key={group.key}
              position={[group.latitude, group.longitude]}
              icon={createCustomIcon(group)}
            >
              <Popup maxWidth={300}>
                <div className="text-sm">
                  <h3 className="font-bold text-base mb-2">
                    {group.locations[0].city}
                    {group.locations[0].state && `, ${group.locations[0].state}`}
                  </h3>
                  <p className="text-slate-600 mb-3">{group.locations[0].stadium_name}</p>

                  {group.locations.length > 1 ? (
                    <div className="space-y-2">
                      <p className="font-semibold text-xs text-slate-500 uppercase tracking-wide">
                        {group.locations.length} Matches
                      </p>
                      {group.locations.map((location) => (
                        <div
                          key={location.id}
                          className="border-l-4 pl-3 py-1"
                          style={{ borderColor: STAGE_COLORS[location.stage_type] || "#64748b" }}
                        >
                          <p className="font-semibold capitalize text-sm">
                            {location.stage_type.replace(/_/g, " ")}
                          </p>
                          {location.group_label && (
                            <p className="text-xs text-slate-600">{location.group_label}</p>
                          )}
                          {location.matchday && (
                            <p className="text-xs text-slate-600">Matchday {location.matchday}</p>
                          )}
                          {location.is_potential && (
                            <p className="text-xs text-amber-600">Potential</p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div>
                      <p className="mt-2 text-xs">
                        <span className="font-semibold capitalize">
                          {group.locations[0].stage_type.replace(/_/g, " ")}
                        </span>
                      </p>
                      {group.locations[0].group_label && (
                        <p className="text-xs text-slate-500">{group.locations[0].group_label}</p>
                      )}
                      {group.locations[0].matchday && (
                        <p className="text-xs text-slate-500">Matchday {group.locations[0].matchday}</p>
                      )}
                      {group.locations[0].is_potential && (
                        <p className="text-xs text-amber-600 mt-1">Potential Location</p>
                      )}
                    </div>
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
