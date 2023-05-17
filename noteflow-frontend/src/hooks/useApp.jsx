import { useContext, createContext, useState, useEffect } from 'react';
import crc32 from 'crc-32';
import instance from '../API/api';
import { useNavigate } from 'react-router-dom';

const UserContext = createContext({
  user: {},
  logout: () => {},
  refetchFromLocalStorage: () => {},
});

const getRandomPicture = (name) => {
  const hash = Math.abs(crc32.str(name) + Number(Date.now() / 3600000));
  return `/assets/avatar/${Math.ceil(hash % 7)}.png`;
};

const UserProvider = (props) => {
  const [user, setUser] = useState(null);
  const [rerender, setRerender] = useState(false);

  const navigate = useNavigate();

  const logout = () => {
    setUser('');
    navigate('/');
  };
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
      .catch((e) => {
        navigate('/');
      });
  }, [rerender]);

  const refetchFromLocalStorage = () => {
    setRerender((prev) => !prev);
  };
  return (
    <UserContext.Provider
      value={{ user, refetchFromLocalStorage, logout }}
      {...props}
    />
  );
};

const useApp = () => useContext(UserContext);

export { useApp, UserProvider, getRandomPicture };
