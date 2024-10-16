import { useState, useEffect, useCallback, useContext } from "react";
import Header from "./components/navigation/Header";
import { ThemeContext } from './context/ThemeProvider'
import { Outlet } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

const baseURL = "http://localhost:4000/projects/";

const App = () => {
  // const [isDarkMode, setIsDarkMode] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [phaseSelected, setPhaseSelected] = useState("All");
  // const [projects, setProjects] = useState([]);

  const { isDarkMode } = useContext(ThemeContext)

  // useEffect(() => {
  //   const loadProjects = async () => {
  //     try {
  //       const resp = await fetch("http://localhost:4000/projects");
  //       const data = await resp.json();
  //       setProjects(data);
  //     } catch (error) {
  //       toast.error(error.message);
  //     }
  //   };
  //   loadProjects();
  // }, []);

  //! Memoized functions
  //! Memoization with useCallback prevents re-creating function references on every render
  //! which helps avoid unnecessary re-renders of child components.
  //! Avoid memoizing everything indiscriminately.
  //! Only memoize functions passed to components (like Header)
  //! or passed down through Outlet if those child components depend on stable references.
  //! memoized functions still have to be listed as dependencies in hooks like useEffect or useMemo
  //! but now they will not be recreated on every render (aka stable) unless one of its dependencies actually changes
  //* POST useFetcher update
  //! Now that useFetcher is exporting setData aliased as setProjects,
  //! the linter wants us to add it as a dependency to the useCallback hooks
  //! but we don't need to because the function reference is stable
  const handleSearch = useCallback((e) => {
    setSearchQuery(e.target.value);
  }, []);

  const handlePhaseSelection = useCallback((e) => {
    if (e.target.textContent === "All") {
      setPhaseSelected("All");
    } else {
      const phase = e.target.textContent.replace("Phase ", "");
      setPhaseSelected(Number(phase));
    }
  }, []);

  const handleAddNewProject = useCallback((createdProject) => {
    setProjects((currentProjects) => [createdProject, ...currentProjects]);
  }, []);

  const handleEditProject = useCallback((updatedProject) => {
    const updatedArray = projects.map((project) =>
      project.id === updatedProject.id ? updatedProject : project
    );
    setProjects(updatedArray);
  }, []);

  const handleClap = useCallback((id, currentClapCount) => {
    fetch(baseURL + `${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ clapCount: currentClapCount + 1 }),
    })
      .then((response) => response.json())
      .then((patchedProject) => {
        setProjects((currentProjects) =>
          currentProjects.map((project) => {
            return project.id === id
              ? { ...project, clapCount: patchedProject.clapCount }
              : project;
          })
        );
      })
      .catch((err) => toast.error(err.message));
  }, []);

  const handleDeleteProject = useCallback(
    (projectToDeleteId) =>
      setProjects(
        projects.filter((project) => project.id !== projectToDeleteId)
      ),
    []
  );

  // const toggleDarkMode = () => setIsDarkMode((current) => !current);

  //! Outlet components have to be used to display ANY child routes content
  return (
    <div className={isDarkMode ? "App" : "App light"}>
      <Toaster />
      <Header />
      <Outlet
        context={{
          searchQuery,
          phaseSelected,
          projects,
          handleSearch,
          handlePhaseSelection,
          handleAddNewProject,
          handleDeleteProject,
          handleEditProject,
          handleClap,
          baseURL,
        }}
      />
    </div>
  );
};

export default App;
