import { useReducer, useCallback, useMemo } from "react";

import { fetchWeather } from "./api/weather.js";
import { fetchPackingList } from "./api/packing.js";
import { TODAY, nightsCount, pluralNights, formatDate } from "./utils/date.js";

import { useLegs } from "./hooks/useLegs.js";
import { useHistory } from "./hooks/useHistory.js";

import { LegCard } from "./components/LegCard.jsx";
import { AccommodationPicker } from "./components/AccommodationPicker.jsx";
import { WeatherStrip } from "./components/WeatherStrip.jsx";
import { PackingSection } from "./components/PackingSection.jsx";
import { HistoryList } from "./components/HistoryList.jsx";
import { ProgressBar } from "./components/ProgressBar.jsx";

// ── App-level state ──────────────────────────────────────────────────────────

const LOADING_STEPS = ["Pobieram prognozy pogody…", "Generuję listę pakowania…"];

const initialState = {
  phase: "form", // "form" | "loading" | "results" | "error"
  loadingStep: 0,
  weatherResults: [],
  packingList: null,
  alerts: [],
  errorMsg: "",
  checked: {},
  accommodation: { hotel: false, airbnb: false, camping: false },
};

function reducer(state, action) {
  switch (action.type) {
    case "START_LOADING":
      return { ...state, phase: "loading", loadingStep: 0, errorMsg: "" };
    case "SET_LOADING_STEP":
      return { ...state, loadingStep: action.step };
    case "SET_RESULTS":
      return {
        ...state, phase: "results", checked: {},
        weatherResults: action.weatherResults,
        packingList: action.packingList,
        alerts: action.alerts,
      };
    case "SET_ERROR":
      return { ...state, phase: "error", errorMsg: action.message };
    case "TOGGLE_CHECK":
      return { ...state, checked: { ...state.checked, [action.key]: !state.checked[action.key] } };
    case "TOGGLE_ACCOMMODATION":
      return { ...state, accommodation: { ...state.accommodation, [action.key]: !state.accommodation[action.key] } };
    case "SET_ACCOMMODATION":
      return { ...state, accommodation: action.accommodation };
    case "RESET":
      return { ...initialState };
    default:
      return state;
  }
}

// ── Component ────────────────────────────────────────────────────────────────

