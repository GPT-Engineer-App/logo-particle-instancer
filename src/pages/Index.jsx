import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <h1 className="text-4xl font-bold mb-6">Welcome to ACME Logo Particles</h1>
      <p className="text-xl mb-8">Experience our logo come to life with Three.js particle animation</p>
      <Button asChild>
        <Link to="/logo-particles">View Logo Particles</Link>
      </Button>
    </div>
  );
};

export default Index;