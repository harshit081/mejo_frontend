import withAuth from "./utils/withAuth";
import { DashboardNav } from "./components/DashboardNav";
import { Button } from "@/components/ui/button";



const Dashboard = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            <DashboardNav />
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold text-gray-800">Welcome to your Dashboard</h1>
                {/* Add your dashboard content here */}
                <Button>Rio Noo</Button>

            </div>
        </div>
    );
};

export default withAuth(Dashboard);
