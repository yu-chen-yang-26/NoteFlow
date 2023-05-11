import { useContext, createContext, useState, useEffect } from 'react';
import crc32 from 'crc-32';
import instance from '../API/api';

const UserContext = createContext({
  user: {},
  refetchFromLocalStorage: () => {},
});

const getRandomPicture = (name) => {
  const hash = Math.abs(crc32.str(name) + Number(Date.now() / 3600000));
  return `/assets/avatar/${Math.ceil(hash % 7)}.png`;
};

const UserProvider = (props) => {
  const [user, setUser] = useState(null);
  const [rerender, setRerender] = useState(false);
  useEffect(() => {
    instance
      .get('/user/who-am-i')
      .then((res) => {
        const user = res.data;
        if (!user.picture) {
          user.picture = getRandomPicture(user.name);
        }
        setUser(user);
      })
      .catch((e) => console.log(e));
  }, [rerender]);

  const refetchFromLocalStorage = () => {
    setRerender((prev) => !prev);
  };
  return (
    <UserContext.Provider
      value={{ user, refetchFromLocalStorage }}
      {...props}
    />
  );
};

const useApp = () => useContext(UserContext);

export { useApp, UserProvider, getRandomPicture };