export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { phase, loadingStep, weatherResults, packingList, alerts, errorMsg, checked, accommodation } = state;

  const { legs, updateLeg, selectLegGeo, addLeg, removeLeg, loadLegs } = useLegs();
  const { history, save: saveHistory } = useHistory();

  // ── Derived values ──

  const isFormValid = useMemo(
    () => legs.every((l) => l.city && l.lat && l.dateFrom && l.dateTo),
    [legs]
  );

  const { totalItems, checkedCount } = useMemo(() => ({
    totalItems:   packingList?.reduce((a, s) => a + s.items.length, 0) ?? 0,
    checkedCount: Object.values(checked).filter(Boolean).length,
  }), [packingList, checked]);

  const tripDateFrom = legs[0]?.dateFrom;
  const tripDateTo   = legs[legs.length - 1]?.dateTo;
  const totalNights  = nightsCount(tripDateFrom, tripDateTo);

  const tripLabel = weatherResults.length > 0
    ? weatherResults.map((l) => l.geo.name).join(" → ")
    : legs.map((l) => l.geoName || l.city).filter(Boolean).join(" → ") || "…";

  // ── Callbacks ──

  const toggleCheck = useCallback((key) => dispatch({ type: "TOGGLE_CHECK", key }), []);
  const toggleAccomm = useCallback((key) => dispatch({ type: "TOGGLE_ACCOMMODATION", key }), []);

  const loadFromHistory = useCallback((entry) => {
    loadLegs(entry.legs);
    dispatch({ type: "SET_ACCOMMODATION", accommodation: entry.accommodation });
  }, [loadLegs]);

  // ── Form validation ──

  function validateLegs() {
    for (const leg of legs) {
      if (!leg.city || !leg.dateFrom || !leg.dateTo)
        return "Wypełnij wszystkie pola dla każdego etapu";
      if (!leg.lat)
        return `Wybierz miasto "${leg.city}" z listy podpowiedzi`;
      if (leg.dateTo < leg.dateFrom)
        return "Data powrotu musi być po dacie wyjazdu";
    }
    return null;
  }

  // ── Submit ──

  async function handleSubmit() {
    const validationError = validateLegs();
    if (validationError) {
      return dispatch({ type: "SET_ERROR", message: validationError });
    }

    dispatch({ type: "START_LOADING" });

    try {
      dispatch({ type: "SET_LOADING_STEP", step: 0 });
      const legWeatherData = await Promise.all(
        legs.map(async (leg) => {
          const daily = await fetchWeather(leg.lat, leg.lon, leg.dateFrom, leg.dateTo);
          return { geo: { name: leg.geoName, country: leg.country }, daily, dateFrom: leg.dateFrom, dateTo: leg.dateTo };
        })
      );

      dispatch({ type: "SET_LOADING_STEP", step: 1 });
      const result = await fetchPackingList(legWeatherData, accommodation);

      dispatch({
        type: "SET_RESULTS",
        weatherResults: legWeatherData,
        packingList: result.sections,
        alerts: result.alerts ?? [],
      });

      saveHistory(legs, accommodation);
    } catch (e) {
      dispatch({ type: "SET_ERROR", message: e.message || "Coś poszło nie tak" });
    }
  }

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="app">
      <header className="header">
        <div className="logo-wrap">
          <div className="logo-icon" aria-hidden="true">🧳</div>
          <span className="logo-text">PackWise</span>
        </div>
        <p className="tagline">Inteligentne pakowanie na każdą pogodę</p>
      </header>

      <main className="card">

        {/* ── FORM ── */}
        {(phase === "form" || phase === "error") && (
          <>
            <p className="form-title">Dokąd i kiedy?</p>

            {phase === "error" && (
              <div className="error-box" role="alert">⚠️ {errorMsg}</div>
            )}

            <HistoryList history={history} onLoad={loadFromHistory} />

            {legs.map((leg, idx) => (
              <LegCard
                key={leg.id}
                leg={leg}
                index={idx}
                isOnly={legs.length === 1}
                today={TODAY}
                onUpdate={updateLeg}
                onSelectGeo={selectLegGeo}
                onRemove={removeLeg}
              />
            ))}

            <button className="btn-add-leg" onClick={addLeg}>
              + Dodaj kolejne miasto
            </button>

            <AccommodationPicker value={accommodation} onToggle={toggleAccomm} />

            <button className="btn" onClick={handleSubmit} disabled={!isFormValid}>
              Sprawdź pogodę i stwórz listę →
            </button>
          </>
        )}

        {/* ── LOADING ── */}
        {phase === "loading" && (
          <div className="loading" aria-live="polite" aria-busy="true">
            <div className="spinner" role="status" />
            <p className="loading-text">{LOADING_STEPS[loadingStep]}</p>
            <p className="loading-sub">Proszę czekać…</p>
            <div className="step-indicator" aria-hidden="true">
              {LOADING_STEPS.map((_, i) => (
                <div key={i} className={`step-dot${i <= loadingStep ? " active" : ""}`} />
              ))}
            </div>
          </div>
        )}

        {/* ── RESULTS ── */}
        {phase === "results" && weatherResults.length > 0 && packingList && (
          <>
            <div className="results-header">
              <p className="trip-title">{tripLabel}</p>
              <p className="trip-dates">
                {formatDate(tripDateFrom)} — {formatDate(tripDateTo)}
                {" · "}
                {totalNights} {pluralNights(totalNights)}
              </p>
            </div>

            {weatherResults.map((leg, i) => (
              <WeatherStrip
                key={i}
                leg={leg}
                showCityTitle={weatherResults.length > 1}
              />
            ))}

            {alerts.map((alert, i) => (
              <div key={i} className="alert-banner" role="alert">
                <span className="alert-icon" aria-hidden="true">⚠️</span>
                <span>{alert}</span>
              </div>
            ))}

            <ProgressBar checked={checkedCount} total={totalItems} />

            {packingList.map((section) => (
              <PackingSection
                key={section.name}
                section={section}
                checked={checked}
                onToggle={toggleCheck}
              />
            ))}

            <button className="btn btn-secondary" onClick={() => dispatch({ type: "RESET" })}>
              ← Zaplanuj nowy wyjazd
            </button>
          </>
        )}

      </main>
    </div>
  );
}
