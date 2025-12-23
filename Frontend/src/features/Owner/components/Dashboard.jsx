import HeaderOwner from "./HeaderOwner";

const Dashboard = ({ user }) => {
  return (
    <div>
      <HeaderOwner user={user} />
      <h1>Dashboard</h1>
    </div>
  );
};

export default Dashboard;
