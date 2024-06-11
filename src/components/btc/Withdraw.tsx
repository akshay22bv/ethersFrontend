import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";

type FormData = {
  recipientAddress: string;
  amount: number;
};

type propType = {
  onClose: () => void;
  onSubmit: (values: FormData) => void;
};

const Withdraw = (props: propType) => {
  const {
    handleSubmit,
    control,
    formState: { errors },
    watch,
    reset,
  } = useForm<FormData>();

  const onSubmit = (values: FormData) => {
    console.log("values: ", values);
    props.onSubmit(values);
  };

  return (
    <Dialog open={true}>
      <DialogTitle>Transfer</DialogTitle>
      <DialogContent>
        <DialogContentText>
          To transfer funds, please enter the address and amount.
        </DialogContentText>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="recipientAddress"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                required
                autoFocus
                margin="dense"
                size="small"
                type="text"
                fullWidth
                variant="outlined"
              />
            )}
          />
          <Controller
            name="amount"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                size="small"
                required
                margin="dense"
                type="number"
                fullWidth
                variant="outlined"
              />
            )}
          />
          <DialogActions>
            <Button
              onClick={() => {
                props.onClose();
              }}
              color="primary"
            >
              Cancel
            </Button>
            <Button type="submit" color="primary">
              Transfer
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default Withdraw;
