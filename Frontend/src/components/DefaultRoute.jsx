import { Link } from "react-router-dom";

const DefaultRoute = () => {
  return (
    <div>
      <h1>Default page

        
      </h1>
      <Link to="/infomain" className="text-blue-600 underline">
        Ir a InfoMain
      </Link>
    </div>
  );
};

export default DefaultRoute;
