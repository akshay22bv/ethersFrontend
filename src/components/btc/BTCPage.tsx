import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Select,
  MenuItem,
  FormControl,
  CircularProgress,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { DataGrid, GridActionsCellItem, GridColDef } from "@mui/x-data-grid";
import toast from "react-hot-toast";
import BTCWithdraw from "./BTCWithdraw";

const BTCPage = () => {
  const [mnemonics, setMnemonics] = useState<Mnemonic[]>([]);
  const [selectedMnemonic, setSelectedMnemonic] = useState("5");
  const [loading, setLoading] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [open, setOpen] = useState(false);
  const [senderAddress, setSenderAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [openAdd, setOpenAdd] = useState("");

  useEffect(() => {
    fetchMnemonics();
  }, []);

  useEffect(() => {
    fetchAddresses(selectedMnemonic);
  }, [selectedMnemonic]);

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

  const fetchAddresses = async (mnemonic: any) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/bitcoin/${mnemonic}`,
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

  const createAddress = async (mnemonic: any) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/bitcoin/${mnemonic}`,
        {
          method: "POST",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to create address");
      }
      await fetchAddresses(mnemonic);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleMnemonicChange = (event: any) => {
    const selectedMnemonic = event.target.value;
    setSelectedMnemonic(selectedMnemonic);
    fetchAddresses(selectedMnemonic);
  };

  const handleCreateAddress = () => {
    if (selectedMnemonic) {
      createAddress(selectedMnemonic);
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
      setLoading(false);

      fetchMnemonics();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const reloadBalance = async (row: any) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/bitcoin/balance/${row.address}`,
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch balance");
      }

      fetchAddresses(row.mnemonic);
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
    // {
    //   field: "actions",
    //   headerName: "Actions",
    //   flex: 1,
    //   renderCell: (params: any) => (
    //     <Button
    //       className="text-grey"
    //       onClick={() => {
    //         console.log({ params });

    //         setSenderAddress(params.row.address);
    //         setOpenAdd("withdraw");
    //       }}
    //     >
    //       Transfer
    //     </Button>
    //   ),
    // },

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
        //   <GridActionsCellItem
        //     key="delete"
        //     label="Delete"
        //     onClick={() => {
        //       setDeleteAzureId(row?.azureId);
        //       setOpenDialog("delete");
        //     }}
        //     sx={{
        //       margin: "0 1rem",
        //       padding: "5px 0",

        //       width: "6rem",
        //       fontSize: "14px",
        //       color: "#ff0000",
        //     }}
        //     showInMenu
        //   />,
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

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 2,
        }}
      >
        <FormControl sx={{ minWidth: 500 }}>
          <Select
            size="small"
            value={selectedMnemonic}
            onChange={handleMnemonicChange}
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

      {(openAdd === "withdraw" || openAdd === "edit") && (
        <BTCWithdraw
          onClose={() => {
            setOpenAdd("");
          }}
          onSubmit={onSubmit}

          // loading={loading}
        />
      )}
    </Box>
  );
};

export default BTCPage;
