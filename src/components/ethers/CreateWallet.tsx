import React, { useEffect, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import Image from "next/image";
import toast from "react-hot-toast";
import qr from "qrcode";

const CreateWallet = () => {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [qrCode, setQrCode] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const createWallet = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.BASE_URL}/createWallet`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to create wallet");
      }

      const data = await response.json();

      if (data.success) {
        toast.success(data.message);
        setWallet(data.body);
        localStorage.setItem("wallet", JSON.stringify(data.body));
        const qrCodeData = await qr.toDataURL(data.body.address);
        setQrCode(qrCodeData);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to create wallet");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const storedWallet = localStorage.getItem("wallet");
    if (storedWallet) {
      const parsedWallet = JSON.parse(storedWallet);
      setWallet(parsedWallet);
      qr.toDataURL(parsedWallet.address).then(setQrCode);
    }
  }, []);

  return (
    <Box>
      <Button
        variant="contained"
        onClick={createWallet}
        disabled={loading}
        sx={{ mb: 2 }}
      >
        {loading ? "Creating Wallet..." : "Create Wallet"}
      </Button>
      {wallet ? (
        <Box>
          <Typography className="break-words" variant="body1">
            <strong>Private Key:</strong> {wallet.privateKey}
          </Typography>
          <Typography className="break-words" variant="body1">
            <strong>Public Key:</strong> {wallet.publicKey}
          </Typography>
          <Typography className="break-words" variant="body1">
            <strong>From Address:</strong> {wallet.address}
          </Typography>
          {qrCode && (
            <Image width={200} height={200} src={qrCode} alt="QR Code" />
          )}
        </Box>
      ) : (
        <Typography variant="body1">No wallet created yet.</Typography>
      )}
    </Box>
  );
};

export default CreateWallet;
