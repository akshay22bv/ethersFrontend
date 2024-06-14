import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Select,
  MenuItem,
  FormControl,
  CircularProgress,
  Button,
  Container,
} from "@mui/material";
import { DataGrid, GridActionsCellItem, GridColDef } from "@mui/x-data-grid";
import toast from "react-hot-toast";
// import BTCWithdraw from "./BTCWithdraw";

const Dashboard = () => {
  const [mnemonics, setMnemonics] = useState<Mnemonic[]>([]);
  const [selectedMnemonic, setSelectedMnemonic] = useState("");
  const [currency, setCurrency] = useState("BTC");
  const [loading, setLoading] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [openAdd, setOpenAdd] = useState("");
  const [senderAddress, setSenderAddress] = useState("");
  const [amount, setAmount] = useState("");

  useEffect(() => {
    fetchMnemonics();
  }, []);

  useEffect(() => {
    if (selectedMnemonic && currency) {
      fetchAddresses(selectedMnemonic, currency);
    }
  }, [selectedMnemonic, currency]);

  const fetchMnemonics = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/mnemonic`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch mnemonics");
      }
      const data = await response.json();
      setMnemonics(data?.body?.mnemonics || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAddresses = async (mnemonic: any, currency: any) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/address/${mnemonic}/${currency}`,
        {
          method: "GET",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch addresses");
      }
      const data = await response.json();
      setAddresses(data?.body?.addresses || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const createAddress = async (mnemonic: any, currency: any) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/address/create/${mnemonic}/${currency}`,
        {
          method: "POST",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to create address");
      }
      await fetchAddresses(mnemonic, currency);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleMnemonicChange = (event: any) => {
    const selectedMnemonic = event.target.value;
    setSelectedMnemonic(selectedMnemonic);
  };

  const handleCurrencyChange = (event: any) => {
    const selectedCurrency = event.target.value;
    setCurrency(selectedCurrency);
  };

  const handleCreateAddress = () => {
    if (selectedMnemonic && currency) {
      createAddress(selectedMnemonic, currency);
    }
  };

  const handleCreateMnemonic = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/mnemonic/create`,
        {
          method: "POST",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to add mnemonic");
      }
      await fetchMnemonics();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const reloadBalance = async (row: any) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/balance/${row.address}/${row.currency}`,
        {
          method: "GET",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch balance");
      }
      await fetchAddresses(row.mnemonic, currency);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", flex: 1 },
    { field: "address", headerName: "Address", flex: 2 },
    { field: "balance", headerName: "Balance", flex: 1 },
    { field: "path", headerName: "Path", flex: 1 },
    { field: "mnemonic", headerName: "Mnemonic", flex: 1 },
    {
      field: "actions",
      type: "actions",
      headerName: "ACTION",
      width: 80,
      getActions: (row: any) => [
        <GridActionsCellItem
          key="transfer"
          onClick={() => {
            setSenderAddress(row.row.address);
            setOpenAdd("withdraw");
          }}
          sx={{
            margin: "0 1rem",
            padding: "5px 0",
            borderBottom: "1px solid #E1DCDC",
            width: "6rem",
            fontSize: "14px",
          }}
          label="Transfer"
          showInMenu
        />,
        <GridActionsCellItem
          key="refresh"
          label="Reload Balance"
          onClick={() => {
            void reloadBalance(row.row);
          }}
          sx={{
            margin: "0 1rem",
            padding: "5px 0",
            borderBottom: "1px solid #E1DCDC",
            width: "6rem",
            fontSize: "14px",
          }}
          showInMenu
        />,
      ],
    },
  ];

  const onSubmit = async (data: any) => {
    data = {
      senderAddress,
      ...data,
    };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/bitcoin/withdraw`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      const res = await response.json();

      if (res.error) {
        toast.error(res.error.code);
      }

      if (res.success) {
        toast.success(res.message);
        setOpenAdd("");
      }
    } catch (error) {}
  };

  const CURRENCY_LIST = [
    { value: "BTC", label: "Bitcoin" },
    { value: "ETH", label: "Ethereum" },
    { value: "USDC_TRC20", label: "USDC (TRC20)" },
    { value: "USDT_TRC20", label: "USDT (TRC20)" },
    { value: "USDC_ERC20", label: "USDC (ERC20)" },
    { value: "USDT_ERC20", label: "USDT (ERC20)" },
    { value: "USDC_BSC", label: "USDC (BSC)" },
    { value: "USDT_BSC", label: "USDT (BSC)" },
    { value: "USDC_POLYGON", label: "USDC (Polygon)" },
    { value: "USDT_POLYGON", label: "USDT (Polygon)" },
  ];

  return (
    <Container component="main" maxWidth="xl">
      <Box mt={8}>
        <Typography variant="h6" gutterBottom>
          Crypto wallet
        </Typography>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 2,
          }}
        >
          <FormControl sx={{ minWidth: 200 }}>
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

              {CURRENCY_LIST?.map((item, i) => (
                <MenuItem key={i} value={item.value}>
                  {item.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 500 }}>
            <Select
              size="small"
              value={selectedMnemonic}
              onChange={handleMnemonicChange}
              displayEmpty
              fullWidth
            >
              <MenuItem value="" disabled>
                Select Mnemonic
              </MenuItem>
              {mnemonics.map((item, index) => (
                <MenuItem key={index} value={item.id}>
                  {item.mnemonic}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleCreateMnemonic}
          >
            Add Mnemonic
          </Button>

          <Button
            variant="contained"
            color="primary"
            onClick={handleCreateAddress}
          >
            Create Address
          </Button>
        </Box>

        <Box sx={{ height: 400 }}>
          {loading ? (
            <CircularProgress />
          ) : (
            <DataGrid rows={addresses} columns={columns} />
          )}
        </Box>

        {/* {(openAdd === "withdraw" || openAdd === "edit") && (
          <BTCWithdraw
            onClose={() => {
              setOpenAdd("");
            }}
            onSubmit={onSubmit}
          />
        )} */}
      </Box>
    </Container>
  );
};

export default Dashboard;
