import { useState, useEffect, useCallback, useContext } from "react";
import useFetcher from "./custom_hooks/useFetcher";
import Header from "./components/navigation/Header";
import { ThemeContext } from "./context/ThemeProvider";
import { Outlet } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

const baseURL = "http://localhost:4000/projects/";

const App = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [phaseSelected, setPhaseSelected] = useState("All");

  const { isDarkMode } = useContext(ThemeContext);

  //! Option 1(exporting setData):
  //!Best for reducing boilerplate and if you want to handle all data management in a single hook.
  //!It simplifies your code but might blur the line between fetching and state management.
  const {
    data: projects,
    isLoading,
    error,
    setData: setProjects,
  } = useFetcher(baseURL);

  //! Option 2(separate state):
  //! More flexible and explicit.It keeps fetching and state management separate,
  //! which might be easier to maintain, especially if you have complex data flows.It is more modular.
  // const { data, loading, error } = useFetcher(baseURL);
  // const [projects, setProjects] = useState(data || []); // Using a separate state

  // useEffect(() => {
  //   if (data) {
  //     setProjects(data); // Sync state with fetched data
  //   }
  // }, [data]);

  //! Memoized functions (useCallback)
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
