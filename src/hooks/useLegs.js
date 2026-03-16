import { useReducer, useCallback } from "react";

export function createLeg(id, dateFrom = "") {
  return { id, city: "", lat: null, lon: null, geoName: "", country: "", dateFrom, dateTo: "" };
}

function legsReducer(state, action) {
  switch (action.type) {
    case "UPDATE":
      return state.map((l) =>
        l.id === action.id ? { ...l, [action.field]: action.value } : l
      );
    case "SELECT_GEO":
      return state.map((l) =>
        l.id === action.id
          ? { ...l, city: action.result.name, geoName: action.result.name,
              lat: action.result.latitude, lon: action.result.longitude,
              country: action.result.country }
          : l
      );
    case "ADD": {
      const last = state[state.length - 1];
      return [...state, createLeg(Date.now(), last?.dateTo ?? "")];
    }
    case "REMOVE":
      return state.filter((l) => l.id !== action.id);
    case "LOAD":
      return action.legs.map((l, i) => ({ id: i + 1, ...l }));
    default:
      return state;
  }
}

export function useLegs() {
  const [legs, dispatch] = useReducer(legsReducer, [createLeg(1)]);

  const updateLeg    = useCallback((id, field, value) => dispatch({ type: "UPDATE", id, field, value }), []);
  const selectLegGeo = useCallback((id, result)       => dispatch({ type: "SELECT_GEO", id, result }), []);
  const addLeg       = useCallback(()                 => dispatch({ type: "ADD" }), []);
  const removeLeg    = useCallback((id)               => dispatch({ type: "REMOVE", id }), []);
  const loadLegs     = useCallback((legs)             => dispatch({ type: "LOAD", legs }), []);

  return { legs, updateLeg, selectLegGeo, addLeg, removeLeg, loadLegs };
}
