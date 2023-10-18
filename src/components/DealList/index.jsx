import { Badge } from "../ui/badge";
import { Table, TableBody, TableCell, TableRow } from "../ui/table";
import { Button } from "../ui/button";

export default function DealList() {
  const mockDataA = [
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

  const mockDataB = [
    {
      discount: "50%",
      description: "Spent over $1000 in the past week",
      unlocked: false,
    },
    {
      discount: "$10",
      description: "Bought sneakers in the past month",
      unlocked: false,
    },
  ];

  return (
    <div>
      <span className="m-4 font-bold">Available deals ({mockDataA.length})</span>
      <Table>
        <TableBody>
          {mockDataA.map((deal, index) => (
            <TableRow key={index}>
              <TableCell>
                <Badge variant="outlined">{deal.discount}</Badge>
              </TableCell>
              <TableCell sx={{ fontSize: "14px" }}>
                {deal.description}
              </TableCell>
              <TableCell align="right">
                <Button disabled={deal.unlocked}>
                  {deal.unlocked ? "Unlocked" : "Unlock"}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <span className="m-4 font-bold">Other deals ({mockDataB.length})</span>
      <Table>
        <TableBody>
          {mockDataB.map((deal, index) => (
            <TableRow key={index}>
              <TableCell>
                <Badge variant="outlined">{deal.discount}</Badge>
              </TableCell>
              <TableCell sx={{ fontSize: "14px" }}>
                {deal.description}
              </TableCell>
              <TableCell align="right">
                <Button>Explore</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
