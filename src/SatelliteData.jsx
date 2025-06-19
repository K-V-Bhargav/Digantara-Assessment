import { useState, useEffect } from "react";
import "./SatelliteData.css";

const SatelliteData = () => {
  const [satellites, setSatellites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rocketBodyCount, setRocketBodyCount] = useState(0);
  const [debrisCount, setDebrisCount] = useState(0);
  const [payloadCount, setPayloadCount] = useState(0);
  const [unknownCount, setUnknownCount] = useState(0);
  const [showSelectedOnly, setShowSelectedOnly] = useState(false);
  const [selectedSatellites, setSelectedSatellites] = useState([]);
  const [activeTypeFilter, setActiveTypeFilter] = useState("");
  useEffect(() => {
    const fetchSatellites = async () => {
      try {
        const url =
          "https://backend.digantara.dev/v1/satellites?" +
          "objectTypes=ROCKET%20BODY,DEBRIS,UNKNOWN,PAYLOAD&" +
          "attributes=noradCatId,intlDes,name,launchDate,decayDate,objectType,launchSiteCode,countryCode,orbitCode";
        const response = await fetch(url, {
          headers: { accept: "application/json" },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const responseData = await response.json();
        const satellitesArray = responseData.data;
        console.log(satellitesArray);
        setSatellites(satellitesArray);
        let rocketBody = 0;
        let debris = 0;
        let payload = 0;
        let unknown = 0;
        satellitesArray.forEach((item) => {
          const type = item.objectType || "UNKNOWN";
          switch (type) {
            case "ROCKET BODY":
              rocketBody++;
              break;
            case "DEBRIS":
              debris++;
              break;
            case "PAYLOAD":
              payload++;
              break;
            default:
              unknown++;
              break;
          }
        });
        setRocketBodyCount(rocketBody);
        setDebrisCount(debris);
        setPayloadCount(payload);
        setUnknownCount(unknown);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchSatellites();
  }, []);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const itemsPerPage = 100;
  const baseList = showSelectedOnly ? selectedSatellites : satellites;
  const filteredSatellites = baseList.filter((sat) => {
    const searchMatch = Object.values(sat)
      .map((val) => String(val || ""))
      .join(" ")
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    const typeMatch = activeTypeFilter
      ? sat.objectType?.toLowerCase() === activeTypeFilter.toLowerCase()
      : true;

    return searchMatch && typeMatch;
  });
  const totalPages = Math.ceil(filteredSatellites.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const visibleSatellites = filteredSatellites.slice(
    startIndex,
    startIndex + itemsPerPage
  );
  const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };
  const handleSelect = (satellite) => {
    const isSelected = selectedSatellites.some(
      (s) => s.noradCatId === satellite.noradCatId
    );
    if (isSelected) {
      setSelectedSatellites((prev) =>
        prev.filter((s) => s.noradCatId !== satellite.noradCatId)
      );
      setError("");
    } else {
      if (selectedSatellites.length >= 10) {
        setError("Maximum 10 selections allowed!");
        return;
      }
      setSelectedSatellites((prev) => [...prev, satellite]);
      setError("");
    }
  };
  const isChecked = (sat) =>
    selectedSatellites.some((s) => s.noradCatId === sat.noradCatId);
  return (
    <div className="satellite-data-container">
      <h1 className="satellite-heading">Space Object Tracking System</h1>
      <p className="satellite-subheading">
        Real-time satellite and space debris monitoring
      </p>

      {loading ? (
        <div className="loading-container">
          <div className="orbit-animation">
            <div className="planet"></div>
            <div className="satellite-orbit">
              <div className="satellite"></div>
            </div>
          </div>
          <p className="loading-text">Fetching satellite data...</p>
        </div>
      ) : error ? (
        <div className="error-message">
          <p>Error: {error}</p>
        </div>
      ) : (
        <div>
          <div className="satellite-stats">
            <div
              className={`stat-card ${activeTypeFilter === "" ? "active" : ""}`}
              onClick={() => setActiveTypeFilter("")}
            >
              <h3>All Objects</h3>
              <p className="stat-number">{satellites.length}</p>
            </div>
            <div
              className={`stat-card ${
                activeTypeFilter === "ROCKET BODY" ? "active" : ""
              }`}
              onClick={() =>
                setActiveTypeFilter(
                  activeTypeFilter === "ROCKET BODY" ? "" : "ROCKET BODY"
                )
              }
            >
              <h3>Rocket Bodies</h3>
              <p className="stat-number">{rocketBodyCount}</p>
            </div>
            <div
              className={`stat-card ${
                activeTypeFilter === "DEBRIS" ? "active" : ""
              }`}
              onClick={() =>
                setActiveTypeFilter(
                  activeTypeFilter === "DEBRIS" ? "" : "DEBRIS"
                )
              }
            >
              <h3>Debris</h3>
              <p className="stat-number">{debrisCount}</p>
            </div>
            <div
              className={`stat-card ${
                activeTypeFilter === "PAYLOAD" ? "active" : ""
              }`}
              onClick={() =>
                setActiveTypeFilter(
                  activeTypeFilter === "PAYLOAD" ? "" : "PAYLOAD"
                )
              }
            >
              <h3>Payloads</h3>
              <p className="stat-number">{payloadCount}</p>
            </div>
            <div
              className={`stat-card ${
                activeTypeFilter === "UNKNOWN" ? "active" : ""
              }`}
              onClick={() =>
                setActiveTypeFilter(
                  activeTypeFilter === "UNKNOWN" ? "" : "UNKNOWN"
                )
              }
            >
              <h3>Unknown</h3>
              <p className="stat-number">{unknownCount}</p>
            </div>
          </div>
          <div className="satellite-data-section">
            <div className="database-header">
              <h2 className="database-title">Satellite Database</h2>
              <div className="database-stats">
                <div className="stat-pill">
                  <span className="stat-label">Total Objects:</span>
                  <span className="stat-value">
                    {(() => {
                      const baseList = showSelectedOnly
                        ? selectedSatellites
                        : satellites;
                      if (activeTypeFilter) {
                        return baseList.filter(
                          (sat) =>
                            sat.objectType?.toLowerCase() ===
                            activeTypeFilter.toLowerCase()
                        ).length;
                      }
                      return baseList.length;
                    })()}
                  </span>
                </div>
                <div className="stat-pill">
                  <span className="stat-label">Showing:</span>
                  <span className="stat-value">{visibleSatellites.length}</span>
                </div>
              </div>
            </div>
            <div className="search-bar-container">
              <input
                type="text"
                className="search-input"
                placeholder="Search by Name, Country or Type..."
                value={searchQuery}
                onChange={handleSearch}
              />
              <button
                className="toggle-btn"
                onClick={() => setShowSelectedOnly((prev) => !prev)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="18"
                  height="18"
                  fill="currentColor"
                  style={{ marginRight: "8px" }}
                >
                  {showSelectedOnly ? (
                    <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z" />
                  ) : (
                    <path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z" />
                  )}
                </svg>
                {showSelectedOnly ? "Show All" : "Show Selected Only"}
              </button>
            </div>
            <div className="selection-info">
              <div className="selection-counter">
                <div className="counter-icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="18"
                    height="18"
                    fill="currentColor"
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                  </svg>
                </div>
                <span className="selection-label">Selected Objects</span>
                <div className="selection-count-badge">
                  <span className="selection-value">
                    {selectedSatellites.length}
                  </span>
                  <span className="selection-max">/ 10</span>
                </div>
              </div>
              {error && (
                <div className="selection-error">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="18"
                    height="18"
                    fill="currentColor"
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                  </svg>
                  <span>{error}</span>
                </div>
              )}
            </div>
            <div className="satellite-grid">
              {visibleSatellites.map((sat, index) => (
                <div key={index} className="sat-card-wrapper">
                  <div className="sat-checkbox">
                    <label className="custom-checkbox">
                      <input
                        type="checkbox"
                        checked={isChecked(sat)}
                        onChange={() => handleSelect(sat)}
                      />
                      <span className="checkmark"></span>
                    </label>
                  </div>
                  <div className="sat-card">
                    <div className="sat-card-top">
                      <div
                        className="sat-type-indicator"
                        data-type={
                          sat.objectType
                            ? sat.objectType.toLowerCase()
                            : "unknown"
                        }
                      ></div>
                      <div className="sat-id">{sat.noradCatId || "N/A"}</div>
                    </div>
                    <h3 className="sat-name">{sat.name || "Unknown Object"}</h3>
                    <div className="sat-info">
                      <div className="sat-info-row">
                        <div className="info-item">
                          <div className="info-label">Type</div>
                          <div className="info-value">
                            {sat.objectType || "Unknown"}
                          </div>
                        </div>
                        <div className="info-item">
                          <div className="info-label">Country</div>
                          <div className="info-value">
                            {sat.countryCode || "-"}
                          </div>
                        </div>
                      </div>
                      <div className="sat-info-row">
                        <div className="info-item">
                          <div className="info-label">Launch</div>
                          <div className="info-value">
                            {sat.launchDate || "-"}
                          </div>
                        </div>
                        <div className="info-item">
                          <div className="info-label">Orbit</div>
                          <div className="info-value">
                            {sat.orbitCode || "-"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="pagination-container">
              <div className="pagination-controls">
                <button
                  className="pagination-button prev-button"
                  onClick={handlePrev}
                  disabled={currentPage === 1}
                >
                  <span className="arrow">◀</span> Previous
                </button>

                <div className="pagination-info">
                  <span className="page-text">Page</span>
                  <span className="page-number">{currentPage}</span>
                  <span className="page-text">of</span>
                  <span className="page-number">{totalPages}</span>
                </div>

                <button
                  className="pagination-button next-button"
                  onClick={handleNext}
                  disabled={currentPage === totalPages}
                >
                  Next <span className="arrow">▶</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SatelliteData;
