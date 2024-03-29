import { Button, Grid, Icon, styled, Card, CircularProgress } from "@mui/material";
import { Span } from "app/components/Typography";
import { useEffect, useState } from "react";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import axios from "axios";

const CardRoot = styled(Card)(({ theme }) => ({
  marginBottom: "24px",
  padding: "24px !important",
  [theme.breakpoints.down("sm")]: { paddingLeft: "16px !important" }
}));

const TextField = styled(TextValidator)(() => ({
  width: "100%",
  marginBottom: "16px"
}));

export default function StatCards() {

  const [isChecking, setIsChecking] = useState(false);

  const [transactionDetails, setTransactionDetails] = useState({
    cardNumber: "",
    amount: "",
    cvv: "",
    cardHolderName: "",
    expirationDate: "",
    recipientCardNumber: ""
  });

  useEffect(() => {
    ValidatorForm.addValidationRule("isTruthy", (value) => value);
    ValidatorForm.addValidationRule("isCardNum", (value) => value.length === 16);
    ValidatorForm.addValidationRule("isCvv", (value) => value.length >= 3 && value.length <= 4);
    // Add others if needed
  }, []);

  // Make sure to remove validators on component unmount
  useEffect(() => {
    // Cleanup
    return function cleanup() {
      ValidatorForm.removeValidationRule("isTruthy");
      ValidatorForm.removeValidationRule("isCardNum");
      ValidatorForm.removeValidationRule("isCvv");
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTransactionDetails({
      ...transactionDetails,
      [name]: value
    });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsChecking(true);
    console.log("Transaction Details: ", transactionDetails);
    // Here you would normally send the data to the backend API
    // using fetch or axios for example.

    const postData = {
      cardNumber: transactionDetails.cardNumber,
      amount: parseFloat(transactionDetails.amount), // Convert amount to a number
      cvv: transactionDetails.cvv,
      cardHolderName: transactionDetails.cardHolderName,
      expirationDate: transactionDetails.expirationDate, // Use the formatted expiration date
      recipientCardNumber: transactionDetails.recipientCardNumber
    };

    try {
      // Send a POST request to the specified endpoint
      const response = await axios.post(
        "https://abandoned.pythonanywhere.com/api/transfer/",
        postData
      );

      // Handle the response here. If successful, you probably want to notify the user.
      if (response.data.status === "success") {
        // Handle success case
        console.log("Success:", response.data);
        toast.success(response.data.message || "Transfer completed successfully.");
        // Insert additional success handling code here, such as resetting the form
        // or displaying a success message/notification to the user
      } else {
        // Handle scenarios where the server processes the request but can't transfer funds
        toast.error(response.data.message || "Invalid card details.");
        console.error("Error:", response.data.message);
        // Insert code to display an error message/notification to the user
      }
    } catch (error) {
      // Handle any network errors or cases where the server doesn't handle the requested correctly
      toast.error(
        error.response?.data?.message || "An error occurred while processing your request."
      );
      console.error(
        "Request Error:",
        error.message || "An error occurred while processing your request."
      );
      // Insert code to display a network error message/notification to the user
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <>
      <CardRoot>
        <div>
          <ValidatorForm onSubmit={handleSubmit} onError={() => null}>
            <Grid container spacing={6}>
              <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>
                <TextField
                  type="text"
                  name="cardNumber"
                  label="Card Number"
                  onChange={handleChange}
                  value={transactionDetails.cardNumber}
                  validators={["required", "isCardNum"]}
                  errorMessages={["this field is required", "Card number should be 16 digits"]}
                  fullWidth
                />

                <TextField
                  sx={{ mb: 4 }}
                  type="text"
                  name="cardHolderName"
                  label="Card Holder Name"
                  onChange={handleChange}
                  value={transactionDetails.cardHolderName || ""}
                  errorMessages={["this field is required"]}
                  validators={["required"]}
                />

                <TextField
                  name="expirationDate"
                  type="text"
                  label="Expiration Date DD/MM"
                  value={transactionDetails.expirationDate || ""}
                  onChange={handleChange}
                  validators={["required"]}
                  errorMessages={["this field is required"]}
                />

                <TextField
                  type="text"
                  name="cvv"
                  label="CVV"
                  value={transactionDetails.cvv || ""}
                  onChange={handleChange}
                  validators={["required", "isNumber", "maxStringLength: 4", "minStringLength: 3"]}
                  errorMessages={["this field is required", "enter valid cvv"]}
                />
              </Grid>

              <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>
                <TextField
                  name="recipientCardNumber"
                  type="text"
                  label="Recipient Card Number"
                  value={transactionDetails.recipientCardNumber || ""}
                  onChange={handleChange}
                  validators={["required", "isCardNum"]}
                  errorMessages={["this field is required", "Card number should be 16 digits"]}
                />

                <TextField
                  type="number"
                  name="amount"
                  label="Amount to transfer"
                  onChange={handleChange}
                  value={transactionDetails.amount || ""}
                  validators={["required"]}
                  errorMessages={["this field is required"]}
                />
              </Grid>
            </Grid>
            <Button 
              color="primary" 
              variant="contained" 
              type="submit" 
              endIcon={isChecking ? <CircularProgress size={24} /> : <Icon>send</Icon>}
              disabled={isChecking} // Disable the button when the API call is in progress
            >
              <Span sx={{ pl: 1, textTransform: "capitalize" }}>
                {isChecking ? "Transferring..." : "Send Amount"} {/* Change text based on isChecking */}
              </Span>
            </Button>{" "}
          </ValidatorForm>
        </div>
      </CardRoot>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
      />
    </>
  );
}
