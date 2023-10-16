import {
  Table,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Button,
} from "@mui/material";
import "./styles.css";

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
    <div>
      <Table sx={{ width: "100%" }}>
        <TableBody>
          {mockData.map((deal, index) => (
            <div>
              <TableRow key={index}>
                <div className="deal-item">
                  <TableCell>
                    <Chip
                      sx={{ minWidth: "50px" }}
                      label={deal.discount}
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>{deal.description}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="success"
                      size="small"
                      disabled={deal.unlocked}
                    >
                      {deal.unlocked ? "Unlocked" : "Unlock"}
                    </Button>
                  </TableCell>
                </div>
              </TableRow>
              {/* {index !== mockData.length - 1 && <Divider />} */}
            </div>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
