import { Badge } from "../ui/badge";
import { Table, TableBody, TableCell, TableRow } from "../ui/table";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";

export default function PurchaseHistory() {
  const mockData = [
    {
      date: "2023-10-17",
      site: "nike.com",
      item: "Nike Air Max 90",
      price: "$100",
      categories: ["Clothing", "Shoes"],
    },
    {
      date: "2023-10-16",
      site: "amazon.com",
      item: "Playstation 5",
      price: "$499",
      categories: ["Electronics", "Gaming"],
    },
  ];

  return (
    <Table>
      <TableBody>
        {mockData.map((purchase, index) => (
          <TableRow key={index}>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>
                  <TableCell>
                    <Badge variant="outlined">{purchase.date}</Badge>
                  </TableCell>
                  <TableCell>{purchase.item}</TableCell>
                  <TableCell align="right">{purchase.price}</TableCell>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="flex mx-5">
                    <span>Categories:</span>
                    {purchase.categories.map((category, index) => (
                      <Badge key={index} variant="outlined" className="ml-2">
                        {category}
                      </Badge>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
