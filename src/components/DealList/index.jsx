import { Badge } from "../ui/badge";
import { Table, TableBody, TableCell, TableRow } from "../ui/table";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export default function DealList() {
  const mockDataA = [
    {
      image:
        "https://athome.starbucks.com/sites/default/files/styles/carousel_415x347/public/2022-05/CAH_PDP_Vanilla_1842x1542_Ground_shadow.png.webp?itok=jyAVO26X",
      title: "Vanta Roast (18oz)",
      discount: "10%",
      expiry: "3 days",
      description: "Bought coffee in the past week",
      unlocked: true,
    },
    {
      image: "https://dam.delonghi.com/600x600/assets/223655",
      title: "Delonghi Magnifica S",
      discount: "$5",
      expiry: "1 week",
      description: "Recurring customer discount",
      unlocked: false,
    },
  ];

  const mockDataB = [
    {
      image:
        "https://athome.starbucks.com/sites/default/files/styles/carousel_415x347/public/2022-05/CAH_PDP_Vanilla_1842x1542_Ground_shadow.png.webp?itok=jyAVO26X",
      title: "Vanta Roast (18oz)",
      discount: "10%",
      expiry: "3 days",
      description: "Bought coffee in the past week",
      unlocked: true,
    },
    {
      image: "https://dam.delonghi.com/600x600/assets/223655",
      title: "Delonghi Magnifica S",
      discount: "$5",
      expiry: "1 week",
      description: "Recurring customer discount",
      unlocked: false,
    },
  ];

  return (
    <div>
      <span className="m-4 font-bold">
        Available deals ({mockDataA.length})
      </span>
      <Table>
        <TableBody>
          {mockDataA.map((deal, index) => (
            <TableRow key={index}>
              <div className="flex p-4 justify-between items-center">
                <div className="flex space-x-3">
                  <img
                    src={deal.image}
                    alt="deal"
                    className="w-20 h-20 rounded-lg"
                  />
                  <div className="flex flex-col items-start	space-y-1">
                    <Badge variant="outlined">{deal.discount} OFF</Badge>
                    <span className="font-bold">{deal.title}</span>
                    <span>Expires in {deal.expiry}</span>
                  </div>
                </div>
                <Button className="mr-3">Apply</Button>
              </div>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <span className="m-4 font-bold">Other deals ({mockDataB.length})</span>
      <Table>
        <TableBody>
          {mockDataB.map((deal, index) => (
            <TableRow key={index}>
              <div className="flex p-4 justify-between items-center">
                <div className="flex space-x-3">
                  <img
                    src={deal.image}
                    alt="deal"
                    className="w-20 h-20 rounded-lg"
                  />
                  <div className="flex flex-col items-start	space-y-1">
                    <Badge variant="outlined">{deal.discount} OFF</Badge>
                    <span className="font-bold">{deal.title}</span>
                    <span>Expires in {deal.expiry}</span>
                  </div>
                </div>
                <Button className="mr-3">Unlock</Button>
              </div>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
