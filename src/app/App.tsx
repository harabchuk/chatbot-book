import { BrowserRouter, Route, Routes } from 'react-router'
import BadContextDesign from '../screens/BadContextDesign'
import InternalInformationLeackage from '../screens/InternalInformationLeackage'
import Main from '../screens/Main'
import WrongInformationRetrieved from '../screens/WrongInformationRetrieved'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/bad-context-design" element={<BadContextDesign />} />
        <Route
          path="/wrong-information-retrieved"
          element={<WrongInformationRetrieved />}
        />
        <Route
          path="/internal-information-leackage"
          element={<InternalInformationLeackage />}
        />
      </Routes>
    </BrowserRouter>
  )
}
