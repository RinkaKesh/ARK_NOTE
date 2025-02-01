import { Navigate, useNavigate} from "react-router-dom"


export const getToken = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    return null;
  }
  return `Bearer ${token}`;
};

export const isAuth = () => {
  return getToken() !== null;
};


export const logout = (navigate,setProfileData,Navigate) => {
  localStorage.clear()
  setProfileData(null)
  navigate("/",{ replace: true })
  //  return <Navigate to="/" />

}


export const getInitials = (name) => {
  if (!name) return "";
  const words = name.trim().split(/\s+/);
  const initials = words.slice(0, 3).map(word => word[0].toUpperCase()).join("");
  return initials;
};

export const getUserData = () => {
  const userData = localStorage.getItem("userdata");
  if (!userData) {
    return null; 
  }
  try {
    return JSON.parse(userData); 
  } catch (error) {
    console.error("Failed to parse userdata from localStorage:", error);
    return null; 
  }
};

let isLoading = false;

export const LoadingSpinner = () => {
  const spinner = document.createElement('div');
  spinner.id = 'loading-spinner';
  spinner.innerHTML = `
      <div class="spinner-container">
        <div class="spinner"></div>
      </div>
    `;
  document.body.appendChild(spinner);
};

export const removeLoadingSpinner = () => {
  const spinner = document.getElementById('loading-spinner');
  if (spinner) {
    spinner.remove();
  }
};

export const showLoader = () => {
  if (!isLoading) {
    isLoading = true;
    LoadingSpinner();
  }
};

export const hideLoader = () => {
  if (isLoading) {
    isLoading = false;
    removeLoadingSpinner();
  }
};

export const getIsLoading = () => isLoading;


export const getStatusColors = (status) => {
  switch (status) {
    case "todo":
      return { bgColor: "bg-yellow-300", textColor: "text-black" };
    case "active":
      return { bgColor: "bg-green-300", textColor: "text-white" };
    case "overdue":
      return { bgColor: "bg-red-300", textColor: "text-white" };
    case "completed":
      return { bgColor: "bg-blue-300", textColor: "text-white" };
    default:
      return { bgColor: "bg-gray-500", textColor: "text-white" }; 
  }
};


