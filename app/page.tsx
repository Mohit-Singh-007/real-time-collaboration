import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Button } from "@/components/ui/button";

export default function page() {
  return (
    <div className="flex justify-center items-center">
      <h1>Hello world</h1>
      <Button>Click Me</Button>
      <ThemeToggle />
    </div>
  );
}
