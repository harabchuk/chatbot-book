import { BrowserRouter, Route, Routes } from 'react-router'
import BadContextDesign from '../screens/BadContextDesign'
import ContextFormattingAccountOwnership from '../screens/ContextFormattingAccountOwnership'
import InternalInformationLeackage from '../screens/InternalInformationLeackage'
import Main from '../screens/Main'
import WrongInformationRetrieved from '../screens/WrongInformationRetrieved'
import { screenMeta as contextFormattingMeta } from '../screens/contextFormattingContent'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/bad-context-design" element={<BadContextDesign />} />
        <Route
          path={contextFormattingMeta.path}
          element={<ContextFormattingAccountOwnership />}
        />
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
