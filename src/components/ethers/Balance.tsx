import React, { useState, useEffect } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";

const Balance = () => {
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchBalance = () => {
    setLoading(true);
    setRefreshing(true);

    const storedWallet = localStorage.getItem("wallet") ?? "";
    const { address } = JSON.parse(storedWallet);

    if (address) {
      fetch(`http://localhost:5000/balance/${address}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to fetch balance");
          }
          return response.json();
        })
        .then((data) => {
          setBalance(data.balance);
        })
        .catch((error) => {
          console.error(error);
        })
        .finally(() => {
          setLoading(false);
          setRefreshing(false);
        });
    } else {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchBalance();
  }, []); // No dependency array

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        {loading ? (
          <Typography variant="body1">Loading balance...</Typography>
        ) : balance !== null ? (
          <Typography variant="body1">Balance: {balance} ETH</Typography>
        ) : (
          <Typography variant="body1">No balance available</Typography>
        )}
        <IconButton onClick={fetchBalance} disabled={refreshing}>
          <RefreshIcon color={refreshing ? "disabled" : "warning"} />
        </IconButton>
      </Box>
    </Box>
  );
};

export default Balance;
