import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Payment from "./request/Payment";

export default function Request() {
  return (
    <Container maxWidth="md">
      <Box
        component="form"
        className="mt-20"
        sx={{
          p: 2,
          border: "2px solid grey",
          borderRadius: 10,
        }}
      >
        <div className="flex">
          <div className="w-1/6"></div>
          <div className="w-2/3">
            <Payment />
          </div>
          <div className="w-1/6"></div>
        </div>
      </Box>
    </Container>
  );
}
