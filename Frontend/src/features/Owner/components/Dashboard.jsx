import HeaderOwner from "../components/HeaderOwner";

const Dashboard = ({ user }) => {
  return (
    <div>
      <HeaderOwner user={user} />
    </div>
  );
};

export default Dashboard;
