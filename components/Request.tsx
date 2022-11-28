import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Payment from "./request/Payment";

export default function Request(props: any) {
  const { setBadRequest, setAmountZeroRequest, setNoTokenRequest } = props;
  return (
    <Container maxWidth="sm">
      <style jsx>{`
        .container {
        }
        p {
        }
      `}</style>
      <Box
        component="form"
        className="backdrop-blur-md"
        sx={{
          p: 2,
          border: "1px solid green",
          borderRadius: 10,
        }}>
        <div>
          <Payment
            setBadRequest={setBadRequest}
            setAmountZeroRequest={setAmountZeroRequest}
            setNoTokenRequest={setNoTokenRequest}
          />
        </div>
      </Box>
    </Container>
  );
}
