import { Box, Button, TextField } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import React from "react";
import toast from "react-hot-toast";

const WithdrawForm = () => {
  const { handleSubmit, control, reset } = useForm();

  const onSubmit = async (data: any) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/withdraw`,
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
      }

      reset();
    } catch (error) {}
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 1 }}>
      <Controller
        name="assetAddress"
        control={control}
        defaultValue=""
        render={({ field }) => (
          <TextField
            size="small"
            {...field}
            margin="normal"
            required
            fullWidth
            id="assetAddress"
            placeholder="Asset Address"
          />
        )}
      />
      <Controller
        name="amount"
        control={control}
        defaultValue=""
        render={({ field }) => (
          <TextField
            {...field}
            size="small"
            margin="normal"
            required
            fullWidth
            placeholder="Amount"
            type="number"
            id="amount"
          />
        )}
      />
      <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
        Withdraw
      </Button>
    </Box>
  );
};

export default WithdrawForm;
