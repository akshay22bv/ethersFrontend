// components/CurrencyAutocomplete.js
import React, { Fragment, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  InputAdornment,
  List,
  ListItem,
  ListItemText,
  Typography,
  IconButton,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import Image from "next/image";

import BTC from "../assets/currencies/sym-btc_colored.svg";
import ETC from "../assets/currencies/sym-etc_colored.svg";
import ETH from "../assets/currencies/sym-eth_colored.svg";
import EUR from "../assets/currencies/sym-eur_colored.svg";
import TRX from "../assets/currencies/sym-trx_colored.svg";
import USD from "../assets/currencies/sym-usd_colored.svg";
import USDC from "../assets/currencies/sym-usdc_colored.svg";
import USDT from "../assets/currencies/sym-usdt_colored.svg";

interface ConvertForm {
  currency1: string;
  currency2: string;
  value1: number;
  value2: number;
}

interface Currency {
  id: number;
  icon: string;
  name: string;
}

const currencies: Currency[] = [
  { id: 1, name: "USDC", icon: USDC },
  { id: 2, name: "BTC", icon: BTC },
  { id: 3, name: "ETH", icon: ETH },
  { id: 4, name: "USDT", icon: USDT },
  { id: 5, name: "TRX", icon: TRX },
  { id: 6, name: "EUR", icon: EUR },
  { id: 6, name: "ETC", icon: ETC },
  { id: 7, name: "USD", icon: USD },
];

const CurrencyAutocomplete = () => {
  const { control, watch, setValue } = useForm<ConvertForm>({
    defaultValues: {
      currency1: "BTC",
      currency2: "USDC",
    },
  });

  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentCurrencyField, setCurrentCurrencyField] = useState<
    "currency1" | "currency2" | null
  >(null);
  const [searchTerm, setSearchTerm] = useState("");

  const selectedCurrency1 = watch("currency1");
  const selectedCurrency2 = watch("currency2");

  const currency1 = currencies.find((item) => item.name === selectedCurrency1);
  const currency2 = currencies.find((item) => item.name === selectedCurrency2);

  const handleDialogOpen = (currencyField: "currency1" | "currency2") => {
    setCurrentCurrencyField(currencyField);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setSearchTerm("");
    setDialogOpen(false);
  };

  const handleCurrencySelect = (currency: Currency) => {
    if (currentCurrencyField) {
      setValue(currentCurrencyField, currency.name);
    }
    handleDialogClose();
    setSearchTerm("");
  };

  const handleSwapCurrencies = () => {
    const currency1Value = selectedCurrency1;
    const currency2Value = selectedCurrency2;
    setValue("currency1", currency2Value);
    setValue("currency2", currency1Value);
  };

  const filteredCurrencies = currencies.filter(
    (currency) =>
      currency.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      currency.name !== selectedCurrency1 &&
      currency.name !== selectedCurrency2
  );

  return (
    <Box component="form" className="h-screen flex justify-center items-center">
      <div className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-3xl p-4">
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full">
          <Controller
            control={control}
            name="value1"
            rules={{ required: "Please enter a value" }}
            render={({ field: { value, onChange }, fieldState: { error } }) => (
              <TextField
                value={value}
                onChange={onChange}
                error={!!error}
                helperText={error ? error.message : null}
                fullWidth
                margin="normal"
                type="number"
                InputProps={{
                  inputProps: { min: 0, className: "appearance-none" },
                  endAdornment: (
                    <InputAdornment position="end" className="w-fit mr-4">
                      <Button onClick={() => handleDialogOpen("currency1")}>
                        {currency1 && (
                          <Typography className="flex gap-1 items-center">
                            <Image
                              src={currency1.icon}
                              alt={currency1.name}
                              width={30}
                              height={30}
                            />
                            {currency1.name}
                          </Typography>
                        )}
                      </Button>
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />
          <IconButton onClick={handleSwapCurrencies} className="mx-2">
            <SwapHorizIcon />
          </IconButton>
          <Controller
            control={control}
            name="value2"
            rules={{ required: "Please enter a value" }}
            render={({ field: { value, onChange }, fieldState: { error } }) => (
              <TextField
                value={value}
                onChange={onChange}
                error={!!error}
                helperText={error ? error.message : null}
                fullWidth
                margin="normal"
                type="number"
                InputProps={{
                  inputProps: { min: 0, className: "appearance-none" },
                  endAdornment: (
                    <InputAdornment position="end" className="w-fit mr-4">
                      <Button onClick={() => handleDialogOpen("currency2")}>
                        {currency2 && (
                          <Typography className="flex gap-1 items-center">
                            <Image
                              src={currency2.icon}
                              alt={currency2.name}
                              width={30}
                              height={30}
                            />
                            {currency2.name}
                          </Typography>
                        )}
                      </Button>
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />
        </div>
      </div>

      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Select Currency</DialogTitle>
        <DialogContent>
          <TextField
            placeholder="Search currency"
            fullWidth
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <List>
            {filteredCurrencies.map((currency) => (
              <ListItem
                button
                key={currency.id}
                className="gap-2"
                onClick={() => handleCurrencySelect(currency)}
              >
                <Image
                  src={currency.icon}
                  alt={currency.name}
                  width={30}
                  height={30}
                />
                <ListItemText primary={currency.name} />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CurrencyAutocomplete;
