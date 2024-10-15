import { NavLink } from "react-router-dom";

const Header = ({isDarkMode, toggleDarkMode}) => {
  return (
    <header>
      <h1>
        <span className="logo">{"//"}</span>
        Project Showcase
      </h1>
      <NavLink to="/" className={({isActive}) => isActive ? "active" : ""}>Home</NavLink>
      <NavLink end to="/projects" className={({isActive}) => isActive ? "active" : ""}>All Projects</NavLink>
      <NavLink end to="/projects/new" className={({isActive}) => isActive ? "active" : ""}>Create Project</NavLink>
      <button onClick={toggleDarkMode}>{isDarkMode ? "Light Mode" : "Dark Mode"}</button>
    </header>
  );
}

export default Header;