import HeaderOwner from "../components/HeaderOwner";

const Bikes = ({ user }) => {
  return (
    <div>
      <HeaderOwner user={user} />
      <h1>Bikes</h1>
    </div>
  );
};

export default Bikes;
