import React from "react";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { TaskLists } from "./components/TaskLists";

const App = () => {
  return (
    <Provider store={store}>
      <div className="m-auto mt-10 w-fit">
        <TaskLists />
      </div>
    </Provider>
  );
};

export default App;
