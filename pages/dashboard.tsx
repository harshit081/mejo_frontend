import withAuth from "./utils/withAuth";

const Dashboard = () => {
    return (
        <div>
            <h1>Welcome to your Dashboard</h1>
        </div>
    );
};

export default withAuth(Dashboard);
