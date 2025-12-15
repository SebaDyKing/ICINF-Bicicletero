import HeaderOwner from "../components/HeaderOwner";

const Profile = ({ user }) => {
  return (
    <div>
      <HeaderOwner user={user} />
      <h1>Profile</h1>
    </div>
  );
};

export default Profile;
