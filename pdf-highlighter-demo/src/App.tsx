import { Link, Outlet } from "react-router-dom";
import "./App.css";

function Layout() {
  return (
    <div className="RootApp">
      <nav className="TopNav">
        <div className="TopNav-left">
          <span className="TopNav-brand">PDF Highlighter Demo</span>
        </div>
        <div className="TopNav-links">
          <Link to="/">Home</Link>
          <Link to="/viewer">Viewer</Link>
          <Link to="/comparison">Comparison</Link>
        </div>
      </nav>
      <Outlet />
    </div>
  );
}

export function HomePage() {
  return (
    <div className="HomePage">
      <div className="HomeCard">
        <h1>pdfjs-highlighter</h1>
        <p>
          This demo showcases a React + TypeScript PDF viewer library with
          rectangle highlights, zoom controls, navigation, and download support.
        </p>
        <p>
          Use the navigation bar to open the <strong>Viewer</strong> page and
          experiment with highlights, zooming, and page navigation.
        </p>
      </div>
    </div>
  );
}

export default Layout;
