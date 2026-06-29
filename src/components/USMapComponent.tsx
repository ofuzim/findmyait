import { memo, useCallback } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
  Annotation
} from "react-simple-maps";

interface USMapComponentProps {
  selectedState: string | null;
  hoveredState: string | null;
  onStateClick: (stateId: string) => void;
  onStateHover: (stateId: string | null) => void;
  stateRequirements: Array<{
    id: string;
    hasReciprocity: boolean;
    recentlyUpdated?: boolean;
    isHighDemand?: boolean;
  }>;
  activeFilter?: string;
}

const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

// State centroid coordinates for labels (approximate center of each state)
const stateCentroids: { [key: string]: [number, number] } = {
  'AL': [-86.79113, 32.377716], 'AK': [-153.369141, 64.20142], 'AZ': [-111.093735, 34.048927],
  'AR': [-92.131378, 34.736009], 'CA': [-119.677, 36.746841], 'CO': [-105.311104, 39.059811],
  'CT': [-72.755371, 41.767], 'DE': [-75.526755, 39.161921], 'FL': [-81.686783, 27.766279],
  'GA': [-83.441162, 32.157435], 'HI': [-157.826182, 21.30895], 'ID': [-114.478828, 44.240459],
  'IL': [-89.650373, 40.349457], 'IN': [-86.147685, 39.790942], 'IA': [-93.620866, 42.032974],
  'KS': [-98.484246, 39.04], 'KY': [-84.86311, 37.839333], 'LA': [-91.8, 30.45809],
  'ME': [-69.765261, 44.323535], 'MD': [-76.501157, 39.045755], 'MA': [-71.530106, 42.230171],
  'MI': [-84.5467, 44.182205], 'MN': [-94.6859, 46.39241], 'MS': [-89.678696, 32.7364],
  'MO': [-92.60376, 38.572954], 'MT': [-110.454353, 47.052053], 'NE': [-99.684494, 41.564247],
  'NV': [-117.055374, 38.4199], 'NH': [-71.549896, 43.452492], 'NJ': [-74.756138, 40.221741],
  'NM': [-106.018066, 34.51994], 'NY': [-74.948051, 42.659829], 'NC': [-79.806419, 35.771],
  'ND': [-101.002012, 47.551493], 'OH': [-82.764915, 40.269789], 'OK': [-96.921387, 35.482309],
  'OR': [-120.767, 43.804133], 'PA': [-77.209755, 40.269789], 'RI': [-71.422132, 41.82355],
  'SC': [-81.035, 33.83654], 'SD': [-99.976, 44.29778], 'TN': [-86.580447, 35.860119],
  'TX': [-97.75, 31.106], 'UT': [-111.892622, 39.419220], 'VT': [-72.710686, 44.0867],
  'VA': [-78.169968, 37.54], 'WA': [-121.1858, 47.042418], 'WV': [-80.9696, 38.349497],
  'WI': [-89.616508, 44.641], 'WY': [-107.30249, 43.07424]
};

// Helper function to get state abbreviation
const getStateAbbreviation = (stateName: string): string => {
  const stateMap: { [key: string]: string } = {
    'Alabama': 'AL', 'Alaska': 'AK', 'Arizona': 'AZ', 'Arkansas': 'AR', 'California': 'CA',
    'Colorado': 'CO', 'Connecticut': 'CT', 'Delaware': 'DE', 'Florida': 'FL', 'Georgia': 'GA',
    'Hawaii': 'HI', 'Idaho': 'ID', 'Illinois': 'IL', 'Indiana': 'IN', 'Iowa': 'IA',
    'Kansas': 'KS', 'Kentucky': 'KY', 'Louisiana': 'LA', 'Maine': 'ME', 'Maryland': 'MD',
    'Massachusetts': 'MA', 'Michigan': 'MI', 'Minnesota': 'MN', 'Mississippi': 'MS', 'Missouri': 'MO',
    'Montana': 'MT', 'Nebraska': 'NE', 'Nevada': 'NV', 'New Hampshire': 'NH', 'New Jersey': 'NJ',
    'New Mexico': 'NM', 'New York': 'NY', 'North Carolina': 'NC', 'North Dakota': 'ND', 'Ohio': 'OH',
    'Oklahoma': 'OK', 'Oregon': 'OR', 'Pennsylvania': 'PA', 'Rhode Island': 'RI', 'South Carolina': 'SC',
    'South Dakota': 'SD', 'Tennessee': 'TN', 'Texas': 'TX', 'Utah': 'UT', 'Vermont': 'VT',
    'Virginia': 'VA', 'Washington': 'WA', 'West Virginia': 'WV', 'Wisconsin': 'WI', 'Wyoming': 'WY'
  };
  return stateMap[stateName] || stateName;
};

