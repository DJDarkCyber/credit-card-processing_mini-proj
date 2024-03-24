import { Done } from "@mui/icons-material";

import {
  Box,
  Card,
  Table,
  Select,
  Avatar,
  styled,
  TableRow,
  MenuItem,
  TableBody,
  TableCell,
  TableHead
} from "@mui/material";
import { Paragraph } from "app/components/Typography";

// STYLED COMPONENTS
const CardHeader = styled(Box)(() => ({
  display: "flex",
  paddingLeft: "24px",
  paddingRight: "24px",
  marginBottom: "12px",
  alignItems: "center",
  justifyContent: "space-between"
}));

const Title = styled("span")(() => ({
  fontSize: "1rem",
  fontWeight: "500",
  textTransform: "capitalize"
}));

const ProductTable = styled(Table)(() => ({
  minWidth: 400,
  whiteSpace: "pre",
  "& small": {
    width: 50,
    height: 15,
    borderRadius: 500,
    boxShadow: "0 0 2px 0 rgba(0, 0, 0, 0.12), 0 2px 2px 0 rgba(0, 0, 0, 0.24)"
  },
  "& td": { borderBottom: "none" },
  "& td:first-of-type": { paddingLeft: "16px !important" }
}));

export default function PastTransactionsTable() {
  return (
    <Card elevation={3} sx={{ pt: "20px", mb: 3 }}>
      <CardHeader>
        <Title>past successful transactions</Title>
        <Select size="small" defaultValue="this_month">
          <MenuItem value="this_month">This Month</MenuItem>
          <MenuItem value="last_month">Last Month</MenuItem>
        </Select>
      </CardHeader>

      <Box overflow="auto">
        <ProductTable>
          <TableHead>
            <TableRow>
              <TableCell colSpan={4} sx={{ px: 3 }}>
                Name
              </TableCell>

              <TableCell colSpan={2} sx={{ px: 0 }}>
                Transferred Amount
              </TableCell>

              <TableCell colSpan={2} sx={{ px: 0 }}>
                Transaction Status
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {productList.map((product, index) => (
              <TableRow key={index} hover>
                <TableCell colSpan={4} align="left" sx={{ px: 0, textTransform: "capitalize" }}>
                  <Box display="flex" alignItems="center" gap={4}>
                    <Avatar src={product.imgUrl} />
                    <Paragraph>{product.name}</Paragraph>
                  </Box>
                </TableCell>

                <TableCell align="left" colSpan={2} sx={{ px: 0, textTransform: "capitalize" }}>
                  ${product.price > 999 ? (product.price / 1000).toFixed(1) + "k" : product.price}
                </TableCell>

                <TableCell sx={{ px: 0 }} align="left" colSpan={2}>
                  <Done />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </ProductTable>
      </Box>
    </Card>
  );
}

const productList = [
  {
    imgUrl: "/assets/images/avatars/001-man.svg",
    name: "John Doe",
    price: 1000,
    available: 15
  },
  {
    imgUrl: "/assets/images/avatars/003-man-1.svg",
    name: "Dark Lord",
    price: 1500,
    available: 30
  },
  {
    imgUrl: "/assets/images/avatars/002-woman.svg",
    name: "Nami-San",
    price: 1900,
    available: 35
  },
  {
    imgUrl: "/assets/images/avatars/006-woman-1.svg",
    name: "Robin-San",
    price: 100,
    available: 0
  },
  {
    imgUrl: "/assets/images/avatars/005-man-2.svg",
    name: "Zoro",
    price: 1190,
    available: 5
  }
];
