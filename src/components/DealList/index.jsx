import { Badge } from "../ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "../ui/table";
import { Button } from "../ui/button";

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
    <Table>
      <TableBody>
        {mockData.map((deal, index) => (
          <TableRow key={index}>
            <TableCell>
              <Badge
                variant="outlined"
              >{deal.discount}</Badge>
            </TableCell>
            <TableCell sx={{ fontSize: "14px" }}>{deal.description}</TableCell>
            <TableCell align="right">
              <Button disabled={deal.unlocked}>
                {deal.unlocked ? "Unlocked" : "Unlock"}
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
