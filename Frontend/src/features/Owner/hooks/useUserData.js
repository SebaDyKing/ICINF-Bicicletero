import { useEffect, useState } from "react";
import { getOwnerService } from "../services/owner.service";

export const useUserData = (rut) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getOwnerService(rut);
        setUser(result);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [rut]);

  return user;
};
