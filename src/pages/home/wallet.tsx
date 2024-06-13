import React, { useState } from "react";
import {
  Box,
  Container,
  MenuItem,
  Select,
  Typography,
  Grid,
} from "@mui/material";
import WithdrawForm from "@/components/ethers/Withdraw";
import CreateWallet from "@/components/ethers/CreateWallet";
import Balance from "@/components/ethers/Balance";
import Address from "@/components/btc/BTCPage";
import BTCPage from "@/components/btc/BTCPage";
import ETHPage from "@/components/eth/ETHPage";

const Dashboard = () => {
  const [currency, setCurrency] = useState("btc");

  const handleCurrencyChange = (event: any) => {
    setCurrency(event.target.value);
  };

  return (
    <Container component="main" maxWidth="xl">
      <Box mt={8}>
        <Typography variant="h4" gutterBottom>
          Dashboard
        </Typography>
        <Box mb={4} width={200}>
          <Select
            size="small"
            value={currency}
            onChange={handleCurrencyChange}
            displayEmpty
            fullWidth
          >
            <MenuItem value="" disabled>
              Select Currency
            </MenuItem>
            <MenuItem value="eth">ETH</MenuItem>
            <MenuItem value="btc">BTC</MenuItem>
          </Select>
        </Box>
        {currency === "eth" && <ETHPage />}

        {currency === "btc" && <BTCPage />}
      </Box>
    </Container>
  );
};

export default Dashboard;
