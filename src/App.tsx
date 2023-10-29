import React, {useState} from "react";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { TaskLists } from "./components/TaskLists";
import Login from "./components/Login";
import {SingleUser} from "./types";
import {login} from "./api/api";
const App = () => {

    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

    const handleLogin = async (username: string, password: string) => {

        const payload: SingleUser = {
            id: 0,
            username,
            password,
            name: '',
            avatar_url: '',
        };

        await login(payload).then((response) => {
            if (response.status === 200) {
                localStorage.setItem('token', response.data.token);
                setToken(response.data.token);
                window.location.reload();
            } else {
                console.log(JSON.stringify(response.data.status));
            }
        }).catch(() => {
            alert('Login failed!');
        });
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setToken(null);
    };

  return (
      <div>
          {(token === "" || token === null || token === undefined)&& <Login  onLogin={handleLogin}/>}
          {(token !== "" && token !== null && token !== undefined) && (<Provider store={store}>
              <div className="m-auto mt-10 w-fit">
                  <button className="m-3 text-white bg-violet-700 px-3 py-1 rounded-md shadow-md"
                          onClick={handleLogout}>Logout</button>
                  <TaskLists /></div>
              </Provider>)}
      </div>
  );
};

export default App;
