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
import Address from "@/components/btc/Address";

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
        {currency === "eth" && (
          <Grid container spacing={2}>
            <Grid
              item
              xs={12}
              md={4}
              sx={{ border: 1, borderColor: "grey.300", padding: 2 }}
            >
              <Box>
                <Typography variant="h6" gutterBottom>
                  Create Wallet
                </Typography>
                <CreateWallet />
              </Box>
            </Grid>
            <Grid
              item
              xs={12}
              md={4}
              sx={{ border: 1, borderColor: "grey.300", padding: 2 }}
            >
              <Box>
                <Typography variant="h6" gutterBottom>
                  Get Balance
                </Typography>
                <Balance />
              </Box>
            </Grid>
            <Grid
              item
              xs={12}
              md={4}
              sx={{ border: 1, borderColor: "grey.300", padding: 2 }}
            >
              <Box>
                <Typography variant="h6" gutterBottom>
                  Withdraw
                </Typography>
                <WithdrawForm />
              </Box>
            </Grid>
          </Grid>
        )}

        {currency === "btc" && <Address />}
      </Box>
    </Container>
  );
};

export default Dashboard;
