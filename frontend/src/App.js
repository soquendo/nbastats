import React, { useState } from "react";
import axios from "axios";

function App() {
  const [playerName, setPlayerName] = useState("");
  const [playerData, setPlayerData] = useState(null);
  const [careerAverages, setCareerAverages] = useState(null);
  const [error, setError] = useState("");

  const fetchPlayerData = async () => {
    try {
      setError("");
      const response = await axios.get(`http://localhost:5001/player/${encodeURIComponent(playerName)}`);
      
      if (!response.data || response.data.length === 0) {
        setError("Player not found or an error occurred.");
        setPlayerData(null);
        setCareerAverages(null);
        return;
      }

      setPlayerData(response.data);

      // fetch career stats separately
      const careerStats = await axios.get(`http://rest.nbaapi.com/api/PlayerDataTotals/name/${encodeURIComponent(playerName)}`);
      if (careerStats.data.length > 0) {
        const averages = calculateCareerAverages(careerStats.data);
        setCareerAverages(averages);
      }

    } catch (err) {
      setError("Player not found or an error occurred.");
      setPlayerData(null);
      setCareerAverages(null);
    }
  };

  // career averages
  const calculateCareerAverages = (seasons) => {
    const totalSeasons = seasons.length;
    if (totalSeasons === 0) return null;

    const sumStats = seasons.reduce((acc, season) => {
      acc.games += season.games;
      acc.points += season.points;
      acc.assists += season.assists;
      acc.rebounds += season.totalRb;
      acc.steals += season.steals;
      acc.blocks += season.blocks;
      return acc;
    }, { games: 0, points: 0, assists: 0, rebounds: 0, steals: 0, blocks: 0 });

    return {
      seasonsPlayed: totalSeasons,
      pointsPerGame: (sumStats.points / sumStats.games).toFixed(1),
      assistsPerGame: (sumStats.assists / sumStats.games).toFixed(1),
      reboundsPerGame: (sumStats.rebounds / sumStats.games).toFixed(1),
      stealsPerGame: (sumStats.steals / sumStats.games).toFixed(1),
      blocksPerGame: (sumStats.blocks / sumStats.games).toFixed(1)
    };
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>NBA Player Stats</h1>
      <input
        type="text"
        placeholder="Enter player name"
        value={playerName}
        onChange={(e) => setPlayerName(e.target.value)}
      />
      <button onClick={fetchPlayerData}>Search</button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {playerData && (
        <div>
          <h2>{playerData.playerName} ({playerData.season})</h2>
          <h3>Latest Season Averages:</h3>
          <p><strong>Age:</strong> {playerData.age}</p>
          <p><strong>Team:</strong> {playerData.team}</p>
          <p><strong>Games Played:</strong> {playerData.games}</p>
          <p><strong>Points Per Game:</strong> {(playerData.points / playerData.games).toFixed(1)}</p>
          <p><strong>Assists Per Game:</strong> {(playerData.assists / playerData.games).toFixed(1)}</p>
          <p><strong>Rebounds Per Game:</strong> {(playerData.totalRb / playerData.games).toFixed(1)}</p>
          <p><strong>Steals Per Game:</strong> {(playerData.steals / playerData.games).toFixed(1)}</p>
          <p><strong>Blocks Per Game:</strong> {(playerData.blocks / playerData.games).toFixed(1)}</p>
        </div>
      )}

      {careerAverages && (
        <div style={{ marginTop: "30px" }}>
          <h3>Career Averages:</h3>
          <p><strong>Seasons Played:</strong> {careerAverages.seasonsPlayed}</p>
          <p><strong>Points Per Game:</strong> {careerAverages.pointsPerGame}</p>
          <p><strong>Assists Per Game:</strong> {careerAverages.assistsPerGame}</p>
          <p><strong>Rebounds Per Game:</strong> {careerAverages.reboundsPerGame}</p>
          <p><strong>Steals Per Game:</strong> {careerAverages.stealsPerGame}</p>
          <p><strong>Blocks Per Game:</strong> {careerAverages.blocksPerGame}</p>
        </div>
      )}
    </div>
  );
}

export default App;