// State color calculation - Using brand colors
const getStateColor = (
  stateId: string, 
  isSelected: boolean, 
  isHovered: boolean, 
  stateRequirements: USMapComponentProps['stateRequirements'],
  activeFilter?: string
) => {
  const state = stateRequirements.find(s => s.id === stateId);
  
  if (isSelected) {
    return isHovered ? "#2d3a70" : "#3b4d8f"; // brand-primary and brand-primary-hover
  }
  
  if (!state) {
    return isHovered ? "#7c8a9f" : "#94a3b8"; // Gray with hover effect
  }
  
  // Check if state matches current filter
  const matchesFilter = () => {
    switch (activeFilter) {
      case 'high-demand':
        return state.isHighDemand;
      case 'reciprocity':
        return state.hasReciprocity;
      case 'recently-updated':
        return state.recentlyUpdated;
      default:
        return true;
    }
  };
  
  // If filter is active and state doesn't match, make it more subtle
  if (activeFilter && activeFilter !== 'all' && !matchesFilter()) {
    return isHovered ? "#d1d5db" : "#e5e7eb"; // Very light gray for non-matching states
  }
  
  if (state.recentlyUpdated) {
    return isHovered ? "#0bc4b7" : "#0dd4c7"; // brand-accent and brand-accent-hover
  }
  
  if (state.hasReciprocity) {
    return isHovered ? "#4a6ba7" : "#5a7bc4"; // Lighter shade of brand-primary
  }
  
  if (state.isHighDemand) {
    return isHovered ? "#eab308" : "#fbbf24"; // Light yellow with hover effect
  }
  
  return isHovered ? "#52606d" : "#64748b"; // Default gray with hover effect
};

// Memoized Geography component
const StateGeography = memo(({ 
  geo, 
  stateAbbr, 
  isSelected, 
  isHovered, 
  onMouseEnter, 
  onMouseLeave, 
  onClick,
  fillColor
}: {
  geo: any;
  stateAbbr: string;
  isSelected: boolean;
  isHovered: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onClick: () => void;
  fillColor: string;
}) => (
  <Geography
    geography={geo}
    fill={fillColor}
    stroke="#1B2126"
    strokeWidth={isSelected ? 1.5 : 1}
    style={{
      default: { outline: "none" },
      hover: { outline: "none" },
      pressed: { outline: "none" },
    }}
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
    onClick={onClick}
    className="cursor-pointer"
  />
));

export const USMapComponent = memo(({
  selectedState,
  hoveredState,
  onStateClick,
  onStateHover,
  stateRequirements,
  activeFilter
}: USMapComponentProps) => {
  const handleMouseEnter = useCallback((stateId: string) => {
    onStateHover(stateId);
  }, [onStateHover]);

  const handleMouseLeave = useCallback(() => {
    onStateHover(null);
  }, [onStateHover]);

  const handleClick = useCallback((stateId: string) => {
    onStateClick(stateId);
  }, [onStateClick]);

  return (
    <ComposableMap
      projection="geoAlbersUsa"
      className="w-full h-full"
      style={{ maxHeight: "100%" }}
    >
      <ZoomableGroup>
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const stateId = geo.properties.name;
              const stateAbbr = getStateAbbreviation(stateId);
              const isSelected = selectedState === stateAbbr;
              const isHovered = hoveredState === stateAbbr;
              const fillColor = getStateColor(stateAbbr, isSelected, isHovered, stateRequirements, activeFilter);
              
              return (
                <StateGeography
                  key={geo.rsmKey}
                  geo={geo}
                  stateAbbr={stateAbbr}
                  isSelected={isSelected}
                  isHovered={isHovered}
                  fillColor={fillColor}
                  onMouseEnter={() => handleMouseEnter(stateAbbr)}
                  onMouseLeave={handleMouseLeave}
                  onClick={() => handleClick(stateAbbr)}
                />
              );
            })
          }
        </Geographies>
        
        {/* State Labels */}
        {Object.entries(stateCentroids).map(([stateAbbr, coordinates]) => {
          const isSelected = selectedState === stateAbbr;
          const isHovered = hoveredState === stateAbbr;
          
          return (
            <Annotation
              key={stateAbbr}
              subject={coordinates}
              dx={0}
              dy={0}
            >
              <text
                x={0}
                y={0}
                textAnchor="middle"
                dominantBaseline="middle"
                style={{
                  fontFamily: "'Noto Sans', sans-serif",
                  fontSize: stateAbbr === 'TX' || stateAbbr === 'CA' || stateAbbr === 'MT' || stateAbbr === 'AK' ? '14px' : '12px',
                  fontWeight: isSelected ? '600' : '500',
                  fill: isSelected || isHovered ? '#ffffff' : '#1e293b',
                  pointerEvents: 'none',
                  userSelect: 'none'
                }}
              >
                {stateAbbr}
              </text>
            </Annotation>
          );
        })}
      </ZoomableGroup>
    </ComposableMap>
  );
});

USMapComponent.displayName = "USMapComponent";