import "./App.css";
import { Header } from "./components/Header";
import { Form } from "./components/Form";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import { appStore } from "./store/appStore";
import { Admin } from "./components/Admin";

function App() {
  return (
    <Provider store={appStore}>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Form />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
