import {
  Table,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Button,
} from "@mui/material";

export default function DealList() {
  const mockData = [
    {
      discount: "10%",
      description: "Bought coffee in the past week",
      unlocked: true,
    },
    {
      discount: "$5",
      description: "Recurring customer discount",
      unlocked: false,
    },
    {
      discount: "25%",
      description: "Spent over $100 in the past month",
      unlocked: false,
    },
  ];

  return (
    <Table sx={{ width: "100%" }}>
      <TableBody>
        {mockData.map((deal, index) => (
          <TableRow key={index}>
            <TableCell>
              <Chip
                sx={{ minWidth: "50px", fontWeight: "bold" }}
                label={deal.discount}
                variant="outlined"
              />
            </TableCell>
            <TableCell sx={{ fontSize: "14px" }}>{deal.description}</TableCell>
            <TableCell align="right">
              <Button
                variant="contained"
                color="success"
                size="small"
                disabled={deal.unlocked}
              >
                {deal.unlocked ? "Unlocked" : "Unlock"}
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
