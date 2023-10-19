import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Checkbox } from "../components/ui/checkbox";
import { Button } from "../components/ui/button";

export const Auth2 = () => {
  const mockData = {
    name: "amazon.com",
    image: "https://amazon.com/favicon.ico",
    queries: [
      "You purchased shoes in the last 7 days",
      "You spent over $100 on Amazon",
    ],
  };

  return (
    <div className="flex flex-col items-center justify-between h-full pt-16 px-3 pb-3 text-center">
      <div className="flex flex-col items-center">
        <div className="flex space-x-4 mb-5">
          <Avatar>
            <AvatarImage src={mockData.image} alt={mockData.name} />
            <AvatarFallback>{mockData.name}</AvatarFallback>
          </Avatar>
          <h1 className="text-2xl font-bold">{mockData.name}</h1>
        </div>
        <span className="max-w-xs">
          Wants to verify the following information from your account:
        </span>
      </div>

      <div className="flex flex-col items-center justify-center h-full py-4 space-y-3">
        {mockData.queries.map((query, index) => (
          <div className="w-full px-5 py-2 border-2	border-black rounded-full">
            {query}
          </div>
        ))}
      </div>
      <div className="w-full">
        <div className="flex items-center space-x-2">
          <Checkbox id="auto-approve" />
          <label
            htmlFor="auto-approve"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Enable auto-approve from now on
          </label>
        </div>
        <div className="flex flex-row justify-between	space-x-3 mt-3">
          <Button className="w-full" variant="destructive">Reject</Button>
          <Button className="w-full">Approve</Button>
        </div>
      </div>
    </div>
  );
};
