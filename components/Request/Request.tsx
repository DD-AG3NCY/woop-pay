import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Payment from "../Payment/Payment";
import styles from "./request.module.scss";
import cx from "classnames";

export default function Request(props: any) {
  const { setBadRequest, setAmountZeroRequest, setNoTokenRequest } = props;

  return (
    <Container maxWidth="sm" className="w-full">
      <Box
        component="form"
        className={cx(
          styles.containerBox,
          "backdrop-blur containerBox p-2 rou rounded-3xl shadow-md w-full"
        )}>
        <Payment
          setBadRequest={setBadRequest}
          setAmountZeroRequest={setAmountZeroRequest}
          setNoTokenRequest={setNoTokenRequest}
        />
      </Box>
    </Container>
  );
}
